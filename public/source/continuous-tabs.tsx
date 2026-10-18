"use client";
import { useLayoutEffect, useRef, useState } from "react";
import "./roc.css";
export interface ContinuousTab { id: string; label: string }
/** A controlled selection group. Labels never move; one retained marker follows selection. */
export function ContinuousTabs({ items, value, onValueChange, label = "View" }: { items: ContinuousTab[]; value: string; onValueChange: (id: string) => void; label?: string }) {
  const root = useRef<HTMLDivElement>(null), [pose, setPose] = useState({ x: 0, width: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const button = root.current?.querySelector<HTMLElement>(`[data-active="true"]`);
      if (button) setPose({ x: button.offsetLeft, width: button.offsetWidth });
    };
    measure(); const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, [value, items]);
  return <div className="roc-tabs" ref={root} role="group" aria-label={label}>
    <span aria-hidden="true" className="roc-tab-marker" style={{ transform: `translateX(${pose.x}px)`, width: pose.width }} />
    {items.map(item => <button key={item.id} data-active={value === item.id} aria-pressed={value === item.id} onClick={() => onValueChange(item.id)}>{item.label}</button>)}
  </div>;
}
