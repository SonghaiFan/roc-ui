// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
"use client";
import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "./utils";
function Progress({
  className,
  value,
  max = 100,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const maximum = Number.isFinite(max) && max > 0 ? max : 100;
  const current =
    typeof value === "number" && Number.isFinite(value)
      ? Math.max(0, Math.min(maximum, value))
      : null;
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("roc-ui", className)}
      {...props}
      value={current}
      max={maximum}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="roc-ui"
        style={
          current === null
            ? undefined
            : { transform: `scaleX(${current / maximum})` }
        }
      />
    </ProgressPrimitive.Root>
  );
}
export { Progress };

import "./progress.css";
