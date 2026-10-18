"use client";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import "./continuous-tabs.css";
export interface ContinuousTab {
  id: string;
  label: React.ReactNode;
}
/** A controlled selection group. Labels never move; one retained marker follows selection. */
export function ContinuousTabs({
  items,
  value,
  onValueChange,
  label = "View",
  color,
  duration,
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
  items: ContinuousTab[];
  value: string;
  onValueChange: (id: string) => void;
  label?: string;
  color?: string;
  duration?: number;
}) {
  const root = useRef<HTMLDivElement>(null),
    [pose, setPose] = useState({ x: 0, width: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const button =
        root.current?.querySelector<HTMLElement>(`[data-active="true"]`);
      if (button) setPose({ x: button.offsetLeft, width: button.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, [value, items]);
  return (
    <div
      className={`roc-tabs ${className}`}
      ref={root}
      style={
        {
          "--roc-marker": color,
          "--roc-duration": duration ? `${duration}ms` : undefined,
          ...style,
        } as CSSProperties
      }
      role="group"
      aria-label={label}
    >
      <span
        aria-hidden="true"
        className="roc-tab-marker"
        style={{ transform: `translateX(${pose.x}px)`, width: pose.width }}
      />
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          data-active={value === item.id}
          aria-pressed={value === item.id}
          onClick={() => onValueChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
