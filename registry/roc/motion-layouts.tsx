"use client";
import { Children, isValidElement, useState, type ComponentProps, type ReactNode, type RefObject } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Button } from "./button";
import { useRocReducedMotion, useRocTransition } from "./motion-config";
import { cn } from "./utils";
import "./motion-layouts.css";

export function MotionGrid({ children, className, ...props }: ComponentProps<"div">) {
  const reduce = useRocReducedMotion(), transition = useRocTransition();
  return <div {...props} className={cn("roc-ui roc-motion-grid", className)}>{Children.toArray(children).map((child, index) => <motion.div key={isValidElement(child) ? child.key ?? index : index} layout={!reduce} initial={false} transition={transition}>{child}</motion.div>)}</div>;
}
export function PinnedList({ items, value, onValueChange }: { items: { id: string; label: string; detail?: string }[]; value?: string; onValueChange?: (id: string) => void }) {
  const [local, setLocal] = useState(items[0]?.id);
  const selected = value ?? local, reduce = useRocReducedMotion(), transition = useRocTransition();
  return <div className="roc-ui roc-pinned-list" role="group" aria-label="Pinned items">{items.map(item => <motion.div key={item.id} layout={!reduce} transition={transition} data-selected={item.id === selected}>
    <Button variant="ghost" aria-pressed={item.id === selected} onClick={() => { if (value === undefined) setLocal(item.id); onValueChange?.(item.id); }}>{item.label}</Button>
    <motion.div initial={false} animate={{ height: selected === item.id ? "auto" : 0, opacity: selected === item.id ? 1 : 0 }} transition={transition} inert={selected !== item.id} aria-hidden={selected !== item.id} style={{ overflow: "hidden" }}><p>{item.detail}</p></motion.div>
  </motion.div>)}</div>;
}
export function Spring({ children = "Drag", className }: { children?: ReactNode; className?: string }) {
  const reduce = useRocReducedMotion(), transition = useRocTransition();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return <motion.button type="button" className={cn("roc-ui roc-spring", className)} drag dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }} dragElastic={reduce ? 0 : 0.35} dragSnapToOrigin
    initial={false} animate={offset} transition={transition} aria-label="Spring: drag or use arrow keys to nudge, release to return"
    onKeyDown={e => { const arrows: Record<string, { x: number; y: number }> = { ArrowLeft: { x: -24, y: 0 }, ArrowRight: { x: 24, y: 0 }, ArrowUp: { x: 0, y: -24 }, ArrowDown: { x: 0, y: 24 } }; if (arrows[e.key]) { e.preventDefault(); setOffset(arrows[e.key]); } }}
    onKeyUp={() => setOffset({ x: 0, y: 0 })} onBlur={() => setOffset({ x: 0, y: 0 })}>{children}</motion.button>;
}
export function ScrollProgress({ container, label = "Reading progress" }: { container?: RefObject<HTMLElement | null>; label?: string }) {
  const { scrollYProgress } = useScroll({ container });
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", value => setPercent(Math.round(value * 100)));
  return <div className="roc-ui roc-scroll-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><motion.span style={{ scaleX: scrollYProgress }} /></div>;
}
export function AvatarGroup({ people }: { people: { id: string; name: string; src?: string }[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  return <div className="roc-ui roc-avatar-group" role="group" aria-label="People">{people.map(person => <Button key={person.id} variant="ghost" aria-label={person.name} title={person.name} aria-pressed={selected === person.id} onClick={() => setSelected(selected === person.id ? null : person.id)}>
    {person.src ? <img src={person.src} alt="" /> : <span>{person.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</span>}
  </Button>)}<span role="status">{people.find(p => p.id === selected)?.name}</span></div>;
}
export function Cursor({ children, className }: { children: ReactNode; className?: string }) {
  const [point, setPoint] = useState({ x: 0, y: 0, visible: false });
  const reduce = useRocReducedMotion();
  return <div className={cn("roc-ui roc-cursor-host", className)} onPointerMove={e => {
    if (reduce || e.pointerType !== "mouse" || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const box = e.currentTarget.getBoundingClientRect(); setPoint({ x: e.clientX - box.left, y: e.clientY - box.top, visible: true });
  }} onPointerLeave={() => setPoint(p => ({ ...p, visible: false }))}>{children}<span aria-hidden="true" className="roc-cursor-dot" style={{ translate: `${point.x}px ${point.y}px`, opacity: point.visible ? 1 : 0 }} /></div>;
}
