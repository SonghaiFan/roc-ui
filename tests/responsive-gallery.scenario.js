// Run against the gallery dev server using the repository's Playwright scenario runner.
async (page) => {
  const checks = [], errors = [];
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
    checks.push(message);
  };
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4186/");
  const frame = page.frameLocator("iframe");
  await frame.locator(".component-card").first().waitFor();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(200);
    const result = await frame.locator(".component-card").evaluateAll((cards) => ({
      count: cards.length,
      overflow: cards.filter((card) => {
        const preview = card.querySelector(".component-preview");
        return preview.scrollWidth > preview.clientWidth + 1;
      }).map((card) => card.id),
    }));
    assert(result.count === 67, `All gallery components remain mounted at ${width}px`);
    assert(result.overflow.length === 0, `No preview overflows at ${width}px: ${result.overflow.join(", ")}`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No page overflow at ${width}px`);
  }
  await page.mouse.move(200, 70);
  await page.mouse.move(2, 300);
  await page.getByLabel("Design settings panel", { exact: true }).waitFor({ state: "visible" });
  assert(await page.getByRole("button", { name: "Design settings", exact: true }).getAttribute("aria-expanded") === "true", "Approaching the desktop edge opens Style");
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Design settings", exact: true }).click();
  const panel = page.getByRole("dialog", { name: "Design settings panel", exact: true });
  await panel.waitFor({ state: "visible" });
  assert(await panel.getAttribute("aria-modal") === "true", "Mobile Style opens as a modal sheet");
  assert(await panel.evaluate((element) => element.contains(document.activeElement)), "Mobile focus moves into the sheet");
  await page.getByRole("combobox", { name: "Corner radius", exact: true }).click();
  assert((await page.getByRole("option").allTextContents()).join(",") === "Square,Small,Medium,Large", "Radius uses four presets");
  await page.getByRole("option", { name: "Small", exact: true }).click();
  assert(await panel.isVisible(), "Selecting a portalled option keeps the sheet open");
  await page.getByRole("button", { name: "Close settings", exact: true }).click();
  assert(await page.evaluate(() => document.body.style.overflow !== "hidden"), "Closing restores page scrolling");
  assert(errors.length === 0, "No browser runtime errors");
  return { passed: checks.length, checks };
}
