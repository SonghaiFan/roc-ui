async (page) => {
  const checks = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (ok, m) => {
    if (!ok) throw Error(m);
    checks.push(m);
  };
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto("http://127.0.0.1:4190/consumer-check/index.html");
  await page
    .getByRole("button", { name: "Consumer button", exact: true })
    .waitFor();
  assert(
    (await page.locator("main > section").count()) === 35,
    "All 35 downloaded components render in the standalone consumer",
  );
  assert(
    await page.getByRole("link", { name: "Variant classes" }).evaluate((el) => {
      const c = getComputedStyle(el);
      return (
        c.display === "inline-flex" &&
        c.borderTopStyle === "solid" &&
        c.borderTopWidth === "1px"
      );
    }),
    "Exported variant helpers work without gallery CSS or data attributes",
  );
  const draft = page.getByLabel("Independent tab draft"),
    node = await draft.elementHandle();
  await draft.fill("Independent retained value");
  await page.getByRole("tab", { name: "Read independent" }).click();
  assert(
    await node.evaluate(
      (el) => el.isConnected && el.closest("[role=tabpanel]").inert,
    ),
    "Controlled Tabs retain and disable inactive content without gallery support",
  );
  await page.getByRole("tab", { name: "Edit independent" }).click();
  assert(
    (await draft.inputValue()) === "Independent retained value",
    "Controlled Tabs restore the original input value",
  );
  const fold = page.getByRole("button", {
      name: "Independent fold",
      exact: true,
    }),
    foldInput = await page.getByLabel("Independent fold draft").elementHandle();
  await fold.click();
  await page.waitForTimeout(400);
  assert(
    await foldInput.evaluate(
      (el) =>
        el.isConnected &&
        el.closest("[data-slot=accordion-content]").getBoundingClientRect()
          .height < 1,
    ),
    "Controlled Accordion collapses to zero while retaining the input",
  );
  await fold.click();
  await page
    .getByRole("button", { name: "Consumer button", exact: true })
    .click();
  assert(
    (await page
      .getByRole("switch", { name: "Independent switch" })
      .getAttribute("aria-checked")) === "true" &&
      (await page
        .getByRole("checkbox", { name: "Independent checkbox" })
        .getAttribute("aria-checked")) === "true",
    "Controlled sibling fields share host-owned state",
  );
  await page
    .getByRole("button", { name: "Independent dialog", exact: true })
    .click();
  const input = page.getByLabel("Independent dialog draft"),
    original = await input.elementHandle();
  await input.fill("Same input");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(450);
  assert(
    await original.evaluate(
      (el) =>
        el ===
          document.querySelector('[aria-label="Independent dialog draft"]') &&
        el.value === "Same input",
    ),
    "Standalone Dialog keeps its original editor across the breakpoint",
  );
  assert(
    await page
      .getByRole("dialog", { name: "Independent form" })
      .evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.x >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;
      }),
    "Standalone Dialog fits the phone viewport without gallery CSS",
  );
  await input.press("Escape");
  await page.getByRole("dialog", {name:"Independent form"}).waitFor({ state: "hidden" });
  await page
    .getByRole("button", { name: "Independent menu", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Consumer action" }).click();
  assert(
    await page
      .getByRole("button", { name: "Independent menu", exact: true })
      .evaluate((el) => el === document.activeElement),
    "Standalone menu restores trigger focus",
  );
  assert(errors.length === 0, "No standalone runtime errors");
  return { passed: checks.length, checks };
}
