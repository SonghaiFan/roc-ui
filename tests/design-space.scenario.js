async (page) => {
  const checks = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (ok, message) => {
    if (!ok) throw Error(message);
    checks.push(message);
  };
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("http://127.0.0.1:4190/");
  const view = await (
    await page.locator("iframe").elementHandle()
  ).contentFrame();
  await view.locator("#tabs").waitFor();
  await page.waitForTimeout(600);
  assert(
    (await view.locator(".component-card").count()) === 67,
    "All 67 customized shadcn components are mounted",
  );
  assert(
    (await view
      .locator("#folder-fan, #voice-player, #source-tray, #expandable-card")
      .count()) === 0,
    "Original components are absent from the gallery",
  );
  const boxes = await view.locator(".component-card").evaluateAll((nodes) =>
    nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return { x: r.x, height: r.height };
    }),
  );
  assert(
    new Set(boxes.map((r) => Math.round(r.x))).size >= 3,
    "Desktop fills the workspace with masonry columns",
  );
  assert(
    new Set(boxes.map((r) => Math.round(r.height))).size > 5,
    "Masonry retains natural component heights",
  );
  const editor = await view.getByLabel("Tabs draft").elementHandle();
  await view.getByLabel("Tabs draft").fill("A retained gallery draft");
  await page.getByLabel("Search components").fill("accordion");
  await view.waitForFunction(
    () =>
      document.querySelectorAll(".component-card:not([hidden])").length === 1,
  );
  assert(
    await view.locator("#accordion").isVisible(),
    "Search finds the customized foundation",
  );
  await page.getByLabel("Search components").fill("voice");
  await view.getByText("No matching components.", { exact: false }).waitFor();
  assert(
    (await view.locator(".component-card:visible").count()) === 0,
    "Search cannot reveal original components",
  );
  await page.getByLabel("Search components").fill("");
  await view
    .getByRole("button", { name: "View Tabs source", exact: true })
    .click();
  await page.locator('.source-panel[data-state="open"]').waitFor();
  await page.getByLabel("Source file").click();
  await page.getByRole("option", { name: "tabs.css" }).click();
  await page.waitForFunction(() =>
    document.querySelector(".source-code").textContent.includes(".roc-ui-tabs"),
  );
  assert(
    (await page.locator(".source-code").innerText()).includes(".roc-ui-tabs"),
    "Details provide the customized component source",
  );
  await page.getByLabel("Close source", { exact: true }).click();
  assert(
    await editor.evaluate(
      (el) =>
        el === document.querySelector('[aria-label="Tabs draft"]') &&
        el.value === "A retained gallery draft",
    ),
    "Search and source inspection retain the original editor",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(700);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile overview has no horizontal overflow",
  );
  assert(
    await view
      .locator(".component-card")
      .evaluateAll(
        (nodes) =>
          new Set(nodes.map((n) => Math.round(n.getBoundingClientRect().x)))
            .size === 1,
      ),
    "Mobile overview uses one masonry column",
  );
  assert(errors.length === 0, "No browser runtime errors");
  return { passed: checks.length, checks };
}
