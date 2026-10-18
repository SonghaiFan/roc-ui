async (page) => {
  const errors = []; page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1000, height: 700 });
  const base = "http://127.0.0.1:4191/popover.html";
  const q = (s) => page.locator(`[data-t="tree-${s}"]`);
  const press = async (k) => { await page.keyboard.down(k); await page.waitForTimeout(30); await page.keyboard.up(k); await page.waitForTimeout(60); };
  const snap = () => page.evaluate(() => {
    const g = (s) => document.querySelector(`[data-t="tree-${s}"]`);
    const lines = [];
    for (const t of ["pop-trigger", "aschild-trigger", "ctl-trigger", "anchored-trigger"]) { const el = g(t); lines.push(t + ":" + [el.tagName, el.getAttribute("aria-haspopup"), el.getAttribute("aria-expanded"), el.getAttribute("data-state"), el.className.replace(/\s*(trg|mine)/g, "$1")].join(",")); }
    for (const c of ["pop-content", "aschild-content", "ctl-content", "anchored-content"]) {
      const el = g(c); if (!el) { lines.push(c + ":absent"); continue; }
      const r = el.getBoundingClientRect(); const tr = g(c.replace("content", "trigger")).getBoundingClientRect();
      lines.push(c + ":" + [el.getAttribute("role"), el.getAttribute("data-state"), el.getAttribute("data-side"), el.getAttribute("data-align"), "dx=" + Math.round(r.left - tr.left), "dy=" + Math.round(r.top - tr.bottom), "txt=" + el.textContent.slice(0, 12)].join(","));
    }
    const ae = document.activeElement;
    lines.push("FOCUS=" + (ae ? (ae.getAttribute("data-t") || ae.tagName).replace("tree-", "") : "none"));
    lines.push("LOG=" + g("log").textContent);
    return lines;
  });
  const steps = [
    ["open by click", () => q("pop-trigger").click()],
    ["Escape closes", () => press("Escape")],
    ["open again", () => q("pop-trigger").click()],
    ["Tab moves into content", () => press("Tab")],
    ["click trigger toggles closed", () => q("pop-trigger").click()],
    ["open then click outside closes", async () => { await q("pop-trigger").click(); await page.waitForTimeout(80); await q("out0").click(); }],
    ["keyboard open (Enter)", async () => { await q("pop-trigger").focus(); await press("Enter"); }],
    ["Escape", () => press("Escape")],
    ["keyboard open (Space)", () => press(" ")],
    ["Escape 2", () => press("Escape")],
    ["asChild open", () => q("aschild-trigger").click()],
    ["asChild Escape", () => press("Escape")],
    ["controlled click requests only", () => q("ctl-trigger").click()],
    ["controlled opened by parent", () => q("ctl-open").click()],
    ["controlled Escape requests close", () => press("Escape")],
    ["anchored open", () => q("anchored-trigger").click()],
  ];
  const results = {};
  for (const tree of ["native", "radix"]) {
    await page.goto(base + "?tree=" + tree);
    await page.waitForSelector('[data-t="tree-pop-trigger"]');
    results[tree] = [];
    for (const [, fn] of steps) { await fn(); await page.waitForTimeout(120); results[tree].push(await snap()); }
  }
  const diffs = [];
  steps.forEach(([name], i) => {
    const a = results.native[i], b = results.radix[i];
    const lines = a.map((x, k) => x === b[k] ? null : x + "   ||   " + b[k]).filter(Boolean);
    if (lines.length) diffs.push({ step: name, lines: lines.slice(0, 5) });
  });
  return { steps: steps.length, diffCount: diffs.length, diffs, errors: errors.slice(0, 3) };
}
