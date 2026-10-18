async (page) => {
  const errors = []; let cur = "-"; page.on("pageerror", (e) => errors.push("[" + cur + "] " + e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push("[" + cur + "] " + m.text().replace(/\s+/g, " ").slice(0, 200)); });
  await page.setViewportSize({ width: 900, height: 700 });
  const base = "http://127.0.0.1:4191/navigation-menu.html";
  const q = (s) => page.locator(`[data-t="tree-${s}"]`);
  const press = async (k) => { await page.keyboard.down(k); await page.waitForTimeout(25); await page.keyboard.up(k); await page.waitForTimeout(80); };
  const snap = () => page.evaluate(() => {
    const g = (s) => document.querySelector(`[data-t="tree-${s}"]`);
    const at = (el, names) => names.map((n) => n + "=" + (el.getAttribute(n) ?? "-")).join(",");
    const lines = [];
    for (const id of ["inline", "vp"]) {
      for (const t of ["ta", "tb"]) { const el = g(id + "-" + t); lines.push(`${id}-${t}:${at(el, ["aria-expanded", "data-state"])},ctrl=${el.getAttribute("aria-controls") && document.getElementById(el.getAttribute("aria-controls")) ? "ok" : "missing"}`); }
      for (const c of ["ca", "cb"]) { const el = g(id + "-" + c); if (!el) { lines.push(`${id}-${c}:absent`); continue; } lines.push(`${id}-${c}:${at(el, ["data-state", "data-motion", "data-orientation"])},in=${el.closest("[data-t$='-vp']") ? "viewport" : el.closest("li") ? "item" : "other"},label=${el.getAttribute("aria-labelledby") ? "yes" : "no"}`); }
      const guide = g(id + "-guide"); lines.push(`${id}-guide:${at(guide, ["data-active", "aria-current"])}`);
      const ind = g(id + "-ind"); lines.push(`${id}-ind:${ind ? at(ind, ["data-state"]) + ",x=" + Math.round(ind.getBoundingClientRect().left) + ",w=" + Math.round(ind.getBoundingClientRect().width) : "absent"}`);
      const vp = g(id + "-vp"); if (vp && !vp.hidden) lines.push(`${id}-vp:${at(vp, ["data-state"])},w=${Math.round(vp.getBoundingClientRect().width)},h=${Math.round(vp.getBoundingClientRect().height)}`);
      lines.push(`${id}-log:${g(id + "-log").textContent}`);
    }
    const ae = document.activeElement; lines.push("FOCUS=" + (ae ? (ae.getAttribute("data-t") || ae.tagName).replace("tree-", "") : "none"));
    return lines;
  });
  const steps = [
    ["initial", async () => {}],
    ["hover Alpha (delayed open)", async () => { await q("inline-ta").hover(); await page.waitForTimeout(450); }],
    ["hover Beta (instant switch, from-end)", async () => { await q("inline-tb").hover(); await page.waitForTimeout(150); }],
    ["hover Alpha again (from-start)", async () => { await q("inline-ta").hover(); await page.waitForTimeout(150); }],
    ["pointer leaves (closes)", async () => { await page.mouse.move(700, 600); await page.waitForTimeout(500); }],
    ["hover then move into content stays open", async () => { await q("inline-ta").hover(); await page.waitForTimeout(400); await q("inline-ca").hover(); await page.waitForTimeout(350); }],
    ["leave closes", async () => { await page.mouse.move(700, 600); await page.waitForTimeout(500); }],
    ["click Alpha opens", async () => { await q("inline-ta").click(); await page.waitForTimeout(150); }],
    ["click Alpha closes, pointer still over", async () => { await q("inline-ta").click(); await page.waitForTimeout(400); }],
    ["pointer away", async () => { await page.mouse.move(700, 600); await page.waitForTimeout(500); }],
    ["keyboard Enter opens", async () => { await q("inline-ta").focus(); await press("Enter"); }],
    ["ArrowDown enters content", () => press("ArrowDown")],
    ["Escape closes + focus trigger", () => press("Escape")],
    ["ArrowRight roves to Beta", () => press("ArrowRight")],
    ["ArrowRight roves to Guide link", () => press("ArrowRight")],
    ["End / Home", async () => { await press("Home"); }],
    ["open Alpha then click link", async () => { await q("inline-ta").click(); await page.waitForTimeout(150); await q("inline-a1").click(); await page.waitForTimeout(150); }],
    ["open then outside click closes", async () => { await q("inline-tb").click(); await page.waitForTimeout(150); await q("out1").click(); await page.waitForTimeout(150); }],
    ["viewport: hover Alpha", async () => { await q("vp-ta").hover(); await page.waitForTimeout(450); }],
    ["viewport: hover Beta", async () => { await q("vp-tb").hover(); await page.waitForTimeout(250); }],
    ["viewport: leave", async () => { await page.mouse.move(700, 650); await page.waitForTimeout(500); }],
    ["viewport: click opens + ArrowDown", async () => { await q("vp-ta").click(); await page.waitForTimeout(150); await press("ArrowDown"); }],
    ["viewport: Escape", () => press("Escape")],
  ];
  const results = {};
  for (const tree of ["native", "radix"]) {
    await page.goto(base + "?tree=" + tree);
    await page.waitForSelector('[data-t="tree-inline-ta"]');
    results[tree] = [];
    for (const [nm, fn] of steps) { cur = tree + "/" + nm; await fn(); await page.waitForTimeout(100); results[tree].push(await snap()); }
  }
  const diffs = []; const seen = new Set();
  steps.forEach(([name], i) => {
    const a = results.native[i], b = results.radix[i];
    const lines = a.map((x, k) => x === b[k] ? null : x + "   ||   " + b[k]).filter(Boolean).filter((l) => !seen.has(l) && seen.add(l));
    if (lines.length) diffs.push({ step: name, lines: lines.slice(0, 6) });
  });
  return { steps: steps.length, diffCount: diffs.length, diffs: diffs.slice(0, 16), errors: errors.slice(0, 4) };
}
