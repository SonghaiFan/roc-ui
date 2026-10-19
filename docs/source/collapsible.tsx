"use client";
import * as React from "react";
import { Collapsible as Primitive } from "./primitive-collapsible";
import { cn } from "./utils";
import "./collapsible.css";
const Collapsible = Primitive.Root;
const CollapsibleTrigger = Primitive.Trigger;
function CollapsibleContent({ className, children, ...props }: React.ComponentProps<typeof Primitive.Content>) {
  return <Primitive.Content {...props} className={cn("roc-ui roc-collapsible", className)}>
    <div className="roc-collapsible-inner">{children}</div>
  </Primitive.Content>;
}
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
