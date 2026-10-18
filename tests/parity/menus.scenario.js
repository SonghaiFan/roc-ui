async (page) => {
  const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 140)); });
  await page.setViewportSize({ width: 900, height: 700 });
  const base = "http://127.0.0.1:4191/menus.html";
  const q = (s) => page.locator(`[data-t="tree-${s}"]`);
  const press = async (k) => { const keys = k.split("+"); for (const x of keys) await page.keyboard.down(x); await page.waitForTimeout(25); for (const x of keys.reverse()) await page.keyboard.up(x); await page.waitForTimeout(70); };
  const snap = () => page.evaluate(() => {
    const g = (s) => document.querySelector(`[data-t="tree-${s}"]`);
    const at = (el, names) => names.map((n) => n + "=" + (el.getAttribute(n) ?? "-")).join(",");
    const lines = [];
    for (const t of ["dd-trigger", "dd-aschild", "ctx-trigger", "mb-file", "mb-edit"]) { const el = g(t); lines.push(t + ":" + el.tagName + "," + at(el, ["aria-haspopup", "aria-expanded", "data-state", "role"]) + ",cls=" + el.className); }
    for (const c of ["dd-content", "dd2-content", "ctx-content", "mb-file-content", "mb-edit-content", "sub-content"]) {
      const el = g(c); if (!el) { lines.push(c + ":absent"); continue; }
      lines.push(c + ":" + at(el, ["role", "data-state", "data-side", "data-align", "aria-orientation"]));
      el.querySelectorAll("[role^=menuitem], [data-t$='-item'],[data-t*='item']").forEach((it) => lines.push("  " + (it.getAttribute("data-t") || "").replace("tree-", "") + ":" + at(it, ["role", "aria-checked", "data-state", "data-disabled", "aria-disabled", "data-highlighted"]) + ",txt=" + it.textContent.slice(0, 14)));
    }
    const ae = document.activeElement; lines.push("FOCUS=" + (ae ? (ae.getAttribute("data-t") || ae.getAttribute("role") || ae.tagName).replace("tree-", "") : "none"));
    lines.push("LOG=" + g("log").textContent);
    return lines;
  });
  const steps = [
    ["open by click", () => q("dd-trigger").click()],
    ["ArrowDown", () => press("ArrowDown")], ["ArrowDown 2 (skips disabled)", async () => { await press("ArrowDown"); }], ["ArrowDown 3", () => press("ArrowDown")],
    ["ArrowUp", () => press("ArrowUp")], ["End", () => press("End")], ["Home", () => press("Home")],
    ["typeahead 'p'", () => press("p")],
    ["Enter selects + closes", () => press("Enter")],
    ["open by Enter", async () => { await q("dd-trigger").focus(); await press("Enter"); }],
    ["first item focus check ArrowDown", () => press("ArrowDown")],
    ["Escape closes + focus returns", () => press("Escape")],
    ["open by ArrowDown key", async () => { await q("dd-trigger").focus(); await press("ArrowDown"); }],
    ["Escape 2", () => press("Escape")],
    ["open click then outside click closes", async () => { await q("dd-trigger").click(); await page.waitForTimeout(100); await page.mouse.click(850, 650); }],
    ["open; click checkbox (closes)", async () => { await q("dd-trigger").click(); await page.waitForTimeout(100); await q("check").click(); }],
    ["open; click keep-open item", async () => { await q("dd-trigger").click(); await page.waitForTimeout(100); await q("item-keep").click(); }],
    ["click radio alpha", () => q("radio-a").click()],
    ["open; hover item sets highlight", async () => { await q("dd-trigger").click(); await page.waitForTimeout(100); await q("item-new").hover(); }],
    ["submenu opens with ArrowRight", async () => { await q("sub-trigger").hover(); await page.waitForTimeout(200); await press("ArrowRight"); }],
    ["submenu ArrowDown", () => press("ArrowDown")],
    ["submenu ArrowLeft closes sub", () => press("ArrowLeft")],
    ["submenu reopen and Enter selects", async () => { await press("ArrowRight"); await press("Enter"); }],
    ["asChild trigger open", () => q("dd-aschild").click()],
    ["asChild item present", () => page.waitForTimeout(50)],
    ["Escape 3", () => press("Escape")],
    ["context menu right click", () => q("ctx-trigger").click({ button: "right", position: { x: 40, y: 20 } })],
    ["context ArrowDown", () => press("ArrowDown")],
    ["context Enter", () => press("Enter")],
    ["context right click again + Escape", async () => { await q("ctx-trigger").click({ button: "right", position: { x: 40, y: 20 } }); await page.waitForTimeout(100); await press("Escape"); }],
    ["menubar open File", () => q("mb-file").click()],
    ["menubar ArrowRight moves to Edit", () => press("ArrowRight")],
    ["menubar hover switches menu", async () => { await q("mb-file").hover(); await page.waitForTimeout(150); }],
    ["menubar select item", async () => { await press("ArrowDown"); await press("Enter"); }],
  ];
  const results = {};
  for (const tree of ["native", "radix"]) {
    await page.goto(base + "?tree=" + tree);
    await page.waitForSelector('[data-t="tree-dd-trigger"]');
    results[tree] = [];
    for (const [, fn] of steps) { await fn(); await page.waitForTimeout(170); results[tree].push(await snap()); }
  }
  const diffs = []; const seen = new Set();
  steps.forEach(([name], i) => {
    const a = results.native[i], b = results.radix[i];
    const lines = a.map((x, k) => x === b[k] ? null : x + "   ||   " + b[k]).filter(Boolean).filter((l) => !seen.has(l) && seen.add(l));
    if (lines.length) diffs.push({ step: name, lines: lines.slice(0, 5) });
  });
  return { steps: steps.length, diffCount: diffs.length, diffs: diffs.slice(0, 16), errors: errors.slice(0, 3) };
}
