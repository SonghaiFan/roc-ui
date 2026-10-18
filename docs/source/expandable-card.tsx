"use client";
import { useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useContinuity } from "./use-continuity";
import "./roc.css";

export interface ExpandableCardProps { title: string; eyebrow?: string; children: ReactNode; defaultOpen?: boolean; color?: string; duration?: number }
/** An in-place reading surface. Children remain mounted, including form/editor state.
 * This is a disclosure, not a modal; surrounding content remains available.
 */
export function ExpandableCard({ title, eyebrow = "FIELD NOTES", children, defaultOpen = false, color, duration }: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { root, change } = useContinuity();
  const id = useId(), trigger = useRef<HTMLButtonElement>(null);
  const close = () => { change(() => setOpen(false)); trigger.current?.focus({ preventScroll: true }); };
  return <div ref={root} style={{ "--roc-paper": color, "--roc-duration": duration ? `${duration}ms` : undefined } as CSSProperties} className={`roc-expand ${open ? "is-open" : ""}`} onKeyDown={e => { if (open && e.key === "Escape") { e.stopPropagation(); close(); } }}>
    <article data-roc-item className="roc-paper">
      <span className="roc-eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p className="roc-summary">A little room for the things worth keeping.</p>
      <div id={id} className="roc-paper-body" inert={!open} aria-hidden={!open}>{children}</div>
      <button ref={trigger} className="roc-text-button" aria-expanded={open} aria-controls={id} onClick={() => open ? close() : change(() => setOpen(true))}>{open ? "Close note ↗" : "Open note ↗"}</button>
    </article>
  </div>;
}
