"use client";
// ROC primitive: a card that previews a link on hover or focus. Behaviour from Base UI.
import * as React from "react";
import { PreviewCard as Base } from "@animate-ui/react/primitives/base-ui/preview-card";
import { createContent, renderChild } from "./primitive-popup";

const DelayContext = React.createContext<{ open?: number; close?: number }>({});

function Root({
  open,
  defaultOpen,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  children?: React.ReactNode;
}) {
  return (
    <DelayContext.Provider value={{ open: openDelay, close: closeDelay }}>
      <Base.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(next) => onOpenChange?.(next)}
      >
        {children}
      </Base.Root>
    </DelayContext.Provider>
  );
}

function Trigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const delays = React.useContext(DelayContext);
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement;
    return (
      <Base.Trigger
        {...(props as object)}
        delay={delays.open}
        closeDelay={delays.close}
        render={renderChild(child, (state) => state.open)}
      />
    );
  }
  return (
    <Base.Trigger
      {...(props as object)}
      delay={delays.open}
      closeDelay={delays.close}
      render={(triggerProps: Record<string, any>, state: { open: boolean }) => (
        <a {...triggerProps} data-state={state.open ? "open" : "closed"} />
      )}
    >
      {children}
    </Base.Trigger>
  );
}

const Content = createContent(
  { Positioner: Base.Positioner, Popup: Base.Popup },
  "hover-card",
);

export const HoverCard = { Root, Trigger, Portal: Base.Portal, Content };
