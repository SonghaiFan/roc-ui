// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { cn } from "./utils";
import { Loader2Icon } from "lucide-react";
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(
        "roc-shadcn",
        cn("roc-u-size-4 roc-u-animate-spin", className),
      )}
      {...props}
    />
  );
}
export { Spinner };

import "./spinner.css";
