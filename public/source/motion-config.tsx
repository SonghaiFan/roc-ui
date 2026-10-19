"use client";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { MotionConfig, MotionConfigContext, type Transition } from "motion/react";

const Pace = createContext(1);
const Reduction = createContext<"user" | "always" | "never">("user");
let media: MediaQueryList | undefined;
const query = () => media ??= window.matchMedia("(prefers-reduced-motion: reduce)");
const snapshot = () => typeof window !== "undefined" && query().matches;
const serverSnapshot = () => false;
const subscribe = (notify: () => void) => {
  const preference = query();
  preference.addEventListener("change", notify);
  return () => preference.removeEventListener("change", notify);
};
export function RocMotionProvider({ children, pace = 1, reducedMotion = "user" }: {
  children: ReactNode; pace?: number; reducedMotion?: "user" | "always" | "never";
}) {
  return <Reduction.Provider value={reducedMotion}><Pace.Provider value={Math.max(0.1, pace)}><MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig></Pace.Provider></Reduction.Provider>;
}
export function useRocTransition(kind: "control" | "surface" = "surface"): Transition {
  const pace = useContext(Pace);
  const reduce = useRocReducedMotion();
  if (reduce) return { duration: 0 };
  return kind === "control"
    ? { type: "spring", stiffness: 520 / (pace * pace), damping: 34 / pace }
    : { type: "spring", stiffness: 280 / (pace * pace), damping: 28 / pace };
}
export function useRocReducedMotion() {
  const system = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const mode = useContext(Reduction);
  const config = useContext(MotionConfigContext);
  return mode === "always" || config.reducedMotion === "always" || (mode === "user" && system);
}
