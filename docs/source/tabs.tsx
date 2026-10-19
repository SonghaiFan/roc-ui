"use client";
// Adapted from shadcn/ui (MIT). Same compound API; retained panels and one marker.
import * as React from "react";
import { Tabs as Primitive } from "./primitive-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import "./tabs.css";
const Selection = React.createContext<string | undefined>(undefined);
function Tabs({
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof Primitive.Root>) {
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = value === undefined ? internal : value;
  return (
    <Selection.Provider value={selected}>
      <Primitive.Root
        {...props}
        className={cn("roc-ui", className)}
        data-slot="tabs"
        value={selected}
        onValueChange={(next) => {
          if (value === undefined) setInternal(next);
          onValueChange?.(next);
        }}
      />
    </Selection.Provider>
  );
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
  const marker = React.useRef<HTMLSpanElement>(null);
  React.useLayoutEffect(() => {
    const node = marker.current!,
      list = node.parentElement!;
    let ready = false;
    const measure = () => {
      const active = list.querySelector<HTMLElement>(
        '[role="tab"][data-state="active"]',
      );
      if (!active) {
        node.hidden = true;
        return;
      }
      node.hidden = false;
      node.style.width = `${active.offsetWidth}px`;
      node.style.height = `${active.offsetHeight}px`;
      node.style.transform = `translate(${active.offsetLeft}px,${active.offsetTop}px)`;
      if (!ready) {
        node.getBoundingClientRect();
        node.dataset.ready = "true";
        ready = true;
      }
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    Array.from(list.children)
      .filter((n) => n !== node)
      .forEach((n) => resize.observe(n));
    const mutation = new MutationObserver(measure);
    mutation.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });
    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, []);
  // The observer measures the committed selection, including controlled updates.
  return (
    <Primitive.List
      {...props}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
    >
      <span ref={marker} className="roc-ui-tabs-marker" aria-hidden="true" />
      {children}
    </Primitive.List>
  );
}
function TabsTrigger({
  className,
  icon,
  children,
  ...props
}: React.ComponentProps<typeof Primitive.Trigger> & { icon?: React.ReactNode }) {
  return (
    <Primitive.Trigger
      {...props}
      data-slot="tabs-trigger"
      data-has-icon={icon ? "" : undefined}
      className={cn("roc-ui", className)}
    >
      {icon && <span className="roc-tabs-icon" aria-hidden="true">{icon}</span>}
      <span className="roc-tabs-label">{children}</span>
    </Primitive.Trigger>
  );
}
function TabsContent({
  className,
  value,
  ...props
}: React.ComponentProps<typeof Primitive.Content>) {
  const active = React.useContext(Selection) === value;
  return (
    <Primitive.Content
      {...props}
      value={value}
      forceMount
      hidden={!active}
      inert={!active}
      data-slot="tabs-content"
      className={cn("roc-ui", className)}
    />
  );
}
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
