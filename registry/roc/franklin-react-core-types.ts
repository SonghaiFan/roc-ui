// Extracted from Franklin Board React worktree efca662 (MIT).
export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
export interface Point { x: number; y: number }
export interface BoardItem<D extends JsonValue = JsonValue> extends Point {
  id: string;
  type: string;
  width: number;
  height: number;
  /** 0: sharp, 1: rounded (the legacy corner modes). */
  radiusKind?: 0 | 1;
  data: D;
  /** Folder geometry is world-space; children store folder-relative coordinates. */
  kind?: "folder";
  /** Preserve explicit positions after arranging inside a folder. */
  folderLayout?: "fan" | "free";
  folderId?: string;
  stackId?: string;
}
export interface BoardDocument { version: 1; items: BoardItem[] }
export interface Camera extends Point { zoom: number }
export interface BoardSnapshot {
  document: BoardDocument;
  selectedId: string | null;
  editingId: string | null;
  previewId: string | null;
  selectedIds: readonly string[];
  openFolderId: string | null;
  spaceFolderId: string | null;
  openStackId: string | null;
  canUndo: boolean;
  canRedo: boolean;
}
export interface BoardCommit {
  source: "local" | "undo" | "redo" | "external";
  label: string;
  document: BoardDocument;
}
export interface Guide { axis: "x" | "y"; value: number }
