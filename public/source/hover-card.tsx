// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { HoverCard as HoverCardPrimitive } from "./primitive-hover-card";
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-z-50 roc-u-w-64 roc-u-origin-(--radix-hover-card-content-transform-origin) roc-u-rounded-md roc-u-border roc-u-bg-popover roc-u-p-4 roc-u-text-popover-foreground roc-u-shadow-md roc-u-outline-hidden roc-u-data-[side=bottom]:slide-in-from-top-2 roc-u-data-[side=left]:slide-in-from-right-2 roc-u-data-[side=right]:slide-in-from-left-2 roc-u-data-[side=top]:slide-in-from-bottom-2 roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:fade-out-0 roc-u-data-[state=closed]:zoom-out-95 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:fade-in-0 roc-u-data-[state=open]:zoom-in-95",
            className,
          ),
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
export { HoverCard, HoverCardTrigger, HoverCardContent };

import "./hover-card.css";
