async (page) => {
  const errors = []; page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1000, height: 700 });
  const base = "http://127.0.0.1:4191/popups.html";
  const q = (s) => page.locator(`[data-t="tree-${s}"]`);
  const press = async (k) => { await page.keyboard.down(k); await page.waitForTimeout(30); await page.keyboard.up(k); await page.waitForTimeout(60); };
  const snap = () => page.evaluate(() => {
    const g = (s) => document.querySelector(`[data-t="tree-${s}"]`);
    const lines = [];
    const attrs = (el, names) => names.map((n) => n + "=" + (el.getAttribute(n) ?? "-")).join(",");
    for (const t of ["tip-trigger", "tip-aschild", "hc-trigger", "col-trigger", "colf-trigger", "cold-trigger"]) { const el = g(t); lines.push(t + ":" + el.tagName + "," + attrs(el, ["data-state", "aria-expanded", "aria-haspopup", "data-disabled", "disabled"]) + ",desc=" + (el.getAttribute("aria-describedby") ? "yes" : "no") + ",cls=" + el.className); }
    for (const c of ["tip-content", "tip-aschild-content", "hc-content"]) {
      const el = g(c); if (!el) { lines.push(c + ":absent"); continue; }
      const r = el.getBoundingClientRect(); const tr = g(c.replace("-content", "").replace(/^tip$/, "tip-trigger").replace(/^hc$/, "hc-trigger").replace("tip-aschild", "tip-aschild")).getBoundingClientRect();
      lines.push(c + ":" + attrs(el, ["data-state", "data-side", "data-align"]) + ",dx=" + Math.round(r.left + r.width / 2 - (tr.left + tr.width / 2)) + ",dy=" + Math.round(r.top - tr.bottom) + ",txt=" + el.textContent.slice(0, 10));
    }
    for (const c of ["col", "colf", "cold"]) { const root = g(c + "-root"), content = g(c + "-content"); lines.push(c + ":root=" + attrs(root, ["data-state", "data-disabled"]) + ",content=" + (content ? attrs(content, ["data-state", "hidden", "id"]).replace(/id=[^,]*/, "id=y") + ",txt=" + content.textContent : "absent") + ",ctrl=" + (g(c + "-trigger").getAttribute("aria-controls") === content?.id ? "match" : "x")); }
    const ae = document.activeElement;
    lines.push("FOCUS=" + (ae ? (ae.getAttribute("data-t") || ae.tagName).replace("tree-", "") : "none"));
    lines.push("LOG=" + g("log").textContent);
    return lines;
  });
  const steps = [
    ["tooltip hover opens", async () => { await q("tip-trigger").hover(); await page.waitForTimeout(300); }],
    ["tooltip mouse leave closes", async () => { await page.mouse.move(5, 5); await page.waitForTimeout(300); }],
    ["tooltip keyboard focus opens", async () => { await q("out0").focus(); await press("Tab"); await page.waitForTimeout(250); }],
    ["tooltip Escape closes", () => press("Escape")],
    ["tooltip click closes", async () => { await q("tip-trigger").hover(); await page.waitForTimeout(300); await q("tip-trigger").click(); }],
    ["tooltip asChild hover", async () => { await page.mouse.move(5, 5); await page.waitForTimeout(250); await q("tip-aschild").hover(); await page.waitForTimeout(300); }],
    ["tooltip asChild leave", async () => { await page.mouse.move(5, 5); await page.waitForTimeout(300); }],
    ["hovercard hover opens", async () => { await q("hc-trigger").hover(); await page.waitForTimeout(350); }],
    ["hovercard move into card keeps open", async () => { await q("hc-content").hover(); await page.waitForTimeout(300); }],
    ["hovercard leave closes", async () => { await page.mouse.move(5, 5); await page.waitForTimeout(400); }],
    ["hovercard focus opens", async () => { await q("hc-trigger").focus(); await page.waitForTimeout(350); }],
    ["hovercard Escape", async () => { await press("Escape"); await page.waitForTimeout(150); }],
    ["collapsible click opens", () => q("col-trigger").click()],
    ["collapsible click closes", () => q("col-trigger").click()],
    ["collapsible keyboard Space", async () => { await q("col-trigger").focus(); await press(" "); }],
    ["collapsible keyboard Enter closes", () => press("Enter")],
    ["collapsible forceMount asChild open", () => q("colf-trigger").click()],
    ["collapsible forceMount asChild close", () => q("colf-trigger").click()],
    ["collapsible disabled click", () => q("cold-trigger").click({ force: true })],
  ];
  const results = {};
  for (const tree of ["native", "radix"]) {
    await page.goto(base + "?tree=" + tree);
    await page.waitForSelector('[data-t="tree-tip-trigger"]');
    await page.mouse.move(5, 5);
    results[tree] = [];
    for (const [, fn] of steps) { await fn(); await page.waitForTimeout(80); results[tree].push(await snap()); }
  }
  const diffs = []; const seen = new Set();
  steps.forEach(([name], i) => {
    const a = results.native[i], b = results.radix[i];
    const lines = a.map((x, k) => x === b[k] ? null : x + "   ||   " + b[k]).filter(Boolean).filter((l) => !l.startsWith("LOG=") && !seen.has(l) && seen.add(l));
    if (lines.length) diffs.push({ step: name, lines: lines.slice(0, 6) });
  });
  return { steps: steps.length, diffCount: diffs.length, diffs, errors: errors.slice(0, 3) };
}
