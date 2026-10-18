"use client";
// ROC primitive: shared adapter that gives Base UI's Dialog parts (and Alert Dialog's,
// which share them) the Overlay/Content/Close shape ROC components use.
import * as React from "react";
import { isNativeButton } from "./primitive-popup";
import { renderChild } from "./primitive-popup";

type Props<T extends keyof React.JSX.IntrinsicElements> = Omit<
  React.ComponentProps<T>,
  "ref"
> & { ref?: React.Ref<any> };

export function createDialog(Base: any) {
  function Root({
    open,
    defaultOpen,
    onOpenChange,
    modal = true,
    children,
  }: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    children?: React.ReactNode;
  }) {
    return (
      <Base.Root
        open={open}
        defaultOpen={defaultOpen}
        modal={modal}
        onOpenChange={(next: boolean) => onOpenChange?.(next)}
      >
        {children}
      </Base.Root>
    );
  }

  /** A button that renders as its own child when `asChild` is set. */
  function ButtonPart(Part: any, withState: boolean) {
    return function Part_({
      asChild,
      children,
      ...props
    }: Props<"button"> & { asChild?: boolean }) {
      if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement;
        return (
          <Part
            {...(props as object)}
            nativeButton={isNativeButton(child)}
            render={
              withState ? renderChild(child, (state) => state.open) : child
            }
          />
        );
      }
      return withState ? (
        <Part
          {...(props as object)}
          render={(p: Record<string, any>, state: { open: boolean }) => (
            <button {...p} data-state={state.open ? "open" : "closed"} />
          )}
        >
          {children}
        </Part>
      ) : (
        <Part {...(props as object)}>{children}</Part>
      );
    };
  }

  const Trigger = ButtonPart(Base.Trigger, true);
  const Close = ButtonPart(Base.Close, false);

  function Overlay(props: Props<"div">) {
    return (
      <Base.Backdrop
        {...props}
        render={(p: Record<string, any>, state: { open: boolean }) => (
          <div {...p} data-state={state.open ? "open" : "closed"} />
        )}
      />
    );
  }

  function Content({
    initialFocus,
    children,
    ...props
  }: Props<"div"> & { initialFocus?: React.RefObject<HTMLElement | null> }) {
    return (
      <Base.Popup
        {...props}
        initialFocus={initialFocus}
        render={(p: Record<string, any>, state: { open: boolean }) => (
          <div {...p} data-state={state.open ? "open" : "closed"} />
        )}
      >
        {children}
      </Base.Popup>
    );
  }

  return {
    Root,
    Trigger,
    Portal: Base.Portal as React.ComponentType<
      { children?: React.ReactNode; container?: HTMLElement | null } & Record<string, unknown>
    >,
    Overlay,
    Content,
    Close,
    Title: Base.Title as React.ComponentType<Props<"h2">>,
    Description: Base.Description as React.ComponentType<Props<"p">>,
  };
}
