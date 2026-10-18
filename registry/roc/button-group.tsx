// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "radix-ui";
import { Separator } from "./separator";
const buttonGroupVariants = cva(
  "roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-30862f3b959a roc-s-0345cc29991c roc-s-d8679a91798e roc-s-5d4ae7bbcc1a roc-s-05e401854cf9 roc-s-55510ebb6d71 roc-s-6eb530dd2043",
  {
    variants: {
      orientation: {
        horizontal: "roc-s-64ddbb05bb97 roc-s-ff26554be2e0 roc-s-61855a3e253a",
        vertical:
          "roc-s-302c0d124a94 roc-s-4484b37a4c77 roc-s-791f1e420264 roc-s-270b098da144",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);
function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "roc-shadcn",
        cn(buttonGroupVariants({ orientation }), className),
      )}
      {...props}
    />
  );
}
function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-71556df3b421 roc-s-074569488cca roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-87ecb59f2d2d roc-s-9513b3968002 roc-s-c74ab393b96d roc-s-daaac3fbf55e roc-s-7de07d413c13 roc-s-bcae9d37090c roc-s-eb5ef2dbc2d4",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-d2d9e1f13413 roc-s-ced874fd1b2a roc-s-48c120f2781d roc-s-e801910db5e8 roc-s-09ea37f36c99",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};

import "./button-group.css";
