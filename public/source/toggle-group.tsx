// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
"use client";
import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { toggleVariants } from "./toggle";
import { cn } from "./utils";
type Variants = VariantProps<typeof toggleVariants>;
const ToggleGroupContext = React.createContext<Variants>({});
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation,
  style,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  Variants & { spacing?: number }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-spacing={spacing}
      data-orientation={orientation ?? "horizontal"}
      orientation={orientation}
      className={cn("roc-ui", className)}
      style={
        {
          "--roc-toggle-gap": `${spacing * 4}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}
function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & Variants) {
  const context = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
        }),
        className,
      )}
      {...props}
    />
  );
}
export { ToggleGroup, ToggleGroupItem };

import "./toggle-group.css";
