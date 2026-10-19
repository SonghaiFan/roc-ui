// Extracted from Franklin Board React worktree efca662 (MIT).
import { freezeDocument, validateDocument } from "./franklin-react-core-document";
import type { BoardDocument, JsonValue } from "./franklin-react-core-types";
export interface ItemDataSchema { validateData?: (data: JsonValue) => boolean }
export type ItemDataSchemas = Readonly<Record<string, ItemDataSchema>>;
export interface BoardStoreOptions {
  historyLimit?: number;
  /** The same registry may include React components; core only reads validators. */
  itemTypes?: ItemDataSchemas;
  /** Unregistered JSON is preserved by default for forward-compatible documents. */
  unknownTypes?: "preserve" | "reject";
}
export class BoardValidationError extends Error {
  readonly name = "BoardValidationError";
  constructor(readonly itemId: string, readonly itemType: string, readonly reason: "unknown-type" | "invalid-data") {
    super(`${reason === "unknown-type" ? "Unknown item type" : "Invalid item data"}: ${itemType} (${itemId})`);
  }
}
/** Capture a stable schema without retaining mutable registry entries. */
export function createDocumentValidator(options: BoardStoreOptions) {
  const schemas = new Map(Object.entries(options.itemTypes ?? {}).map(([type, schema]) => {
    if (schema.validateData !== undefined && typeof schema.validateData !== "function") throw new Error(`Invalid data validator: ${type}`);
    return [type, schema.validateData] as const;
  }));
  const unknown = options.unknownTypes ?? "preserve";
  if (unknown !== "preserve" && unknown !== "reject") throw new Error("Invalid unknown-type policy");
  return (value: unknown): BoardDocument => {
    // Validators see detached frozen JSON, and cannot transform the stored data.
    const document = freezeDocument(validateDocument(value));
    for (const item of document.items) {
      if (!schemas.has(item.type)) {
        if (unknown === "reject" && item.kind !== "folder") throw new BoardValidationError(item.id, item.type, "unknown-type");
        continue;
      }
      const validate = schemas.get(item.type); if (!validate) continue;
      let valid = false;
      try { valid = validate(item.data) === true; } catch { /* Report identity, never user data. */ }
      if (!valid) throw new BoardValidationError(item.id, item.type, "invalid-data");
    }
    return document;
  };
}
