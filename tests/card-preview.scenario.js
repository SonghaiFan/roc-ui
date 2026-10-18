async (page) => {
  const checks = [];
  const assert = (ok, message) => {
    if (!ok) throw Error(message);
    checks.push(message);
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4190/");
  const card = page.locator(".roc-expand .roc-card-preview");
  const paper = await card.locator(".roc-preview-paper").elementHandle(),
    editor = await card.locator("textarea").elementHandle();
  const width = await card
    .locator(".roc-preview-composition")
    .evaluate((el) => el.offsetWidth);
  await card.getByRole("button", { name: "Open preview ↗" }).click();
  await page.waitForTimeout(1000);
  assert(
    await paper.evaluate(
      (el) => el === document.querySelector(".roc-card-dialog:modal article"),
    ),
    "Same paper promoted to the native top layer",
  );
  assert(
    (await card
      .locator(".roc-preview-composition")
      .evaluate((el) => el.offsetWidth)) === width,
    "Opening retains typesetting width",
  );
  await card
    .getByRole("textbox", { name: "Your note" })
    .fill("A retained draft, without a second editor.");
  await card
    .getByRole("textbox", { name: "Your note" })
    .evaluate((el) => el.setSelectionRange(4, 12));
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector(".roc-card-dialog:modal"),
  );
  assert(
    await editor.evaluate(
      (el) =>
        el.isConnected &&
        el.value.startsWith("A retained") &&
        el.selectionStart === 4 &&
        el.selectionEnd === 12,
    ),
    "Return preserves editor identity, value and selection",
  );
  const landed = await paper.evaluate((el) => {
    const a = el.getBoundingClientRect(),
      b = el.closest(".roc-return-slot").getBoundingClientRect();
    return Math.max(
      Math.abs(a.x - b.x),
      Math.abs(a.y - b.y),
      Math.abs(a.width - b.width),
    );
  });
  assert(landed < 1, "Paper lands within one pixel of its retained slot");
  assert(
    await card
      .locator(".roc-preview-trigger")
      .evaluate((el) => el === document.activeElement),
    "Return restores launcher focus",
  );
  // Check same-task reversal without a frame of target geometry leaking through.
  const jump = await card.evaluate((root) => {
    root.querySelector(".roc-preview-trigger").click();
    return new Promise((resolve) =>
      setTimeout(() => {
        const p = root.querySelector("article"),
          a = p.getBoundingClientRect();
        root.querySelector(".roc-preview-close").click();
        const b = p.getBoundingClientRect();
        resolve(
          Math.max(
            Math.abs(a.x - b.x),
            Math.abs(a.y - b.y),
            Math.abs(a.width - b.width),
          ),
        );
      }, 80),
    );
  });
  assert(jump < 1, "Mid-flight close starts from the currently painted paper");
  await page.waitForFunction(
    () => !document.querySelector(".roc-card-dialog:modal"),
  );
  await card.getByRole("button", { name: "Open preview ↗" }).click();
  await page.waitForTimeout(1000);
  assert(
    await paper.evaluate(
      (el) => el === document.querySelector(".roc-card-dialog:modal article"),
    ),
    "Same paper retained after reopening",
  );
  await page.setViewportSize({ width: 390, height: 600 });
  await page.waitForTimeout(1000);
  const box = await paper.boundingBox();
  assert(
    box.x >= 0 && box.x + box.width <= 390 && box.y + box.height <= 600,
    "Reading paper fits phone visible viewport",
  );
  // Add height through the actual user-editable textarea and scroll the real reading surface.
  await card.locator("textarea").evaluate((el) => (el.style.height = "1000px"));
  await page.waitForTimeout(1000);
  const scroll = await card.locator(".roc-preview-scroll").evaluate((el) => {
    el.scrollTop = 160;
    return el.scrollTop;
  });
  assert(scroll > 100, "Long retained content scrolls in reading mode");
  await page.screenshot({ path: "output/playwright/roc-reading-mobile.png" });
  await page.keyboard.press("Escape");
  const firstScroll = await card
    .locator(".roc-preview-scroll")
    .evaluate((el) => el.scrollTop);
  assert(
    firstScroll > 0,
    "Closing does not reset scroll before the return motion",
  );
  await page.waitForFunction(
    () => !document.querySelector(".roc-card-dialog:modal"),
  );
  assert(
    (await card
      .locator(".roc-preview-scroll")
      .evaluate((el) => el.scrollTop)) === 0,
    "Scroll unwinds by the landing frame",
  );
  assert(
    await editor.evaluate((el) => el.value.startsWith("A retained")),
    "Phone resize and scroll return preserve draft",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  const source = page.locator(".roc-source").first(),
    input = await source.locator("input").elementHandle();
  await source.getByRole("button", { name: "Inspect ↗" }).click();
  await page.waitForTimeout(1000);
  await source
    .getByRole("textbox", { name: "Source note" })
    .fill("The original source control");
  await source.getByRole("button", { name: "Return ↙" }).click();
  await page.waitForFunction(
    () => !document.querySelector(".roc-card-dialog:modal"),
  );
  assert(
    await input.evaluate(
      (el) => el.isConnected && el.value === "The original source control",
    ),
    "Source inspection retains its actual input",
  );
  const result = await source.evaluate((root) => {
    const a = root.querySelector("article").getBoundingClientRect(),
      b = root.querySelector(".roc-return-slot").getBoundingClientRect();
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  });
  assert(result < 1, "Source returns to its measured spread slot");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await source.getByRole("button", { name: "Inspect ↗" }).click();
  await page.keyboard.press("Escape");
  assert(
    (await page.locator(".roc-card-dialog:modal").count()) === 0,
    "Reduced motion returns immediately",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  return { passed: checks.length, checks };
}
