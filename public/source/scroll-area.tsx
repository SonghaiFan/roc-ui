// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
"use client";
import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "./primitive-scroll-area";
import { cn } from "./utils";
type ViewportProps = React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>;
function ScrollArea({
  className,
  children,
  viewportProps,
  scrollbars = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  viewportProps?: ViewportProps;
  scrollbars?: "vertical" | "horizontal" | "both";
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("roc-ui", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        tabIndex={0}
        {...viewportProps}
        data-slot="scroll-area-viewport"
        className={cn("roc-ui", viewportProps?.className)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {scrollbars !== "horizontal" && <ScrollBar orientation="vertical" />}
      {scrollbars !== "vertical" && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn("roc-ui", className)}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="roc-ui"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}
export { ScrollArea, ScrollBar };

import "./scroll-area.css";
