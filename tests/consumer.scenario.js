async (page) => {
  const checks = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const assert = (ok, m) => {
    if (!ok) throw Error(m);
    checks.push(m);
  };
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto("http://127.0.0.1:4190/consumer-check/index.html");
  await page.locator("main > section").first().waitFor();
  assert(
    (await page.locator("main > section").count()) === 10,
    "All downloaded components mount in a StrictMode consumer without gallery CSS",
  );
  assert(
    await page.locator(".roc-image-tools").isHidden(),
    "Inactive image controls are hidden without a global CSS reset",
  );
  await page.getByRole("button", { name: "External state" }).click();
  await page.waitForTimeout(900);
  assert(
    (await page.locator(".roc-card-dialog:modal").count()) === 1,
    "Caller-controlled state opens the card",
  );
  await page.getByLabel("Consumer draft").fill("Preserved by the consumer");
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector(".roc-card-dialog:modal"),
  );
  assert(
    (await page.locator(".roc-folder-toggle").getAttribute("aria-expanded")) ===
      "false" &&
      (await page.locator(".roc-tray-toggle").getAttribute("aria-expanded")) ===
        "false",
    "Card dismissal updates the host and all controlled siblings",
  );
  await page
    .locator(".roc-tabs")
    .getByRole("button", { name: "Beta", exact: true })
    .click();
  assert(
    (await page.locator(".roc-lane.is-focused .roc-lane-title").innerText()) ===
      "Beta",
    "Controlled tabs and lanes share caller-owned state",
  );
  assert(
    (await page.locator(".roc-voice button").count()) === 1 &&
      (await page.locator(".roc-voice input").count()) === 0,
    "Voice controls compose independently in caller-defined order",
  );
  const editor = page.getByRole("textbox", { name: "Consumer editor" });
  await editor.evaluate((el) => {
    el.focus();
    const r = document.createRange();
    r.selectNodeContents(el);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
  });
  await page
    .locator(".roc-selection-toolbar:popover-open")
    .getByRole("button", { name: "Annotate", exact: true })
    .click();
  assert(
    (await page.locator("#format-result").innerText()) ===
      "Select any words here.",
    "Custom selection actions receive the original Range without an editor dependency",
  );
  await page.evaluate(() => getSelection().removeAllRanges());
  await page.waitForFunction(
    () => !document.querySelector(".roc-selection-toolbar:popover-open"),
  );
  const book = page.locator(".roc-page-book");
  await book.getByRole("button", { name: "Next page" }).click();
  await page.waitForTimeout(1100);
  assert(
    (await book.getByRole("status").innerText()) !== "Cover",
    "Book motion survives React StrictMode effect replay",
  );
  assert(errors.length === 0, "No isolated consumer runtime errors");
  return { passed: checks.length, checks };
}
