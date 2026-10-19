// Extracted from Franklin Board React worktree efca662 (MIT).
import type { BoardDocument, BoardItem, Point } from "./franklin-react-core-types";

export interface Pose extends Point { scale: number; rotation: number }
export interface Bounds extends Point { width: number; height: number }
export const poseOf = (item: Point): Pose => ({ x: item.x, y: item.y, scale: 1, rotation: 0 });
export const isFolder = (item: BoardItem) => item.kind === "folder";
export const membersOf = (doc: BoardDocument, stackId: string) => doc.items.filter(item => item.stackId === stackId);
export function boundsOf(items: Bounds[]): Bounds | null {
  if (!items.length) return null;
  const left = Math.min(...items.map(item => item.x)), top = Math.min(...items.map(item => item.y));
  return { x: left, y: top, width: Math.max(...items.map(item => item.x + item.width)) - left, height: Math.max(...items.map(item => item.y + item.height)) - top };
}
/** Ported from the retained legacy model: narrowing, centred rows, no size changes. */
export function folderFanLayout(folder: BoardItem, items: BoardItem[]): Map<string, Pose> {
  const layout = new Map<string, Pose>(), gap = 20;
  const remaining = items.map((item, index) => ({ item, index })).sort((a, b) => b.item.width * b.item.height - a.item.width * a.item.height || a.index - b.index).map(entry => entry.item);
  const columns = items.length <= 5 ? items.length : Math.ceil(Math.sqrt(items.length * 1.6));
  const baseWidth = remaining.slice(0, columns).reduce((sum, item) => sum + item.width, 0) + Math.max(0, columns - 1) * gap;
  const rows: { items: BoardItem[]; width: number; height: number }[] = [];
  while (remaining.length) {
    const budget = baseWidth * Math.pow(.82, rows.length), row: BoardItem[] = [];
    let width = 0;
    while (remaining.length) {
      const item = remaining[0], next = width + (row.length ? gap : 0) + item.width;
      if (row.length && next > budget) break;
      row.push(remaining.shift()!); width = next;
    }
    rows.push({ items: row, width, height: Math.max(...row.map(item => item.height)) });
  }
  let bottom = folder.y - 24;
  for (const row of rows) {
    const center = folder.x + folder.width / 2, radius = (row.width - (row.items[0].width + row.items.at(-1)!.width) / 2) / 2;
    const rise = row.items.length > 1 ? Math.min(12, row.width * .012) : 0;
    let x = center - row.width / 2;
    for (const item of row.items) {
      const t = radius ? Math.max(-1, Math.min(1, (x + item.width / 2 - center) / radius)) : 0;
      layout.set(item.id, { x, y: bottom - item.height - rise * (1 - t * t), scale: 1, rotation: 0 });
      x += item.width + gap;
    }
    bottom -= row.height + 24 + rise;
  }
  return layout;
}
/** Same compact grid and bottom alignment as legacy stackScatterLayout. */
export function stackScatterLayout(items: BoardItem[]): Map<string, Pose> {
  const layout = new Map<string, Pose>(), bounds = boundsOf(items);
  if (!bounds) return layout;
  const gap = 28, columns = items.length <= 3 ? items.length : Math.ceil(Math.sqrt(items.length)), rows = Math.ceil(items.length / columns);
  const widths = Array<number>(columns).fill(0), heights = Array<number>(rows).fill(0);
  items.forEach((item, index) => { widths[index % columns] = Math.max(widths[index % columns], item.width); heights[Math.floor(index / columns)] = Math.max(heights[Math.floor(index / columns)], item.height); });
  const left = bounds.x + bounds.width / 2 - (widths.reduce((a, b) => a + b, 0) + gap * (columns - 1)) / 2;
  const top = bounds.y + bounds.height / 2 - (heights.reduce((a, b) => a + b, 0) + gap * (rows - 1)) / 2;
  items.forEach((item, index) => {
    const column = index % columns, row = Math.floor(index / columns);
    layout.set(item.id, { x: left + widths.slice(0, column).reduce((a, b) => a + b, 0) + column * gap + (widths[column] - item.width) / 2,
      y: top + heights.slice(0, row).reduce((a, b) => a + b, 0) + row * gap + heights[row] - item.height, scale: 1, rotation: 0 });
  });
  return layout;
}
export function normalizeStacks(items: BoardItem[]) {
  const groups = new Map<string, BoardItem[]>();
  for (const item of items) if (item.stackId) groups.set(item.stackId, [...(groups.get(item.stackId) ?? []), item]);
  for (const group of groups.values()) if (group.length < 2) delete group[0].stackId;
}
/** Stable pocket variation prevents a close/open reversal from picking a new destination. */
export function folderPocket(item: BoardItem, folder: BoardItem, rank: number): Pose {
  const hash = [...item.id].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
  const scale = Math.min(folder.width * .88 / item.width, folder.height * .82 / item.height);
  return { x: folder.x + folder.width / 2 + (hash % 7 - 3) - item.width / 2,
    y: folder.y + 12 - Math.min(rank, 3) * 3 + item.height * scale / 2 - item.height / 2,
    scale, rotation: (hash % 15 - 7) * .5 };
}
export function layoutBoard(doc: BoardDocument, openFolderId: string | null, openStackId: string | null, spaceFolderId: string | null = null): Map<string, Pose> {
  const layout = new Map(doc.items.map(item => [item.id, poseOf(item)]));
  const groups = new Map<string, BoardItem[]>();
  for (const item of doc.items) if (item.stackId) groups.set(item.stackId, [...(groups.get(item.stackId) ?? []), item]);
  // Closed stacks retain originals in data; the pile is only a presentation.
  for (const items of groups.values()) {
    const bounds = boundsOf(items)!;
    items.forEach((item, index) => {
      const depth = items.length - 1 - index;
      layout.set(item.id, { x: bounds.x + bounds.width / 2 - item.width / 2 + Math.min(depth, 4) * 3,
        y: bounds.y + bounds.height / 2 - item.height / 2 - Math.min(depth, 4) * 3,
        rotation: depth ? (depth % 2 ? -1 : 1) * Math.min(depth * 2, 6) : 0, scale: 1 });
    });
  }
  for (const folder of doc.items.filter(isFolder)) {
    const children = doc.items.filter(item => item.folderId === folder.id);
    if (folder.id !== openFolderId) { children.forEach((item, index) => layout.set(item.id, folderPocket(item, folder, index))); continue; }
    if (folder.id === spaceFolderId || folder.folderLayout === "free") {
      for (const item of children) { const pose = layout.get(item.id)!; layout.set(item.id, { ...pose, x: pose.x + folder.x, y: pose.y + folder.y }); }
      continue;
    }
    const representatives = children.filter(item => !item.stackId || groups.get(item.stackId)?.at(-1)?.id === item.id);
    const slots = folderFanLayout(folder, representatives);
    for (const item of children) {
      const group = item.stackId ? groups.get(item.stackId)! : [item], top = group.at(-1)!;
      const slot = slots.get(top.id)!, topPose = layout.get(top.id)!, original = layout.get(item.id)!;
      layout.set(item.id, { ...original, x: original.x + slot.x - topPose.x, y: original.y + slot.y - topPose.y });
      // Update the representative last (array order), so every member shares the same offset.
    }
  }
  if (openStackId) {
    const items = (groups.get(openStackId) ?? []).map(item => ({ ...item, ...layout.get(item.id) }));
    for (const [id, pose] of stackScatterLayout(items)) layout.set(id, pose);
  }
  return layout;
}
export function folderDropContains(point: Point, frame: Bounds): boolean {
  // Legacy CSS mapping of the native hit region, plus the open mouth allowance.
  const rect = point.x >= frame.x && point.x < frame.x + frame.width && point.y >= frame.y && point.y < frame.y + frame.height;
  return rect && Math.hypot(point.x - frame.x - frame.width / 2, point.y - frame.y - frame.height / 2 - 12) < 128 ||
    point.x > frame.x + 12 && point.x < frame.x + frame.width - 12 && point.y >= frame.y - Math.max(30, frame.height * .22) && point.y < frame.y + frame.height * .45;
}
export const pullShouldDetach = (elapsed: number, dx: number, dy: number, zoom: number) => elapsed > 800 || Math.hypot(dx, dy) > 500 / zoom;
