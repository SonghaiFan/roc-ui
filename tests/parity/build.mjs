// Bundle the parity harness: node tests/parity/build.mjs, then serve tests/parity/dist.
import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("tests/parity/dist", { recursive: true });
await build({
  entryPoints: ["tests/parity/harness.tsx"],
  bundle: true,
  outfile: "tests/parity/dist/out.js",
  loader: { ".css": "empty" },
  define: { "process.env.NODE_ENV": '"development"' },
  jsx: "automatic",
  logLevel: "error",
});
await writeFile(
  "tests/parity/dist/index.html",
  '<!doctype html><div id="root"></div><script src="out.js"></script>',
);
console.log("Built tests/parity/dist");
