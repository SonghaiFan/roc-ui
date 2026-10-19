"use client";
import { useRef, useState, type ComponentProps } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRocReducedMotion, useRocTransition } from "./motion-config";
import { cn } from "./utils";
import "./motion-effects.css";

export type EffectKind = "fade" | "slide" | "blur" | "zoom" | "highlight" | "shine" | "click" | "tilt" | "magnetic" | "particles";
export type EffectProps = Omit<ComponentProps<"div">, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> & {
  active?: boolean; effect?: EffectKind; distance?: number;
};
/** Retains the caller's subtree. `active` changes presentation, never presence. */
export function Effect({ active = true, effect = "fade", distance = 18, className, children, ...props }: EffectProps) {
  const reduce = useRocReducedMotion(), transition = useRocTransition();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const moving = !reduce && (effect === "magnetic" || effect === "tilt");
  const point = moving ? pointer : { x: 0, y: 0 };
  const animate = {
    opacity: active || !["fade", "blur", "slide", "zoom"].includes(effect) ? 1 : 0.28,
    x: effect === "magnetic" ? point.x * 0.15 : 0,
    y: !reduce && effect === "slide" && !active ? distance : effect === "magnetic" ? point.y * 0.15 : 0,
    scale: !reduce && ((effect === "zoom" && !active) || (effect === "click" && active)) ? 0.94 : 1,
    rotateX: moving && effect === "tilt" ? -point.y * 0.12 : 0,
    rotateY: moving && effect === "tilt" ? point.x * 0.12 : 0,
    filter: effect === "blur" && !active && !reduce ? "blur(5px)" : "blur(0px)",
    backgroundColor: effect === "highlight" && active ? "var(--roc-marker, #ededed)" : "transparent",
  };
  return <motion.div {...props} className={cn("roc-ui roc-effect", className)} initial={false} animate={animate} transition={transition}
    data-effect={effect} data-active={active} style={{ perspective: 800, ...props.style }}
    onPointerMove={e => {
      props.onPointerMove?.(e);
      if (e.defaultPrevented || !moving || e.pointerType !== "mouse" || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const box = e.currentTarget.getBoundingClientRect();
      setPointer({ x: e.clientX - box.left - box.width / 2, y: e.clientY - box.top - box.height / 2 });
    }} onPointerLeave={e => { props.onPointerLeave?.(e); setPointer({ x: 0, y: 0 }); }}>
    {children}
    {effect === "shine" && <motion.span aria-hidden="true" className="roc-effect-shine" initial={false} animate={{ x: active && !reduce ? "240%" : "-140%" }} transition={{ duration: reduce ? 0 : 0.65 }} />}
    {effect === "particles" && <span aria-hidden="true" className="roc-effect-particles">{Array.from({ length: 10 }, (_, i) => <motion.i key={i} initial={false} animate={{ x: active && !reduce ? [0, Math.cos(i * Math.PI / 5) * 58] : 0, y: active && !reduce ? [0, Math.sin(i * Math.PI / 5) * 40] : 0, opacity: active && !reduce ? [0, 0.8, 0] : 0, scale: active && !reduce ? [0, 1, 0.4] : 0 }} transition={{ type: "tween", duration: reduce ? 0 : 0.65 }} />)}</span>}
  </motion.div>;
}
export function Fade(props: EffectProps) { return <Effect {...props} effect="fade" />; }
export function Slide(props: EffectProps) { return <Effect {...props} effect="slide" />; }
export function Blur(props: EffectProps) { return <Effect {...props} effect="blur" />; }
export function Zoom(props: EffectProps) { return <Effect {...props} effect="zoom" />; }
export function Highlight(props: EffectProps) { return <Effect {...props} effect="highlight" />; }
export function Shine(props: EffectProps) { return <Effect {...props} effect="shine" />; }
export function Click(props: EffectProps) { return <Effect {...props} effect="click" />; }
export function Tilt(props: EffectProps) { return <Effect {...props} effect="tilt" />; }
export function Magnetic(props: EffectProps) { return <Effect {...props} effect="magnetic" />; }
export function Particles(props: EffectProps) { return <Effect {...props} effect="particles" />; }
export function ScrollFade({ children, className, ...props }: ComponentProps<"div">) {
  const target = useRef<HTMLDivElement>(null), reduce = useRocReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  return <motion.div {...props as object} ref={target} className={cn("roc-ui", className)} style={{ ...props.style, opacity: reduce ? 1 : opacity }}>{children}</motion.div>;
}
export function ImageZoom({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [zoomed, setZoomed] = useState(false), reduce = useRocReducedMotion(), transition = useRocTransition();
  return <button type="button" className={cn("roc-ui roc-image-zoom", className)} aria-label={`${zoomed ? "Zoom out of" : "Zoom into"} ${alt}`} aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>
    <motion.img src={src} alt={alt} initial={false} animate={{ scale: zoomed && !reduce ? 1.6 : 1 }} transition={transition} />
    <span>{zoomed ? "−" : "+"}</span>
  </button>;
}
export function ThemeToggler({ dark, children, className }: ComponentProps<"div"> & { dark: boolean }) {
  const transition = useRocTransition();
  return <motion.div className={cn("roc-ui roc-theme-surface", className)} initial={false} animate={{ backgroundColor: dark ? "#252525" : "#fafafa", color: dark ? "#fafafa" : "#252525" }} transition={transition}>{children}</motion.div>;
}
