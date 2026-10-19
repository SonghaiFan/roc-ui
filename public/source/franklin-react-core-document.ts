// Extracted from Franklin Board React worktree efca662 (MIT).
import type { BoardDocument, JsonValue } from "./franklin-react-core-types";

function isJson(value: unknown, seen = new Set<object>()): value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || seen.has(value)) return false;
  if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) return false;
  seen.add(value);
  const valid = Object.values(value).every(child => isJson(child, seen));
  seen.delete(value);
  return valid;
}
export function validateDocument(value: unknown): BoardDocument {
  if (!value || typeof value !== "object") throw new Error("Invalid board document");
  const doc = value as BoardDocument;
  if (doc.version !== 1 || !Array.isArray(doc.items)) throw new Error("Unsupported board document version");
  const ids = new Set<string>();
  for (const item of doc.items) {
    if (!item || typeof item.id !== "string" || !item.id || ids.has(item.id) ||
      typeof item.type !== "string" || !item.type ||
      ![item.x, item.y, item.width, item.height].every(Number.isFinite) ||
      item.width <= 0 || item.height <= 0 || !isJson(item.data)) {
      throw new Error("Invalid or duplicate board item");
    }
    if (item.radiusKind !== undefined && item.radiusKind !== 0 && item.radiusKind !== 1) throw new Error("Invalid corner style");
    ids.add(item.id);
  }
  const byId = new Map(doc.items.map(item => [item.id, item]));
  const stackFolders = new Map<string, string | undefined>();
  const stackCounts = new Map<string, number>();
  for (const item of doc.items) {
    if (item.kind !== undefined && item.kind !== "folder") throw new Error("Unknown container kind");
    if (item.folderLayout !== undefined && (item.kind !== "folder" || !["fan", "free"].includes(item.folderLayout))) throw new Error("Invalid folder layout");
    if (item.folderId !== undefined && (typeof item.folderId !== "string" || !item.folderId || byId.get(item.folderId)?.kind !== "folder" || item.kind === "folder")) throw new Error("Invalid folder membership; nested folders are not supported");
    if (item.stackId !== undefined) {
      if (typeof item.stackId !== "string" || !item.stackId || item.kind === "folder") throw new Error("Invalid stack membership");
      if (stackFolders.has(item.stackId) && stackFolders.get(item.stackId) !== item.folderId) throw new Error("Stack members must share a folder");
      stackFolders.set(item.stackId, item.folderId);
      stackCounts.set(item.stackId, (stackCounts.get(item.stackId) ?? 0) + 1);
    }
  }
  if ([...stackCounts.values()].some(count => count < 2)) throw new Error("A stack needs at least two members");
  return structuredClone({ version: 1, items: doc.items });
}
export function freezeDocument(doc: BoardDocument): BoardDocument {
  const freeze = (value: unknown): void => {
    if (value && typeof value === "object") {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
  };
  freeze(doc);
  return doc;
}
