// Adapted from shadcn/ui (MIT). Retained content is a ROC extension.
"use client";
import * as React from "react";
import { AutoHeight } from "@animate-ui/react/primitives/effects/auto-height";
import { Collapsible as Primitive } from "./primitive-collapsible";
import { cn } from "./utils";
import "./collapsible.css";
const State = React.createContext(false);
function Collapsible({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<typeof Primitive.Root>) {
  const [local, setLocal] = React.useState(defaultOpen);
  const open = controlled ?? local;
  return (
    <State.Provider value={open}>
      <Primitive.Root
        open={open}
        onOpenChange={(value) => {
          if (controlled === undefined) setLocal(value);
          onOpenChange?.(value);
        }}
        {...props}
      >
        {children}
      </Primitive.Root>
    </State.Provider>
  );
}
const CollapsibleTrigger = Primitive.Trigger;
function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Primitive.Content>) {
  const open = React.useContext(State);
  return (
    <Primitive.Content
      {...props}
      forceMount
      className={cn("roc-ui roc-collapsible", className)}
      aria-hidden={!open}
      inert={!open}
      data-open={open}
    >
      <AutoHeight initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}>
        <div className="roc-collapsible-inner">{children}</div>
      </AutoHeight>
    </Primitive.Content>
  );
}
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
