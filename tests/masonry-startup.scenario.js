async (browserPage) => {
  const page = await browserPage.context().newPage();
  const checks = [],
    errors = [];
  const assert = (ok, message) => {
    if (!ok) throw Error(message);
    checks.push(message);
  };
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    const observeStartup = () => {
      window.startupProbe = { samples: [], animations: 0 };
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (...args) {
        if (this.classList.contains("component-card"))
          window.startupProbe.animations++;
        return animate.apply(this, args);
      };
      const watch = new MutationObserver(() => {
        const canvas = document.querySelector(".preview-canvas");
        if (!canvas) return;
        watch.disconnect();
        const sample = () => {
          const cards = [...canvas.querySelectorAll(".component-card")];
          if (cards.length !== 25) return;
          window.startupProbe.samples.push({
            width: innerWidth,
            cards: cards.map((card) => {
              const r = card.getBoundingClientRect();
              return { id: card.id, x: r.x, y: r.y, w: r.width };
            }),
          });
        };
        sample();
        new ResizeObserver(sample).observe(canvas);
      });
      watch.observe(document, { subtree: true, childList: true });
    };
    await page.route("**/assets/main.js", async (route) => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        body: `(${observeStartup.toString()})();\n${await response.text()}`,
      });
    });
    const results = [];
    for (const width of [1440, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("http://127.0.0.1:4190/");
      const frame = await (
        await page.locator("iframe").elementHandle()
      ).contentFrame();
      await frame.locator("#tabs").waitFor();
      await page.waitForTimeout(1000);
      const probe = await frame.evaluate(() => window.startupProbe);
      const widths = [...new Set(probe.samples.map((s) => s.width))];
      assert(
        probe.samples.length > 0,
        `${width}px: startup geometry was observed`,
      );
      assert(
        widths.length === 1 &&
          widths[0] === (await frame.evaluate(() => innerWidth)),
        `${width}px: first layout uses the final viewport width`,
      );
      assert(
        probe.animations === 0,
        `${width}px: no masonry card animations during load`,
      );
      const first = probe.samples[0],
        last = probe.samples.at(-1);
      const drift = Math.max(
        ...first.cards.map((r, i) =>
          Math.max(
            Math.abs(r.x - last.cards[i].x),
            Math.abs(r.y - last.cards[i].y),
          ),
        ),
      );
      assert(
        drift < 1,
        `${width}px: cards stay in their initial slots while loading`,
      );
      assert(
        await page
          .locator(".viewport-shell")
          .evaluate((el) => getComputedStyle(el).transitionDuration === "0s"),
        `${width}px: overview has no width transition`,
      );
      results.push({
        host: width,
        widths,
        cardAnimations: probe.animations,
        drift,
      });
    }
    const frame = await (
      await page.locator("iframe").elementHandle()
    ).contentFrame();
    const draft = await frame.getByLabel("Tabs draft").elementHandle();
    await frame
      .getByLabel("Tabs draft")
      .fill("Keep my draft without gallery choreography");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    assert(
      await draft.evaluate(
        (el) =>
          el === document.querySelector('[aria-label="Tabs draft"]') &&
          el.value.startsWith("Keep my draft"),
      ),
      "Host resize retains the original editor",
    );
    assert(
      await frame.evaluate(() => window.startupProbe.animations === 0),
      "Host resize does not restart masonry animations",
    );
    assert(errors.length === 0, "No runtime errors");
    return { passed: checks.length, results, checks };
  } finally {
    await page.close();
  }
}
