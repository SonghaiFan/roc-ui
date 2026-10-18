"use client";
// ROC primitive: an anchored popup. Behaviour from Base UI, shaped for ROC.
import * as React from "react";
import { Popover as Base } from "@animate-ui/react/primitives/base-ui/popover";
import {
  createContent,
  isNativeButton,
  renderChild,
} from "./primitive-popup";

const AnchorContext = React.createContext<{
  anchor: Element | null;
  setAnchor: (element: Element | null) => void;
}>({ anchor: null, setAnchor: () => {} });

type RootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `true` locks scroll and blocks outside pointer input. */
  modal?: boolean;
  children?: React.ReactNode;
};

function Root({ open, defaultOpen, onOpenChange, modal = false, children }: RootProps) {
  const [anchor, setAnchor] = React.useState<Element | null>(null);
  return (
    <AnchorContext.Provider value={{ anchor, setAnchor }}>
      <Base.Root
        open={open}
        defaultOpen={defaultOpen}
        modal={modal}
        onOpenChange={(next) => onOpenChange?.(next)}
      >
        {children}
      </Base.Root>
    </AnchorContext.Provider>
  );
}

type TriggerProps = React.ComponentProps<"button"> & { asChild?: boolean };

function Trigger({ asChild, children, ...props }: TriggerProps) {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement;
    return (
      <Base.Trigger
        {...(props as object)}
        nativeButton={isNativeButton(child)}
        render={renderChild(child, (state) => state.open)}
      />
    );
  }
  return (
    <Base.Trigger
      {...(props as object)}
      render={(triggerProps: Record<string, any>, state: { open: boolean }) => (
        <button {...triggerProps} data-state={state.open ? "open" : "closed"} />
      )}
    >
      {children}
    </Base.Trigger>
  );
}

/** Positions the popup against this element instead of the trigger. */
function Anchor({ asChild, children, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const { setAnchor } = React.useContext(AnchorContext);
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ ref?: React.Ref<Element> }>;
    return React.cloneElement(child, {
      ...(props as object),
      ref: (node: Element | null) => setAnchor(node),
    } as object);
  }
  return (
    <div {...props} ref={(node) => setAnchor(node)}>
      {children}
    </div>
  );
}

const BaseContent = createContent(
  { Positioner: Base.Positioner, Popup: Base.Popup },
  "popover",
);
function Content(props: React.ComponentProps<typeof BaseContent>) {
  const { anchor } = React.useContext(AnchorContext);
  return <BaseContent anchor={anchor} {...props} />;
}

function Close({ asChild, children, ...props }: TriggerProps) {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement;
    return (
      <Base.Close
        {...(props as object)}
        nativeButton={isNativeButton(child)}
        render={child}
      />
    );
  }
  return <Base.Close {...(props as object)}>{children}</Base.Close>;
}

export const Popover = { Root, Trigger, Anchor, Portal: Base.Portal, Content, Close };
