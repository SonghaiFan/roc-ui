// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "./primitive-slot";
import { Separator } from "./separator";
function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/item-group roc-u-flex roc-u-flex-col",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("roc-shadcn", cn("roc-u-my-0", className))}
      {...props}
    />
  );
}
const itemVariants = cva(
  "roc-u-group/item roc-u-flex roc-u-flex-wrap roc-u-items-center roc-u-rounded-md roc-u-border roc-u-border-transparent roc-u-text-sm roc-u-transition-colors roc-u-duration-100 roc-u-outline-none roc-u-focus-visible:border-ring roc-u-focus-visible:ring-[3px] roc-u-focus-visible:ring-ring/50 roc-u-[a]:transition-colors roc-u-[a]:hover:bg-accent/50",
  {
    variants: {
      variant: {
        default: "roc-u-bg-transparent",
        outline: "roc-u-border-border",
        muted: "roc-u-bg-muted/50",
      },
      size: {
        default: "roc-u-gap-4 roc-u-p-4",
        sm: "roc-u-gap-2.5 roc-u-px-4 roc-u-py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(
        "roc-shadcn",
        cn(itemVariants({ variant, size, className })),
      )}
      {...props}
    />
  );
}
const itemMediaVariants = cva(
  "roc-u-flex roc-u-shrink-0 roc-u-items-center roc-u-justify-center roc-u-gap-2 roc-u-group-has-[[data-slot=item-description]]/item:translate-y-0.5 roc-u-group-has-[[data-slot=item-description]]/item:self-start roc-u-[&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "roc-u-bg-transparent",
        icon: "roc-u-size-8 roc-u-rounded-sm roc-u-border roc-u-bg-muted roc-u-[&_svg:not([class*='size-'])]:size-4",
        image:
          "roc-u-size-10 roc-u-overflow-hidden roc-u-rounded-sm roc-u-[&_img]:size-full roc-u-[&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(itemMediaVariants({ variant, className })),
      )}
      {...props}
    />
  );
}
function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-flex-1 roc-u-flex-col roc-u-gap-1 roc-u-[&+[data-slot=item-content]]:flex-none",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-w-fit roc-u-items-center roc-u-gap-2 roc-u-text-sm roc-u-leading-snug roc-u-font-medium",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-line-clamp-2 roc-u-text-sm roc-u-leading-normal roc-u-font-normal roc-u-text-balance roc-u-text-muted-foreground",
          "roc-u-[&>a]:underline roc-u-[&>a]:underline-offset-4 roc-u-[&>a:hover]:text-primary",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-items-center roc-u-gap-2",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-basis-full roc-u-items-center roc-u-justify-between roc-u-gap-2",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-basis-full roc-u-items-center roc-u-justify-between roc-u-gap-2",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};

import "./item.css";
