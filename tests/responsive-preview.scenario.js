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
  const body = await view.locator("body").elementHandle();
  assert(
    (await page.getByLabel("Preview width", { exact: true }).count()) === 0,
    "Overview has no viewport slider",
  );
  assert(
    (await page.getByRole("group", { name: "Preview viewport" }).count()) === 0,
    "Overview has no device switcher",
  );
  assert(
    (await page.getByRole("separator", { name: "Resize preview" }).count()) ===
      0,
    "Overview has no resize grip",
  );
  await page.waitForTimeout(600);
  await page.screenshot({ path: "output/playwright/shadcn-only-gallery.png" });
  await view
    .getByRole("button", { name: "Focus Tabs preview", exact: true })
    .click();
  await page.getByRole("region", { name: "Component details" }).waitFor();
  const draft = view.getByLabel("Tabs draft");
  const original = await draft.elementHandle();
  await draft.fill("Retained through detail, width and return");
  const preset = async (name, width) => {
    await page.getByRole("button", { name, exact: true }).click();
    await view.waitForFunction((w) => innerWidth === w, width);
  };
  await preset("Desktop", 1024);
  await preset("Phone", 390);
  await preset("Tablet", 768);
  assert(
    await original.evaluate(
      (el) =>
        el === document.querySelector('[aria-label="Tabs draft"]') &&
        el.value.startsWith("Retained"),
    ),
    "Real desktop, phone and tablet widths retain the original editor",
  );
  for (const [label, width] of [
    ["sm", 640],
    ["md", 768],
    ["lg", 1024],
    ["xl", 1280],
    ["2xl", 1536],
  ]) {
    await page
      .getByRole("button", {
        name: `${label} breakpoint: ${width} pixels`,
        exact: true,
      })
      .click();
    await view.waitForFunction((w) => innerWidth === w, width);
    await page.waitForFunction(
      (label) =>
        document.querySelector(".active-breakpoint").textContent === label,
      label,
    );
    assert(
      (await page.locator(".active-breakpoint").innerText()) === label,
      `${label} marker sets the exact media breakpoint`,
    );
  }
  await page.getByLabel("Preview width", { exact: true }).fill("639");
  await view.waitForFunction(() => innerWidth === 639);
  await page.waitForFunction(
    () => document.querySelector(".active-breakpoint").textContent === "base",
  );
  assert(
    (await page.locator(".active-breakpoint").innerText()) === "base",
    "Breakpoint readout changes below sm",
  );
  await page.getByLabel("Preview width", { exact: true }).fill("530");
  await view.waitForFunction(() => innerWidth === 530);
  const grip = page.getByRole("separator", { name: "Resize preview" });
  await grip.focus();
  await page.keyboard.press("ArrowRight");
  await view.waitForFunction(() => innerWidth === 540);
  assert(
    await view.evaluate(() => innerWidth === 540),
    "Keyboard grip adjusts the real viewport",
  );
  const box = await grip.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 30, box.y + 80, { steps: 5 });
  await page.mouse.up();
  await view.waitForFunction(() => innerWidth === 600);
  assert(
    await view.evaluate(() => innerWidth === 600),
    "Pointer grip continuously resizes the viewport",
  );
  await page.screenshot({
    path: "output/playwright/shadcn-component-details.png",
  });
  await page
    .getByRole("button", { name: "All components", exact: false })
    .click();
  await view.locator("#button").waitFor();
  assert(
    (await page.getByLabel("Preview width", { exact: true }).count()) === 0,
    "Returning to gallery removes all viewport controls",
  );
  await view
    .getByRole("button", { name: "Focus Tabs preview", exact: true })
    .click();
  await view.waitForFunction(() => innerWidth === 600);
  assert(
    await original.evaluate(
      (el) =>
        el === document.querySelector('[aria-label="Tabs draft"]') &&
        el.value.startsWith("Retained"),
    ),
    "Returning and reopening restores the detail width and original draft",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Fit", exact: true }).click();
  await page.waitForTimeout(600);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Detail controls fit a narrow host without overflow",
  );
  const marks = await page
    .getByLabel("Media breakpoints")
    .locator("button")
    .evaluateAll((nodes) =>
      nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return { left: r.left, right: r.right };
      }),
    );
  assert(
    marks.every((r, i) => i === 0 || r.left >= marks[i - 1].right),
    "All breakpoint labels remain separated on a phone host",
  );
  await page.screenshot({
    path: "output/playwright/shadcn-details-mobile.png",
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await preset("Phone", 390);
  assert(
    await body.evaluate((el) => el === document.body),
    "One iframe document survives gallery, details and all width changes",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  assert(errors.length === 0, "No browser runtime errors");
  return { passed: checks.length, checks };
}
