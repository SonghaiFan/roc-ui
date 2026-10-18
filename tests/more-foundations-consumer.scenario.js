async (page) => {
  const checks = [],
    errors = [];
  const assert = (ok, m) => {
    if (!ok) throw Error(m);
    checks.push(m);
  };
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1000, height: 1000 });
  await page.goto("http://127.0.0.1:4190/consumer-check/index.html");
  await page
    .getByRole("alert")
    .filter({ hasText: "Independent notice" })
    .waitFor();
  assert(
    (await page.locator("main > section").count()) === 35,
    "All 35 downloaded components render without gallery files",
  );
  const progress = page.getByRole("progressbar", {
    name: "Independent progress",
  });
  assert(
    (await progress.getAttribute("aria-valuenow")) === "50" &&
      (await progress.getAttribute("aria-valuemax")) === "200",
    "Progress exposes custom max and value in an isolated host",
  );
  const fill = await progress
    .locator("[data-slot=progress-indicator]")
    .elementHandle();
  assert(
    await fill.evaluate(
      (el) =>
        Math.abs(
          new DOMMatrixReadOnly(getComputedStyle(el).transform).a - 0.25,
        ) < 0.01,
    ),
    "Progress fill respects max instead of assuming 100",
  );
  await page
    .getByRole("button", { name: "Toggle unknown progress", exact: true })
    .click();
  assert(
    (await progress.getAttribute("aria-valuenow")) === null,
    "Indeterminate progress omits aria-valuenow",
  );
  const toggle = page.getByRole("button", {
    name: "Independent toggle",
    exact: true,
  });
  await toggle.focus();
  await toggle.press("Space");
  assert(
    (await toggle.getAttribute("aria-pressed")) === "true",
    "Downloaded toggle retains native keyboard activation",
  );
  await page.getByRole("button", { name: "Format B", exact: true }).click();
  assert(
    (await page
      .getByRole("button", { name: "Format A", exact: true })
      .getAttribute("aria-pressed")) === "true" &&
      (await page
        .getByRole("button", { name: "Format B", exact: true })
        .getAttribute("aria-pressed")) === "true",
    "Downloaded multiple toggle group keeps both selected values",
  );
  const a = page.getByRole("radio", { name: "Choice A", exact: true });
  await a.focus();
  await a.press("ArrowDown", { delay: 50 });
  await page.waitForFunction(
    () =>
      document
        .querySelector('[aria-label="Independent choice"] [value=b]')
        ?.getAttribute("aria-checked") === "true",
  );
  assert(
    (await page
      .getByRole("radio", { name: "Choice B", exact: true })
      .getAttribute("aria-checked")) === "true",
    "Downloaded radio group supports arrow navigation",
  );
  assert(
    await page
      .getByRole("radio", { name: "Choice C", exact: true })
      .isDisabled(),
    "Disabled radio remains unavailable",
  );
  const scroll = page.getByRole("region", { name: "Independent notes" });
  await scroll.focus();
  await scroll.press("PageDown");
  await page.waitForTimeout(250);
  assert(
    await scroll.evaluate((el) => el.scrollTop > 0),
    "Downloaded scroll area supports keyboard scrolling",
  );
  const skeleton = page.getByTestId("independent-skeleton");
  assert(
    await skeleton.evaluate(
      (el) =>
        el.getBoundingClientRect().width === 160 &&
        el.getBoundingClientRect().height === 24 &&
        getComputedStyle(el).animationName === "none",
    ),
    "Downloaded skeleton reserves its explicit size without motion",
  );
  await page
    .locator("[data-slot=avatar-fallback]")
    .filter({ hasText: "IN" })
    .waitFor();
  assert(
    await page
      .locator("[data-slot=avatar]")
      .evaluate((el) => el.getBoundingClientRect().width === 32),
    "Failed image keeps the independent avatar footprint",
  );
  assert(
    (await page
      .locator("[data-slot=breadcrumb-page]")
      .getAttribute("aria-current")) === "page",
    "Downloaded breadcrumb exposes current page semantics",
  );
  const nav = page.getByRole("navigation", { name: "Independent pages" });
  assert(
    (await nav
      .locator('[aria-label="Go to previous page"]')
      .getAttribute("href")) === null,
    "Disabled previous page has no navigation target",
  );
  await nav.getByRole("link", { name: "Go to next page", exact: true }).click();
  assert(
    (await nav
      .getByRole("link", { name: "Page two", exact: true })
      .getAttribute("aria-current")) === "page",
    "Downloaded pagination follows caller-owned state",
  );
  assert(errors.length === 0, "No isolated consumer runtime errors");
  return { passed: checks.length, checks };
}
