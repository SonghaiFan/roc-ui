async (page) => {
  const errors = []; let cur = "-"; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push("[" + cur + "] " + m.text().replace(/\s+/g, " ").slice(0, 200)); });
  await page.setViewportSize({ width: 800, height: 900 });
  const base = "http://127.0.0.1:4191/scroll-area.html";
  const q = (s) => page.locator(`[data-t="tree-${s}"]`);
  const snap = () => page.evaluate(() => {
    const lines = [];
    for (const id of ["both", "vert", "short"]) {
      const vp = document.querySelector(`[data-t="tree-${id}-vp"]`), root = document.querySelector(`[data-t="tree-${id}"]`);
      lines.push(`${id}-scroll:top=${Math.round(vp.scrollTop)},left=${Math.round(vp.scrollLeft)}`);
      for (const o of ["vertical", "horizontal"]) {
        const bar = document.querySelector(`[data-t="tree-${id}-bar-${o}"]`), th = document.querySelector(`[data-t="tree-${id}-thumb-${o}"]`);
        if (!bar) { lines.push(`${id}-${o}:no-bar`); continue; }
        const b = bar.getBoundingClientRect(), t = th ? th.getBoundingClientRect() : null;
        const v = o === "vertical";
        lines.push(`${id}-${o}:bar=${Math.round(v ? b.height : b.width)}x${Math.round(v ? b.width : b.height)},thumbLen=${t ? Math.round((v ? t.height : t.width) / (v ? b.height : b.width) * 20) / 20 : "none"},thumbPos=${t ? Math.round((v ? (t.top - b.top) / b.height : (t.left - b.left) / b.width) * 20) / 20 : "none"},orient=${bar.getAttribute("data-orientation")}`);
      }
      const cs = getComputedStyle(vp); lines.push(`${id}-vp:overflow=${cs.overflowX}/${cs.overflowY},role=${vp.getAttribute("role")},tab=${vp.getAttribute("tabindex")}`);
    }
    return lines;
  });
  const steps = [
    ["initial", async () => {}],
    ["scrollTop = 150 (programmatic)", () => q("both-vp").evaluate((el) => { el.scrollTop = 150; })],
    ["scrollLeft = 200", () => q("both-vp").evaluate((el) => { el.scrollLeft = 200; })],
    ["wheel down", async () => { const b = await q("both").boundingBox(); await page.mouse.move(b.x + 50, b.y + 50); await page.mouse.wheel(0, 120); }],
    ["keyboard PageDown", async () => { await q("both-vp").focus(); await page.keyboard.press("PageDown"); }],
    ["keyboard End", () => page.keyboard.press("End")],
    ["keyboard Home", () => page.keyboard.press("Home")],
    ["drag vertical thumb down 40px", async () => { const t = await q("both-thumb-vertical").boundingBox(); await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2); await page.mouse.down(); await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2 + 40, { steps: 8 }); await page.mouse.up(); }],
    ["drag horizontal thumb right 50px", async () => { const t = await q("both-thumb-horizontal").boundingBox(); await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2); await page.mouse.down(); await page.mouse.move(t.x + t.width / 2 + 50, t.y + t.height / 2, { steps: 8 }); await page.mouse.up(); }],
    ["click vertical track below thumb", async () => { const b = await q("both-bar-vertical").boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height - 12); }],
    ["scroll vert-only area", () => q("vert-vp").evaluate((el) => { el.scrollTop = 300; })],
    ["short area has no overflow", () => q("short-vp").evaluate((el) => { el.scrollTop = 50; })],
  ];
  const results = {};
  for (const tree of ["native", "radix"]) {
    await page.goto(base + "?tree=" + tree);
    await page.waitForSelector('[data-t="tree-both"]');
    await page.waitForTimeout(300);
    results[tree] = [];
    for (const [nm, fn] of steps) { cur = tree + "/" + nm; await fn(); await page.waitForTimeout(250); results[tree].push(await snap()); }
  }
  const diffs = [];
  steps.forEach(([name], i) => {
    const a = results.native[i], b = results.radix[i];
    const lines = a.map((x, k) => x === b[k] ? null : x + "   ||   " + b[k]).filter(Boolean);
    if (lines.length) diffs.push({ step: name, lines: lines.slice(0, 5) });
  });
  return { steps: steps.length, diffCount: diffs.length, diffs, errors: errors.slice(0, 4) };
}
