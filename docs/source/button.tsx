// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "radix-ui";

const buttonVariants = cva("roc-ui roc-ui-button", {
  variants: {
    variant: {
      default: "roc-ui-button-variant-default",
      destructive: "roc-ui-button-variant-destructive",
      outline: "roc-ui-button-variant-outline",
      secondary: "roc-ui-button-variant-secondary",
      ghost: "roc-ui-button-variant-ghost",
      link: "roc-ui-button-variant-link",
    },
    size: {
      default: "roc-ui-button-size-default",
      xs: "roc-ui-button-size-xs",
      sm: "roc-ui-button-size-sm",
      lg: "roc-ui-button-size-lg",
      icon: "roc-ui-button-size-icon",
      "icon-xs": "roc-ui-button-size-icon-xs",
      "icon-sm": "roc-ui-button-size-icon-sm",
      "icon-lg": "roc-ui-button-size-icon-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  type,
  children,
  disabled,
  pending = false,
  pendingLabel,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    pending?: boolean;
    pendingLabel?: React.ReactNode;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      type={asChild ? type : (type ?? "button")}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn("roc-ui", buttonVariants({ variant, size, className }))}
      {...props}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
    >
      {asChild || pendingLabel === undefined ? (
        children
      ) : (
        <span className="roc-ui-button-label">
          <span style={{ visibility: pending ? "hidden" : undefined }}>
            {children}
          </span>
          <span
            aria-hidden={!pending}
            style={{ visibility: pending ? undefined : "hidden" }}
          >
            {pendingLabel}
          </span>
        </span>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };

import "./button.css";
