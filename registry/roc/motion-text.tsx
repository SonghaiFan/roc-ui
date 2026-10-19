"use client";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { useRocReducedMotion, useRocTransition } from "./motion-config";
import { cn } from "./utils";
import "./motion-text.css";

type TextKind = "gradient" | "highlight" | "morphing" | "rolling" | "rotating" | "shimmering" | "sliding" | "splitting" | "swapping";
export type TextMotionProps = Omit<ComponentProps<"span">, "children"> & { children: string; active?: boolean };
export function MotionText({ children, active = true, effect, className, ...props }: TextMotionProps & { effect: TextKind }) {
  const reduce = useRocReducedMotion(), transition = useRocTransition();
  const split = ["splitting", "rolling"].includes(effect);
  return <span {...props} className={cn("roc-ui roc-motion-text", className)} data-text-effect={effect} data-active={active && !reduce}>
    <span className="roc-ui-sr-only">{children}</span>
    <span aria-hidden="true" className="roc-text-visual">
      {split ? Array.from(children).map((char, i) => <motion.span className="roc-text-letter" key={i} initial={false}
        animate={{ y: active || reduce ? 0 : 16, opacity: active || reduce ? 1 : 0.35, rotateX: effect === "rolling" && !active && !reduce ? 80 : 0 }}
        transition={{ ...transition, delay: reduce ? 0 : i * 0.018 }}>{char === " " ? "\u00a0" : char}</motion.span>) :
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={effect === "sliding" ? `${children}-${active}` : children} initial={reduce ? false : { opacity: 0, y: (effect === "swapping" || effect === "sliding") ? 14 : 0, rotateX: effect === "rotating" ? -80 : 0, filter: effect === "morphing" ? "blur(8px)" : "blur(0px)" }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={transition}>{children}</motion.span>
        </AnimatePresence>}
    </span>
  </span>;
}
export function GradientText(props: TextMotionProps) { return <MotionText {...props} effect="gradient" />; }
export function HighlightText(props: TextMotionProps) { return <MotionText {...props} effect="highlight" />; }
export function MorphingText(props: TextMotionProps) { return <MotionText {...props} effect="morphing" />; }
export function RollingText(props: TextMotionProps) { return <MotionText {...props} effect="rolling" />; }
export function RotatingText(props: TextMotionProps) { return <MotionText {...props} effect="rotating" />; }
export function ShimmeringText(props: TextMotionProps) { return <MotionText {...props} effect="shimmering" />; }
export function SlidingText(props: TextMotionProps) { return <MotionText {...props} effect="sliding" />; }
export function SplittingText(props: TextMotionProps) { return <MotionText {...props} effect="splitting" />; }
export function SwappingText(props: TextMotionProps) { return <MotionText {...props} effect="swapping" />; }
export function TypingText({ children, active = true, speed = 45, className, ...props }: TextMotionProps & { speed?: number }) {
  const reduce = useRocReducedMotion();
  const characters = Array.from(children);
  const [length, setLength] = useState(characters.length);
  useEffect(() => {
    if (!active || reduce) { setLength(Array.from(children).length); return; }
    setLength(0);
    const timer = setInterval(() => setLength(n => {
      if (n + 1 >= Array.from(children).length) clearInterval(timer);
      return Math.min(n + 1, Array.from(children).length);
    }), Math.max(16, speed));
    return () => clearInterval(timer);
  }, [children, active, speed, reduce]);
  return <span {...props} className={cn("roc-ui roc-typing-text", className)}><span className="roc-ui-sr-only">{children}</span><span aria-hidden="true" className="roc-typing-reserve">{children}</span><span aria-hidden="true" className="roc-typing-visible">{characters.slice(0, length).join("")}</span></span>;
}
export type NumberMotionProps = Omit<ComponentProps<"span">, "children"> & { value: number; decimals?: number; duration?: number };
export function CountingNumber({ value, decimals = 0, duration = 0.65, className, ...props }: NumberMotionProps) {
  const reduce = useRocReducedMotion(), number = useMotionValue(value), visible = useRef<HTMLSpanElement>(null);
  const places = Math.min(6, Math.max(0, decimals));
  const initialText = useRef(value.toFixed(places));
  useEffect(() => {
    const render = (n: number) => { if (visible.current) visible.current.textContent = n.toFixed(places); };
    render(number.get());
    const off = number.on("change", render);
    const control = animate(number, value, { duration: reduce ? 0 : Math.max(0, duration), ease: "easeOut" });
    return () => { off(); control.stop(); };
  }, [value, places, duration, number, reduce]);
  return <span {...props} className={cn("roc-ui roc-motion-number", className)}><span className="roc-ui-sr-only">{value.toFixed(places)}</span><span aria-hidden="true" ref={visible}>{initialText.current}</span></span>;
}
export function ScrollingNumber({ value, decimals = 0, className, ...props }: NumberMotionProps) {
  const transition = useRocTransition("control");
  const text = value.toFixed(Math.min(6, Math.max(0, decimals)));
  return <span {...props} className={cn("roc-ui roc-motion-number", className)}><span className="roc-ui-sr-only">{text}</span><span aria-hidden="true" className="roc-number-digits">{Array.from(text).map((digit, i) => /\d/.test(digit) ? <span key={text.length - i} className="roc-number-window"><motion.span initial={false} animate={{ y: `${Number(digit) * -10}%` }} transition={transition}>{Array.from({ length: 10 }, (_, n) => <span key={n}>{n}</span>)}</motion.span></span> : <span key={text.length - i}>{digit}</span>)}</span></span>;
}
export function SlidingNumber({ value, decimals = 0, className, ...props }: NumberMotionProps) {
  const reduce = useRocReducedMotion(), transition = useRocTransition();
  const text = value.toFixed(Math.min(6, Math.max(0, decimals)));
  return <span {...props} className={cn("roc-ui roc-motion-number roc-number-slide", className)}><span className="roc-ui-sr-only">{text}</span><span aria-hidden="true"><AnimatePresence initial={false} mode="popLayout"><motion.span key={text} initial={{ y: reduce ? 0 : "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduce ? 0 : "-100%", opacity: 0 }} transition={transition}>{text}</motion.span></AnimatePresence></span></span>;
}
