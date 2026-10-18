"use client";
// ROC primitive: a label that does not select its text on double click.
import * as React from "react";
import { Slot } from "./primitive-slot";

type RootProps = React.ComponentProps<"label"> & { asChild?: boolean };

function Root({ asChild, onMouseDown, ...props }: RootProps) {
  const Comp: React.ElementType = asChild ? Slot.Root : "label";
  return (
    <Comp
      {...props}
      onMouseDown={(event: React.MouseEvent<HTMLLabelElement>) => {
        if ((event.target as HTMLElement).closest("button, input, select, textarea"))
          return;
        onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }}
    />
  );
}

export const Label = { Root };
