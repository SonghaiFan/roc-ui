// Extracted from Franklin Board React worktree efca662 (MIT).
import type { BoardItem, Camera, Point } from "./franklin-react-core-types";
import type { GeometryPose } from "./franklin-react-motion-position";

/** Screen-space channels used by the retained legacy document presentation. */
export interface PresentationPose extends Point {
  width: number; height: number; rotation: number; radius: number; reveal: number; scroll: number;
}
export interface PresentationViewport { width: number; height: number }
export function cardRadius(item: BoardItem) {
  return item.radiusKind === 0 || item.radiusKind === undefined && item.type === "image" ? 0 : 16;
}
export const DOCUMENT_SIZE = Object.freeze({ width: 210, height: 297 });

/** Fit the fixed document paper geometry; image lead retains the legacy no-upscaling rule. */
export function fullViewTarget(item: BoardItem, viewport: PresentationViewport): PresentationPose {
  const { width: vw, height: vh } = viewport;
  if (item.type === "image") {
    const data = item.data && typeof item.data === "object" && !Array.isArray(item.data) ? item.data : {};
    const nw = typeof data.naturalWidth === "number" && data.naturalWidth > 0 ? data.naturalWidth : item.width;
    const nh = typeof data.naturalHeight === "number" && data.naturalHeight > 0 ? data.naturalHeight : item.height;
    const desktop = vw >= 1000, top = Math.min(56, Math.max(24, vh * .045));
    const scale = Math.min(1, Math.max(40, desktop ? vw - 560 : vw - 48) / nw, Math.max(80, vh - top - (desktop ? 180 : 300)) / nh);
    return { x: (vw - nw * scale) / 2, y: (vh - nh * scale) / 2, width: nw * scale, height: nh * scale, rotation: 0, radius: 0, reveal: 1, scroll: 0 };
  }
  const scale = Math.min(vh / DOCUMENT_SIZE.height, (vw - 44) / DOCUMENT_SIZE.width);
  const width = DOCUMENT_SIZE.width * scale, height = DOCUMENT_SIZE.height * scale;
  return { x: (vw - width) / 2, y: (vh - height) / 2, width, height, rotation: 0, radius: 16, reveal: 1, scroll: 0 };
}
/** Convert centre-origin board transforms once; the flight then has unit screen scale. */
export function screenCardPose(pose: GeometryPose, radius: number, camera: Camera, origin: Point): PresentationPose {
  const scale = pose.scale * camera.zoom, width = pose.width * scale, height = pose.height * scale;
  const angle = pose.rotation * Math.PI / 180, c = Math.cos(angle), s = Math.sin(angle);
  const cx = origin.x + camera.x + (pose.x + pose.width / 2) * camera.zoom;
  const cy = origin.y + camera.y + (pose.y + pose.height / 2) * camera.zoom;
  return { x: cx - width / 2 * c + height / 2 * s, y: cy - width / 2 * s - height / 2 * c,
    width, height, rotation: pose.rotation, radius: radius * scale, reveal: 0, scroll: 0 };
}
