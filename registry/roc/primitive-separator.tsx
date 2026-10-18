"use client";
// ROC primitive: a visual or semantic divider.
import * as React from "react";
import { Slot } from "./primitive-slot";

type RootProps = React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
  /** Purely visual: removed from the accessibility tree. */
  decorative?: boolean;
  asChild?: boolean;
};

function Root({
  orientation: requested = "horizontal",
  decorative,
  asChild,
  ...props
}: RootProps) {
  const orientation = requested === "vertical" ? "vertical" : "horizontal";
  const Comp: React.ElementType = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-orientation={orientation}
      {...(decorative
        ? { role: "none" }
        : {
            role: "separator",
            "aria-orientation": orientation === "vertical" ? "vertical" : undefined,
          })}
      {...props}
    />
  );
}

export const Separator = { Root };
