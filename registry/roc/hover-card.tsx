// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
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
            "roc-s-3eef1ce97dba roc-s-72b37c1a040d roc-s-f7df1783a7f8 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-e593c38256e0 roc-s-99df86594a98 roc-s-5bd2afe89f0b roc-s-94ea94fde25f roc-s-59edd3d33673 roc-s-89f6aab7a3f8 roc-s-3550f48d66b9 roc-s-7720fe004f5c roc-s-66b560f839de roc-s-0cb4489c3645 roc-s-bb5869ef903b roc-s-f4cf4be63707 roc-s-bae1e782f277 roc-s-45464a92c1f6 roc-s-9ca352480f25",
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
