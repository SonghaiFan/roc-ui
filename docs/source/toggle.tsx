// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";
import { cn } from "./utils";
const toggleVariants = cva("roc-ui roc-ui-toggle", {
  variants: {
    variant: {
      default: "roc-ui-toggle-default",
      outline: "roc-ui-toggle-outline",
    },
    size: {
      default: "roc-ui-toggle-default-size",
      sm: "roc-ui-toggle-sm",
      lg: "roc-ui-toggle-lg",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}
export { Toggle, toggleVariants };

import "./toggle.css";
