// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "radix-ui";
function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-184ddc11e5f9 roc-s-302c0d124a94 roc-s-074569488cca",
          className,
        ),
      )}
      {...props}
    />
  );
}
const bubbleVariants = cva(
  "roc-s-a7a3eeeabdda roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-d5cb992d8706 roc-s-184ddc11e5f9 roc-s-302c0d124a94 roc-s-19e97f3f40e6 roc-s-9a446d4f4132 roc-s-e1409d26247b roc-s-d00025bf56f5",
  {
    variants: {
      variant: {
        default: "roc-s-6ccf7ef27fd2 roc-s-45ea72e24647 roc-s-644eaf83ae45",
        secondary: "roc-s-248f3e6ac6b3 roc-s-65168d4b0c7d roc-s-9ec2985f8c8a",
        muted: "roc-s-eaf5f9d103a8 roc-s-43df09252070",
        tinted:
          "roc-s-4c07fb5f3c7d roc-s-de918e7391b5 roc-s-fb4c9e552f15 roc-s-84202996f0b4 roc-s-f92c9ddc7a41",
        outline:
          "roc-s-8e61b6e66d0e roc-s-f47926549252 roc-s-11849f73a0fb roc-s-8b797798e4a6 roc-s-b3a9f50ccf9e",
        ghost:
          "roc-s-be97b11af432 roc-s-31da9e6e796d roc-s-be34253f63e5 roc-s-3578bd946493 roc-s-11849f73a0fb roc-s-8b797798e4a6 roc-s-ebde28b1fc90",
        destructive:
          "roc-s-4578d8a15183 roc-s-ff5ec7a609e1 roc-s-a0917b627f8b roc-s-8ffbaa305805 roc-s-9df25d800da4",
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
          "roc-s-8cfb5a42ef9f roc-s-81b198a2db84 roc-s-184ddc11e5f9 roc-s-d5111d0e9f48 roc-s-6ad537f2bbaa roc-s-4f1a55de40bc roc-s-e9c0d2f3599e roc-s-0f9e6672913a roc-s-b5edc3ea7c91 roc-s-c74ab393b96d roc-s-059428494356 roc-s-1eb753eb16e8 roc-s-bceac5f707d0 roc-s-146f528513a0 roc-s-ac89775d8d02 roc-s-2639a4c2e4eb roc-s-e00381a252a3 roc-s-dd042d1469da roc-s-0ad0dedeee98",
          className,
        ),
      )}
      {...props}
    />
  );
}
const bubbleReactionsVariants = cva(
  "roc-s-747355bdc2a2 roc-s-418e44ad4f9e roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-27ead27a81df roc-s-71556df3b421 roc-s-a503dd374cca roc-s-19e97f3f40e6 roc-s-b005d61d0953 roc-s-87ecb59f2d2d roc-s-1da2e8f173c5 roc-s-be24efcccdb9 roc-s-c74ab393b96d roc-s-ea7fd2c2745b roc-s-4aec084365be roc-s-393835207416",
  {
    variants: {
      side: {
        top: "roc-s-98599e4ee250 roc-s-3d1357349cb1",
        bottom: "roc-s-30150dd033ab roc-s-c8db802467c9",
      },
      align: {
        start: "roc-s-ea31f8b3a958",
        end: "roc-s-8b66d98296a5",
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
