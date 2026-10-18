// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
"use client";

import * as React from "react";
import { cn } from "./utils";
import { Checkbox as CheckboxPrimitive } from "./primitive-checkbox";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn("roc-ui", className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="roc-ui"
        forceMount
      >
        <svg
          className="roc-ui-icon roc-ui-checkbox-mark"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" pathLength={1} />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

import "./checkbox.css";
