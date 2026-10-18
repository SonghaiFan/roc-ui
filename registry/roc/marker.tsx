// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "radix-ui";
const markerVariants = cva(
  "roc-s-7f968dfc1113 roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-db5d34295fcd roc-s-58d0413dd93c roc-s-71556df3b421 roc-s-074569488cca roc-s-1a5d10977b93 roc-s-c74ab393b96d roc-s-35f35c41d134 roc-s-eb5ef2dbc2d4 roc-s-ac4e5f6d16c0 roc-s-e97fb9d15235 roc-s-f006185bfb5b",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "roc-s-92370022fff3 roc-s-f2a35ef20100 roc-s-f0901564ac85 roc-s-7fcdf2a25108 roc-s-0a559d976312 roc-s-b97fdf168025 roc-s-6d57d9f7be47 roc-s-5c1091e64898 roc-s-9d2e451defad roc-s-0e8106026fea",
        border: "roc-s-bbe39cfb5cc6 roc-s-b1e6016d4f99 roc-s-2a81098af961",
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
          "roc-s-100c22d5776b roc-s-27ead27a81df roc-s-eb5ef2dbc2d4",
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
          "roc-s-184ddc11e5f9 roc-s-1eb753eb16e8 roc-s-02dfebc28ff9 roc-s-eb62b599cc0f roc-s-d21ca853d27e roc-s-ed0d9e4bd82f roc-s-b7d74dc6621d",
          className,
        ),
      )}
      {...props}
    />
  );
}
export { Marker, MarkerIcon, MarkerContent, markerVariants };

import "./marker.css";
