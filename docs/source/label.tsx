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
          "roc-s-222f930b8752 roc-s-71556df3b421 roc-s-074569488cca roc-s-c74ab393b96d roc-s-761cdb81bddb roc-s-daaac3fbf55e roc-s-78905c9e865c roc-s-9af9a4182597 roc-s-272ef88d6a0c roc-s-f0ee83167878 roc-s-25d26df52a1d",
          className,
        ),
      )}
      {...props}
    />
  );
}
export { Label };

import "./label.css";
