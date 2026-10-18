"use client";
// Adapted from shadcn/ui (MIT). Retain panels and make reversal interruptible.
import * as React from "react";
import { AutoHeight } from "@animate-ui/react/primitives/effects/auto-height";
import { Accordion as Primitive } from "./primitive-accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "./utils";
import "./accordion.css";
const Values = React.createContext<string[]>([]),
  ItemOpen = React.createContext(false);
function Accordion(props: React.ComponentProps<typeof Primitive.Root>) {
  const [internal, setInternal] = React.useState<string | string[]>(
    props.defaultValue ?? (props.type === "multiple" ? [] : ""),
  );
  const value = props.value === undefined ? internal : props.value;
  const change = (next: string | string[]) => {
    if (props.value === undefined) setInternal(next);
    if (props.type === "multiple") props.onValueChange?.(next as string[]);
    else props.onValueChange?.(next as string);
  };
  const root =
    props.type === "multiple" ? (
      <Primitive.Root
        {...props}
        value={value as string[]}
        onValueChange={change}
      />
    ) : (
      <Primitive.Root
        {...props}
        value={value as string}
        onValueChange={change}
      />
    );
  return (
    <Values.Provider value={Array.isArray(value) ? value : [value]}>
      {root}
    </Values.Provider>
  );
}
function AccordionItem({
  className,
  value,
  ...props
}: React.ComponentProps<typeof Primitive.Item>) {
  const open = React.useContext(Values).includes(value);
  return (
    <ItemOpen.Provider value={open}>
      <Primitive.Item
        {...props}
        value={value}
        data-slot="accordion-item"
        className={cn("roc-ui", className)}
      />
    </ItemOpen.Provider>
  );
}
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Header className="roc-ui-accordion-heading">
      <Primitive.Trigger
        {...props}
        data-slot="accordion-trigger"
        className={cn("roc-ui", className)}
      >
        {children}
        <ChevronDownIcon aria-hidden="true" className="roc-ui-icon" />
      </Primitive.Trigger>
    </Primitive.Header>
  );
}
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Primitive.Content>) {
  const open = React.useContext(ItemOpen);
  return (
    <Primitive.Content
      {...props}
      forceMount
      inert={!open}
      aria-hidden={!open}
      data-slot="accordion-content"
      className={cn("roc-ui", className)}
    >
      <AutoHeight className="roc-ui-accordion-layout" data-open={open} initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}>
        <div className="roc-ui-accordion-clip">
          <div className="roc-ui-accordion-body">{children}</div>
        </div>
      </AutoHeight>
    </Primitive.Content>
  );
}
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
