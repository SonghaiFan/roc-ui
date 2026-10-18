"use client";
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import "./folder-fan.css";
import { useControllableState } from "./use-controllable-state";
export interface FolderItem {
  id: string;
  label: string;
  content?: ReactNode;
  color?: string;
}
export interface FolderFanProps {
  className?: string;
  style?: CSSProperties;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: FolderItem[];
  title?: string;
  onSelect?: (id: string) => void;
  spread?: number;
  direction?: "up" | "right";
  material?: "paper" | "glass";
  color?: string;
  duration?: number;
  trigger?: "press" | "hover";
}
/** One card tree through pocket and fan. CSS retargets from the current presentation.
 * Hover is optional; the toggle remains operable by touch and keyboard.
 */
export function FolderFan({
  items,
  className = "",
  style,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  title = "Collection",
  onSelect,
  spread = 12,
  direction = "up",
  material = "glass",
  color = "#a8c6ee",
  duration = 560,
  trigger = "press",
}: FolderFanProps) {
  const [pinned, setPinned] = useControllableState(
    controlled,
    defaultOpen,
    onOpenChange,
  );
  const [hovered, setHovered] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  const open = pinned || (trigger === "hover" && hovered);
  const side = direction === "right";
  return (
    <div
      ref={root}
      data-direction={direction}
      data-material={material}
      className={`roc-folder ${open ? "is-open" : ""} ${className}`}
      style={
        {
          "--folder-color": color,
          "--roc-duration": `${duration}ms`,
          ...style,
        } as CSSProperties
      }
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setPinned(false);
          setHovered(false);
          root.current
            ?.querySelector<HTMLButtonElement>(".roc-folder-toggle")
            ?.focus();
        }
      }}
    >
      <div className="roc-folder-back" aria-hidden="true" />
      <div
        id={id}
        className="roc-folder-items"
        inert={!open}
        aria-hidden={!open}
      >
        {items.map((item, index) => {
          const n = index - (items.length - 1) / 2;
          const unit = items.length < 2 ? 0 : n / ((items.length - 1) / 2);
          return (
            <button
              type="button"
              key={item.id}
              data-roc-item
              className="roc-folder-card"
              onClick={() => onSelect?.(item.id)}
              style={{
                background: item.color,
                left: side
                  ? open
                    ? `${66 + Math.abs(unit) * 3}%`
                    : "28%"
                  : open
                    ? `${50 + unit * (13 + spread * 0.45)}%`
                    : "50%",
                top: side
                  ? open
                    ? `${50 + unit * (12 + spread * 0.3)}%`
                    : "57%"
                  : open
                    ? `${28 + Math.abs(unit) * 2}%`
                    : "56%",
                transform: `translate(-50%, -50%) rotate(${open ? unit * spread : n * 4}deg) scale(${open ? 1 : 0.87})`,
                zIndex: index + 1,
              }}
            >
              <span className="roc-eyebrow">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{item.label}</strong>
              <span className="roc-card-content">{item.content}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="roc-folder-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setPinned(!open);
          setHovered(false);
        }}
      >
        <span>{title}</span>
        <span>
          {items.length} objects <b>{open ? "−" : "+"}</b>
        </span>
      </button>
    </div>
  );
}
