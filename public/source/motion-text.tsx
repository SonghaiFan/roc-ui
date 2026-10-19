"use client";
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { useRocReducedMotion, useRocTransition } from "./motion-config";
import { cn } from "./utils";
import "./motion-text.css";
import { GradientText as AnimateGradientText } from "@animate-ui/react/primitives/texts/gradient";
import { HighlightText as AnimateHighlightText } from "@animate-ui/react/primitives/texts/highlight";
import { MorphingText as AnimateMorphingText } from "@animate-ui/react/primitives/texts/morphing";
import { RollingText as AnimateRollingText } from "@animate-ui/react/primitives/texts/rolling";
import { ShimmeringText as AnimateShimmeringText } from "@animate-ui/react/primitives/texts/shimmering";
import { SlidingText as AnimateSlidingText } from "@animate-ui/react/primitives/texts/sliding";
import { SplittingText as AnimateSplittingText } from "@animate-ui/react/primitives/texts/splitting";
import { SwappingText as AnimateSwappingText } from "@animate-ui/react/primitives/texts/swapping";
import { TypingText as AnimateTypingText } from "@animate-ui/react/primitives/texts/typing";
import { RotatingText as AnimateRotatingText, RotatingTextContainer } from "@animate-ui/react/primitives/texts/rotating";

// Motion is supplied by the installed Animate UI package; ROC owns the host styling
// and the existing children/active API. No upstream source is vendored here.
export type TextMotionProps = Omit<ComponentProps<"span">, "children"> & { children: string; active?: boolean };
function TextFrame({ children, active = true, className, effect, render, retain = false, ...props }: TextMotionProps & {
  effect: string; retain?: boolean; render: (text: string) => ReactNode;
}) {
  const reduce = useRocReducedMotion();
  return <span {...props} className={cn("roc-ui roc-motion-text", className)} data-text-effect={effect} data-active={active && !reduce}>
    {(active || retain) && !reduce ? render(children) : children}
  </span>;
}
export function GradientText(props: TextMotionProps) {
  return <TextFrame {...props} effect="gradient" render={text => <AnimateGradientText text={text} gradient="linear-gradient(90deg, var(--roc-ink, #222), var(--roc-accent, #777), #aaa, var(--roc-accent, #777), var(--roc-ink, #222))" />} />;
}
export function HighlightText(props: TextMotionProps) {
  return <TextFrame {...props} effect="highlight" render={text => <AnimateHighlightText text={text} style={{ backgroundImage: "linear-gradient(var(--roc-marker, #e5e5e5), var(--roc-marker, #e5e5e5))" }} />} />;
}
export function MorphingText(props: TextMotionProps) {
  return <TextFrame {...props} effect="morphing" retain render={text => <AnimateMorphingText text={text} />} />;
}
export function RollingText(props: TextMotionProps) {
  return <TextFrame {...props} effect="rolling" render={text => <AnimateRollingText text={text} />} />;
}
export function RotatingText(props: TextMotionProps) {
  return <TextFrame {...props} effect="rotating" retain render={text => <RotatingTextContainer text={text} style={{ display: "inline-block", verticalAlign: "bottom" }}><AnimateRotatingText /></RotatingTextContainer>} />;
}
export function ShimmeringText(props: TextMotionProps) {
  return <TextFrame {...props} effect="shimmering" render={text => <AnimateShimmeringText text={text} color="var(--roc-ink, #222)" shimmeringColor="var(--roc-muted, #999)" />} />;
}
export function SlidingText(props: TextMotionProps) {
  return <TextFrame {...props} effect="sliding" render={text => <AnimateSlidingText text={text} trigger="hover" tabIndex={0} />} />;
}
export function SplittingText(props: TextMotionProps) {
  return <TextFrame {...props} effect="splitting" render={text => <AnimateSplittingText text={text} style={{ display: "inline" }} />} />;
}
export function SwappingText(props: TextMotionProps) {
  return <TextFrame {...props} effect="swapping" retain render={text => <AnimateSwappingText text={text} />} />;
}
export function TypingText({ speed = 45, ...props }: TextMotionProps & { speed?: number }) {
  return <TextFrame {...props} effect="typing" render={text => <span className="roc-typing-frame"><span aria-hidden="true" className="roc-typing-reserve">{text}</span><AnimateTypingText className="roc-typing-visible" text={text} duration={Math.max(16, speed)} /></span>} />;
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
