// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "./primitive-slot";
function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-min-w-0 roc-u-flex-col roc-u-gap-2",
          className,
        ),
      )}
      {...props}
    />
  );
}
const bubbleVariants = cva(
  "roc-u-group/bubble roc-u-relative roc-u-flex roc-u-w-fit roc-u-max-w-[80%] roc-u-min-w-0 roc-u-flex-col roc-u-gap-1 roc-u-group-data-[align=end]/message:self-end roc-u-data-[align=end]:self-end roc-u-data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default: "roc-u-*:data-[slot=bubble-content]:bg-primary roc-u-*:data-[slot=bubble-content]:text-primary-foreground roc-u-[&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary: "roc-u-*:data-[slot=bubble-content]:bg-secondary roc-u-*:data-[slot=bubble-content]:text-secondary-foreground roc-u-[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        muted: "roc-u-*:data-[slot=bubble-content]:bg-muted roc-u-[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted:
          "roc-u-*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] roc-u-*:data-[slot=bubble-content]:text-foreground roc-u-dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] roc-u-[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] roc-u-dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
        outline:
          "roc-u-*:data-[slot=bubble-content]:border-border roc-u-*:data-[slot=bubble-content]:bg-background roc-u-[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted roc-u-[&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground roc-u-dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
        ghost:
          "roc-u-border-none roc-u-*:data-[slot=bubble-content]:rounded-none roc-u-*:data-[slot=bubble-content]:bg-transparent roc-u-*:data-[slot=bubble-content]:p-0 roc-u-[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted roc-u-[&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground roc-u-dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
        destructive:
          "roc-u-*:data-[slot=bubble-content]:bg-destructive/10 roc-u-*:data-[slot=bubble-content]:text-destructive roc-u-dark:*:data-[slot=bubble-content]:bg-destructive/20 roc-u-[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 roc-u-dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end";
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn("roc-shadcn", cn(bubbleVariants({ variant }), className))}
      {...props}
    />
  );
}
function BubbleContent({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="bubble-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-w-fit roc-u-max-w-full roc-u-min-w-0 roc-u-overflow-hidden roc-u-rounded-xl roc-u-border roc-u-border-transparent roc-u-px-3 roc-u-py-2 roc-u-text-sm roc-u-leading-relaxed roc-u-wrap-break-word roc-u-group-data-[align=end]/bubble:self-end roc-u-[button]:text-left roc-u-[button,a]:transition-colors roc-u-[button,a]:outline-none roc-u-[button,a]:focus-visible:border-ring roc-u-[button,a]:focus-visible:ring-3 roc-u-[button,a]:focus-visible:ring-ring/50",
          className,
        ),
      )}
      {...props}
    />
  );
}
const bubbleReactionsVariants = cva(
  "roc-u-absolute roc-u-z-10 roc-u-flex roc-u-w-fit roc-u-shrink-0 roc-u-items-center roc-u-justify-center roc-u-gap-1 roc-u-rounded-full roc-u-bg-muted roc-u-px-1.5 roc-u-py-0.5 roc-u-text-sm roc-u-ring-3 roc-u-ring-card roc-u-has-[button]:p-0",
  {
    variants: {
      side: {
        top: "roc-u-top-0 roc-u--translate-y-3/4",
        bottom: "roc-u-bottom-0 roc-u-translate-y-3/4",
      },
      align: {
        start: "roc-u-left-3",
        end: "roc-u-right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  },
);
function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end";
  side?: "top" | "bottom";
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(
        "roc-shadcn",
        cn(bubbleReactionsVariants({ side, align }), className),
      )}
      {...props}
    />
  );
}
export { BubbleGroup, Bubble, BubbleContent, BubbleReactions };

import "./bubble.css";
