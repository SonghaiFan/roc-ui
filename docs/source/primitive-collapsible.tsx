"use client";
import * as React from "react";
import { Collapsible as Base } from "@animate-ui/react/primitives/base-ui/collapsible";
import { isNativeButton, renderChild } from "./primitive-popup";
type RootProps = React.ComponentProps<"div"> & { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; disabled?: boolean; asChild?: boolean };
function Root({ onOpenChange, asChild, children, ...props }: RootProps) {
  if (asChild && React.isValidElement(children)) return <Base.Root {...props} onOpenChange={next => onOpenChange?.(next)} render={renderChild(children, s => s.open)} />;
  return <Base.Root {...props} onOpenChange={next => onOpenChange?.(next)} render={(p, s) => <div {...p} data-state={s.open ? "open" : "closed"} />}>{children}</Base.Root>;
}
function Trigger({ asChild, children, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) return <Base.Trigger {...props} nativeButton={isNativeButton(children)} render={renderChild(children, s => s.open)} />;
  return <Base.Trigger {...props} render={(p, s) => <button {...p} data-state={s.open ? "open" : "closed"} />}>{children}</Base.Trigger>;
}
function Content({ forceMount = true, ...props }: React.ComponentProps<"div"> & { forceMount?: boolean }) {
  return <Base.Panel {...props} keepMounted={forceMount} data-roc-motion="animate-ui" />;
}
export const Collapsible = { Root, Trigger, Content };
