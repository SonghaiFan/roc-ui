"use client";
import * as React from "react";
import { Button } from "@base-ui/react/button";
import { Slot } from "./primitive-slot";
import { motion } from "motion/react";
import { useRocReducedMotion, useRocTransition } from "./motion-config";

export function Pressable({ asChild, tapScale = 0.97, children, ...props }:
  React.ComponentProps<"button"> & { asChild?: boolean; tapScale?: number }) {
  const reduce = useRocReducedMotion();
  const transition = useRocTransition("control");
  if (asChild && React.isValidElement(children)) {
    const { disabled, onClick, ...childProps } = props;
    return <Slot.Root {...childProps} aria-disabled={disabled || undefined} onClick={event => {
      if (disabled) { event.preventDefault(); return; }
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    }}>{children}</Slot.Root>;
  }
  return <Button {...props} render={<motion.button whileTap={props.disabled || reduce ? undefined : { scale: tapScale }} transition={transition} />}>{children}</Button>;
}
