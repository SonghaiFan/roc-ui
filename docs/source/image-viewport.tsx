// Extracted from Franklin Board React worktree; MIT. See SOURCE-LICENSE.txt.
"use client";
import "./roc.css";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { FIT_IMAGE_VIEW, constrainImageView, zoomImageAt, type ImageFrame, type ImageView } from "./image-geometry";
type Point = { x: number; y: number };
import { createPositionMotion } from "./position-motion";
import { presentationSpring } from "./physical-spring";
export interface ImageViewportProps { active: boolean; naturalWidth: number; naturalHeight: number; children: ReactNode }
/** Transforms stay outside React/document state; controls only receive the zoom readout. */
export function ImageViewport({ active, naturalWidth, naturalHeight, children }: ImageViewportProps) {
  const root = useRef<HTMLDivElement>(null), activeRef = useRef(active); activeRef.current = active;
  const api = useRef<{ zoom: (factor: number) => void; fit: () => void } | null>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const node = root.current!, image = node.querySelector("img"); if (!image) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"), points = new Map<number, Point>();
    let frame: ImageFrame = { width: node.clientWidth, height: node.clientHeight, naturalWidth, naturalHeight };
    let pan: { point: Point; view: ImageView } | null = null;
    let pinch: { middle: Point; distance: number; view: ImageView } | null = null;
    const motion = createPositionMotion(image, FIT_IMAGE_VIEW, pose => {
      image.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale})`;
      node.dataset.zoom = String(pose.scale); node.dataset.pannable = String(activeRef.current && pose.scale > 1.001);
    });
    const current = (): ImageView => { const pose = motion.read(); return { x: pose.x, y: pose.y, scale: pose.scale }; };
    const paint = (view: ImageView) => { const bounded = constrainImageView(view, frame); motion.set(bounded); setScale(bounded.scale); };
    const fit = () => { cancel(); motion.to(FIT_IMAGE_VIEW, reduced.matches, { spring: presentationSpring(false), preserveVelocity: false }); setScale(1); };
    const anchor = (event: { clientX: number; clientY: number }): Point => {
      const rect = node.getBoundingClientRect(); return { x: (event.clientX - rect.left) * node.clientWidth / Math.max(1, rect.width) - node.clientWidth / 2, y: (event.clientY - rect.top) * node.clientHeight / Math.max(1, rect.height) - node.clientHeight / 2 };
    };
    const zoom = (factor: number, point: Point = { x: 0, y: 0 }) => { cancel(); const view = current(); paint(zoomImageAt(view, point, view.scale * factor, frame)); };
    api.current = { zoom, fit };
    const observer = new ResizeObserver(() => { frame = { width: node.clientWidth, height: node.clientHeight, naturalWidth, naturalHeight }; if (activeRef.current && !points.size) paint(current()); }); observer.observe(node);
    const down = (event: PointerEvent) => {
      if (!activeRef.current || event.button !== 0 || (event.target as Element).closest("button")) return;
      if (event.pointerType !== "touch" || motion.peek().scale > 1.001 || points.size) event.preventDefault();
      event.stopPropagation(); node.focus({ preventScroll: true });
      points.set(event.pointerId, anchor(event)); node.setPointerCapture(event.pointerId);
      if (points.size === 1) pan = { point: anchor(event), view: current() };
      if (points.size === 2) { const [a, b] = [...points.values()]; pinch = { middle: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), view: current() }; }
    };
    const move = (event: PointerEvent) => {
      if (!points.has(event.pointerId)) return;
      if (event.pointerType === "touch" && points.size === 1 && motion.peek().scale <= 1.001) return;
      event.preventDefault(); event.stopPropagation(); points.set(event.pointerId, anchor(event));
      if (points.size >= 2 && pinch) {
        const [a, b] = [...points.values()], middle = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const view = zoomImageAt(pinch.view, pinch.middle, pinch.view.scale * Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance, frame);
        paint({ ...view, x: view.x + middle.x - pinch.middle.x, y: view.y + middle.y - pinch.middle.y });
      } else if (pan) { const point = anchor(event); paint({ ...pan.view, x: pan.view.x + point.x - pan.point.x, y: pan.view.y + point.y - pan.point.y }); }
    };
    const end = (event: PointerEvent) => {
      if (!points.delete(event.pointerId)) return; event.stopPropagation();
      if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
      pinch = null; pan = points.size ? { point: [...points.values()][0], view: current() } : null;
    };
    const wheel = (event: WheelEvent) => { if (!activeRef.current || !(event.ctrlKey || event.metaKey)) return; event.preventDefault(); event.stopPropagation(); zoom(Math.exp(-event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? frame.height : 1) * .002), anchor(event)); };
    const double = (event: MouseEvent) => { if (!activeRef.current || (event.target as Element).closest("button")) return; event.preventDefault(); event.stopPropagation(); motion.peek().scale > 1.01 ? fit() : zoom(2, anchor(event)); };
    const key = (event: KeyboardEvent) => {
      if (!activeRef.current || event.target !== node) return;
      if (["+", "=", "-", "0", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault(); event.stopPropagation();
        if (event.key === "0") fit(); else if (["+", "=", "-"].includes(event.key)) zoom(event.key === "-" ? 1 / 1.25 : 1.25);
        else { const view = current(), step = event.shiftKey ? 80 : 24; paint({ ...view, x: view.x + (event.key === "ArrowLeft" ? step : event.key === "ArrowRight" ? -step : 0), y: view.y + (event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0) }); }
      }
    };
    const cancel = () => { const ids = [...points.keys()]; points.clear(); pan = pinch = null; for (const id of ids) if (node.hasPointerCapture(id)) node.releasePointerCapture(id); };
    const preference = () => { if (reduced.matches) motion.finish(); };
    const visibility = () => { if (document.hidden) { cancel(); motion.finish(); } };
    const abort = new AbortController(), opts = { signal: abort.signal };
    node.addEventListener("pointerdown", down, opts); node.addEventListener("pointermove", move, opts); node.addEventListener("pointerup", end, opts); node.addEventListener("pointercancel", end, opts); node.addEventListener("lostpointercapture", end, opts);
    node.addEventListener("wheel", wheel, { ...opts, passive: false }); node.addEventListener("dblclick", double, opts); node.addEventListener("keydown", key, opts); window.addEventListener("blur", cancel, opts); document.addEventListener("visibilitychange", visibility, opts); reduced.addEventListener("change", preference, opts);
    return () => { cancel(); abort.abort(); observer.disconnect(); motion.dispose(); image.style.removeProperty("transform"); api.current = null; };
  }, [naturalWidth, naturalHeight]);
  useLayoutEffect(() => { if (!active) api.current?.fit(); }, [active]);
  return <div ref={root} className="roc-image-viewport" tabIndex={active ? 0 : -1} data-board-interactive={active || undefined} aria-label="Image zoom and pan" title={active ? "Scroll to read · Ctrl/⌘ + wheel to zoom" : undefined}>
    {children}
    <div className="roc-image-tools" hidden={!active} aria-label="Image view controls">
      <button type="button" onClick={() => api.current?.zoom(1 / 1.25)} aria-label="Zoom image out" title="Zoom out (−)">−</button>
      <button type="button" onClick={() => api.current?.fit()} aria-label="Fit image" title="Fit image (0)">{Math.abs(scale - 1) < .001 ? "Fit" : `${Math.round(scale * 100)}%`}</button>
      <button type="button" onClick={() => api.current?.zoom(1.25)} aria-label="Zoom image in" title="Zoom in (+)">+</button>
    </div>
  </div>;
}
