async (page) => {
  const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
  await page.setViewportSize({ width: 900, height: 700 });
  const base = "http://127.0.0.1:4191/select.html";
  const q = (s) => page.locator(`[data-t="tree-${s}"]`);
  const press = async (k) => { await page.keyboard.down(k); await page.waitForTimeout(25); await page.keyboard.up(k); await page.waitForTimeout(80); };
  const snap = () => page.evaluate(() => {
    const g = (s) => document.querySelector(`[data-t="tree-${s}"]`);
    const at = (el, names) => names.map((n) => n + "=" + (el.getAttribute(n) ?? "-")).join(",");
    const lines = [];
    for (const id of ["a", "b", "c"]) {
      const t = g(id + "-trigger"); lines.push(id + "-trigger:" + t.tagName + "," + at(t, ["role", "aria-expanded", "aria-haspopup", "data-state", "data-placeholder", "aria-autocomplete"]) + ",txt=" + t.textContent);
      const c = g(id + "-content");
      if (!c) { lines.push(id + "-content:absent"); continue; }
      lines.push(id + "-content:" + at(c, ["data-state", "data-side", "data-position"]).replace(/data-position=-/, ""));
      ["apple", "banana", "cherry", "date", "elder"].forEach((v) => { const it = g(id + "-" + v); if (it) lines.push(id + "-" + v + ":" + at(it, ["role", "aria-selected", "data-state", "data-highlighted", "data-disabled", "aria-disabled"]) + ",tab=" + it.getAttribute("tabindex")); });
    }
    const ae = document.activeElement; lines.push("FOCUS=" + (ae ? (ae.getAttribute("data-t") || ae.getAttribute("role") || ae.tagName).replace("tree-", "") : "none"));
    lines.push("HIDDEN=" + [...document.querySelectorAll("input[aria-hidden=true], select[aria-hidden=true], input[tabindex='-1']")].map((e) => e.tagName + ":" + (e.name || "-") + ":" + e.value).join(";"));
    lines.push("LOG=" + g("log").textContent);
    return lines;
  });
  const steps = [
    ["initial", async () => {}],
    ["open a by click", () => q("a-trigger").click()],
    ["ArrowDown", () => press("ArrowDown")], ["ArrowDown skip disabled", () => press("ArrowDown")], ["ArrowUp", () => press("ArrowUp")],
    ["End", () => press("End")], ["Home", () => press("Home")],
    ["typeahead 'e'", () => press("e")],
    ["Enter selects + closes", () => press("Enter")],
    ["open by Enter", async () => { await q("a-trigger").focus(); await press("Enter"); }],
    ["Escape", () => press("Escape")],
    ["open by Space", async () => { await q("a-trigger").focus(); await press(" "); }],
    ["click item selects", () => q("a-cherry").click()],
    ["open by ArrowDown", async () => { await q("a-trigger").focus(); await press("ArrowDown"); }],
    ["click outside closes", async () => { await page.keyboard.press("Escape"); await page.waitForTimeout(100); }],
    ["popper b open (placeholder)", () => q("b-trigger").click()],
    ["popper hover highlights", async () => { await q("b-date").hover(); }],
    ["popper click selects", () => q("b-date").click()],
    ["form submit", () => q("submit").click()],
    ["controlled c open", () => q("c-trigger").click()],
    ["controlled c pick", () => q("c-apple").click()],
    ["controlled typeahead from trigger", async () => { await q("c-trigger").focus(); await press("d"); }],
  ];
  const results = {};
  for (const tree of ["native", "radix"]) {
    await page.goto(base + "?tree=" + tree);
    await page.waitForSelector('[data-t="tree-a-trigger"]');
    results[tree] = [];
    for (const [, fn] of steps) { await fn(); await page.waitForTimeout(220); results[tree].push(await snap()); }
  }
  const keyOf = (l) => { const m = l.match(/^([A-Za-z0-9-]+)[:=]/); return m ? m[1] : l; };
  const toMap = (lines) => new Map(lines.map((l) => [keyOf(l), l]));
  // known, intended differences: normalise them away
  const norm = (l) => (l || "<absent>")
    .replace(/aria-haspopup=[^,]*,/g, "").replace(/aria-autocomplete=[^,]*,?/g, "")
    .replace(/aria-selected=[^,]*,/g, "").replace(/tab=[^,]*/g, "").replace(/,data-side=[^,]*/g, "").replace(/,data-position=[^,]*/g, "")
    .replace(/^HIDDEN=.*/, "HIDDEN").replace(/\|open-[a-z]:(true|false)/g, "").replace(/\|[a-c]:[a-z]+/g, (m) => m);
  const diffs = []; const seen = new Set();
  steps.forEach(([name], i) => {
    const a = toMap(results.native[i]), b = toMap(results.radix[i]);
    const keys = new Set([...a.keys(), ...b.keys()]);
    const lines = [];
    for (const k of keys) { const x = norm(a.get(k)), y = norm(b.get(k)); if (x !== y && !seen.has(x + y)) { seen.add(x + y); lines.push(x + "   ||   " + y); } }
    if (lines.length) diffs.push({ step: name, lines: lines.slice(0, 6) });
  });
  return { steps: steps.length, diffCount: diffs.length, diffs: diffs.slice(0, 16), errors: errors.slice(0, 4) };
}
