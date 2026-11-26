import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const skillName = "responsive-object-continuity";
export const skillRoot = fileURLToPath(new URL(`../skills/${skillName}/`, import.meta.url));

export async function validateSkill(directory = skillRoot) {
  const root = resolve(directory);
  const files = [];
  async function walk(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = resolve(folder, entry.name);
      if (entry.name.startsWith(".") || entry.isSymbolicLink())
        throw new Error(`Unexpected hidden entry or symlink: ${relative(root, path)}`);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile()) files.push(relative(root, path).split(sep).join("/"));
    }
  }
  await walk(root);
  files.sort();
  const source = await readFile(resolve(root, "SKILL.md"), "utf8");
  const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(source)?.[1];
  if (!frontmatter || !frontmatter.includes(`name: ${skillName}`))
    throw new Error("Skill frontmatter must declare its installable name.");
  if (!/^description:\s*\S/m.test(frontmatter)) throw new Error("Missing skill description.");
  if (!files.includes("LICENSE")) throw new Error("The standalone skill must include its license.");
  const cases = files.filter(name => /^cases\/\d{3}-.+\.md$/.test(name));
  const ids = cases.map(name => name.slice(6, 9));
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate case numbers.");
  const index = source.split("## Case index")[1]?.split("### Positive reference:")[0] ?? "";
  for (const name of cases) {
    if (!index.includes(`](${name})`)) throw new Error(`Case missing from index: ${name}`);
    const heading = (await readFile(resolve(root, name), "utf8")).split("\n")[0];
    if (!heading.startsWith(`# ${name.slice(6, 9)} `)) throw new Error(`Case heading differs from filename: ${name}`);
  }
  for (const name of files.filter(name => name.endsWith(".md"))) {
    const content = await readFile(resolve(root, name), "utf8");
    if (/\/Users\/[^/]+\//.test(content)) throw new Error(`Machine-specific user path: ${name}`);
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const href = match[1].split("#")[0];
      if (!href || /^[a-z][a-z\d+.-]*:/i.test(href)) continue;
      const target = resolve(dirname(resolve(root, name)), decodeURIComponent(href));
      if (!target.startsWith(root + sep) || !(await stat(target).catch(() => null)))
        throw new Error(`Missing or external local reference in ${name}: ${href}`);
    }
  }
  return { root, files, cases: cases.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await validateSkill(process.argv[2]);
  console.log(`Validated ROC skill: ${result.cases} unique cases, ${result.files.length} files, all local links resolve.`);
}
