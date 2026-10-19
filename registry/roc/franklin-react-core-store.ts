// Extracted from Franklin Board React worktree efca662 (MIT).
import { createDocumentValidator, type BoardStoreOptions } from "./franklin-react-core-schema";
import { boundsOf, isFolder, layoutBoard, normalizeStacks, stackScatterLayout, folderFanLayout } from "./franklin-react-core-containers";
import type { BoardCommit, BoardDocument, BoardItem, BoardSnapshot, JsonValue, Point } from "./franklin-react-core-types";

export function createBoardStore(initial: BoardDocument, options: number | BoardStoreOptions = {}) {
  const config = typeof options === "number" ? { historyLimit: options } : options;
  const historyLimit = config.historyLimit ?? 100;
  const prepare = createDocumentValidator(config);
  let updating = false;
  const assertIdle = () => { if (updating) throw new Error("Use only the transaction draft inside an updater or validator"); };
  if (!Number.isInteger(historyLimit) || historyLimit < 1) throw new Error("Invalid history limit");
  let document = prepare(initial);
  let selectedIds: string[] = [], openFolderId: string | null = null, openStackId: string | null = null;
  let spaceFolderId: string | null = null;
  let openFolderHadContents = false;
  let editingId: string | null = null, previewId: string | null = null, editSession = "", historyGroup: string | undefined;
  const past: BoardDocument[] = [], future: BoardDocument[] = [];
  const listeners = new Set<() => void>(), commits = new Set<(event: BoardCommit) => void>();
  let snapshot: BoardSnapshot;
  const refresh = () => {
    selectedIds = selectedIds.filter(id => document.items.some(item => item.id === id));
    if (openFolderId) {
      const exists = document.items.some(item => item.id === openFolderId && isFolder(item));
      const hasContents = document.items.some(item => item.folderId === openFolderId);
      if (!exists || !spaceFolderId && openFolderHadContents && !hasContents) { openFolderId = null; openFolderHadContents = false; }
      else openFolderHadContents ||= hasContents;
    }
    if (spaceFolderId && spaceFolderId !== openFolderId) spaceFolderId = null;
    if (openStackId && !document.items.some(item => item.stackId === openStackId && (item.folderId ?? null) === openFolderId)) openStackId = null;
    if (!document.items.some(item => item.id === editingId)) editingId = null;
    if (!document.items.some(item => item.id === previewId)) previewId = null;
    snapshot = Object.freeze({ document, editingId, previewId, selectedId: selectedIds.at(-1) ?? null, selectedIds: Object.freeze([...selectedIds]), openFolderId, spaceFolderId, openStackId, canUndo: !!past.length, canRedo: !!future.length });
    listeners.forEach(listener => listener());
  };
  const emit = (source: BoardCommit["source"], label: string) => { refresh(); commits.forEach(listener => listener({ source, label, document })); };
  const transact = (label: string, update: (draft: BoardDocument) => unknown, group?: string) => {
    assertIdle();
    if (!label.trim()) throw new Error("A transaction needs a label");
    let valid: BoardDocument;
    updating = true;
    try {
      const next = structuredClone(document), result = update(next);
      if (result && (typeof result === "object" || typeof result === "function") && "then" in result && typeof result.then === "function") {
        void Promise.resolve(result).catch(() => {});
        throw new Error("Transactions must be synchronous; prepare asynchronous work first");
      }
      normalizeStacks(next.items); valid = prepare(next);
    } finally { updating = false; }
    if (JSON.stringify(valid) === JSON.stringify(document)) return;
    if (!group || group !== historyGroup) { past.push(document); if (past.length > historyLimit) past.shift(); }
    historyGroup = group; future.length = 0;
    document = valid; emit("local", label);
  };
  const edit = (label: string, update: (items: BoardItem[]) => void, group?: string) => transact(label, draft => update(draft.items), group);
  const movingItems = (items: BoardItem[], ids: string[]) => {
    const moving = items.filter(item => ids.includes(item.id));
    if (!moving.length || moving.length !== new Set(ids).size) throw new Error("Unknown item");
    return moving;
  };
  const sameFolder = (items: BoardItem[]) => items.every(item => item.folderId === items[0].folderId);
  const operationItems = (ids: readonly string[], descendants = false) => {
    const selected = new Set(ids);
    movingItems(document.items, [...ids]);
    for (const item of document.items) if (selected.has(item.id) && item.stackId && item.stackId !== openStackId)
      for (const member of document.items) if (member.stackId === item.stackId) selected.add(member.id);
    if (descendants) for (const item of document.items) if (item.folderId && selected.has(item.folderId)) selected.add(item.id);
    return document.items.filter(item => selected.has(item.id));
  };
  refresh();
  return {
    getSnapshot: () => snapshot,
    /** Application-owned commands share the validated, atomic undo pipeline. */
    transaction(label: string, update: (draft: BoardDocument) => void) { transact(label, update); },
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    onCommit(listener: (event: BoardCommit) => void) { commits.add(listener); return () => { commits.delete(listener); }; },
    beginEditing(id: string) {
      assertIdle();
      if (!document.items.some(item => item.id === id)) return "";
      if (editingId !== id) { editingId = id; editSession = globalThis.crypto.randomUUID(); refresh(); }
      return editSession;
    },
    endEditing(id?: string) { assertIdle(); if (id && editingId !== id) return; editingId = null; historyGroup = undefined; refresh(); },
    updateData(id: string, patch: Record<string, JsonValue>) {
      edit("Edit card", items => {
        const item = movingItems(items, [id])[0];
        if (!item.data || typeof item.data !== "object" || Array.isArray(item.data)) throw new Error("Editing requires object data");
        item.data = { ...item.data, ...patch };
      }, editingId === id ? editSession : undefined);
    },
    toggleCorners(ids: string[]) { edit("Change corners", items => { for (const item of movingItems(items, ids)) item.radiusKind = item.radiusKind === 0 || item.radiusKind === undefined && item.type === "image" ? 1 : 0; }); },
    insert(items: BoardItem[]) { edit("Import items", current => { current.push(...structuredClone(items)); }); },
    /** Host supplies type/data; point is the world-space centre of the new item. */
    create(template: Omit<BoardItem, "id" | "x" | "y" | "folderId" | "stackId">, point: Point) {
      assertIdle();
      if (template.kind === "folder" && openFolderId) throw new Error("Folders cannot be nested");
      const folder = document.items.find(item => item.id === openFolderId);
      const item: BoardItem = { ...structuredClone(template), id: crypto.randomUUID(),
        x: point.x - template.width / 2 - (folder?.x ?? 0), y: point.y - template.height / 2 - (folder?.y ?? 0),
        ...(folder ? { folderId: folder.id } : {}) };
      edit("Create item", items => { items.push(item); });
      selectedIds = [item.id]; refresh(); return item.id;
    },
    remove(ids: readonly string[] = selectedIds, folderContents: "release" | "delete" = "release") {
      assertIdle(); if (!ids.length) return;
      const removing = new Set(operationItems(ids, folderContents === "delete").map(item => item.id));
      transact("Delete items", draft => {
        for (const folder of draft.items.filter(item => folderContents === "release" && removing.has(item.id) && isFolder(item))) {
          const children = draft.items.filter(item => item.folderId === folder.id), fan = folderFanLayout(folder, children);
          for (const child of children) { const point = fan.get(child.id)!; child.x = point.x; child.y = point.y; delete child.folderId; }
        }
        draft.items = draft.items.filter(item => !removing.has(item.id));
      });
    },
    duplicate(ids: readonly string[] = selectedIds) {
      assertIdle(); if (!ids.length) return [];
      const originals = operationItems(ids, true), included = new Set(originals.map(item => item.id));
      const mapping = new Map(originals.map(item => [item.id, crypto.randomUUID()]));
      const stacks = new Map<string, string>(), poses = layoutBoard(document, openFolderId, openStackId, spaceFolderId);
      const copies = originals.map(original => {
        const copy = structuredClone(original); copy.id = mapping.get(original.id)!;
        if (original.folderId && included.has(original.folderId)) copy.folderId = mapping.get(original.folderId)!;
        else {
          const parent = document.items.find(item => item.id === original.folderId), pose = poses.get(original.id)!;
          copy.x = pose.x - (parent?.x ?? 0) + 26; copy.y = pose.y - (parent?.y ?? 0) + 26;
        }
        if (copy.stackId) { if (!stacks.has(copy.stackId)) stacks.set(copy.stackId, crypto.randomUUID()); copy.stackId = stacks.get(copy.stackId)!; }
        return copy;
      });
      edit("Duplicate items", items => { items.push(...copies); });
      selectedIds = originals.filter(item => !item.folderId || !included.has(item.folderId)).map(item => mapping.get(item.id)!);
      refresh(); return [...selectedIds];
    },
    arrangeGrid(ids: readonly string[] = selectedIds) {
      assertIdle(); if (!ids.length) return;
      const members = operationItems(ids); if (members.length < 2) return;
      if (!sameFolder(members)) throw new Error("Select items in the same folder");
      const poses = layoutBoard(document, openFolderId, openStackId, spaceFolderId);
      const grid = stackScatterLayout(members.map(item => ({ ...item, ...poses.get(item.id)! })));
      edit("Arrange in grid", items => {
        const parent = items.find(item => item.id === members[0].folderId);
        if (parent) parent.folderLayout = "free";
        for (const item of items) if (grid.has(item.id)) {
          const parent = items.find(parent => parent.id === item.folderId), point = grid.get(item.id)!;
          item.x = point.x - (parent?.x ?? 0); item.y = point.y - (parent?.y ?? 0); delete item.stackId;
        }
      });
      selectedIds = members.map(item => item.id); refresh();
    },
    openPreview(id: string) { assertIdle(); if (!document.items.some(item => item.id === id && !isFolder(item))) return; editingId = null; previewId = id; selectedIds = [id]; refresh(); },
    closePreview() { assertIdle(); if (!previewId) return; previewId = null; editingId = null; historyGroup = undefined; refresh(); },
    select(id: string | null, additive = false) {
      assertIdle();
      if (id !== null && !document.items.some(item => item.id === id)) return;
      const next = id === null ? [] : additive ? selectedIds.includes(id) ? selectedIds.filter(value => value !== id) : [...selectedIds, id] : [id];
      if (next.join("\0") === selectedIds.join("\0")) return;
      selectedIds = next; refresh();
    },
    selectMany(ids: readonly string[]) {
      assertIdle();
      const next = [...new Set(ids)].filter(id => document.items.some(item => item.id === id));
      if (next.join("\0") === selectedIds.join("\0")) return;
      selectedIds = next; refresh();
    },
    resizeMany(geometries: Record<string, { x: number; y: number; width: number; height: number }>) {
      edit("Resize items", items => {
        for (const item of movingItems(items, Object.keys(geometries))) {
          const geometry = geometries[item.id];
          if (![geometry.x, geometry.y, geometry.width, geometry.height].every(Number.isFinite) || geometry.width < 90 || geometry.height < 70 || geometry.width > 4000 || geometry.height > 4000 || isFolder(item)) throw new Error("Invalid card size");
          Object.assign(item, geometry);
        }
      });
    },
    enterFolder(id: string) {
      assertIdle();
      if (!document.items.some(item => item.id === id && isFolder(item))) return;
      spaceFolderId = openFolderId = id; openStackId = previewId = editingId = null; selectedIds = []; refresh();
    },
    toggleFolder(id: string) {
      assertIdle();
      const folder = document.items.find(item => item.id === id && isFolder(item));
      if (!folder) return;
      spaceFolderId = null;
      previewId = null; editingId = null; openStackId = null; openFolderId = openFolderId === id ? null : id; openFolderHadContents = document.items.some(item => item.folderId === openFolderId); selectedIds = []; refresh();
    },
    toggleStack(id: string) {
      assertIdle();
      const member = document.items.find(item => item.stackId === id);
      if (!member || (member.folderId ?? null) !== openFolderId) return;
      previewId = null; editingId = null; openStackId = openStackId === id ? null : id; selectedIds = []; refresh();
    },
    back() { assertIdle(); if (editingId) { editingId = null; historyGroup = undefined; refresh(); return; } if (previewId) { previewId = null; refresh(); return; } if (openStackId) openStackId = null; else openFolderId = null; selectedIds = []; refresh(); },
    move(id: string, point: Point) {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new Error("Invalid position");
      const item = document.items.find(item => item.id === id);
      if (!item || (item.x === point.x && item.y === point.y)) return;
      const dx = point.x - item.x, dy = point.y - item.y;
      edit("Move item", items => {
        for (const moving of items) if (moving.id === id || item.stackId && moving.stackId === item.stackId) { moving.x += dx; moving.y += dy; }
      });
    },
    moveMany(positions: Record<string, Point>) {
      edit("Move items", items => { for (const item of items) if (positions[item.id]) { item.x = positions[item.id].x; item.y = positions[item.id].y; } });
    },
    createFolder(ids: string[], options: { title?: string; position?: Point } = {}) {
      const id = `folder-${globalThis.crypto.randomUUID()}`, poses = layoutBoard(document, openFolderId, openStackId, spaceFolderId);
      edit("Create folder", items => {
        const members = movingItems(items, ids);
        if (members.some(item => isFolder(item) || item.folderId)) throw new Error("Folders cannot be nested");
        const bounds = boundsOf(members.map(item => ({ ...item, ...poses.get(item.id)! })))!;
        const position = options.position ?? { x: bounds.x + bounds.width / 2 - 120, y: bounds.y + bounds.height / 2 - 85 };
        const folder: BoardItem = { id, type: "folder", kind: "folder", ...position, width: 240, height: 170, data: { title: options.title ?? "Untitled folder" } };
        for (const item of members) {
          const pose = poses.get(item.id)!;
          if (item.stackId && items.some(other => other.stackId === item.stackId && !ids.includes(other.id))) delete item.stackId;
          item.x = pose.x - folder.x; item.y = pose.y - folder.y; item.folderId = id;
        }
        items.push(folder);
      });
      return id;
    },
    stack(ids: string[], positions: Record<string, Point> = {}, detachIds: string[] = []) {
      const stackId = `stack-${globalThis.crypto.randomUUID()}`;
      edit("Stack items", items => {
        for (const item of items) if (detachIds.includes(item.id)) delete item.stackId;
        const seed = movingItems(items, ids), existing = new Set(seed.map(item => item.stackId).filter(Boolean));
        const members = items.filter(item => ids.includes(item.id) || item.stackId && existing.has(item.stackId));
        if (members.length < 2 || members.some(isFolder) || !sameFolder(members)) throw new Error("Stack requires two cards in the same folder");
        for (const item of members) { if (positions[item.id]) { item.x = positions[item.id].x; item.y = positions[item.id].y; } item.stackId = stackId; }
      });
      return stackId;
    },
    unstack(id: string) {
      const poses = layoutBoard(document, openFolderId, openStackId, spaceFolderId);
      edit("Unstack items", items => {
        for (const item of items.filter(item => item.stackId === id)) {
          if (openStackId === id) {
            const pose = poses.get(item.id)!, folder = items.find(folder => folder.id === item.folderId);
            item.x = pose.x - (folder?.x ?? 0); item.y = pose.y - (folder?.y ?? 0);
          }
          delete item.stackId;
        }
      });
    },
    /** World-space positions are converted once at the command boundary. */
    file(ids: string[], folderId: string, positions: Record<string, Point> = {}) {
      edit("File items", items => {
        const folder = items.find(item => item.id === folderId && isFolder(item));
        const moving = movingItems(items, ids);
        if (!folder || moving.some(isFolder) || moving.some(item => item.folderId === folderId)) throw new Error("Invalid folder drop");
        const movingSet = new Set(ids);
        for (const item of moving) {
          if (item.stackId && items.some(other => other.stackId === item.stackId && !movingSet.has(other.id))) delete item.stackId;
          const oldFolder = items.find(parent => parent.id === item.folderId);
          const point = positions[item.id] ?? { x: item.x + (oldFolder?.x ?? 0), y: item.y + (oldFolder?.y ?? 0) };
          item.x = point.x - folder.x; item.y = point.y - folder.y; item.folderId = folderId;
        }
      });
    },
    detach(ids: string[], positions: Record<string, Point>, leaveFolder = false) {
      edit(leaveFolder ? "Move out of folder" : "Detach from stack", items => {
        for (const item of movingItems(items, ids)) {
          const point = positions[item.id]; if (!point) throw new Error("Missing detach position");
          const folder = leaveFolder ? undefined : items.find(parent => parent.id === item.folderId);
          item.x = point.x - (folder?.x ?? 0); item.y = point.y - (folder?.y ?? 0);
          delete item.stackId; if (leaveFolder) delete item.folderId;
        }
      });
    },
    undo() { assertIdle(); editingId = null; historyGroup = undefined; const previous = past.pop(); if (!previous) return; future.push(document); document = previous; emit("undo", "Undo"); },
    redo() { assertIdle(); editingId = null; historyGroup = undefined; const next = future.pop(); if (!next) return; past.push(document); document = next; emit("redo", "Redo"); },
    load(value: unknown) {
      assertIdle();
      let next: BoardDocument; updating = true;
      try { next = prepare(value); } finally { updating = false; }
      document = next; editingId = previewId = null; openFolderHadContents = false; historyGroup = undefined; past.length = 0; future.length = 0; selectedIds = []; openFolderId = openStackId = null;
      emit("external", "Load document");
    },
  };
}
export type BoardStore = ReturnType<typeof createBoardStore>;
