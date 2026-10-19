"use client";
// Adapted from shadcn/ui (MIT). Same compound API; retained panels and one marker.
import * as React from "react";
import { Tabs as Primitive } from "./primitive-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import "./tabs.css";
function Tabs({ className, ...props }: React.ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root {...props} className={cn("roc-ui", className)} data-slot="tabs" />;
}
const tabsListVariants = cva("roc-ui", {
  variants: {
    variant: { default: "roc-ui-tabs-default", line: "roc-ui-tabs-line" },
  },
  defaultVariants: { variant: "default" },
});
function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof Primitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <Primitive.List
      {...props}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
    >
      {children}
    </Primitive.List>
  );
}
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      {...props}
      data-slot="tabs-trigger"
      className={cn("roc-ui", className)}
    />
  );
}
function TabsContent({
  className,
  value,
  ...props
}: React.ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Content
      {...props}
      value={value}
      forceMount
      data-slot="tabs-content"
      className={cn("roc-ui", className)}
    />
  );
}
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
