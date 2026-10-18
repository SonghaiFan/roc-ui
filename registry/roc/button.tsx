// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Button as AnimatedButton } from "@animate-ui/react/primitives/buttons/button";

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
  const Comp: React.ElementType = AnimatedButton;

  return (
    <Comp
      asChild={asChild}
      tapScale={disabled || pending ? 1 : 0.97}
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
          <span
            aria-hidden={pending}
            data-state={pending ? "inactive" : "active"}
          >
            {children}
          </span>
          <span
            aria-hidden={!pending}
            data-state={pending ? "active" : "inactive"}
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
