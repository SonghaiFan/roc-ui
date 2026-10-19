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
    assert(result.count === 109, `All gallery components remain mounted at ${width}px`);
    assert(result.overflow.length === 0, `No preview overflows at ${width}px: ${result.overflow.join(", ")}`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No page overflow at ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.locator(".preset-switch").isVisible(), "Appearance presets stay in the mobile header");
  await page.getByRole("radio", { name: "Paper", exact: true }).click();
  assert(await page.evaluate(() => document.body.style.overflow !== "hidden"), "Changing a preset does not lock scrolling");
  assert(errors.length === 0, "No browser runtime errors");
  return { passed: checks.length, checks };
}
