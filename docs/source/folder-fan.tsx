"use client";
import { useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./roc.css";
export interface FolderItem { id: string; label: string; content?: ReactNode; color?: string }
export interface FolderFanProps {
  items: FolderItem[]; title?: string; onSelect?: (id: string) => void;
  spread?: number; direction?: "up" | "right"; material?: "paper" | "glass";
  color?: string; duration?: number; trigger?: "press" | "hover";
}
/** One card tree through pocket and fan. CSS retargets from the current presentation.
 * Hover is optional; the toggle remains operable by touch and keyboard.
 */
export function FolderFan({ items, title = "Collected ideas", onSelect, spread = 12, direction = "up", material = "glass", color = "#a8c6ee", duration = 560, trigger = "press" }: FolderFanProps) {
  const [pinned, setPinned] = useState(false), [hovered, setHovered] = useState(false);
  const root = useRef<HTMLDivElement>(null), id = useId();
  const open = pinned || (trigger === "hover" && hovered);
  const side = direction === "right";
  return <div ref={root} data-direction={direction} data-material={material} className={`roc-folder ${open ? "is-open" : ""}`} style={{ "--folder-color": color, "--roc-duration": `${duration}ms` } as CSSProperties}
    onPointerEnter={e => { if(e.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)}
    onKeyDown={e => { if(e.key === "Escape" && open) { e.stopPropagation(); setPinned(false); setHovered(false); root.current?.querySelector<HTMLButtonElement>(".roc-folder-toggle")?.focus(); } }}>
    <div className="roc-folder-back" aria-hidden="true" />
    <div id={id} className="roc-folder-items" inert={!open} aria-hidden={!open}>
      {items.map((item, index) => {
        const n = index - (items.length - 1) / 2;
        const unit = items.length < 2 ? 0 : n / ((items.length - 1) / 2);
        return <button key={item.id} data-roc-item className="roc-folder-card" onClick={() => onSelect?.(item.id)} style={{ background: item.color,
          left: side ? (open ? `${66 + Math.abs(unit) * 3}%` : "28%") : (open ? `${50 + unit * (13 + spread * .45)}%` : "50%"),
          top: side ? (open ? `${50 + unit * (12 + spread * .3)}%` : "57%") : (open ? `${28 + Math.abs(unit) * 2}%` : "56%"),
          transform: `translate(-50%, -50%) rotate(${open ? unit * spread : n * 4}deg) scale(${open ? 1 : .87})`, zIndex: index + 1 }}>
          <span className="roc-eyebrow">{String(index + 1).padStart(2, "0")} / SOURCE</span><strong>{item.label}</strong><span className="roc-card-content">{item.content}</span>
        </button>;
      })}
    </div>
    <button className="roc-folder-toggle" aria-expanded={open} aria-controls={id} onClick={() => { setPinned(!open); setHovered(false); }}><span>{title}</span><span>{items.length} objects <b>{open ? "−" : "+"}</b></span></button>
  </div>;
}
