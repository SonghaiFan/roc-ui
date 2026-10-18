"use client";
import { useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useContinuity } from "./use-continuity";
import "./roc.css";
export interface SourceItem { id: string; title: string; kind: string; content: ReactNode; color?: string }
/** Each source owns one mounted subtree through pile, spread and focused detail. */
export function SourceStack({ items, color, duration }: { items: SourceItem[]; color?: string; duration?: number }) {
  const [spread, setSpread] = useState(false), [selected, setSelected] = useState<string | null>(null);
  const { root, change } = useContinuity(), id = useId(), toggle = useRef<HTMLButtonElement>(null);
  const select = (key: string | null) => change(() => { setSelected(key); if (key) setSpread(true); });
  return <div ref={root} style={{ "--roc-duration": duration ? `${duration}ms` : undefined } as CSSProperties} className={`roc-sources ${spread ? "is-spread" : ""} ${selected ? "has-selection" : ""}`} onKeyDown={e => { if (e.key === "Escape" && (spread || selected)) { e.stopPropagation(); if (!selected) change(() => setSpread(false)); else select(null); toggle.current?.focus(); } }}>
    <button ref={toggle} className="roc-text-button roc-source-toggle" aria-expanded={spread} aria-controls={id} onClick={() => change(() => { setSpread(!spread); setSelected(null); })}>{spread ? "Gather sources" : "Unfold sources"} <span>↗</span></button>
    <div id={id} className="roc-source-items" inert={!spread} aria-hidden={!spread}>
      {items.map((item, index) => <article key={item.id} data-roc-item className={`roc-source ${selected === item.id ? "is-selected" : ""}`} style={{ background: color ? `color-mix(in srgb, ${color} ${12 + index * 12}%, white)` : item.color, left: selected === item.id ? "50%" : spread ? `${items.length <= 1 ? 50 : 16 + index / (items.length - 1) * 68}%` : "50%", top: selected === item.id ? 0 : spread ? 35 : 30 + index * 6, transform: `translateX(-50%) rotate(${spread ? 0 : (index - (items.length - 1) / 2) * 7}deg)`, zIndex: selected === item.id ? 10 : index + 1 }} inert={!!selected && selected !== item.id}>
        <span className="roc-eyebrow">{item.kind}</span><h3>{item.title}</h3>
        <div className="roc-source-content">{item.content}</div>
        <button className="roc-text-button" aria-pressed={selected === item.id} onClick={() => select(selected === item.id ? null : item.id)}>{selected === item.id ? "Return ↙" : "Inspect ↗"}</button>
      </article>)}
    </div>
  </div>;
}
