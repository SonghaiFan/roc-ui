async (page) => {
  const checks = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (ok, m) => {
    if (!ok) throw Error(m);
    checks.push(m);
  };
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("http://127.0.0.1:4190/");
  await page.waitForFunction(
    () =>
      document.querySelector(".roc-tab-marker")?.getBoundingClientRect().width >
      30,
  );
  assert(
    (await page.locator(".component-card").count()) === 10,
    "All ten components mounted in the masonry canvas",
  );
  const boxes = await page.locator(".component-card").evaluateAll((nodes) =>
    nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    }),
  );
  assert(
    new Set(boxes.map((b) => Math.round(b.x))).size === 3,
    "Desktop uses three masonry columns",
  );
  assert(
    new Set(boxes.map((b) => Math.round(b.h))).size > 5,
    "Cards use their natural different heights",
  );
  const voice = page.locator("#voice-player .roc-voice"),
    audio = await voice.nth(0).locator("audio").elementHandle();
  await voice
    .nth(0)
    .getByRole("button", { name: "Play audio", exact: true })
    .click();
  await page.waitForTimeout(200);
  assert(
    await audio.evaluate((el) => !el.paused && el.currentTime > 0),
    "React player plays media",
  );
  await voice.nth(0).getByRole("slider").fill("3");
  assert(
    await audio.evaluate((el) => Math.abs(el.currentTime - 3) < 0.3),
    "React seek control seeks media",
  );
  await voice
    .nth(0)
    .getByRole("button", { name: "Playback speed, 1 times", exact: true })
    .click();
  assert(
    await audio.evaluate((el) => el.playbackRate === 1.5),
    "Rate control changes media",
  );
  await voice
    .nth(1)
    .getByRole("button", { name: "Play audio", exact: true })
    .click();
  assert(
    await audio.evaluate((el) => el.paused),
    "Optional group pauses other player",
  );
  await voice
    .nth(1)
    .getByRole("button", { name: "Pause audio", exact: true })
    .click();
  const tray = page.locator(".roc-source-tray"),
    editor = await tray.locator("textarea").elementHandle();
  await tray.locator("textarea").fill("A persistent original");
  await tray.getByRole("button", { name: "Gather 3", exact: true }).click();
  await page.waitForTimeout(150);
  await tray.getByRole("button", { name: "Sources 3", exact: true }).click();
  await page.waitForTimeout(1000);
  assert(
    await editor.evaluate(
      (el) => el.isConnected && el.value === "A persistent original",
    ),
    "Tray preserves the original input across interrupted reversal",
  );
  await page
    .getByRole("button", { name: "View Source tray source", exact: true })
    .click();
  assert(
    (await page.locator(".source-panel:modal").count()) === 1,
    "Source opens in an accessible dialog",
  );
  await page.getByLabel("Source file").selectOption("source-tray.css");
  assert(
    (await page.locator(".source-code").innerText()).includes(
      ".roc-source-tray",
    ),
    "Per-component CSS is available in source view",
  );
  await page.keyboard.press("Escape");
  assert(
    await editor.evaluate(
      (el) => el === document.querySelector(".roc-source-tray textarea"),
    ),
    "Source view leaves preview node in place",
  );
  const card = page.locator(".roc-expand .roc-card-preview"),
    paper = await card.locator("article").elementHandle();
  await card
    .getByRole("button", { name: "Open preview ↗", exact: true })
    .click();
  await page.waitForTimeout(1000);
  await card
    .getByRole("textbox", { name: "Your note" })
    .fill("Retained reading composition");
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector(".roc-card-dialog:modal"),
  );
  assert(
    await paper.evaluate((el) => {
      const a = el.getBoundingClientRect(),
        b = el.closest(".roc-return-slot").getBoundingClientRect();
      return Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1;
    }),
    "Reading surface returns to its masonry slot",
  );
  const editable = page.getByRole("textbox", { name: "Selection demo editor" });
  await editable.evaluate((el) => {
    el.focus();
    const r = document.createRange(),
      text = el.querySelector("p").firstChild;
    r.setStart(text, 0);
    r.setEnd(text, 14);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
  });
  const toolbar = page.locator(".roc-selection-toolbar:popover-open");
  await toolbar.waitFor({ state: "visible" });
  await toolbar.getByRole("button", { name: "Bold", exact: true }).click();
  assert(
    await editable.evaluate((el) => !!el.querySelector("b,strong")),
    "React toolbar invokes the host editor adapter",
  );
  assert(
    await page.evaluate(() => getSelection().toString() === "Keep the words"),
    "Toolbar restores the original selected range",
  );
  await page.evaluate(() => getSelection().removeAllRanges());
  await page.waitForFunction(
    () => !document.querySelector(".roc-selection-toolbar:popover-open"),
  );
  const viewport = page.locator(".roc-image-viewport");
  await viewport.getByRole("button", { name: "Zoom image in" }).click();
  assert(
    Number(await viewport.getAttribute("data-zoom")) > 1,
    "Image zoom remains functional",
  );
  await viewport.getByRole("button", { name: "Fit image" }).click();
  await page.waitForTimeout(1000);
  const book = page.locator(".roc-page-book");
  await book.getByRole("button", { name: "Next page" }).click();
  await page.waitForTimeout(1200);
  assert(
    (await book.getByRole("status").innerText()) !== "Cover",
    "Book cover turns",
  );
  await page.getByLabel("Search components").fill("voice");
  assert(
    (await page.locator(".component-card:visible").count()) === 1,
    "Search filters without removing other components",
  );
  await page.getByLabel("Search components").fill("");
  await page.getByLabel("blue accent").click();
  await page.getByLabel("Spacing").selectOption("Compact");
  await page.getByLabel("Corner radius").fill("6");
  assert(
    await editor.evaluate(
      (el) =>
        el === document.querySelector(".roc-source-tray textarea") &&
        el.value === "A persistent original",
    ),
    "Theme and density preserve editor state",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(700);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile has no horizontal overflow",
  );
  assert(
    await page
      .locator(".component-card")
      .evaluateAll(
        (nodes) =>
          new Set(nodes.map((n) => Math.round(n.getBoundingClientRect().x)))
            .size === 1,
      ),
    "Mobile has one masonry column",
  );
  assert(
    await editor.evaluate(
      (el) => el === document.querySelector(".roc-source-tray textarea"),
    ),
    "Responsive reflow keeps the same React node",
  );
  await page.screenshot({
    path: "output/playwright/masonry-mobile.png",
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await book.getByRole("button", { name: "Previous page" }).click();
  assert(
    await book.getByRole("button", { name: "Next page" }).isEnabled(),
    "Reduced-motion page turn settles immediately",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  assert(errors.length === 0, "No browser runtime errors");
  return { passed: checks.length, checks };
}
