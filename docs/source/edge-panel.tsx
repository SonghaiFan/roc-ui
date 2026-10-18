"use client";
import * as React from "react";
import { PinIcon, XIcon } from "lucide-react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Toggle } from "./toggle";
import { Slot } from "./primitive-slot";
import { useControllableState } from "./use-controllable-state";
import { cn } from "./utils";

type Side = "left" | "right";
type EdgePanelContextValue = {
  id: string;
  open: boolean;
  pinned: boolean;
  side: Side;
  contained: boolean;
  setPinned: (pinned: boolean) => void;
  show: () => void;
  hide: (force?: boolean) => void;
  scheduleHide: () => void;
  cancel: () => void;
  panel: React.RefObject<HTMLElement | null>;
  trigger: React.RefObject<HTMLElement | null>;
};
const EdgePanelContext = React.createContext<EdgePanelContextValue | null>(
  null,
);
/** Read and drive the nearest EdgePanel, e.g. to dismiss it from outside. */
function useEdgePanel() {
  const context = React.useContext(EdgePanelContext);
  if (!context) throw new Error("useEdgePanel must be used inside EdgePanel");
  return context;
}
// Menus portal out of the panel; while one of its own triggers is expanded they still belong to it.
const POPUP =
  '[role="listbox"],[role="menu"],[role="dialog"],[data-slot$="-content"]';

function EdgePanel({
  id,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  pinned: pinnedProp,
  defaultPinned = false,
  onPinnedChange,
  side = "left",
  contained = false,
  hideDelay = 400,
  children,
}: {
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  pinned?: boolean;
  defaultPinned?: boolean;
  onPinnedChange?: (pinned: boolean) => void;
  side?: Side;
  /** Anchor to the nearest positioned ancestor instead of the window. */
  contained?: boolean;
  hideDelay?: number;
  children?: React.ReactNode;
}) {
  const generated = React.useId();
  const [open, setOpen] = useControllableState(
    openProp,
    defaultOpen,
    onOpenChange,
  );
  const [pinned, setPinned] = useControllableState(
    pinnedProp,
    defaultPinned,
    onPinnedChange,
  );
  const panel = React.useRef<HTMLElement>(null),
    trigger = React.useRef<HTMLElement>(null),
    timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const live = React.useRef({ open, pinned, setOpen, setPinned, hideDelay });
  live.current = { open, pinned, setOpen, setPinned, hideDelay };
  const api = React.useMemo(() => {
    const cancel = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
    const popupOpen = () =>
      !!panel.current?.querySelector('[aria-expanded="true"]');
    const hide = (force = false) => {
      cancel();
      const state = live.current;
      if (state.pinned && !force) return;
      if (panel.current?.contains(document.activeElement))
        trigger.current?.focus({ preventScroll: true });
      state.setOpen(false);
      if (force) state.setPinned(false);
    };
    return {
      cancel,
      hide,
      popupOpen,
      show: () => {
        cancel();
        live.current.setOpen(true);
      },
      scheduleHide: () => {
        cancel();
        timer.current = setTimeout(() => {
          if (!panel.current?.matches(":focus-within") && !popupOpen()) hide();
        }, live.current.hideDelay);
      },
    };
  }, []);
  React.useEffect(() => {
    const belongs = (node: Node | null) =>
      !!node &&
      (!!panel.current?.contains(node) ||
        !!trigger.current?.contains(node) ||
        (api.popupOpen() && node instanceof Element && !!node.closest(POPUP)));
    const outside = (event: PointerEvent) => {
      if (!belongs(event.target as Node)) api.hide();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && live.current.open) api.hide(true);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside, true);
    return () => {
      api.cancel();
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside, true);
    };
  }, [api]);
  const value = React.useMemo(
    () => ({
      id: id ?? `edge-panel-${generated}`,
      open,
      pinned,
      side,
      contained,
      setPinned,
      show: api.show,
      hide: api.hide,
      scheduleHide: api.scheduleHide,
      cancel: api.cancel,
      panel,
      trigger,
    }),
    [id, generated, open, pinned, side, contained, api],
  );
  return <EdgePanelContext value={value}>{children}</EdgePanelContext>;
}

