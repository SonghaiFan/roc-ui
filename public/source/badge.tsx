// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "radix-ui";

const badgeVariants = cva("roc-ui roc-ui-badge", {
  variants: {
    variant: {
      default: "roc-ui-badge-variant-default",
      secondary: "roc-ui-badge-variant-secondary",
      destructive: "roc-ui-badge-variant-destructive",
      outline: "roc-ui-badge-variant-outline",
      ghost: "roc-ui-badge-variant-ghost",
      link: "roc-ui-badge-variant-link",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn("roc-ui", badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

import "./badge.css";
