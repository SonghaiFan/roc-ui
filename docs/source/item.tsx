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
          "roc-s-c283bdcd73f0 roc-s-222f930b8752 roc-s-302c0d124a94",
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
      className={cn("roc-shadcn", cn("roc-s-4f43e31e043e", className))}
      {...props}
    />
  );
}
const itemVariants = cva(
  "roc-s-e072114ac035 roc-s-222f930b8752 roc-s-faa8a23c68f6 roc-s-71556df3b421 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-e9c0d2f3599e roc-s-c74ab393b96d roc-s-eae178841c68 roc-s-aa96ad346e97 roc-s-b30fc56058b6 roc-s-b906a32b31ee roc-s-365a4654f7b1 roc-s-392a26f4c1b0 roc-s-3d5f796096d0 roc-s-2801b7aeff18",
  {
    variants: {
      variant: {
        default: "roc-s-8fca9236d191",
        outline: "roc-s-b1e6016d4f99",
        muted: "roc-s-44de6d2f7d5f",
      },
      size: {
        default: "roc-s-90fc3ec35a37 roc-s-99df86594a98",
        sm: "roc-s-08f0549eb630 roc-s-9513b3968002 roc-s-d3cea061f2f3",
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
  "roc-s-222f930b8752 roc-s-27ead27a81df roc-s-71556df3b421 roc-s-a503dd374cca roc-s-074569488cca roc-s-c4124515fdee roc-s-741676090dcd roc-s-bcae9d37090c",
  {
    variants: {
      variant: {
        default: "roc-s-8fca9236d191",
        icon: "roc-s-ebd37e04d422 roc-s-02e603944040 roc-s-4f1a55de40bc roc-s-87ecb59f2d2d roc-s-eb5ef2dbc2d4",
        image:
          "roc-s-d0a383a9c24f roc-s-d5111d0e9f48 roc-s-02e603944040 roc-s-2f1350a1d279 roc-s-229ebfc9a355",
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
          "roc-s-222f930b8752 roc-s-7bd5bab6d7f4 roc-s-302c0d124a94 roc-s-19e97f3f40e6 roc-s-00840773681c",
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
          "roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-71556df3b421 roc-s-074569488cca roc-s-c74ab393b96d roc-s-4c3c66460268 roc-s-daaac3fbf55e",
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
          "roc-s-ff5c6b1ee450 roc-s-c74ab393b96d roc-s-7844ca2c6709 roc-s-52101fc7d8bb roc-s-f032143bc1c9 roc-s-35f35c41d134",
          "roc-s-e1bd2eaca11c roc-s-30f54d824d9e roc-s-e8926eea1512",
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
          "roc-s-222f930b8752 roc-s-71556df3b421 roc-s-074569488cca",
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
          "roc-s-222f930b8752 roc-s-fec0aea7f726 roc-s-71556df3b421 roc-s-32c92bb1fde4 roc-s-074569488cca",
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
          "roc-s-222f930b8752 roc-s-fec0aea7f726 roc-s-71556df3b421 roc-s-32c92bb1fde4 roc-s-074569488cca",
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