const FOCUSABLE =
  '[data-slot="select-trigger"],input,textarea,select,[href],button:not([data-slot="edge-panel-pin"]):not([data-slot="edge-panel-close"])';

function EdgePanelTrigger({
  asChild,
  className,
  onPointerEnter,
  onPointerLeave,
  onClick,
  ref,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const panel = useEdgePanel();
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-slot="edge-panel-trigger"
      aria-controls={panel.id}
      aria-expanded={panel.open}
      className={className}
      ref={(node: HTMLElement | null) => {
        panel.trigger.current = node;
        if (typeof ref === "function") ref(node as HTMLButtonElement);
        else if (ref) ref.current = node as HTMLButtonElement;
      }}
      onPointerEnter={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(event);
        if (event.pointerType === "mouse") panel.show();
      }}
      onPointerLeave={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(event);
        panel.scheduleHide();
      }}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        panel.show();
        // Keyboard activation moves into the panel; pointer use leaves focus alone.
        if (event.detail === 0)
          requestAnimationFrame(() =>
            panel.panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(),
          );
      }}
      {...props}
    />
  );
}

function EdgePanelContent({
  title,
  className,
  children,
  pinLabel = "Keep open",
  closeLabel = "Close",
  ...props
}: Omit<React.ComponentProps<"aside">, "title"> & {
  title?: React.ReactNode;
  pinLabel?: string;
  closeLabel?: string;
}) {
  const panel = useEdgePanel();
  const data = {
    "data-side": panel.side,
    "data-contained": panel.contained || undefined,
  };
  return (
    <>
      <div
        aria-hidden="true"
        data-slot="edge-panel-zone"
        className="roc-ui roc-ui-edge-panel-zone"
        {...data}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") panel.show();
        }}
        onPointerLeave={panel.scheduleHide}
      />
      <aside
        ref={panel.panel}
        id={panel.id}
        data-slot="edge-panel"
        data-state={panel.open ? "open" : "closed"}
        {...data}
        inert={!panel.open}
        className={cn("roc-ui roc-ui-edge-panel", className)}
        onPointerEnter={panel.cancel}
        onPointerLeave={panel.scheduleHide}
        onBlur={(event) => {
          const next = event.relatedTarget as Node | null;
          if (
            !event.currentTarget.contains(next) &&
            next !== panel.trigger.current &&
            !(
              next instanceof Element &&
              event.currentTarget.querySelector('[aria-expanded="true"]') &&
              next.closest(POPUP)
            )
          )
            panel.hide();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            panel.hide(true);
          }
        }}
        {...props}
      >
        <div data-slot="edge-panel-header" className="roc-ui-edge-panel-header">
          <span data-slot="edge-panel-title">{title}</span>
          <div>
            <Toggle
              data-slot="edge-panel-pin"
              size="sm"
              aria-label={pinLabel}
              pressed={panel.pinned}
              onPressedChange={panel.setPinned}
            >
              <PinIcon aria-hidden="true" />
              {panel.pinned ? "Pinned" : "Pin"}
            </Toggle>
            <Button
              data-slot="edge-panel-close"
              variant="ghost"
              size="icon-sm"
              aria-label={closeLabel}
              onClick={() => panel.hide(true)}
            >
              <XIcon aria-hidden="true" />
            </Button>
          </div>
        </div>
        <ScrollArea className="roc-ui-edge-panel-scroll">{children}</ScrollArea>
      </aside>
    </>
  );
}

export { EdgePanel, EdgePanelTrigger, EdgePanelContent, useEdgePanel };

import "./edge-panel.css";
