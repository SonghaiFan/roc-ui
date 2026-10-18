async (page) => {
  const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 140)); });
  await page.setViewportSize({ width: 900, height: 600 });
  const base = "http://127.0.0.1:4191/dialogs.html";
  const q = (s) => page.locator(`[data-t="tree-${s}"]`);
  const press = async (k) => { const keys = k.split("+"); for (const x of keys) await page.keyboard.down(x); await page.waitForTimeout(30); for (const x of keys.reverse()) await page.keyboard.up(x); await page.waitForTimeout(60); };
  const snap = () => page.evaluate(() => {
    const g = (s) => document.querySelector(`[data-t="tree-${s}"]`);
    const lines = [];
    const at = (el, names) => names.map((n) => n + "=" + (el.getAttribute(n) ?? "-")).join(",");
    for (const t of ["dlg-trigger", "ctl-trigger", "alert-trigger"]) { const el = g(t); lines.push(t + ":" + el.tagName + "," + at(el, ["aria-haspopup", "aria-expanded", "data-state"]) + ",cls=" + el.className); }
    for (const c of ["dlg", "ctl", "alert"]) {
      const el = g(c + "-content"); if (!el) { lines.push(c + ":absent"); continue; }
      const lab = document.getElementById(el.getAttribute("aria-labelledby") || ""); const des = document.getElementById(el.getAttribute("aria-describedby") || "");
      lines.push(c + ":role=" + el.getAttribute("role") + ",state=" + el.getAttribute("data-state") + ",modal=" + (el.getAttribute("aria-modal") ?? "-") + ",label=" + (lab ? lab.textContent : "none") + ",desc=" + (des ? des.textContent : "none"));
      const ov = g(c + "-overlay"); lines.push(c + "-overlay:" + (ov ? ov.getAttribute("data-state") : "absent"));
    }
    const out = g("out0"); let outsideHidden = "no"; for (let n = out; n; n = n.parentElement) { if (n.getAttribute("aria-hidden") === "true") { outsideHidden = "aria-hidden"; break; } if (n.inert) { outsideHidden = "inert"; break; } }
    lines.push("outside=" + outsideHidden + ",bodyOverflow=" + (getComputedStyle(document.body).overflow === "hidden" ? "hidden" : "visible"));
    const ae = document.activeElement; lines.push("FOCUS=" + (ae ? (ae.getAttribute("data-t") || ae.tagName).replace("tree-", "") : "none"));
    lines.push("LOG=" + g("log").textContent);
    return lines;
  });
  const steps = [
    ["open dialog", () => q("dlg-trigger").click()],
    ["Tab 1", () => press("Tab")], ["Tab 2", () => press("Tab")], ["Tab 3", () => press("Tab")], ["Tab 4", () => press("Tab")], ["Tab 5 (wraps)", () => press("Tab")],
    ["Shift+Tab", () => press("Shift+Tab")],
    ["Escape", () => press("Escape")],
    ["reopen by keyboard", async () => { await q("dlg-trigger").focus(); await press("Enter"); }],
    ["click overlay closes", async () => { await page.mouse.click(850, 560); }],
    ["reopen", () => q("dlg-trigger").click()],
    ["click Save (asChild close)", () => q("dlg-save").click()],
    ["reopen again", () => q("dlg-trigger").click()],
    ["click x close", () => q("dlg-x").click()],
    ["controlled: click requests", () => q("ctl-trigger").click()],
    ["controlled: parent opens", () => q("ctl-open").click({ force: true })],
    ["controlled: Escape requests close", () => press("Escape")],
    ["controlled: parent closes", () => page.evaluate(() => document.querySelector('[data-t="tree-ctl-reset"]').click())],
    ["alert open", () => q("alert-trigger").click()],
    ["alert Escape", () => press("Escape")],
    ["alert reopen", () => q("alert-trigger").click()],
    ["alert click outside stays open", async () => { await page.mouse.click(850, 560); }],
    ["alert Cancel", () => q("alert-cancel").click()],
    ["alert reopen 2", () => q("alert-trigger").click()],
    ["alert Action", () => q("alert-action").click()],
    ["alert reopen 3 + Tab", async () => { await q("alert-trigger").click(); await press("Tab"); }],
  ];
  const results = {};
  for (const tree of ["native", "radix"]) {
    await page.goto(base + "?tree=" + tree);
    await page.waitForSelector('[data-t="tree-dlg-trigger"]');
    results[tree] = [];
    for (const [, fn] of steps) { await fn(); await page.waitForTimeout(150); results[tree].push(await snap()); }
  }
  const diffs = []; const seen = new Set();
  steps.forEach(([name], i) => {
    const a = results.native[i], b = results.radix[i];
    const lines = a.map((x, k) => x === b[k] ? null : x + "   ||   " + b[k]).filter(Boolean).filter((l) => !(l.startsWith("LOG=") && false));
    if (lines.length) diffs.push({ step: name, lines: lines.slice(0, 5) });
  });
  return { steps: steps.length, diffCount: diffs.length, diffs: diffs.slice(0, 12), errors: errors.slice(0, 3) };
}
