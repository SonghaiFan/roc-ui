// Extracted from Franklin Board React worktree efca662 (MIT).
import type { Point } from "./franklin-react-core-types";
export interface ImageView extends Point { scale: number }
export interface ImageFrame { width: number; height: number; naturalWidth: number; naturalHeight: number }
export const FIT_IMAGE_VIEW: ImageView = { x: 0, y: 0, scale: 1 };
export function constrainImageView(view: ImageView, frame: ImageFrame): ImageView {
  const scale = Math.max(1, Math.min(8, Number.isFinite(view.scale) ? view.scale : 1));
  const fit = Math.min(frame.width / Math.max(1, frame.naturalWidth), frame.height / Math.max(1, frame.naturalHeight));
  const x = Math.max(0, (frame.naturalWidth * fit * scale - frame.width) / 2);
  const y = Math.max(0, (frame.naturalHeight * fit * scale - frame.height) / 2);
  return { scale, x: Math.max(-x, Math.min(x, Number.isFinite(view.x) ? view.x : 0)), y: Math.max(-y, Math.min(y, Number.isFinite(view.y) ? view.y : 0)) };
}
/** Anchor is relative to the centre of the fitted viewport. */
export function zoomImageAt(view: ImageView, anchor: Point, scale: number, frame: ImageFrame): ImageView {
  const next = Math.max(1, Math.min(8, scale)), ratio = next / view.scale;
  return constrainImageView({ scale: next, x: anchor.x - (anchor.x - view.x) * ratio, y: anchor.y - (anchor.y - view.y) * ratio }, frame);
}
