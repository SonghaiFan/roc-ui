import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../registry/roc/button";
import { ScrollArea } from "../registry/roc/scroll-area";
import { Toggle } from "../registry/roc/toggle";

/** Settings float above the canvas; hiding them never resizes or remounts it. */
export function AutoHidePanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false),
    [pinned, setPinned] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null),
    panel = useRef<HTMLElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const live = useRef({ open, pinned });
  live.current = { open, pinned };
  // Select menus portal out of the panel; they still belong to it.
  const inPopup = (node: Node | null) =>
    node instanceof Element && !!node.closest(".picker-content");
  const popupOpen = () =>
    !!panel.current?.querySelector(
      '[data-slot="select-trigger"][aria-expanded="true"]',
    );
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const close = (force = false) => {
    cancel();
    if (live.current.pinned && !force) return;
    if (panel.current?.contains(document.activeElement))
      trigger.current?.focus({ preventScroll: true });
    setOpen(false);
    if (force) setPinned(false);
  };
  const reveal = () => {
    cancel();
    setOpen(true);
  };
  const leave = () => {
    cancel();
    timer.current = setTimeout(() => {
      if (!panel.current?.matches(":focus-within") && !popupOpen()) close();
    }, 400);
  };
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (
        !panel.current?.contains(event.target as Node) &&
        !trigger.current?.contains(event.target as Node) &&
        !inPopup(event.target as Node)
      )
        close();
    };
    const preview = () => close();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && live.current.open) close(true);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside, true);
    window.addEventListener("roc-preview-interact", preview);
    return () => {
      cancel();
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside, true);
      window.removeEventListener("roc-preview-interact", preview);
    };
  }, []);
  return (
    <div className="style-menu">
      <Button
        ref={trigger}
        variant="ghost"
        size="sm"
        className="style-trigger"
        aria-label="Design settings"
        aria-controls="design-settings"
        aria-expanded={open}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") reveal();
        }}
        onPointerLeave={leave}
        onClick={(e) => {
          reveal();
          if (e.detail === 0)
            requestAnimationFrame(() =>
              panel.current
                ?.querySelector<HTMLElement>('[data-slot="select-trigger"]')
                ?.focus(),
            );
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <path d="M3 5h14M3 10h14M3 15h14" />
          <path d="M7 3v4M13 8v4M8 13v4" strokeWidth="3" />
        </svg>
        <span>Style</span>
      </Button>
      <aside
        ref={panel}
        id="design-settings"
        className="design-controls"
        aria-label="Design settings panel"
        inert={!open}
        data-open={open}
        onPointerEnter={cancel}
        onPointerLeave={leave}
        onBlur={(e) => {
          if (
            !e.currentTarget.contains(e.relatedTarget as Node) &&
            e.relatedTarget !== trigger.current &&
            !inPopup(e.relatedTarget as Node)
          )
            close();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            close(true);
          }
        }}
      >
        <div className="rail-heading">
          <span>Appearance</span>
          <div>
            <Toggle
              size="sm"
              aria-label="Keep settings open"
              pressed={pinned}
              onPressedChange={setPinned}
            >
              {pinned ? "Pinned" : "Pin"}
            </Toggle>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close settings"
              onClick={() => close(true)}
            >
              ×
            </Button>
          </div>
        </div>
        <ScrollArea className="rail-scroll">{children}</ScrollArea>
      </aside>
    </div>
  );
}
