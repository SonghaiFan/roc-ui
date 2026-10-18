"use client";
// ROC primitive: a short label that appears on hover or focus. Behaviour from Base UI.
import * as React from "react";
import { Tooltip as Base } from "@base-ui/react/tooltip";
import { createContent, renderChild } from "./primitive-popup";

const DelayContext = React.createContext<number | undefined>(undefined);
const IdContext = React.createContext<string | undefined>(undefined);
// shadcn reserves the arrow's height inside the offset when there is an arrow;
// Base UI does not. The arrow tells its content it exists.
const ARROW_HEIGHT = 5;
const ArrowContext = React.createContext<(present: boolean) => void>(() => {});

function Provider({
  delayDuration = 700,
  skipDelayDuration = 300,
  children,
}: {
  delayDuration?: number;
  skipDelayDuration?: number;
  children?: React.ReactNode;
}) {
  return (
    <Base.Provider delay={delayDuration} timeout={skipDelayDuration}>
      {children}
    </Base.Provider>
  );
}

function Root({
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  disableHoverableContent,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  children?: React.ReactNode;
}) {
  const id = React.useId();
  return (
    <DelayContext.Provider value={delayDuration}>
      <IdContext.Provider value={id}>
        <Base.Root
          open={open}
          defaultOpen={defaultOpen}
          disableHoverablePopup={disableHoverableContent}
          onOpenChange={(next) => onOpenChange?.(next)}
        >
          {children}
        </Base.Root>
      </IdContext.Provider>
    </DelayContext.Provider>
  );
}

function Trigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const delay = React.useContext(DelayContext);
  const id = React.useContext(IdContext);
  const describe = (state: { open: boolean }) => ({
    "aria-describedby": state.open ? id : undefined,
  });
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement;
    return (
      <Base.Trigger
        {...(props as object)}
        delay={delay}
        render={renderChild(child, (state) => state.open, "delayed-open", describe)}
      />
    );
  }
  return (
    <Base.Trigger
      {...(props as object)}
      delay={delay}
      render={(triggerProps: Record<string, any>, state: { open: boolean }) => (
        <button
          {...triggerProps}
          {...describe(state)}
          data-state={state.open ? "delayed-open" : "closed"}
        />
      )}
    >
      {children}
    </Base.Trigger>
  );
}

/** A small pointer, drawn as an SVG so it can take its colour from `fill`. */
function Arrow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const register = React.useContext(ArrowContext);
  React.useLayoutEffect(() => {
    register(true);
    return () => register(false);
  }, [register]);
  return (
    <Base.Arrow data-slot="tooltip-arrow" className={className} style={style}>
      <svg
        width="10"
        height="5"
        viewBox="0 0 10 5"
        aria-hidden="true"
        style={{ display: "block", width: 10, height: 5 }}
      >
        <polygon points="0,5 5,0 10,5" />
      </svg>
    </Base.Arrow>
  );
}

const BaseContent = createContent(
  { Positioner: Base.Positioner, Popup: Base.Popup },
  "tooltip",
  "delayed-open",
);

function Content({ sideOffset = 0, ...props }: React.ComponentProps<typeof BaseContent>) {
  const id = React.useContext(IdContext);
  const [hasArrow, setHasArrow] = React.useState(false);
  return (
    <ArrowContext.Provider value={setHasArrow}>
      <BaseContent
        id={id}
        role="tooltip"
        sideOffset={sideOffset + (hasArrow ? ARROW_HEIGHT : 0)}
        {...props}
      />
    </ArrowContext.Provider>
  );
}

export const Tooltip = { Provider, Root, Trigger, Portal: Base.Portal, Content, Arrow };
