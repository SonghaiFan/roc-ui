async (page) => {
  const checks = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (ok, m) => {
    if (!ok) throw Error(m);
    checks.push(m);
  };
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("http://127.0.0.1:4190/");
  const frame = await (
    await page.locator("iframe").elementHandle()
  ).contentFrame();
  await frame.locator(".component-card").first().waitFor();
  const body = await frame.locator("body").elementHandle();
  const preset = async (name, width) => {
    await page.getByRole("button", { name, exact: true }).click();
    await frame.waitForFunction((w) => innerWidth === w, width);
  };
  await preset("Desktop", 1024);
  assert(
    await frame.evaluate(() => innerWidth === 1024),
    "Desktop sets a real 1024 px browsing viewport",
  );
  await page
    .getByRole("button", { name: "Design settings", exact: true })
    .click();
  await page.getByRole("button", { name: /09 Page book/ }).click();
  await frame.waitForFunction(
    () => document.querySelector(".preview-canvas").dataset.focused === "true",
  );
  assert(
    (await frame.locator(".roc-page-book").getAttribute("data-mode")) ===
      "spread",
    "Focused book uses a desktop spread",
  );
  await preset("Phone", 390);
  await frame.waitForFunction(
    () => document.querySelector(".roc-page-book").dataset.mode === "single",
  );
  assert(
    (await frame.locator(".roc-page-book").getAttribute("data-mode")) ===
      "single",
    "The same book responds to phone width with a single page",
  );
  await preset("Tablet", 768);
  assert(
    await frame.evaluate(() => innerWidth === 768),
    "Tablet sets a real 768 px viewport",
  );
  await frame
    .getByRole("button", { name: "All components", exact: false })
    .click();
  await frame
    .getByRole("button", { name: "Focus Source tray preview", exact: true })
    .click();
  const note = await frame.locator(".roc-source-tray textarea").elementHandle();
  await frame
    .getByRole("textbox", { name: "Tray source note" })
    .fill("Keep this across widths");
  await preset("Phone", 390);
  await preset("Desktop", 1024);
  assert(
    await note.evaluate(
      (el) =>
        el === document.querySelector(".roc-source-tray textarea") &&
        el.value === "Keep this across widths",
    ),
    "Desktop-phone-desktop retains the same editor and draft",
  );
  await page.getByLabel("Preview width", { exact: true }).fill("530");
  await frame.waitForFunction(() => innerWidth === 530);
  await page.waitForFunction(
    () => document.querySelector(".viewport-size").textContent === "530 × 768",
  );
  assert(
    (await page.getByLabel("Viewport dimensions").innerText()) === "530 × 768",
    "Custom width readout matches the real viewport",
  );
  const grip = page.getByRole("separator", { name: "Resize preview" });
  await grip.focus();
  await page.keyboard.press("ArrowRight");
  await frame.waitForFunction(() => innerWidth === 540);
  assert(
    await frame.evaluate(() => innerWidth === 540),
    "Resize handle supports keyboard adjustment",
  );
  const handle = await grip.boundingBox();
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    handle.x + handle.width / 2 + 30,
    handle.y + handle.height / 2,
    { steps: 5 },
  );
  await page.mouse.up();
  await frame.waitForFunction(() => innerWidth === 600);
  assert(
    await frame.evaluate(() => innerWidth === 600),
    "Pointer dragging continuously resizes the real viewport",
  );
  await frame
    .getByRole("button", { name: "All components", exact: false })
    .click();
  await frame
    .getByRole("button", { name: "Focus Voice player preview", exact: true })
    .click();
  const player = frame.locator("#voice-player .roc-voice").first(),
    audio = await player.locator("audio").elementHandle();
  await player.getByRole("button", { name: "Play audio", exact: true }).click();
  await preset("Phone", 390);
  await preset("Desktop", 1024);
  assert(
    await audio.evaluate(
      (a) =>
        a === document.querySelector("#voice-player audio") &&
        !a.paused &&
        a.currentTime > 0,
    ),
    "Audio instance and playback survive viewport switching",
  );
  await player
    .getByRole("button", { name: "Pause audio", exact: true })
    .click();
  await frame
    .getByRole("button", { name: "All components", exact: false })
    .click();
  const card = frame.locator(".roc-expand .roc-card-preview");
  await card.getByRole("button", { name: "Open preview ↗" }).click();
  await page.waitForTimeout(900);
  const paper = await card.locator("article").elementHandle();
  await card
    .getByRole("textbox", { name: "Your note" })
    .fill("A reading surface across breakpoints");
  await preset("Phone", 390);
  await page.waitForTimeout(800);
  assert(
    await paper.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        el === document.querySelector(".roc-card-dialog:modal article") &&
        r.x >= 0 &&
        r.right <= innerWidth &&
        r.bottom <= innerHeight
      );
    }),
    "Open reading dialog stays in the same phone viewport and retains its paper",
  );
  await card.getByRole("button", { name: "Return ↙", exact: true }).click();
  await frame.waitForFunction(
    () => !document.querySelector(".roc-card-dialog:modal"),
  );
  assert(
    await paper.evaluate((el) => {
      const r = el.getBoundingClientRect(),
        s = el.closest(".roc-return-slot").getBoundingClientRect();
      return Math.abs(r.x - s.x) < 1 && Math.abs(r.y - s.y) < 1;
    }),
    "Reading paper returns to its remeasured phone slot",
  );
  assert(
    await body.evaluate((el) => el === document.body),
    "One iframe document survives all presets and width changes",
  );
  await page
    .getByRole("button", { name: "Design settings", exact: true })
    .click();
  await page.getByLabel("blue accent").click();
  await frame.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".design-space"))
        .getPropertyValue("--roc-accent")
        .trim() === "#a7cbef",
  );
  assert(
    await frame
      .locator(".design-space")
      .evaluate(
        (el) =>
          getComputedStyle(el).getPropertyValue("--roc-accent").trim() ===
          "#a7cbef",
      ),
    "Appearance controls update the live preview without reload",
  );
  await page.screenshot({ path: "output/playwright/responsive-phone.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await preset("Desktop", 1024);
  assert(
    await frame.evaluate(() => innerWidth === 1024),
    "Reduced-motion viewport switching reaches its destination",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Fit", exact: true }).click();
  await page.waitForTimeout(600);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Viewport controls remain usable on a narrow host without page overflow",
  );
  assert(errors.length === 0, "No runtime errors");
  return { passed: checks.length, checks };
}
