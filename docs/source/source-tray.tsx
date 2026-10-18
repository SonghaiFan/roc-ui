"use client";
import {
  useId,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react";
import { folderFanLayout } from "./fan-layout";
import { createPositionMotion, type PositionMotion } from "./position-motion";
import { containerSpring } from "./physical-spring";
import { useControllableState } from "./use-controllable-state";
import "./source-tray.css";
export interface TraySource {
  id: string;
  width: number;
  height: number;
  content: ReactNode;
}
export interface SourceTrayProps {
  items: TraySource[];
  label?: ReactNode;
  closeLabel?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSettled?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
}
/** Renderer-neutral geometry. Hosts own assets, playback and persistence.
 * One motion writer per keyed shell; reversals retain current position/velocity. */
export function SourceTray({
  items,
  label = "Sources",
  closeLabel = "Gather",
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  onSettled,
  className = "",
  style,
}: SourceTrayProps) {
  const [open, setOpen] = useControllableState(
    controlled,
    defaultOpen,
    onOpenChange,
  );
  const root = useRef<HTMLDivElement>(null),
    button = useRef<HTMLButtonElement>(null),
    nodes = useRef(new Map<string, HTMLElement>()),
    motions = useRef(new Map<string, PositionMotion>()),
    id = useId();
  const current = useRef({ open, items, onSettled });
  current.current = { open, items, onSettled };
  useLayoutEffect(() => {
    const layout = () => {
      const { open, items, onSettled } = current.current,
        w = root.current!.clientWidth,
        h = root.current!.clientHeight - 36;
      const frames = folderFanLayout(
          { x: w / 2 - 30, y: h - 24, width: 60 },
          items,
        ),
        values = [...frames.values()];
      if (!values.length) return;
      const minX = Math.min(...values.map((p) => p.x)),
        maxX = Math.max(...values.map((p) => p.x + p.width)),
        minY = Math.min(...values.map((p) => p.y));
      const scale = Math.max(
        0.05,
        Math.min(1, (w - 24) / (maxX - minX), (h - 35) / (h - 24 - minY)),
      );
      let remaining = items.length;
      for (const item of items) {
        const node = nodes.current.get(item.id);
        if (!node) continue;
        const p = frames.get(item.id)!;
        const closed = { x: w / 2 - p.width * 0.12, y: h - 55, scale: 0.24 };
        let motion = motions.current.get(item.id);
        if (!motion) {
          motion = createPositionMotion(node, closed);
          motions.current.set(item.id, motion);
        }
        motion.to(
          open
            ? {
                x: w / 2 + (p.x - w / 2) * scale,
                y: h - 24 + (p.y - (h - 24)) * scale,
                scale,
              }
            : closed,
          matchMedia("(prefers-reduced-motion: reduce)").matches,
          {
            spring: containerSpring(open ? "unfold" : "refold"),
            onFinish: () => {
              if (--remaining === 0) onSettled?.(open);
            },
          },
        );
      }
      for (const [key, motion] of motions.current)
        if (!frames.has(key)) {
          motion.dispose();
          motions.current.delete(key);
        }
    };
    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(root.current!);
    return () => observer.disconnect();
  }, [open, items.map((i) => `${i.id}:${i.width}:${i.height}`).join("|")]);
  useLayoutEffect(
    () => () => {
      motions.current.forEach((m) => m.dispose());
      motions.current.clear();
    },
    [],
  );
  return (
    <div
      ref={root}
      className={`roc-source-tray ${className}`}
      style={style}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <div id={id} className="roc-tray-layer" inert={!open} aria-hidden={!open}>
        {items.map((item) => (
          <div
            key={item.id}
            ref={(node) => {
              if (node) nodes.current.set(item.id, node);
              else nodes.current.delete(item.id);
            }}
            data-tray-id={item.id}
            className="roc-tray-item"
            style={{ width: item.width, height: item.height }}
          >
            {item.content}
          </div>
        ))}
      </div>
      <button
        ref={button}
        className="roc-tray-toggle"
        type="button"
        aria-controls={id}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? closeLabel : label} <span>{items.length}</span>
      </button>
    </div>
  );
}
