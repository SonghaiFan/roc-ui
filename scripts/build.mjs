import { build } from "esbuild";
import { mkdir, readFile, writeFile, cp, rm } from "node:fs/promises";
const foundationNames =
  "button badge card input textarea checkbox switch slider separator tabs accordion dialog popover dropdown-menu tooltip alert avatar progress skeleton toggle toggle-group radio-group scroll-area breadcrumb pagination alert-dialog aspect-ratio attachment bubble button-group calendar carousel chart code-block collapsible combobox command context-menu data-table date-picker direction drawer empty field hover-card input-group input-otp item kbd label marker menubar message message-scroller native-select navigation-menu questionnaire resizable select sheet sidebar spinner table toast trace typography".split(
    " ",
  );
const motionItems = JSON.parse(await readFile("catalog/motion.json", "utf8"));
const names = [
  ...motionItems.map(item => item.id),
  "preview-link-card",
  ...foundationNames,
  "expandable-card",
  "folder-fan",
  "source-stack",
  "focus-lanes",
  "continuous-tabs",
  "image-viewport",
  "voice-player",
  "selection-toolbar",
  "page-book",
  "source-tray",
  "edge-panel",
  "board-document", "board-note", "board-folder", "board-image-stack",
];
const packageInfo = JSON.parse(await readFile("package.json", "utf8"));
const root = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "roc",
  homepage: "https://github.com/SonghaiFan/roc-ui",
  items: [],
};
await rm("public/r", { recursive: true, force: true });
await rm("public/source", { recursive: true, force: true });
await mkdir("public/r", { recursive: true });
await mkdir("public/source", { recursive: true });
for (const name of names) {
  const files = [],
    seen = new Set(),
    dependencies = new Set(["react"]);
  async function collect(file) {
    if (seen.has(file)) return;
    seen.add(file);
    files.push(file);
    const content = await readFile(`registry/roc/${file}`, "utf8");
    if(file.endsWith(".css") && content.includes("tailwindcss v")) await collect("TAILWIND-LICENSE.txt");
    for (const match of content.matchAll(/from\s*["']([^./][^"']+)["']/g)) {
      const spec = match[1];
      dependencies.add(
        spec.startsWith("@")
          ? spec.split("/").slice(0, 2).join("/")
          : spec.split("/")[0],
      );
    }
    if (file.endsWith(".js")) {
      try {
        await readFile(`registry/roc/${file.replace(/\.js$/, ".d.ts")}`);
        await collect(file.replace(/\.js$/, ".d.ts"));
      } catch {}
    }
    for (const match of content.matchAll(
      /(?:from\s*|import\s*|@import\s*)["']\.\/([^"']+)["']/g,
    )) {
      let target = match[1];
      if (!/\.(?:css|js|ts|tsx)$/.test(target)) {
        for (const ext of [".ts", ".tsx", ".js"]) {
          try {
            await readFile(`registry/roc/${target + ext}`);
            target += ext;
            break;
          } catch {}
        }
      }
      await collect(target);
    }
  }
  await collect(`${name}.tsx`);
  await collect("SOURCE-LICENSE.txt");
  if (name.startsWith("board-") || name === "folder-fan") await collect("FRANKLIN-LICENSE.txt");
  if (foundationNames.includes(name)) await collect("SHADCN-LICENSE.txt");
  // Anything that bundles shadcn-derived source ships the shadcn licence, however it was reached.
  for (const file of [...files])
    if ((await readFile(`registry/roc/${file}`, "utf8")).includes("Adapted from shadcn/ui"))
      await collect("SHADCN-LICENSE.txt");
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:component",
    title: name
      .split("-")
      .map((x) => x[0].toUpperCase() + x.slice(1))
      .join(" "),
    description: "ROC: retained identity and coherent layout changes.",
    dependencies: [...dependencies].map((dep) =>
      packageInfo.dependencies[dep]
        ? `${dep}@${packageInfo.dependencies[dep]}`
        : dep,
    ),
    files: [],
  };
  for (const file of files) {
    const path = `registry/roc/${file}`;
    const content = await readFile(path, "utf8");
    item.files.push({
      path,
      type: "registry:file",
      target: `~/components/roc/${file}`,
      content,
    });
    await writeFile(`public/source/${file}`, content);
  }
  await writeFile(
    `public/r/${name}.json`,
    JSON.stringify(item, null, 2) + "\n",
  );
  root.items.push({
    ...item,
    files: item.files.map(({ content, ...file }) => file),
  });
}
await writeFile("registry.json", JSON.stringify(root, null, 2) + "\n");
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  minify: true,
  legalComments: "linked",
  format: "esm",
  outdir: "dist/assets",
  target: "es2022",
  supported: { "template-literal": false },
  define: { "process.env.NODE_ENV": '"production"' },
});
// Keep bundled dependency notices alongside the script, without whitespace-only lines.
const notices = "dist/assets/main.js.LEGAL.txt";
await writeFile(
  notices,
  (await readFile(notices, "utf8")).replace(/[ \t]+$/gm, ""),
);
await writeFile(
  "dist/index.html",
  `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="ROC — a design space for reusable interfaces that preserve object identity. Interactive React components, source code, and continuity contracts."><meta name="theme-color" content="#fafbf8"><title>ROC — Objects, in continuity</title><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./assets/main.css"></head><body><div id="root"></div><script type="module" src="./assets/main.js"></script></body></html>`,
);
console.log(`Built gallery + ${names.length} registry items.`);

await rm("docs", { recursive: true, force: true });
await cp("dist", "docs", { recursive: true });
await writeFile("docs/.nojekyll", "");
