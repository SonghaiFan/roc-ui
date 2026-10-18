// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { cn } from "./utils";
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-pointer-events-none roc-u-inline-flex roc-u-h-5 roc-u-w-fit roc-u-min-w-5 roc-u-items-center roc-u-justify-center roc-u-gap-1 roc-u-rounded-sm roc-u-bg-muted roc-u-px-1 roc-u-font-sans roc-u-text-xs roc-u-font-medium roc-u-text-muted-foreground roc-u-select-none",
          "roc-u-[&_svg:not([class*='size-'])]:size-3",
          "roc-u-[[data-slot=tooltip-content]_&]:bg-background/20 roc-u-[[data-slot=tooltip-content]_&]:text-background roc-u-dark:[[data-slot=tooltip-content]_&]:bg-background/10",
          className,
        ),
      )}
      {...props}
    />
  );
}
function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-inline-flex roc-u-items-center roc-u-gap-1",
          className,
        ),
      )}
      {...props}
    />
  );
}
export { Kbd, KbdGroup };

import "./kbd.css";
