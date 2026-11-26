import { lstat, mkdir, realpath, symlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { validateSkill, skillName, skillRoot } from "./check-skill.mjs";

if (process.argv.includes("--help")) {
  console.log("npm run skill:link -- [destination]\nDefaults to ~/.agents/skills/responsive-object-continuity. Existing unrelated destinations are left untouched.");
  process.exit(0);
}
if (process.argv.length > 3) throw new Error("Pass at most one destination path.");
await validateSkill();
const target = resolve(process.argv[2] ?? resolve(homedir(), ".agents/skills", skillName));
const existing = await lstat(target).catch(() => null);
if (existing) {
  if (await realpath(target).catch(() => null) === await realpath(skillRoot)) {
    console.log(`ROC skill already linked: ${target}`);
    process.exit(0);
  }
  throw new Error(`Destination already exists: ${target}. Move it aside or choose a different destination.`);
}
await mkdir(dirname(target), { recursive: true });
await symlink(skillRoot, target, process.platform === "win32" ? "junction" : "dir");
console.log(`Linked ${target} → ${skillRoot}`);
