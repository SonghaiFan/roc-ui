import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const defaults =
  "button badge card input textarea checkbox switch slider separator tabs accordion dialog popover dropdown-menu tooltip alert avatar progress skeleton toggle toggle-group radio-group scroll-area breadcrumb pagination".split(
    " ",
  );
const names = process.argv.slice(2).length ? process.argv.slice(2) : defaults;
const root = "upstream/shadcn";
await mkdir(root, { recursive: true });
async function get(url) {
  const response = await fetch(url);
  if (!response.ok) throw Error(`${response.status}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}
let previous;
try {
  previous = JSON.parse(await readFile(`${root}/manifest.json`, "utf8"));
} catch {}
const items = (previous?.items ?? [])
  .filter((item) => !names.includes(item.name))
  .map((item) => ({
    ...item,
    retrievedAt: item.retrievedAt ?? previous.retrievedAt,
  }));
for (const name of names) {
  const url = `https://ui.shadcn.com/r/styles/new-york-v4/${name}.json`,
    raw = await get(url),
    item = JSON.parse(raw);
  await writeFile(`${root}/${name}.json`, raw);
  for (const file of item.files)
    await writeFile(`${root}/${path.basename(file.path)}`, file.content);
  items.push({
    name,
    retrievedAt: new Date().toISOString(),
    url,
    sha256: createHash("sha256").update(raw).digest("hex"),
    dependencies: item.dependencies ?? [],
  });
}
await writeFile(
  `${root}/LICENSE.md`,
  await get("https://raw.githubusercontent.com/shadcn-ui/ui/main/LICENSE.md"),
);
await writeFile(
  `${root}/manifest.json`,
  JSON.stringify(
    { retrievedAt: new Date().toISOString(), style: "new-york-v4", items },
    null,
    2,
  ) + "\n",
);
console.log(
  `Downloaded ${names.length} snapshots; ${items.length} total references. ROC source was not modified.`,
);
