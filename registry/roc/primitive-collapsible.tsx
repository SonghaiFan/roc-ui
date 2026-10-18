"use client";
// ROC primitive: a trigger and a region it shows or hides.
import * as React from "react";
import { Slot } from "./primitive-slot";
import { composeEventHandlers } from "./primitive-utils";
import { useControllableState } from "./use-controllable-state";

const Context = React.createContext<{
  open: boolean;
  disabled: boolean;
  toggle: () => void;
  contentId: string;
} | null>(null);
const useCollapsible = () => {
  const context = React.useContext(Context);
  if (!context) throw new Error("Collapsible parts must be inside Collapsible.Root");
  return context;
};

type RootProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  asChild?: boolean;
};

function Root({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  asChild,
  ...props
}: RootProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const contentId = React.useId();
  const Comp: React.ElementType = asChild ? Slot.Root : "div";
  return (
    <Context.Provider value={{ open, disabled, toggle: () => setOpen(!open), contentId }}>
      <Comp
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        {...props}
      />
    </Context.Provider>
  );
}

function Trigger({
  asChild,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { open, disabled, toggle, contentId } = useCollapsible();
  const Comp: React.ElementType = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : "button"}
      aria-controls={contentId}
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      disabled={disabled}
      {...props}
      onClick={composeEventHandlers(onClick, toggle)}
    />
  );
}

function Content({
  forceMount,
  asChild,
  children,
  ...props
}: React.ComponentProps<"div"> & { forceMount?: boolean; asChild?: boolean }) {
  const { open, disabled, contentId } = useCollapsible();
  const Comp: React.ElementType = asChild ? Slot.Root : "div";
  // Closed content is emptied and hidden unless the caller keeps it ("forceMount")
  // to animate or retain its state. The empty region keeps `aria-controls` valid.
  if (!open && !forceMount)
    return (
      <Comp
        data-state="closed"
        data-disabled={disabled ? "" : undefined}
        {...props}
        id={contentId}
        hidden
      />
    );
  return (
    <Comp
      data-state={open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      {...props}
      id={contentId}
    >
      {children}
    </Comp>
  );
}

export const Collapsible = { Root, Trigger, Content };
