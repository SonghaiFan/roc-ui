// Bundle the parity harnesses: node tests/parity/build.mjs, then serve tests/parity/dist on :4191.
import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("tests/parity/dist", { recursive: true });
const pages = { harness: "index", popover: "popover", popups: "popups", dialogs: "dialogs", menus: "menus", select: "select", slider: "slider", "scroll-area": "scroll-area" };
for (const [entry, page] of Object.entries(pages)) {
  await build({
    entryPoints: [`tests/parity/${entry}.tsx`],
    bundle: true,
    outfile: `tests/parity/dist/${entry}.js`,
    loader: { ".css": "empty" },
    define: { "process.env.NODE_ENV": '"development"' },
    jsx: "automatic",
    logLevel: "error",
  });
  await writeFile(
    `tests/parity/dist/${page}.html`,
    `<!doctype html><div id="root"></div><script src="${entry}.js"></script>`,
  );
}
console.log("Built tests/parity/dist");
