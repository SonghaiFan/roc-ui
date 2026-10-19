"use client";
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import "./folder-fan.css";
import { createFolderLidMotion, folderItemMotion } from "./folder-motion";
import { createPositionMotion, type PositionMotion } from "./franklin-react-motion-position";
import { boundsOf, folderFanLayout, folderPocket } from "./franklin-react-core-containers";
import type { BoardItem } from "./franklin-react-core-types";
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
  /** @deprecated The shared Board layout determines card spacing. */
  spread?: number;
  direction?: "up" | "right";
  material?: "paper" | "glass";
  color?: string;
  /** @deprecated Motion now uses the shared Franklin spring profiles. */
  duration?: number;
  trigger?: "press" | "hover";
}
/** One retained card tree, using the same layout and springs as BoardFolder.
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
  spread: _spread,
  direction = "up",
  material = "glass",
  color = "var(--roc-secondary, #2563eb)",
  duration: _duration,
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
  const nodes = useRef(new Map<string, HTMLButtonElement>());
  const world = useRef<HTMLDivElement>(null), lid = useRef<HTMLButtonElement>(null);
  const latest = useRef({ items, open, side }); latest.current = { items, open, side };
  const sync = useRef<(() => void) | null>(null);
  useLayoutEffect(() => {
    const host = root.current!, scene = world.current!, cover = lid.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const motions = new Map<string, PositionMotion>();
    const destinations = new Map<string, string>();
    let lidMotion = createFolderLidMotion(cover, latest.current.open ? 20 : 0, latest.current.side);
    const camera = createPositionMotion(scene, { x: 0, y: 0, scale: 1 }, pose => {
      scene.style.transform = `translate(${pose.x}px, ${pose.y}px) scale(${pose.scale})`;
    });
    let mounted = false, previousOpen = latest.current.open, previousSide = latest.current.side;
    sync.current = () => {
      const state = latest.current;
      const folder: BoardItem = { id: "folder", type: "folder", x: 0, y: 0, width: 228, height: 176, data: {} };
      const cards: BoardItem[] = state.items.map(item => ({ id: item.id, type: "card", x: 0, y: 0, width: 118, height: 152, data: {} }));
      const fan = folderFanLayout(folder, cards);
      const poses = cards.map((item, index) => {
        const pose = state.open ? fan.get(item.id)! : folderPocket(item, folder, index);
        // Side-opening folders rotate the same local arrangement around the pocket.
        if (state.side && state.open) return { ...pose, x: folder.width + 24 + Math.max(0, -pose.y - item.height), y: pose.x + item.width / 2 - item.height / 2 };
        return pose;
      });
      const bounds = boundsOf([folder, ...cards.map((item,index) => ({ ...item, ...poses[index] }))])!;
      const scale = Math.min(1, Math.max(1, host.clientWidth - 48) / bounds.width, Math.max(1, host.clientHeight - 48) / bounds.height);
      const target = { x: host.clientWidth / 2 - (bounds.x + bounds.width / 2) * scale, y: host.clientHeight / 2 - (bounds.y + bounds.height / 2) * scale, scale };
      if (mounted && previousOpen !== state.open) camera.to(target, reduced.matches); else camera.set(target);
      const ids = new Set(cards.map(item => item.id));
      for (const [key, motion] of motions) if (!ids.has(key)) { motion.dispose(); motions.delete(key); destinations.delete(key); }
      cards.forEach((item,index) => {
        const node = nodes.current.get(item.id); if (!node) return;
        let motion = motions.get(item.id);
        const destination = JSON.stringify(poses[index]);
        if (!motion) { motion = createPositionMotion(node, poses[index]); motions.set(item.id, motion); }
        else if (destinations.get(item.id) !== destination) motion.to(poses[index], reduced.matches, folderItemMotion(state.open));
        destinations.set(item.id, destination);
      });
      if (previousSide !== state.side) { lidMotion.dispose(); lidMotion = createFolderLidMotion(cover, state.open ? 20 : 0, state.side); }
      lidMotion.to(state.open ? 20 : 0, reduced.matches);
      previousOpen = state.open; previousSide = state.side; mounted = true;
    };
    sync.current();
    const resize = new ResizeObserver(() => sync.current?.()); resize.observe(host);
    const preference = () => { if (reduced.matches) { motions.forEach(motion => motion.finish()); camera.finish(); lidMotion.finish(); } };
    reduced.addEventListener("change", preference);
    return () => { resize.disconnect(); reduced.removeEventListener("change", preference); motions.forEach(motion => motion.dispose()); camera.dispose(); lidMotion.dispose(); sync.current = null; };
  }, []);
  useLayoutEffect(() => { sync.current?.(); });
  return (
    <div
      ref={root}
      data-direction={direction}
      data-material={material}
      className={`roc-folder ${open ? "is-open" : ""} ${className}`}
      style={
        {
          "--folder-color": color,
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
      <div className="roc-folder-world" ref={world}>
      <div className="roc-folder-back" aria-hidden="true" />
      <div
        id={id}
        className="roc-folder-items"
        inert={!open}
        aria-hidden={!open}
      >
        {items.map((item, index) => {
          return (
            <button
              type="button"
              key={item.id}
              ref={node => { if (node) nodes.current.set(item.id, node); else nodes.current.delete(item.id); }}
              data-roc-item
              className="roc-folder-card"
              onClick={() => onSelect?.(item.id)}
              style={{
                background: item.color,
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
        ref={lid}
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
    </div>
  );
}
