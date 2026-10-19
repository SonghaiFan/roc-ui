// Extracted from Franklin Board React worktree efca662 (MIT).
import type { BoardItem, Camera, Guide, Point } from "./franklin-react-core-types";
export function screenToWorld(point: Point, camera: Camera): Point {
  return { x: (point.x - camera.x) / camera.zoom, y: (point.y - camera.y) / camera.zoom };
}
/** Threshold is supplied in world units so callers can keep it constant on screen. */
export function snapPosition(item: BoardItem, point: Point, others: BoardItem[], threshold: number, grid = 24) {
  const result = { ...point };
  const guides: Guide[] = [];
  for (const axis of ["x", "y"] as const) {
    const size = axis === "x" ? "width" : "height";
    let distance = threshold + Number.EPSILON;
    let target: number | undefined;
    let guide: number | undefined;
    for (const other of others) {
      if (other.id === item.id) continue;
      for (const anchor of [0, .5, 1]) for (const edge of [0, .5, 1]) {
        const value = other[axis] + other[size] * edge;
        const candidate = value - item[size] * anchor;
        const delta = Math.abs(candidate - point[axis]);
        if (delta < distance) { distance = delta; target = candidate; guide = value; }
      }
    }
    if (target === undefined && grid > 0) {
      const candidate = Math.round(point[axis] / grid) * grid;
      if (Math.abs(candidate - point[axis]) <= threshold) { target = candidate; guide = candidate; }
    }
    if (target !== undefined) {
      result[axis] = target;
      guides.push({ axis, value: guide! });
    }
  }
  return { point: result, guides };
}

export type ResizeDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
export interface ItemGeometry extends Point { width: number; height: number }
/** Legacy local-axis resize: keep the opposite anchor fixed, including rotated poses. */
export function resizeCard(item: ItemGeometry & { rotation?: number }, direction: ResizeDirection, dx: number, dy: number, lockAspect = false): ItemGeometry {
  const sx = direction.includes("e") ? 1 : direction.includes("w") ? -1 : 0;
  const sy = direction.includes("s") ? 1 : direction.includes("n") ? -1 : 0;
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  let width = item.width, height = item.height;
  if (lockAspect) {
    const ratio = height / width, change = (sx * dx + ratio * sy * dy) / (1 + ratio * ratio);
    width = clamp(width + change, Math.max(90, 70 / ratio), Math.min(4000, 4000 / ratio)); height = width * ratio;
  } else {
    if (sx) width = clamp(width + sx * dx, 90, 4000);
    if (sy) height = clamp(height + sy * dy, 70, 4000);
  }
  const dw = width - item.width, dh = height - item.height, rad = (item.rotation ?? 0) * Math.PI / 180;
  return { width, height, x: item.x + sx * dw / 2 * Math.cos(rad) - sy * dh / 2 * Math.sin(rad) - dw / 2,
    y: item.y + sx * dw / 2 * Math.sin(rad) + sy * dh / 2 * Math.cos(rad) - dh / 2 };
}
/** World-space visual bounds, including centre-origin scale and rotation. */
export function visualBounds(item: ItemGeometry & { scale?: number; rotation?: number }): ItemGeometry {
  const rad = (item.rotation ?? 0) * Math.PI / 180, scale = item.scale ?? 1;
  const width = scale * (Math.abs(Math.cos(rad)) * item.width + Math.abs(Math.sin(rad)) * item.height);
  const height = scale * (Math.abs(Math.sin(rad)) * item.width + Math.abs(Math.cos(rad)) * item.height);
  return { x: item.x + (item.width - width) / 2, y: item.y + (item.height - height) / 2, width, height };
}
export const rectIntersects = (a: ItemGeometry, b: ItemGeometry) => a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;
