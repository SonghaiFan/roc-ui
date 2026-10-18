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
  const frame = await (
    await page.locator("iframe").elementHandle()
  ).contentFrame();
  await frame.locator(".component-card").first().waitFor();
  await page.waitForTimeout(600);
  const panel = page.getByLabel("Design settings panel"),
    trigger = page.getByRole("button", {
      name: "Design settings",
      exact: true,
    });
  const body = await frame.locator("body").elementHandle();
  const size = await frame.evaluate(() => innerWidth);
  const shell = () =>
    page
      .locator(".topbar")
      .evaluate((el) => ({
        background: getComputedStyle(el).backgroundColor,
        color: getComputedStyle(el).color,
      }));
  const before = await shell();
  assert(
    (await panel.getAttribute("inert")) !== null && !(await panel.isVisible()),
    "Settings start hidden and excluded from keyboard navigation",
  );
  assert(
    size > 1300,
    "Masonry uses the full desktop canvas without a reserved sidebar",
  );
  await trigger.hover();
  await panel.waitFor({ state: "visible" });
  assert(await panel.isVisible(), "Hover reveals the left settings panel");
  await page.mouse.move(1100, 30);
  await panel.waitFor({ state: "hidden" });
  assert(
    !(await panel.isVisible()),
    "Leaving the panel automatically hides it",
  );
  await trigger.click();
  await panel.waitFor({ state: "visible" });
  await page.getByLabel("blue accent").click();
  await page.getByLabel("Surface", { exact: true }).selectOption("Paper");
  await frame.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".design-space"))
        .getPropertyValue("--roc-accent")
        .trim() === "#a7cbef",
  );
  assert(
    JSON.stringify(await shell()) === JSON.stringify(before),
    "Theme changes leave the page chrome neutral",
  );
  assert(
    await frame
      .locator(".component-card")
      .first()
      .evaluate(
        (el) => getComputedStyle(el).backgroundColor === "rgb(255, 255, 255)",
      ),
    "Gallery wrappers stay neutral while component surfaces are styled",
  );
  assert(
    (await frame.evaluate(() => innerWidth)) === size,
    "Opening settings never resizes the live viewport",
  );
  await page.getByLabel("Keep settings open").click();
  await frame
    .getByRole("button", { name: "Focus Source tray preview", exact: true })
    .click();
  const note = frame.getByRole("textbox", { name: "Tray source note" });
  await note.fill("Retain me when the settings hide");
  assert(
    await panel.isVisible(),
    "Pinned settings stay open during preview interaction",
  );
  await page.getByLabel("Keep settings open").click();
  await note.click();
  await panel.waitFor({ state: "hidden" });
  assert(
    !(await panel.isVisible()),
    "Interacting with the preview hides unpinned settings",
  );
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.getByLabel("Surface", { exact: true }).waitFor();
  await page.keyboard.press("Escape");
  await panel.waitFor({ state: "hidden" });
  assert(
    await trigger.evaluate((el) => el === document.activeElement),
    "Escape closes the panel and returns keyboard focus",
  );
  assert(
    (await body.evaluate((el) => el === document.body)) &&
      (await note.inputValue()) === "Retain me when the settings hide",
    "Panel transitions retain the iframe and edited component state",
  );
  await trigger.click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: "output/playwright/neutral-settings.png" });
  await page.getByLabel("Close settings", { exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger.dispatchEvent("pointerdown", { pointerType: "touch" });
  await trigger.click();
  await panel.waitFor({ state: "visible" });
  assert(
    await panel.isVisible(),
    "Settings are accessible by tap/click on narrow screens",
  );
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile settings do not cause page overflow",
  );
  await page.waitForTimeout(600);
  await page.screenshot({
    path: "output/playwright/neutral-mobile-settings.png",
  });
  await page.getByLabel("Close settings", { exact: true }).click();
  await page.getByRole("button", { name: "Phone", exact: true }).click();
  await frame.waitForFunction(() => innerWidth === 390);
  assert(
    await frame.evaluate(() => innerWidth === 390),
    "Phone preview remains a real responsive viewport",
  );
  assert(errors.length === 0, "No browser runtime errors");
  return { passed: checks.length, checks };
}
