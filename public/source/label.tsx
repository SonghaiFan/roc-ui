// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { Label as LabelPrimitive } from "./primitive-label";
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-items-center roc-u-gap-2 roc-u-text-sm roc-u-leading-none roc-u-font-medium roc-u-select-none roc-u-group-data-[disabled=true]:pointer-events-none roc-u-group-data-[disabled=true]:opacity-50 roc-u-peer-disabled:cursor-not-allowed roc-u-peer-disabled:opacity-50",
          className,
        ),
      )}
      {...props}
    />
  );
}
export { Label };

import "./label.css";
