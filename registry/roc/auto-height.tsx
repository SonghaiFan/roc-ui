"use client";
import { motion, type HTMLMotionProps } from "motion/react";
import { useRocTransition } from "./motion-config";
import "./auto-height.css";

/** Motion measures auto height while the caller's subtree stays mounted. */
export function AutoHeight({ style, ...props }: HTMLMotionProps<"div">) {
  const transition = useRocTransition();
  return <motion.div initial={false} transition={transition} {...props} style={{ overflow: "hidden", ...style }} />;
}
