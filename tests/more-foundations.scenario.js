async (page) => {
  const checks = [],
    errors = [];
  const assert = (ok, message) => {
    if (!ok) throw Error(message);
    checks.push(message);
  };
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto("http://127.0.0.1:4190/");
  const view = await (
    await page.locator("iframe").elementHandle()
  ).contentFrame();
  await view.locator("#pagination").waitFor();
  assert(
    (await view.locator(".component-card").count()) === 25,
    "All 25 customized foundations are mounted",
  );
  const focus = async (name) => {
    const back = page.getByRole("button", {
      name: "All components",
      exact: false,
    });
    if (await back.count()) {
      await back.click();
      await view.waitForFunction(
        () =>
          document.querySelector(".preview-canvas").dataset.focused === "false",
      );
    }
    await view
      .getByRole("button", { name: `Focus ${name} preview`, exact: true })
      .click();
    await page.getByRole("heading", { name, exact: true }).waitFor();
  };
  await focus("Alert");
  assert(
    (await view.locator("#alert").getByRole("alert").count()) === 2,
    "Alert variants retain semantic notices",
  );
  await focus("Avatar");
  const avatar = await view
    .locator("#avatar [data-slot=avatar]")
    .first()
    .elementHandle();
  const before = await avatar.boundingBox();
  await view
    .getByRole("button", { name: "Load portrait", exact: true })
    .click();
  await view.getByRole("img", { name: "Alex Morgan", exact: true }).waitFor();
  const after = await avatar.boundingBox();
  assert(
    before.width === after.width && before.height === after.height,
    "Loading an avatar does not change its footprint",
  );
  await view
    .getByRole("button", { name: "Show initials", exact: true })
    .click();
  assert(
    await avatar.evaluate((el) => el.isConnected && el.textContent === "AM"),
    "Avatar fallback returns inside the same root",
  );
  await focus("Progress");
  const progress = view.getByRole("progressbar", {
    name: "Collection progress",
  });
  const fill = await progress
    .locator("[data-slot=progress-indicator]")
    .elementHandle();
  assert(
    (await progress.getAttribute("aria-valuenow")) === "35",
    "Progress exposes its actual initial value",
  );
  await view
    .getByRole("button", { name: "Advance progress", exact: true })
    .click();
  assert(
    (await progress.getAttribute("aria-valuenow")) === "60",
    "Progress exposes the updated value",
  );
  assert(
    await fill.evaluate(
      (el) =>
        el ===
        document.querySelector("#progress [data-slot=progress-indicator]"),
    ),
    "Progress retains one fill element",
  );
  await view
    .getByRole("button", { name: "Unknown duration", exact: true })
    .click();
  assert(
    (await progress.getAttribute("aria-valuenow")) === null,
    "Unknown duration is not announced as zero progress",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert(
    await fill.evaluate((el) => getComputedStyle(el).animationName === "none"),
    "Indeterminate progress respects reduced motion",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await view
    .getByRole("button", { name: "Unknown duration", exact: true })
    .click();
  await focus("Skeleton");
  const placeholder = view.locator(".foundation-loading-sample");
  const placeholderBox = await placeholder.boundingBox();
  assert(
    await view
      .locator("#skeleton [data-slot=skeleton]")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName === "none"),
    "Skeleton is static rather than an ambient shimmer",
  );
  await view.getByRole("button", { name: "Show content", exact: true }).click();
  const contentBox = await placeholder.boundingBox();
  assert(
    placeholderBox.height === contentBox.height,
    "Loading content keeps the reserved footprint",
  );
  await focus("Toggle");
  const bold = view.getByRole("button", { name: "Bold text", exact: true });
  const editor = await view.getByLabel("Toggle draft").elementHandle();
  await view
    .getByLabel("Toggle draft")
    .fill("Retain emphasis and the same draft");
  await bold.focus();
  await bold.press("Space");
  assert(
    (await bold.getAttribute("aria-pressed")) === "true",
    "Toggle supports Space and pressed semantics",
  );
  assert(
    await editor.evaluate(
      (el) =>
        el.value.startsWith("Retain") &&
        getComputedStyle(el).fontWeight === "600",
    ),
    "Toggle changes formatting on the original editor",
  );
  await focus("Toggle group");
  await view.getByRole("radio", { name: "Align left", exact: true }).focus();
  await view
    .getByRole("radio", { name: "Align left", exact: true })
    .press("ArrowRight");
  await view.waitForFunction(
    () => document.activeElement?.getAttribute("aria-label") === "Align center",
  );
  await view
    .getByRole("radio", { name: "Align center", exact: true })
    .press("Space");
  assert(
    (await view
      .getByRole("radio", { name: "Align center", exact: true })
      .getAttribute("aria-checked")) === "true",
    "Single toggle group supports roving keyboard selection",
  );
  await view.getByRole("button", { name: "Use bold", exact: true }).click();
  assert(
    (await view
      .getByRole("button", { name: "Use bold", exact: true })
      .getAttribute("aria-pressed")) === "true" &&
      (await view
        .getByRole("button", { name: "Use italic", exact: true })
        .getAttribute("aria-pressed")) === "true",
    "Multiple toggle group retains independent selected values",
  );
  await focus("Radio group");
  const choice = view.getByRole("radio", { name: "Only me", exact: true });
  await choice.focus();
  await choice.press("ArrowDown", { delay: 50 });
  await view.waitForFunction(
    () =>
      document
        .querySelector("#radio-group [value=team]")
        ?.getAttribute("aria-checked") === "true",
  );
  assert(
    (await view
      .getByRole("radio", { name: "People in this workspace", exact: true })
      .getAttribute("aria-checked")) === "true",
    "Radio arrow navigation selects the next option",
  );
  await focus("Scroll area");
  const scroll = view.getByRole("region", { name: "Collection notes" });
  await scroll.focus();
  await scroll.press("PageDown");
  await page.waitForTimeout(300);
  assert(
    await scroll.evaluate((el) => el.scrollTop > 0),
    "Scroll area supports keyboard scrolling",
  );
  const scrollNode = await scroll.elementHandle();
  await scroll.evaluate((el) => (el.scrollTop = 80));
  const note = await view.getByLabel("Scroll area draft").elementHandle();
  await page.getByRole("button", { name: "Phone", exact: true }).click();
  await view.waitForFunction(() => innerWidth === 390);
  assert(
    await scrollNode.evaluate(
      (el) =>
        el ===
          document.querySelector(
            "#scroll-area [data-slot=scroll-area-viewport]",
          ) && el.scrollTop > 0,
    ),
    "Phone resize retains the same scrolling viewport and position",
  );
  assert(
    await note.evaluate((el) => el.isConnected),
    "Phone resize retains the original scroll-area editor",
  );
  await focus("Breadcrumb");
  assert(
    (await view.locator("#breadcrumb [aria-current=page]").innerText()) ===
      "Field notes",
    "Breadcrumb identifies its current page",
  );
  await view.getByRole("button", { name: "Collections", exact: true }).click();
  assert(
    (await view.locator("#breadcrumb [role=status]").innerText()).includes(
      "Collections",
    ),
    "Breadcrumb supports composed buttons without app routing dependencies",
  );
  await focus("Pagination");
  const prev = view.locator('#pagination [aria-label="Go to previous page"]');
  assert(
    (await prev.getAttribute("href")) === null &&
      (await prev.getAttribute("tabindex")) === "-1",
    "Disabled pagination cannot navigate or enter tab order",
  );
  await view
    .getByRole("link", { name: "Go to next page", exact: true })
    .click();
  assert(
    (await view
      .getByRole("link", { name: "Page 2", exact: true })
      .getAttribute("aria-current")) === "page",
    "Pagination exposes the current destination",
  );
  await page.screenshot({
    path: "output/playwright/more-foundations-phone.png",
  });
  await page
    .getByRole("button", { name: "All components", exact: false })
    .click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Expanded gallery has no phone-host overflow",
  );
  assert(
    (await page.getByLabel("Preview width", { exact: true }).count()) === 0,
    "Responsive controls stay in component details",
  );
  assert(errors.length === 0, "No browser runtime errors");
  return { passed: checks.length, checks };
}
