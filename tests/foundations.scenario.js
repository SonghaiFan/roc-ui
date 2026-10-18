async (page) => {
  const checks = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (ok, m) => {
    if (!ok) throw Error(m);
    checks.push(m);
  };
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4190/");
  const view = await (
    await page.locator("iframe").elementHandle()
  ).contentFrame();
  await view.locator("#tabs").waitFor();
  assert(
    (await view.locator(".component-card").count()) === 25,
    "All 15 shadcn-derived foundations and 10 source components are mounted",
  );
  const focus = async (name) => {
    const back = view.getByRole("button", {
      name: "All components",
      exact: false,
    });
    if (await back.count()) await back.click();
    await view
      .getByRole("button", { name: `Focus ${name} preview`, exact: true })
      .click();
  };
  await focus("Button");
  const save = view.getByRole("button", { name: "Save changes", exact: true });
  const before = await save.boundingBox();
  await save.click();
  const saving = view.getByRole("button", { name: "Saving…", exact: true });
  const during = await saving.boundingBox();
  assert(
    before.width === during.width && before.height === during.height,
    "Pending feedback does not resize the original button",
  );
  await save.waitFor();
  await focus("Tabs");
  const draft = view.getByLabel("Tabs draft");
  const original = await draft.elementHandle();
  await draft.fill("A retained tab draft");
  await view.getByRole("tab", { name: "Details", exact: true }).click();
  assert(
    await original.evaluate(
      (el) => el.isConnected && el.closest("[role=tabpanel]").inert,
    ),
    "Inactive tab content stays mounted and inert",
  );
  await view
    .getByRole("tab", { name: "Details", exact: true })
    .press("ArrowLeft");
  assert(
    (await draft.inputValue()) === "A retained tab draft" &&
      (await original.evaluate(
        (el) => el === document.querySelector('[aria-label="Tabs draft"]'),
      )),
    "Keyboard tab switching returns to the same editor",
  );
  await page.waitForTimeout(350);
  assert(
    await view.evaluate(() => {
      const marker = document
          .querySelector(".roc-ui-tabs-marker")
          .getBoundingClientRect(),
        tab = document
          .querySelector("[role=tab][data-state=active]")
          .getBoundingClientRect();
      return (
        Math.abs(marker.x - tab.x) < 1 && Math.abs(marker.width - tab.width) < 1
      );
    }),
    "One selection marker settles on the active tab",
  );
  await focus("Accordion");
  const fold = view.getByRole("button", {
      name: "A note in progress",
      exact: true,
    }),
    foldDraft = view.getByLabel("Accordion draft"),
    node = await foldDraft.elementHandle();
  await foldDraft.fill("Retained through interruption");
  await fold.click();
  await page.waitForTimeout(90);
  const middle = await node.evaluate(
    (el) =>
      el.closest("[data-slot=accordion-content]").getBoundingClientRect()
        .height,
  );
  await fold.click();
  await page.waitForTimeout(400);
  assert(
    await node.evaluate(
      (el) =>
        el === document.querySelector('[aria-label="Accordion draft"]') &&
        el.value === "Retained through interruption",
    ),
    "Accordion reversal retains the original editor",
  );
  await fold.click();
  await page.waitForTimeout(400);
  assert(
    await node.evaluate((el) => {
      const panel = el.closest("[data-slot=accordion-content]");
      return panel.inert && panel.getBoundingClientRect().height < 1;
    }),
    "Folded content settles at zero height and cannot receive input",
  );
  assert(
    middle > 0,
    "Accordion has a measurable intermediate frame instead of a remount",
  );
  await fold.click();
  await focus("Switch");
  const toggle = view.getByRole("switch");
  const thumb = await toggle
    .locator("[data-slot=switch-thumb]")
    .elementHandle();
  await toggle.click();
  await page.waitForTimeout(70);
  await toggle.click();
  assert(
    await thumb.evaluate(
      (el) => el === document.querySelector("#switch [data-slot=switch-thumb]"),
    ),
    "Switch reversal retains one thumb",
  );
  await focus("Checkbox");
  const check = view.getByRole("checkbox", { name: "Keep original sources" });
  await check.focus();
  await check.press("Space");
  assert(
    (await check.getAttribute("aria-checked")) === "false",
    "Checkbox preserves native keyboard selection",
  );
  await focus("Slider");
  const slider = view.getByRole("slider", { name: "Reading width" });
  await slider.focus();
  const old = Number(await slider.getAttribute("aria-valuenow"));
  await slider.press("ArrowRight");
  assert(
    Number(await slider.getAttribute("aria-valuenow")) === old + 1,
    "Slider supports precise keyboard refinement",
  );
  await focus("Dialog");
  const trigger = view.getByRole("button", {
    name: "Edit document",
    exact: true,
  });
  await trigger.click();
  const dialog = view.getByRole("dialog", { name: "Document details" });
  await dialog.waitFor();
  const field = view.getByLabel("Dialog document title"),
    fieldNode = await field.elementHandle();
  await field.fill("One object across widths");
  await page.getByRole("button", { name: "Phone", exact: true }).click();
  await view.waitForFunction(() => innerWidth === 390);
  await page.waitForTimeout(500);
  assert(
    await fieldNode.evaluate(
      (el) =>
        el === document.querySelector('[aria-label="Dialog document title"]') &&
        el.value === "One object across widths",
    ),
    "Open dialog retains the same form through desktop-phone reflow",
  );
  assert(
    await dialog.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        r.x >= 0 &&
        r.right <= innerWidth &&
        Math.abs(innerHeight - r.bottom - 12) < 2
      );
    }),
    "Phone dialog settles against the visible bottom edge",
  );
  await view.evaluate(() =>
    document.documentElement.style.setProperty("--roc-safe-bottom", "44px"),
  );
  await page.waitForTimeout(400);
  assert(
    await dialog.evaluate(
      (el) => el.getBoundingClientRect().bottom <= innerHeight - 43,
    ),
    "Dialog respects a covered bottom edge",
  );
  await field.focus();
  await field.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert(
    await trigger.evaluate((el) => el === document.activeElement),
    "Dialog dismissal restores focus to its original trigger",
  );
  await trigger.click();
  assert(
    (await field.inputValue()) === "One object across widths",
    "Caller-owned draft state survives dialog dismissal",
  );
  await field.press("Escape");
  await view.evaluate(() =>
    document.documentElement.style.removeProperty("--roc-safe-bottom"),
  );
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  await view.waitForFunction(() => innerWidth === 1024);
  await focus("Popover");
  const popTrigger = view.getByRole("button", {
    name: "View options",
    exact: true,
  });
  await popTrigger.click();
  const pop = view.getByLabel("Popover display name");
  await pop.fill("Persistent preferences");
  await pop.press("Escape");
  await popTrigger.click();
  assert(
    (await pop.inputValue()) === "Persistent preferences",
    "Popover leaves persistent values with its caller",
  );
  await pop.press("Escape");
  await focus("Dropdown menu");
  const menuTrigger = view.getByRole("button", {
    name: "Document actions",
    exact: true,
  });
  await menuTrigger.focus();
  await menuTrigger.press("Enter");
  const item = view.getByRole("menuitem", { name: "Rename", exact: false });
  await item.waitFor();
  await item.press("Enter");
  assert(
    (await view.locator("#dropdown-menu [role=status]").innerText()) ===
      "Rename selected",
    "Dropdown keyboard selection invokes the action",
  );
  assert(
    await menuTrigger.evaluate((el) => el === document.activeElement),
    "Menu restores trigger focus",
  );
  await focus("Tooltip");
  const tip = view.getByRole("button", { name: "Keep original", exact: true });
  await tip.focus();
  await view.getByRole("tooltip").waitFor();
  assert(
    await view.getByRole("tooltip").isVisible(),
    "Tooltip is available on keyboard focus",
  );
  await tip.press("Escape");
  await focus("Accordion");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await fold.click();
  assert(
    await node.evaluate(
      (el) =>
        getComputedStyle(el.closest(".roc-ui-accordion-layout"))
          .transitionDuration === "0s",
    ),
    "Reduced motion keeps the same retained destination",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Fit", exact: true }).click();
  await page.waitForTimeout(600);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Foundations keep the host usable at phone width",
  );
  assert(errors.length === 0, "No browser runtime errors");
  return { passed: checks.length, checks };
}
