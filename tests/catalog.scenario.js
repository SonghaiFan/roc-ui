async (page) => {
  const checks = [],
    errors = [];
  const assert = (ok, message) => {
    if (!ok) throw Error(message);
    checks.push(message);
  };
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4190/");
  const view = await (
    await page.locator("iframe").elementHandle()
  ).contentFrame();
  await view.locator("#typography").waitFor();
  assert(
    (await view.locator(".component-card").count()) === 66,
    "66 components mounted",
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
    await page.waitForTimeout(550);
  };
  await focus("Alert Dialog");
  await view
    .getByRole("button", { name: "Archive collection", exact: true })
    .click();
  await view.getByRole("alertdialog").waitFor();
  await view.getByRole("button", { name: "Cancel", exact: true }).click();
  await view.waitForFunction(
    () => document.activeElement?.textContent === "Archive collection",
  );
  assert(
    await view
      .getByRole("button", { name: "Archive collection", exact: true })
      .evaluate((e) => e === document.activeElement),
    "Alert Dialog returns focus",
  );
  await focus("Collapsible");
  const draft = view.getByRole("textbox", { name: "Collapsible draft" });
  await draft.fill("Retained after folding");
  const node = await draft.elementHandle();
  await view
    .getByRole("button", { name: "Collection details", exact: true })
    .click();
  assert(
    await node.evaluate((e) => e.isConnected && !!e.closest("[inert]")),
    "Folded content is retained and inert",
  );
  await view
    .getByRole("button", { name: "Collection details", exact: true })
    .click();
  await page.getByRole("button", { name: "Phone", exact: true }).click();
  assert(
    await node.evaluate(
      (e) => e.isConnected && e.value === "Retained after folding",
    ),
    "Draft survives phone layout",
  );
  await focus("Combobox");
  const combo = view.getByRole("combobox", { name: "Framework" });
  await combo.fill("Vue");
  await view.getByRole("option", { name: "Vue", exact: true }).click();
  assert((await combo.inputValue()) === "Vue", "Combobox filters and selects");
  await focus("Command");
  await view.getByRole("combobox").fill("Create");
  await view
    .getByRole("option", { name: "Create a note", exact: true })
    .click();
  assert(
    (await view.locator("#command [role=status]").textContent()) ===
      "Create a note",
    "Command search invokes the action",
  );
  await focus("Data Table");
  await view
    .getByRole("textbox", { name: "Search Collections" })
    .fill("walking");
  assert(
    (await view.locator("#data-table tbody tr").count()) === 1,
    "Data Table filters records",
  );
  assert(
    (await view.locator("#data-table tbody").textContent()).includes(
      "Walking routes",
    ),
    "Filtered record retains its identity",
  );
  await view.getByRole("textbox", { name: "Search Collections" }).fill("");
  await view.getByRole("button", { name: "Collection", exact: true }).click();
  assert(
    (await view.locator("#data-table tbody tr").first().textContent()).includes(
      "Collected ideas",
    ),
    "Data Table sorts by name",
  );
  await view.getByRole("button", { name: "Next", exact: true }).click();
  assert(
    await view
      .getByRole("button", { name: "Previous", exact: true })
      .isEnabled(),
    "Data Table paginates",
  );
  await focus("Date Picker");
  await view.getByRole("button", { name: "Choose date" }).click();
  await view
    .locator("[data-slot=calendar]")
    .filter({ visible: true })
    .waitFor();
  await view
    .locator('[data-day="19/10/2026"], [data-day="10/19/2026"]')
    .filter({ visible: true })
    .click();
  assert(
    (
      await view.getByRole("button", { name: "Choose date" }).textContent()
    ).includes("19"),
    "Date Picker commits a date",
  );
  await focus("Field");
  await view.getByRole("button", { name: "Save name" }).click();
  assert(
    await view.getByRole("alert").isVisible(),
    "Field displays validation",
  );
  await view
    .getByRole("textbox", { name: "Collection name", exact: true })
    .fill("New collection");
  await view.getByRole("button", { name: "Save name" }).click();
  assert(
    (await view.getByRole("status").textContent()).includes("Saved"),
    "Field accepts valid input",
  );
  await focus("Input OTP");
  await view.getByRole("textbox", { name: "Verification code" }).fill("123456");
  assert(
    (await view.getByRole("status").textContent()).includes("complete"),
    "OTP uses one fillable input",
  );
  await focus("Select");
  await view.getByRole("combobox", { name: "Sharing" }).click();
  await view.getByRole("option", { name: "Workspace", exact: true }).click();
  assert(
    (
      await view.getByRole("combobox", { name: "Sharing" }).textContent()
    ).includes("Workspace"),
    "Select commits selected option",
  );
  await focus("Questionnaire");
  await view.getByRole("radio", { name: "Ideas", exact: false }).check();
  await view.getByRole("button", { name: "Next", exact: true }).click();
  await view
    .getByRole("textbox", { name: "Questionnaire collection name" })
    .fill("Retained answers");
  await view.getByRole("button", { name: "Previous", exact: true }).click();
  assert(
    await view.getByRole("radio", { name: "Ideas", exact: false }).isChecked(),
    "Questionnaire preserves previous answers",
  );
  await view.getByRole("button", { name: "Next", exact: true }).click();
  assert(
    (await view
      .getByRole("textbox", { name: "Questionnaire collection name" })
      .inputValue()) === "Retained answers",
    "Questionnaire retains text across steps",
  );
  await view.getByRole("button", { name: "Submit", exact: true }).click();
  assert(
    (await view.locator("#questionnaire [role=status]").textContent()).includes(
      "saved",
    ),
    "Questionnaire submits locally",
  );
  await focus("Sidebar");
  const sidebarDraft = await view
    .getByRole("textbox", { name: "Sidebar draft" })
    .elementHandle();
  await view
    .getByRole("textbox", { name: "Sidebar draft" })
    .fill("Navigation draft");
  await view.getByRole("button", { name: "Toggle sidebar" }).click();
  assert(
    (await view.locator("#sidebar aside").getAttribute("inert")) !== null,
    "Collapsed sidebar is inert",
  );
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  await view.getByRole("button", { name: "Toggle sidebar" }).click();
  assert(
    await sidebarDraft.evaluate(
      (e) => e.isConnected && e.value === "Navigation draft",
    ),
    "Sidebar retains editor across collapse and resize",
  );
  await focus("Resizable");
  const editor = await view
    .getByRole("textbox", { name: "Resizable draft" })
    .elementHandle();
  const handle = view.getByRole("separator");
  await handle.focus();
  await handle.press("ArrowRight");
  assert(
    await editor.evaluate((e) => e.isConnected),
    "Keyboard panel resizing retains editor",
  );
  await focus("Sheet");
  await view.getByRole("button", { name: "Open inspector" }).click();
  const sheetInput = await view
    .getByRole("textbox", { name: "Sheet title" })
    .elementHandle();
  await view
    .getByRole("textbox", { name: "Sheet title" })
    .fill("Retained sheet");
  await page.getByRole("button", { name: "Phone", exact: true }).click();
  assert(
    await sheetInput.evaluate(
      (e) => e.isConnected && e.value === "Retained sheet",
    ),
    "Open sheet retains input across breakpoint",
  );
  await page.mouse.move(100, 800);
  await page.mouse.wheel(0, 600);
  await view.getByRole("button", { name: "Done", exact: true }).click();
  await focus("Drawer");
  await view.getByRole("button", { name: "Open drawer", exact: true }).click();
  await view
    .getByRole("textbox", { name: "Drawer note" })
    .fill("Persistent drawer draft");
  await page.mouse.move(100, 800);
  await page.mouse.wheel(0, 600);
  await view.getByRole("button", { name: "Done", exact: true }).click();
  await view.getByRole("button", { name: "Open drawer", exact: true }).click();
  assert(
    (await view.getByRole("textbox", { name: "Drawer note" }).inputValue()) ===
      "Persistent drawer draft",
    "Drawer values survive dismissal",
  );
  await view.getByRole("button", { name: "Done", exact: true }).click();
  await focus("Toast");
  await view.getByRole("button", { name: "Show notification" }).click();
  await view.getByText("Collection saved", { exact: true }).waitFor();
  await page.mouse.move(100,800);
  await page.mouse.wheel(0,600);
  await view.locator("[data-slot=toast]").hover();
  await view.getByRole("button", { name: "Close toast" }).click();
  assert(
    await view.getByRole("button", { name: "Show notification" }).isVisible(),
    "Toast can be dismissed",
  );
  await focus("Trace");
  await view.getByRole("button", { name: "Collected observations" }).click();
  assert(
    await view
      .getByText(
        "Three notes share a common theme: keep the original context.",
        { exact: true },
      )
      .isVisible(),
    "Trace reveals retained evidence",
  );
  await page
    .getByRole("button", { name: "All components", exact: false })
    .click();
  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForTimeout(500);
  const overflow = await view.evaluate(() =>
    [...document.querySelectorAll(".component-preview")]
      .filter((e) => e.scrollWidth > e.clientWidth + 2)
      .map((e) => e.dataset.component),
  );
  assert(
    !overflow.length,
    "Phone gallery has no overflowing previews: " + overflow.join(","),
  );
  await page.screenshot({ path: "output/playwright/catalog-phone.png" });
  assert(errors.length === 0, "No runtime errors");
  return { checks, errors };
}
