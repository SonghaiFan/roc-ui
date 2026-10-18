async (page) => {
  const errors = []; let cur = "-"; let curTree = "-"; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push("[" + curTree + " / " + cur + "] " + m.text().replace(/\s+/g, " ").slice(0, 330)); });
  await page.setViewportSize({ width: 900, height: 900 });
  const base = "http://127.0.0.1:4191/slider.html";
  const press = async (k) => { const keys = k.split("+"); for (const x of keys) await page.keyboard.down(x); await page.waitForTimeout(25); for (const x of keys.reverse()) await page.keyboard.up(x); await page.waitForTimeout(60); };
  const th = (id, i = 0) => page.locator(`[data-t="tree-${id}-thumb${i}"]`);
  const focusEl = async (id, i = 0) => { const loc = th(id, i); await loc.evaluate((el) => { const inp = el.matches("input") ? el : el.querySelector("input"); (inp || el).focus(); }); };
  const snap = () => page.evaluate(() => {
    const lines = [];
    for (const id of ["one", "range", "vert", "dis", "step", "ctl"]) {
      const root = document.querySelector(`[data-t="tree-${id}"]`); const rr = root.getBoundingClientRect();
      const horiz = root.getAttribute("data-orientation") !== "vertical";
      root.querySelectorAll(`[data-t^="tree-${id}-thumb"]`).forEach((thumb, i) => {
        const el = thumb.matches('[role=slider]') ? thumb : thumb.querySelector('[role=slider], input') || thumb;
        const tr = thumb.getBoundingClientRect();
        const frac = horiz ? (tr.left + tr.width / 2 - rr.left) / rr.width : 1 - (tr.top + tr.height / 2 - rr.top) / rr.height;
        const now = el.getAttribute("aria-valuenow") ?? el.value;
        lines.push(`${id}-t${i}:now=${now},min=${el.getAttribute("aria-valuemin") ?? el.min ?? "-"},max=${el.getAttribute("aria-valuemax") ?? el.max ?? "-"},orient=${el.getAttribute("aria-orientation") ?? "-"},label=${el.getAttribute("aria-label")},dis=${el.disabled || el.getAttribute("aria-disabled") === "true" || el.hasAttribute("data-disabled")},frac=${Math.round(frac * 100) / 100}`);
      });
      const range = root.querySelector("[data-slot=slider-range]"); const rg = range.getBoundingClientRect();
      lines.push(`${id}-range:${horiz ? Math.round((rg.left - rr.left) / rr.width * 100) + "→" + Math.round((rg.right - rr.left) / rr.width * 100) : Math.round((rr.bottom - rg.bottom) / rr.height * 100) + "→" + Math.round((rr.bottom - rg.top) / rr.height * 100)}`);
      lines.push(`${id}-root:orient=${root.getAttribute("data-orientation")},dis=${root.hasAttribute("data-disabled")}`);
    }
    const ae = document.activeElement; lines.push("FOCUS=" + (ae.closest("[data-t]") ? ae.closest("[data-t]").getAttribute("data-t").replace("tree-", "") : ae.tagName));
    lines.push("LOG=" + document.querySelector('[data-t="tree-log"]').textContent);
    return lines;
  });
  const rootBox = (id) => page.locator(`[data-t="tree-${id}"]`).boundingBox();
  const steps = [
    ["initial", async () => {}],
    ["focus one + ArrowRight", async () => { await focusEl("one"); await press("ArrowRight"); }],
    ["ArrowLeft x2", async () => { await press("ArrowLeft"); await press("ArrowLeft"); }],
    ["PageUp", () => press("PageUp")], ["PageDown", () => press("PageDown")],
    ["Shift+ArrowRight", () => press("Shift+ArrowRight")],
    ["Home", () => press("Home")], ["End", () => press("End")],
    ["click track at 25%", async () => { const b = await rootBox("one"); await page.mouse.click(b.x + b.width * 0.25, b.y + b.height / 2); }],
    ["drag thumb to 70%", async () => { const b = await rootBox("one"); const t = await th("one").boundingBox(); await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width * 0.7, b.y + b.height / 2, { steps: 6 }); await page.mouse.up(); }],
    ["range: focus first + ArrowRight", async () => { await focusEl("range", 0); await press("ArrowRight"); }],
    ["range: first thumb to near second (min steps)", async () => { for (let i = 0; i < 12; i++) await press("ArrowRight"); }],
    ["range: second thumb ArrowLeft", async () => { await focusEl("range", 1); for (let i = 0; i < 5; i++) await press("ArrowLeft"); }],
    ["range: click near the right end", async () => { const b = await rootBox("range"); await page.mouse.click(b.x + b.width * 0.95, b.y + b.height / 2); }],
    ["range: drag first thumb past second", async () => { const b = await rootBox("range"); const t = await th("range", 0).boundingBox(); await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width * 0.99, b.y + b.height / 2, { steps: 8 }); await page.mouse.up(); }],
    ["vertical: ArrowUp", async () => { await focusEl("vert"); await press("ArrowUp"); await press("ArrowUp"); }],
    ["vertical: click at 20% from bottom", async () => { const b = await rootBox("vert"); await page.mouse.click(b.x + b.width / 2, b.y + b.height * 0.8); }],
    ["disabled: ArrowRight ignored", async () => { await page.locator('[data-t="tree-dis-thumb0"]').evaluate((el) => (el.querySelector("input") || el).focus()); await press("ArrowRight"); }],
    ["step: ArrowRight (step 2)", async () => { await focusEl("step"); await press("ArrowRight"); await press("ArrowRight"); }],
    ["step: PageUp", () => press("PageUp")],
    ["controlled: ArrowRight follows parent", async () => { await focusEl("ctl"); await press("ArrowRight"); await press("ArrowRight"); }],
  ];
  const results = {};
  for (const tree of ["native", "radix"]) {
    await page.goto(base + "?tree=" + tree);
    await page.waitForSelector('[data-t="tree-one"]');
    results[tree] = [];
    curTree = tree; for (const [nm, fn] of steps) { cur = nm; await fn(); await page.waitForTimeout(120); results[tree].push(await snap()); }
  }
  const stateOnly = (lines) => lines.filter((l) => /^(one|range|vert|dis|step|ctl)-t\d/.test(l) || /^FOCUS/.test(l)).map((l) => l.replace(/,frac=[\d.]+/, ""));
  const diffs = [];
  const order = ["initial","focus one + ArrowRight","ArrowLeft x2","PageUp","PageDown","Shift+ArrowRight","Home","End","vertical: ArrowUp","disabled: ArrowRight ignored","step: ArrowRight (step 2)","step: PageUp","controlled: ArrowRight follows parent","range: focus first + ArrowRight","range: first thumb to near second (min steps)","range: second thumb ArrowLeft"];
  steps.forEach(([name], i) => {
    if (!order.includes(name)) return;
    const a = stateOnly(results.native[i]), b = stateOnly(results.radix[i]);
    // pointer steps earlier shift only the 'one' slider; compare the other sliders and focus
    const keep = (l) => /^(dis|step|ctl)-t/.test(l);
    const lines = a.map((x, k) => x === b[k] ? null : x + "   ||   " + b[k]).filter(Boolean).filter(keep);
    if (lines.length) diffs.push({ step: name, lines: lines.slice(0, 4) });
  });
  return { steps: steps.length, diffCount: diffs.length, errors: errors.slice(0, 4), diffs };
}
