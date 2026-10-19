"use client";
// ROC supplies the compound API, visuals and retained-panel default.
import * as React from "react";
import { Accordion as Primitive } from "./primitive-accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "./utils";
import "./accordion.css";
const Accordion = Primitive.Root;
function AccordionItem({ className, ...props }: React.ComponentProps<typeof Primitive.Item>) {
  return <Primitive.Item {...props} data-slot="accordion-item" className={cn("roc-ui", className)} />;
}
function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof Primitive.Trigger>) {
  return <Primitive.Header className="roc-ui-accordion-heading"><Primitive.Trigger {...props} data-slot="accordion-trigger" className={cn("roc-ui", className)}>
    {children}<ChevronDownIcon aria-hidden="true" className="roc-ui-icon" />
  </Primitive.Trigger></Primitive.Header>;
}
function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof Primitive.Content>) {
  return <Primitive.Content {...props} data-slot="accordion-content" className={cn("roc-ui", className)}>
    <div className="roc-ui-accordion-body">{children}</div>
  </Primitive.Content>;
}
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
