import { build } from "esbuild";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import assert from "node:assert/strict";
import path from "node:path";
await rm(".checks", { recursive: true, force: true });
await mkdir(".checks/components/roc", { recursive: true });
const registry = JSON.parse(await readFile("registry.json", "utf8"));
for (const entry of registry.items) {
  const payload = JSON.parse(
    await readFile(`public/r/${entry.name}.json`, "utf8"),
  );
  for (const file of payload.files)
    await writeFile(
      `.checks/components/roc/${path.basename(file.path)}`,
      file.content,
    );
}
await writeFile(
  ".checks/consumer.tsx",
  await readFile("tests/fixtures/consumer.tsx"),
);
await writeFile(
  ".checks/foundations.tsx",
  await readFile("tests/fixtures/foundations.tsx"),
);
await writeFile(
  ".checks/more-foundations.tsx",
  await readFile("tests/fixtures/more-foundations.tsx"),
);
await build({
  entryPoints: [".checks/consumer.tsx"],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  outfile: ".checks/consumer.mjs",
  jsx: "automatic",
});
const { Consumer } = await import("../.checks/consumer.mjs");
const markup = renderToString(createElement(Consumer));
assert.equal((markup.match(/<section>/g) || []).length, registry.items.length);
await mkdir("dist/consumer-check", { recursive: true });
await build({
  entryPoints: [".checks/consumer.tsx"],
  bundle: true,
  format: "esm",
  outdir: "dist/consumer-check",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"development"' },
});
await writeFile(
  "dist/consumer-check/index.html",
  '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="./consumer.css"><title>ROC isolated consumer</title></head><body><div id="root"></div><script type="module" src="./consumer.js"></script></body></html>',
);
console.log(
  "Thirty-five downloaded registry components compile and server-render without gallery files. Browser fixture: /consumer-check/index.html",
);
