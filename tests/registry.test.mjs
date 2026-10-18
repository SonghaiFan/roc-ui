import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
const registry = JSON.parse(await readFile("registry.json", "utf8"));
for (const entry of registry.items)
  test(`${entry.name}: published payload has complete local imports and matches source`, async () => {
    const item = JSON.parse(
      await readFile(`public/r/${entry.name}.json`, "utf8"),
    );
    const targets = new Set(
      item.files.map((file) => path.basename(file.target)),
    );
    for (const file of item.files) {
      assert.equal(file.content, await readFile(file.path, "utf8"));
      for (const match of file.content.matchAll(
        /(?:from\s*|import\s*|@import\s*)["']\.\/([^"']+)["']/g,
      )) {
        const target = match[1];
        assert.ok(
          targets.has(target) ||
            targets.has(target + ".ts") ||
            targets.has(target + ".tsx"),
          `Missing dependency: ${target}`,
        );
      }
    }
  });

for (const entry of registry.items)
  test(`${entry.name}: registry is independent of the gallery and legacy runtime`, async () => {
    const item = JSON.parse(
      await readFile(`public/r/${entry.name}.json`, "utf8"),
    );
    assert.ok(item.files.some((f) => f.path.endsWith(`/${entry.name}.css`)));
    for (const file of item.files) {
      assert.ok(
        !/native-.*\.(?:js|d\.ts)$|\/roc\.css$/.test(file.path),
        file.path,
      );
      assert.ok(
        !/from ["'](?:.*src\/|.*Examples|.*settings)|document\.createElement|appendChild|sample-tone|sample-landscape/.test(
          file.content,
        ),
        file.path,
      );
    }
  });

for (const entry of registry.items)
  test(`${entry.name}: external imports and derived-source licenses ship with the item`, async () => {
    const item = JSON.parse(
      await readFile(`public/r/${entry.name}.json`, "utf8"),
    );
    const declared = new Set(item.dependencies);
    for (const file of item.files) {
      for (const match of file.content.matchAll(
        /from\s*["']([^./][^"']+)["']/g,
      )) {
        const spec = match[1],
          dependency = spec.startsWith("@")
            ? spec.split("/").slice(0, 2).join("/")
            : spec.split("/")[0];
        assert.ok(
          declared.has(dependency),
          `Undeclared package: ${dependency}`,
        );
      }
      if (file.content.includes("Adapted from shadcn/ui"))
        assert.ok(
          item.files.some((f) => f.path.endsWith("SHADCN-LICENSE.txt")),
        );
    }
  });
