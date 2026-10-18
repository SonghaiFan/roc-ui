// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { ChevronDownIcon } from "lucide-react";
function NativeSelect({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default";
}) {
  return (
    <div
      className={cn(
        "roc-shadcn",
        "roc-u-group/native-select roc-u-relative roc-u-w-fit roc-u-has-[select:disabled]:opacity-50",
      )}
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-h-9 roc-u-w-full roc-u-min-w-0 roc-u-appearance-none roc-u-rounded-md roc-u-border roc-u-border-input roc-u-bg-transparent roc-u-px-3 roc-u-py-2 roc-u-pr-9 roc-u-text-sm roc-u-shadow-xs roc-u-transition-[color,box-shadow] roc-u-outline-none roc-u-selection:bg-primary roc-u-selection:text-primary-foreground roc-u-placeholder:text-muted-foreground roc-u-disabled:pointer-events-none roc-u-disabled:cursor-not-allowed roc-u-data-[size=sm]:h-8 roc-u-data-[size=sm]:py-1 roc-u-dark:bg-input/30 roc-u-dark:hover:bg-input/50",
            "roc-u-focus-visible:border-ring roc-u-focus-visible:ring-[3px] roc-u-focus-visible:ring-ring/50",
            "roc-u-aria-invalid:border-destructive roc-u-aria-invalid:ring-destructive/20 roc-u-dark:aria-invalid:ring-destructive/40",
            className,
          ),
        )}
        {...props}
      />
      <ChevronDownIcon
        className={cn(
          "roc-shadcn",
          "roc-u-pointer-events-none roc-u-absolute roc-u-top-1/2 roc-u-right-3.5 roc-u-size-4 roc-u--translate-y-1/2 roc-u-text-muted-foreground roc-u-opacity-50 roc-u-select-none",
        )}
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}
function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn(
        "roc-shadcn",
        cn("roc-u-bg-[Canvas] roc-u-text-[CanvasText]", className),
      )}
      {...props}
    />
  );
}
function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(
        "roc-shadcn",
        cn("roc-u-bg-[Canvas] roc-u-text-[CanvasText]", className),
      )}
      {...props}
    />
  );
}
export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };

import "./native-select.css";
