"use client";
import { useId, useState, type ReactNode } from "react";
import { useContinuity } from "./use-continuity";
import "./roc.css";
export interface FolderItem { id: string; label: string; content?: ReactNode; color?: string }
export interface FolderFanProps { items: FolderItem[]; title?: string; onSelect?: (id: string) => void }
/** Stable keyed cards stay inside one tree, moving between a pocket and a fan. */
export function FolderFan({ items, title = "Collected ideas", onSelect }: FolderFanProps) {
  const [open, setOpen] = useState(false);
  const { root, change } = useContinuity(560), id = useId();
  return <div ref={root} className={`roc-folder ${open ? "is-open" : ""}`} onKeyDown={e => { if (e.key === "Escape" && open) { change(() => setOpen(false)); root.current?.querySelector<HTMLButtonElement>(".roc-folder-toggle")?.focus(); } }}>
    <div className="roc-folder-back" aria-hidden="true" />
    <div id={id} className="roc-folder-items" inert={!open} aria-hidden={!open}>
      {items.map((item, index) => <button key={item.id} data-roc-item className="roc-folder-card" onClick={() => onSelect?.(item.id)} style={{ background: item.color, left: open ? `${items.length <= 1 ? 50 : 18 + index / (items.length - 1) * 64}%` : "50%", top: open ? 22 + Math.abs(index - (items.length - 1) / 2) * 8 : 115, transform: `translateX(-50%) rotate(${open ? (index - (items.length - 1) / 2) * 7 : (index - (items.length - 1) / 2) * 3}deg)` }}>
        <span className="roc-eyebrow">{String(index + 1).padStart(2, "0")} / SOURCE</span><strong>{item.label}</strong><span className="roc-card-content">{item.content}</span>
      </button>)}
    </div>
    <button className="roc-folder-toggle" aria-expanded={open} aria-controls={id} onClick={() => change(() => setOpen(!open))}><span>{title}</span><span>{items.length} objects <b>{open ? "−" : "+"}</b></span></button>
  </div>;
}
