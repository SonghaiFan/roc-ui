// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "./primitive-slot";
const markerVariants = cva(
  "roc-u-group/marker roc-u-relative roc-u-flex roc-u-min-h-4 roc-u-w-full roc-u-items-center roc-u-gap-2 roc-u-text-left roc-u-text-sm roc-u-text-muted-foreground roc-u-[&_svg:not([class*='size-'])]:size-4 roc-u-[a]:underline roc-u-[a]:underline-offset-3 roc-u-[a]:hover:text-foreground",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "roc-u-before:mr-1 roc-u-before:h-px roc-u-before:min-w-0 roc-u-before:flex-1 roc-u-before:bg-border roc-u-after:ml-1 roc-u-after:h-px roc-u-after:min-w-0 roc-u-after:flex-1 roc-u-after:bg-border",
        border: "roc-u-border-b roc-u-border-border roc-u-pb-2",
      },
    },
  },
);
function Marker({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof markerVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="marker"
      data-variant={variant}
      className={cn("roc-shadcn", cn(markerVariants({ variant, className })))}
      {...props}
    />
  );
}
function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-size-4 roc-u-shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-min-w-0 roc-u-wrap-break-word roc-u-group-data-[variant=separator]/marker:flex-none roc-u-group-data-[variant=separator]/marker:text-center roc-u-*:[a]:underline roc-u-*:[a]:underline-offset-3 roc-u-*:[a]:hover:text-foreground",
          className,
        ),
      )}
      {...props}
    />
  );
}
export { Marker, MarkerIcon, MarkerContent, markerVariants };

import "./marker.css";
