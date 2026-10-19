// Extracted from Franklin Board React worktree efca662 (MIT).
import type { Camera, Point } from "./franklin-react-core-types";
import type { Bounds } from "./franklin-react-core-containers";
export const MIN_ZOOM = .15, MAX_ZOOM = 3;
export function normalizeCamera(camera: Camera): Camera {
  if (![camera.x, camera.y, camera.zoom].every(Number.isFinite) || camera.zoom <= 0) throw new Error("Invalid camera");
  return { x: camera.x, y: camera.y, zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.zoom)) };
}
/** Anchor is relative to the canvas viewport, in CSS pixels. */
export function zoomCamera(camera: Camera, zoom: number, anchor: Point): Camera {
  const next = normalizeCamera({ ...camera, zoom });
  if (![anchor.x, anchor.y].every(Number.isFinite)) throw new Error("Invalid zoom anchor");
  return { x: anchor.x - (anchor.x - camera.x) * next.zoom / camera.zoom, y: anchor.y - (anchor.y - camera.y) * next.zoom / camera.zoom, zoom: next.zoom };
}
/** Legacy board Fit margins and maximum fit scale, measured in the embedded viewport. */
export function fitCamera(bounds: Bounds | null, width: number, height: number): Camera {
  if (!bounds) return { x: width / 2 - 120, y: height / 2 - 100, zoom: 1 };
  const zoom = Math.max(MIN_ZOOM, Math.min(1.1, Math.max(1, width - 120) / Math.max(1, bounds.width), Math.max(1, height - 190) / Math.max(1, bounds.height)));
  return { x: width / 2 - (bounds.x + bounds.width / 2) * zoom, y: height / 2 - (bounds.y + bounds.height / 2) * zoom - 5, zoom };
}
