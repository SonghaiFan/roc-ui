"use client";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { presentationSample } from "./presentation-spring";
import "./roc.css";

type Pose = { x: number; y: number; scale: number; height: number; radius: number; reveal: number; scroll: number };
const keys: (keyof Pose)[] = ["x", "y", "scale", "height", "radius", "reveal", "scroll"];
export interface CardPreviewProps {
  children: ReactNode; label: string; className?: string; color?: string;
  previewHeight?: number; compositionWidth?: number; defaultOpen?: boolean;
  openLabel?: string; closeLabel?: string;
  onOpenChange?: (open: boolean) => void;
}
/** One composition in one native dialog, embedded while closed and in the top
 * layer while reading. No portal handoff, clone, or content reflow on opening.
 * The return slot is always present and remeasured while closing. */
export function CardPreview({ children, label, className = "", color, previewHeight = 240, compositionWidth = 480, defaultOpen = false, openLabel = "Open preview ↗", closeLabel = "Return ↙", onOpenChange }: CardPreviewProps) {
  const anchor = useRef<HTMLDivElement>(null), dialog = useRef<HTMLDialogElement>(null);
  const surface = useRef<HTMLElement>(null), viewport = useRef<HTMLDivElement>(null), content = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null), closeButton = useRef<HTMLButtonElement>(null);
  const control = useRef<{ toggle: () => void; close: () => void } | null>(null);
  const callback = useRef(onOpenChange); callback.current = onOpenChange;
  const [reading, setReading] = useState(false);
  useLayoutEffect(() => {
    const slot = anchor.current!, modal = dialog.current!, paper = surface.current!, clip = viewport.current!, body = content.current!;
    let current: Pose, flight: { from: Pose; to: Pose; start: number; opening: boolean; done?: () => void } | null = null;
    let raf = 0, active = false, closing = false, disposed = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const slotPose = (): Pose => {
      const r = slot.getBoundingClientRect();
      return { x: r.x, y: r.y, scale: r.width / compositionWidth, height: previewHeight, radius: 8, reveal: 0, scroll: 0 };
    };
    const target = (): Pose => {
      const v = window.visualViewport, width = v?.width || innerWidth, height = v?.height || innerHeight;
      const w = Math.min(640, width - 40), scale = w / compositionWidth;
      const h = Math.min(body.scrollHeight * scale, height - 112);
      return { x: (v?.offsetLeft || 0) + (width - w) / 2, y: (v?.offsetTop || 0) + 64, scale, height: h, radius: 16, reveal: 1, scroll: 0 };
    };
    function paint() {
      paper.style.transform = active ? `translate3d(${current.x}px,${current.y}px,0)` : "none";
      paper.style.width = `${compositionWidth * current.scale}px`;
      paper.style.height = `${current.height}px`;
      paper.style.borderRadius = `${current.radius}px`;
      body.style.transform = `scale(${current.scale})`;
      clip.style.height = `${current.height}px`;
      clip.style.overflowY = active && !closing ? "auto" : "hidden";
      // A scaled composition retains its natural typesetting; only its physical
      // footprint changes. Keep scroll extent in those same projected coordinates.
      body.parentElement!.style.height = `${body.scrollHeight * current.scale}px`;
      if (closing) clip.scrollTop = current.scroll;
      modal.style.setProperty("--roc-reveal", String(current.reveal));
    }
    function sample(now: number) {
      if (!flight) return;
      for (const key of keys) current[key] = presentationSample(flight.from[key], flight.to[key], (now - flight.start) / 1000, flight.opening).position;
    }
    function tick(now: number) {
      if (!flight || disposed) return;
      // An anchor can move during resize/scroll while this paper is returning.
      if (closing) {
        const next = slotPose();
        if (["x", "y", "scale"].some(k => Math.abs(next[k as keyof Pose] - flight!.to[k as keyof Pose]) > .01)) {
          sample(now); flight.from = { ...current }; flight.to = next; flight.start = now;
        }
      }
      sample(now);
      const settled = keys.every(k => {
        const s = presentationSample(flight!.from[k], flight!.to[k], (now-flight!.start)/1000, flight!.opening);
        const tolerance = k === "scale" || k === "reveal" ? .0001 : .04;
        return Math.abs(s.position-flight!.to[k]) < tolerance && Math.abs(s.velocity) < tolerance*4;
      });
      if (reduced.matches || settled) { const done = flight.done; current = { ...flight.to }; flight = null; paint(); done?.(); }
      else { paint(); raf = requestAnimationFrame(tick); }
    }
    function run(to: Pose, opening: boolean, done?: () => void) {
      cancelAnimationFrame(raf);
      flight = { from: { ...current }, to, start: performance.now(), opening, done }; tick(performance.now());
    }
    function finish() {
      active = false; closing = false; modal.close(); modal.classList.remove("is-reading"); modal.setAttribute("open", "");
      current = slotPose(); clip.scrollTop = 0; paint(); setReading(false);
      trigger.current?.focus({ preventScroll: true }); callback.current?.(false);
    }
    function close() {
      if (!active || closing) return;
      current.scroll = clip.scrollTop; closing = true;
      body.inert = true; run(slotPose(), false, finish);
    }
    function open() {
      if (active && !closing) return;
      if (!active) {
        current = slotPose(); modal.close(); modal.classList.add("is-reading"); active = true; paint(); modal.showModal();
      }
      closing = false; body.inert = false; setReading(true); callback.current?.(true);
      run(target(), true); closeButton.current?.focus({ preventScroll: true });
    }
    control.current = { toggle: () => active && !closing ? close() : open(), close };
    const fit = () => { if (!active) { current = slotPose(); paint(); } else if (!closing) run(target(), true); };
    const observer = new ResizeObserver(fit); observer.observe(slot); observer.observe(body);
    const cancel = (e: Event) => { e.preventDefault(); e.stopPropagation(); close(); };
    modal.addEventListener("cancel", cancel); window.addEventListener("resize", fit); window.visualViewport?.addEventListener("resize", fit);
    current = slotPose(); modal.setAttribute("open", ""); body.inert = true; paint();
    if (defaultOpen) open();
    return () => { disposed = true; cancelAnimationFrame(raf); observer.disconnect(); modal.removeEventListener("cancel", cancel); window.removeEventListener("resize", fit); window.visualViewport?.removeEventListener("resize", fit); modal.close(); control.current = null; };
  }, [compositionWidth, previewHeight, defaultOpen]);
  return <div className={`roc-card-preview ${className}`} style={{ "--roc-card-color": color } as CSSProperties}>
    <div ref={anchor} className="roc-return-slot" style={{ height: previewHeight }}>
      <dialog ref={dialog} className="roc-card-dialog" aria-label={label} onKeyDown={e => e.stopPropagation()} onPointerDown={e => { if (e.target === e.currentTarget && reading) control.current?.close(); }}>
        <article ref={surface} className="roc-preview-paper" data-roc-item>
          <div ref={viewport} className="roc-preview-scroll"><div className="roc-preview-extent"><div ref={content} className="roc-preview-composition" style={{ width: compositionWidth }}>{children}</div></div></div>
        </article>
        <button ref={closeButton} hidden={!reading} type="button" className="roc-preview-close" onClick={() => control.current?.close()}>{closeLabel}</button>
      </dialog>
    </div>
    <button ref={trigger} type="button" className="roc-text-button roc-preview-trigger" aria-expanded={reading} onClick={() => control.current?.toggle()}>{openLabel}</button>
  </div>;
}
