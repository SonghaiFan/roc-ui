async (page) => {
  
  await page.goto("http://127.0.0.1:4191/");
  await page.waitForSelector("#native [role=tablist]");
  const errors = []; page.on("pageerror", (e) => errors.push(e.message));
  const snap = (id) => page.evaluate((id) => {
    const root = document.getElementById(id);
    const lines = [];
    root.querySelectorAll("button, [role=tabpanel], [role=region], [role=radiogroup], [role=group], [role=tablist]").forEach((el) => {
      if (el.matches("[role=tabpanel],[role=region]")) { if (!el.hidden) lines.push(el.getAttribute("role") + ":" + el.getAttribute("data-state") + ":" + el.textContent); return; }
      if (el.matches("[role=tablist],[role=radiogroup],[role=group]")) { lines.push(el.getAttribute("role") + ":" + (el.getAttribute("aria-orientation") || "-") + ":" + (el.getAttribute("aria-required") || "-")); return; }
      const g = (k) => el.getAttribute(k) ?? "-";
      lines.push(["btn", el.textContent, el.getAttribute("role") || "-", g("aria-selected"), g("aria-checked"), g("aria-pressed"), g("aria-expanded"), g("aria-disabled"), g("data-state"), el.disabled ? "disabled" : "enabled"].join("|"));
    });
    root.querySelectorAll("input").forEach((el) => lines.push("input:" + el.type + ":" + (el.name || "") + ":" + el.checked));
    const ae = document.activeElement;
    lines.push("FOCUS=" + (root.contains(ae) ? ae.tagName + ":" + ae.textContent + ":" + (ae.getAttribute("role") || "") : "outside"));
    lines.push("LOG=" + root.querySelector("[data-t=log]").textContent);
    return lines;
  }, id);
  const walk = async (id) => {
    await page.locator("#" + id + " [data-t=out0]").focus();
    const stops = [];
    for (let i = 0; i < 16; i++) { await press("Tab"); stops.push(await page.evaluate((id) => { const ae = document.activeElement; return document.getElementById(id).contains(ae) ? (ae.getAttribute("role") || ae.tagName) + ":" + ae.textContent : "outside"; }, id)); }
    return stops;
  };
  const keep = async (id) => page.evaluate((id) => { const root = document.getElementById(id); root.querySelectorAll("[data-probe-focus]").forEach((e) => e.removeAttribute("data-probe-focus")); if (root.contains(document.activeElement)) document.activeElement.setAttribute("data-probe-focus", ""); }, id);
  const restore = async (id) => page.evaluate((id) => { const el = document.querySelector("#" + id + " [data-probe-focus]"); if (el) el.focus(); else if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); }, id);
  // A held key, like a person's: Radix defers focus moves and reads key-up state.
  const press = async (k) => { await page.keyboard.down(k); await page.waitForTimeout(30); await page.keyboard.up(k); await page.waitForTimeout(40); };
  const L = (root, sel) => page.locator("#" + root + " " + sel);
  const tab = (r, name) => page.locator("#" + r).getByRole("tab", { name, exact: true });
  const acc = (r, name) => page.locator("#" + r).getByRole("button", { name, exact: true });
  const radio = (r, group, i) => page.locator("#" + r + " [data-t=" + group + "] [role=radio]").nth(i);
  const tog = (r, group, i) => page.locator("#" + r + " [data-t=" + group + "] button").nth(i);
  const steps = [
    ["tab C click", (r) => tab(r, "C").click()],
    ["ArrowLeft from C", (r) => press("ArrowLeft")],
    ["End", (r) => press("End")],
    ["Home", (r) => press("Home")],
    ["ArrowRight x2 (loop)", async (r) => { await press("ArrowRight"); await press("ArrowRight"); }],
    ["click disabled B", (r) => tab(r, "B").click({ force: true })],
    ["manual X focus", (r) => tab(r, "X").focus()],
    ["manual ArrowDown", (r) => press("ArrowDown")],
    ["manual ArrowRight ignored", (r) => press("ArrowRight")],
    ["manual Enter selects", (r) => press("Enter")],
    ["manual click X", (r) => tab(r, "X").click()],
    ["acc click two", (r) => acc(r, "two").click()],
    ["acc click two again closes", (r) => acc(r, "two").click()],
    ["acc focus one + ArrowDown", async (r) => { await acc(r, "one").focus(); await press("ArrowDown"); }],
    ["acc ArrowDown skips disabled, loops", async (r) => { await press("ArrowDown"); }],
    ["acc End", (r) => press("End")],
    ["acc Home", (r) => press("Home")],
    ["acc locked click p", (r) => acc(r, "p").click({ force: true })],
    ["acc locked click q", (r) => acc(r, "q").click()],
    ["acc multi click m", (r) => acc(r, "m").click()],
    ["acc multi click n", (r) => acc(r, "n").click()],
    ["acc multi click m closes", (r) => acc(r, "m").click()],
    ["radio focus m", (r) => radio(r, "radio", 1).focus()],
    ["radio ArrowDown -> l checked", (r) => press("ArrowDown")],
    ["radio ArrowDown loops past disabled", (r) => press("ArrowDown")],
    ["radio ArrowUp", (r) => press("ArrowUp")],
    ["radio Enter noop", (r) => press("Enter")],
    ["radio click l", (r) => radio(r, "radio", 2).click()],
    ["radio submit", (r) => L(r, "[data-t=submit]").click()],
    ["radio-none ArrowRight from focus u", async (r) => { await radio(r, "radio-none", 0).focus(); await press("ArrowRight"); }],
    ["radio-none ArrowUp ignored (horizontal)", (r) => press("ArrowUp")],
    ["radio submit 2", (r) => L(r, "[data-t=submit]").click()],
    ["radio reset", async (r) => { await L(r, "[data-t=reset]").click(); await page.waitForTimeout(60); }],
    ["tg single click c", (r) => tog(r, "tg-single", 1).click()],
    ["tg single click c again", (r) => tog(r, "tg-single", 1).click()],
    ["tg single arrows", async (r) => { await tog(r, "tg-single", 0).focus(); await press("ArrowRight"); await press("ArrowRight"); await press("ArrowRight"); }],
    ["tg multi click b", (r) => tog(r, "tg-multi", 0).click()],
    ["tg multi click u", (r) => tog(r, "tg-multi", 2).click()],
    ["tg multi arrow skips disabled", async (r) => { await tog(r, "tg-multi", 0).focus(); await press("ArrowRight"); }],
    ["tg multi click b off", (r) => tog(r, "tg-multi", 0).click()],
  ];
  const diffs = []; let count = 0;
  const walkCompare = async (label) => { await keep("native"); await keep("radix"); const a = await walk("native"); const b = await walk("radix"); count++; if (JSON.stringify(a) !== JSON.stringify(b)) diffs.push({ step: "TAB WALK " + label, native: a, radix: b }); };
  await walkCompare("initial");
  const first = await Promise.all([snap("native"), snap("radix")]);
  if (JSON.stringify(first[0]) !== JSON.stringify(first[1])) diffs.push({ step: "INITIAL", native: first[0].filter((x, i) => x !== first[1][i]).slice(0, 6), radix: first[1].filter((x, i) => x !== first[0][i]).slice(0, 6) });
  for (const [name, fn] of steps) {
    await restore("native"); await fn("native"); await page.waitForTimeout(30);
    const a = await snap("native"); await keep("native");
    await restore("radix"); await fn("radix"); await page.waitForTimeout(30);
    const b = await snap("radix"); await keep("radix");
    count++;
    if (name === "radio click l" || name === "acc multi click n") await walkCompare("after " + name);
    const ja = JSON.stringify(a), jb = JSON.stringify(b);
    if (ja !== jb) {
      const na = a.filter((x, i) => x !== b[i]), nb = b.filter((x, i) => x !== a[i]);
      diffs.push({ step: name, lines: a.map((x, i) => x === b[i] ? null : x + "  ||  " + b[i]).filter(Boolean).slice(0, 6) });
    }
  }
  return { steps: count, diffCount: diffs.length, diffs: diffs.slice(0, 14), errors: errors.slice(0, 3) };
}
