import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const names =
  "button badge card input textarea checkbox switch slider separator tabs accordion dialog popover dropdown-menu tooltip".split(
    " ",
  );
const root = "upstream/shadcn";
await mkdir(root, { recursive: true });
async function get(url) {
  const response = await fetch(url);
  if (!response.ok) throw Error(`${response.status}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}
const items = [];
for (const name of names) {
  const url = `https://ui.shadcn.com/r/styles/new-york-v4/${name}.json`,
    raw = await get(url),
    item = JSON.parse(raw);
  await writeFile(`${root}/${name}.json`, raw);
  for (const file of item.files)
    await writeFile(`${root}/${path.basename(file.path)}`, file.content);
  items.push({
    name,
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
  `Downloaded ${items.length} reference snapshots. ROC source was not modified.`,
);
