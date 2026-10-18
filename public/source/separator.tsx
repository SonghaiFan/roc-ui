// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
"use client";

import * as React from "react";
import { cn } from "./utils";
import { Separator as SeparatorPrimitive } from "./primitive-separator";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn("roc-ui", className)}
      {...props}
    />
  );
}

export { Separator };

import "./separator.css";
