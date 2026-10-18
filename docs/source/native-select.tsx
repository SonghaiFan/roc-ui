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
        "roc-s-2a96cec8fa52 roc-s-d2d9e1f13413 roc-s-8cfb5a42ef9f roc-s-ad38525a81fe",
      )}
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          "roc-shadcn",
          cn(
            "roc-s-539ae144f076 roc-s-58d0413dd93c roc-s-184ddc11e5f9 roc-s-395428ec595c roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-8fca9236d191 roc-s-0f9e6672913a roc-s-b5edc3ea7c91 roc-s-0359a07b64f9 roc-s-c74ab393b96d roc-s-7de07d413c13 roc-s-4a85c59e17d7 roc-s-b30fc56058b6 roc-s-8c498cb46d9e roc-s-03d0b4ef751a roc-s-20315da78444 roc-s-8d3c1014b967 roc-s-db567af109b7 roc-s-bb554e6b177f roc-s-788521e22ec9 roc-s-9daa2369a41b roc-s-2d1843c40e8c",
            "roc-s-b906a32b31ee roc-s-365a4654f7b1 roc-s-392a26f4c1b0",
            "roc-s-1fac1d7d1df3 roc-s-5491fd0b4dc5 roc-s-c88f65aa011e",
            className,
          ),
        )}
        {...props}
      />
      <ChevronDownIcon
        className={cn(
          "roc-shadcn",
          "roc-s-33228ff7d583 roc-s-747355bdc2a2 roc-s-4e45f4841abb roc-s-3937181a2747 roc-s-100c22d5776b roc-s-5dde0fd996f0 roc-s-35f35c41d134 roc-s-0b5a4d1257ab roc-s-78905c9e865c",
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
        cn("roc-s-81870f385dc8 roc-s-2efd94124cb2", className),
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
        cn("roc-s-81870f385dc8 roc-s-2efd94124cb2", className),
      )}
      {...props}
    />
  );
}
export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };

import "./native-select.css";
