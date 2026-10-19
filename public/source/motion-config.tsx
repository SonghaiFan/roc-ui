"use client";
import { type ReactNode } from "react";
import { AnimateUIProvider } from "@animate-ui/react/provider";
import { motionTokens, useShouldReduceMotion, useTempoTransition, type CheckAnimation, type ReducedMotion } from "@animate-ui/react/utils/motion";
import { MotionConfig, type Transition } from "motion/react";

/** ROC's public defaults feed the same provider used by every Animate UI primitive. */
export function RocMotionProvider({ children, pace, reducedMotion, checkAnimation }: {
  children: ReactNode; pace?: number; reducedMotion?: ReducedMotion; checkAnimation?: CheckAnimation;
}) {
  return <AnimateUIProvider tempo={pace === undefined ? undefined : Math.max(0.1, pace)} reducedMotion={reducedMotion} checkAnimation={checkAnimation}>
    <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
  </AnimateUIProvider>;
}
/** For ROC-only compositions; timings and tempo come from Animate UI. */
export function useRocTransition(kind: "control" | "surface" = "surface"): Transition {
  const transition = useTempoTransition(kind === "control" ? motionTokens.spring.thumb : motionTokens.spring.dialog);
  const reduce = useRocReducedMotion();
  return reduce ? { duration: 0 } : transition;
}
export const useRocReducedMotion = useShouldReduceMotion;
