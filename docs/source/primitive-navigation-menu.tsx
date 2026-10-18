"use client";
// ROC primitive: site navigation whose items reveal panels. Written for ROC; no library.
// Hover opens after a short delay (instant while moving between items), a click toggles,
// Escape and outside clicks dismiss, and `data-motion` tells panels which way to slide.
import * as React from "react";
import { createPortal } from "react-dom";
import { Slot } from "./primitive-slot";
import { composeEventHandlers, useComposedRefs } from "./primitive-utils";
import { useDirectionContext } from "./primitive-direction-context";
import { useControllableState } from "./use-controllable-state";
import { ROVING_ROOT, handleRovingKey, type Orientation } from "./primitive-roving";

type Dir = "ltr" | "rtl";
const CLOSE_DELAY = 150;

type RootContext = {
  baseId: string;
  value: string;
  previous: string;
  setValue: (value: string) => void;
  orientation: Orientation;
  dir: Dir | undefined;
  /** Open `value` now, or after the hover delay when nothing is open yet. */
  hoverOpen: (value: string) => void;
  startClose: () => void;
  cancelClose: () => void;
  list: HTMLElement | null;
  track: HTMLElement | null;
  setTrack: (element: HTMLElement | null) => void;
  viewport: HTMLElement | null;
  setViewport: (element: HTMLElement | null) => void;
  size: { width: number; height: number } | null;
  setSize: (size: { width: number; height: number } | null) => void;
  nav: React.RefObject<HTMLElement | null>;
};
const Context = React.createContext<RootContext | null>(null);
const ItemContext = React.createContext<{ value: string } | null>(null);
const InContent = React.createContext(false);
const useRoot = () => {
  const context = React.useContext(Context);
  if (!context) throw new Error("NavigationMenu parts must be inside NavigationMenu.Root");
  return context;
};
const slug = (value: string) => encodeURIComponent(value).replace(/%/g, "_");
const triggerId = (base: string, value: string) => `${base}-trigger-${slug(value)}`;
const contentId = (base: string, value: string) => `${base}-content-${slug(value)}`;

type RootProps = Omit<React.ComponentProps<"nav">, "defaultValue" | "dir"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Hover delay before the first panel opens. */
  delayDuration?: number;
  /** How long after closing that hovering another item opens it at once. */
  skipDelayDuration?: number;
  orientation?: Orientation;
  dir?: Dir;
};

function Root({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  delayDuration = 200,
  skipDelayDuration = 300,
  orientation = "horizontal",
  dir: dirProp,
  ref,
  ...props
}: RootProps) {
  const dir = useDirectionContext(dirProp);
  const baseId = React.useId();
  const nav = React.useRef<HTMLElement | null>(null);
  const composed = useComposedRefs<HTMLElement>(ref, nav);
  const [value, setValueState] = useControllableState<string>(valueProp, defaultValue, onValueChange);
  const previous = React.useRef("");
  const [previousSeen, setPreviousSeen] = React.useState("");
  const [track, setTrack] = React.useState<HTMLElement | null>(null);
  const [viewport, setViewport] = React.useState<HTMLElement | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  const openTimer = React.useRef<number>(0);
  const closeTimer = React.useRef<number>(0);
  const skipTimer = React.useRef<number>(0);
  const skipping = React.useRef(false);
  const latest = React.useRef(value);
  latest.current = value;

  const setValue = React.useCallback(
    (next: string) => {
      if (next === latest.current) return;
      // Remember what was open so panels can slide the right way.
      previous.current = latest.current;
      setPreviousSeen(latest.current);
      setValueState(next);
      if (next === "") {
        // Moving to another item right after closing opens it without the delay.
        skipping.current = true;
        window.clearTimeout(skipTimer.current);
        skipTimer.current = window.setTimeout(() => (skipping.current = false), skipDelayDuration);
      }
    },
    [setValueState, skipDelayDuration],
  );

  const hoverOpen = React.useCallback(
    (next: string) => {
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(openTimer.current);
      if (latest.current !== "" || skipping.current) setValue(next);
      else openTimer.current = window.setTimeout(() => setValue(next), delayDuration);
    },
    [delayDuration, setValue],
  );
  const cancelClose = React.useCallback(() => window.clearTimeout(closeTimer.current), []);
  const startClose = React.useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setValue(""), CLOSE_DELAY);
  }, [setValue]);
  React.useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(skipTimer.current);
    },
    [],
  );

  // Dismiss on Escape, a press outside, or focus leaving the menu.
  React.useEffect(() => {
    if (value === "") return;
    const inside = (target: EventTarget | null) => {
      const node = target as Node | null;
      return !!node && (nav.current?.contains(node) || viewport?.contains(node));
    };
    const down = (event: PointerEvent) => {
      if (!inside(event.target)) setValue("");
    };
    const focus = (event: FocusEvent) => {
      if (!inside(event.target)) setValue("");
    };
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const trigger = document.getElementById(triggerId(baseId, latest.current));
      const hadFocus = inside(document.activeElement);
      setValue("");
      if (hadFocus) trigger?.focus();
    };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("focusin", focus);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("keydown", key);
    };
  }, [value, viewport, baseId, setValue]);

  return (
    <Context.Provider
      value={{
        baseId,
        value,
        previous: previousSeen,
        setValue,
        orientation,
        dir,
        hoverOpen,
        startClose,
        cancelClose,
        list: null,
        track,
        setTrack,
        viewport,
        setViewport,
        size,
        setSize,
        nav,
      }}
    >
      <nav
        aria-label="Main"
        data-orientation={orientation}
        dir={dir}
        {...props}
        ref={composed}
      />
    </Context.Provider>
  );
}

function List({ ref, onKeyDown, ...props }: React.ComponentProps<"ul">) {
  const root = useRoot();
  const list = React.useRef<HTMLUListElement | null>(null);
  const composed = useComposedRefs<HTMLUListElement>(ref, list);
  return (
    <div style={{ position: "relative" }} ref={root.setTrack}>
      <ul
        data-orientation={root.orientation}
        {...{ [ROVING_ROOT]: "" }}
        {...props}
        ref={composed}
        onKeyDown={composeEventHandlers(onKeyDown, (event) =>
          handleRovingKey(event, list.current as HTMLDivElement | null, {
            orientation: root.orientation,
            dir: root.dir,
          }),
        )}
      />
    </div>
  );
}

function Item({
  value: valueProp,
  ...props
}: React.ComponentProps<"li"> & { value?: string }) {
  const generated = React.useId();
  const value = valueProp ?? generated;
  return (
    <ItemContext.Provider value={{ value }}>
      <li data-nav-item-value={value} {...props} />
    </ItemContext.Provider>
  );
}

function Trigger({
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onClick,
  onKeyDown,
  disabled,
  ...props
}: React.ComponentProps<"button">) {
  const root = useRoot();
  const item = React.useContext(ItemContext)!;
  const open = root.value === item.value;
  const wasClickClose = React.useRef(false);
  const touch = (event: React.PointerEvent) => event.pointerType === "touch";
  const entry =
    root.orientation === "horizontal" ? "ArrowDown" : root.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
  return (
    <button
      type="button"
      id={triggerId(root.baseId, item.value)}
      aria-expanded={open}
      aria-controls={contentId(root.baseId, item.value)}
      data-state={open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      data-roving-item=""
      data-roving-value={item.value}
      disabled={disabled}
      {...props}
      onPointerEnter={composeEventHandlers(onPointerEnter, () => {
        wasClickClose.current = false;
        root.cancelClose();
      })}
      onPointerMove={composeEventHandlers(onPointerMove, (event) => {
        if (touch(event) || wasClickClose.current || open) return;
        root.hoverOpen(item.value);
      })}
      onPointerLeave={composeEventHandlers(onPointerLeave, (event) => {
        if (touch(event)) return;
        wasClickClose.current = false;
        root.startClose();
      })}
      onClick={composeEventHandlers(onClick, () => {
        root.cancelClose();
        root.setValue(open ? "" : item.value);
        wasClickClose.current = open;
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (open && event.key === entry) {
          const content = document.getElementById(contentId(root.baseId, item.value));
          const first = content?.querySelector<HTMLElement>(
            "a[href], button:not(:disabled), [tabindex]:not([tabindex='-1'])",
          );
          if (first) {
            event.preventDefault();
            first.focus();
          }
        }
      })}
    />
  );
}

/** Keep a closing panel mounted until its exit animation has finished. */
function usePresence(open: boolean, ref: React.RefObject<HTMLElement | null>) {
  const [mounted, setMounted] = React.useState(open);
  React.useLayoutEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const element = ref.current;
    if (!element) return setMounted(false);
    void getComputedStyle(element).animationName; // flush styles so the exit animation exists
    const running = element.getAnimations?.() ?? [];
    if (!running.length) return setMounted(false);
    let cancelled = false;
    Promise.allSettled(running.map((animation) => animation.finished)).then(
      () => !cancelled && setMounted(false),
    );
    return () => {
      cancelled = true;
    };
  }, [open, ref]);
  return open || mounted;
}

function Content({
  forceMount,
  ref,
  onPointerEnter,
  onPointerLeave,
  onKeyDown,
  ...props
}: React.ComponentProps<"div"> & { forceMount?: boolean }) {
  const root = useRoot();
  const item = React.useContext(ItemContext)!;
  const open = root.value === item.value;
  const element = React.useRef<HTMLDivElement | null>(null);
  const composed = useComposedRefs<HTMLDivElement>(ref, element);
  const present = usePresence(open, element);

  // Which way to slide: from the side of the item we came from.
  const motionRef = React.useRef<string | undefined>(undefined);
  const values = root.nav.current
    ? Array.from(root.nav.current.querySelectorAll<HTMLElement>("[data-nav-item-value]")).map(
        (li) => li.dataset.navItemValue!,
      )
    : [];
  if (root.dir === "rtl") values.reverse();
  const index = values.indexOf(root.value);
  const previousIndex = values.indexOf(root.previous);
  const mine = values.indexOf(item.value);
  const wasOpen = previousIndex === mine;
  if (open || wasOpen) {
    let motion: string | undefined;
    if (index !== previousIndex) {
      if (open && previousIndex !== -1) motion = index > previousIndex ? "from-end" : "from-start";
      else if (wasOpen && index !== -1) motion = index > previousIndex ? "to-start" : "to-end";
    }
    motionRef.current = motion;
  }

  // The viewport sizes itself to the open panel.
  React.useLayoutEffect(() => {
    if (!open || !element.current || !root.viewport) return;
    const target = element.current;
    const measure = () => root.setSize({ width: target.offsetWidth, height: target.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    return () => observer.disconnect();
  }, [open, root.viewport]);

  if (!present && !forceMount) return null;
  const node = (
    <InContent.Provider value={true}>
      <div
        id={contentId(root.baseId, item.value)}
        aria-labelledby={triggerId(root.baseId, item.value)}
        data-state={open ? "open" : "closed"}
        data-orientation={root.orientation}
        data-motion={motionRef.current}
        {...props}
        ref={composed}
        onPointerEnter={composeEventHandlers(onPointerEnter, root.cancelClose)}
        onPointerLeave={composeEventHandlers(onPointerLeave, (event) => {
          if (event.pointerType !== "touch") root.startClose();
        })}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Escape") {
            root.setValue("");
            document.getElementById(triggerId(root.baseId, item.value))?.focus();
          }
        })}
      />
    </InContent.Provider>
  );
  return root.viewport ? createPortal(node, root.viewport) : node;
}

function Link({
  asChild,
  active,
  onSelect,
  onClick,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  active?: boolean;
  onSelect?: (event: React.SyntheticEvent) => void;
}) {
  const root = useRoot();
  const inContent = React.useContext(InContent);
  const Comp: React.ElementType = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-active={active ? "" : undefined}
      aria-current={active ? "page" : undefined}
      data-roving-item={inContent ? undefined : ""}
      {...props}
      onClick={composeEventHandlers(onClick, (event: React.MouseEvent) => {
        onSelect?.(event);
        if (event.defaultPrevented) return;
        // A panel link is about to disappear: hand focus back to its trigger first.
        if (inContent && root.value)
          document.getElementById(triggerId(root.baseId, root.value))?.focus();
        root.setValue("");
      })}
    />
  );
}

/** A marker that slides under the open item's trigger. */
function Indicator({ children, ...props }: React.ComponentProps<"div">) {
  const root = useRoot();
  const [box, setBox] = React.useState<{ left: number; width: number } | null>(null);
  React.useLayoutEffect(() => {
    const trigger = document.getElementById(triggerId(root.baseId, root.value));
    if (!root.value || !trigger) return setBox(null);
    const measure = () => setBox({ left: trigger.offsetLeft, width: trigger.offsetWidth });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trigger);
    return () => observer.disconnect();
  }, [root.value, root.baseId]);
  // No open item, no marker.
  if (!root.track || !box) return null;
  return createPortal(
    <div
      aria-hidden
      data-state="visible"
      data-orientation={root.orientation}
      {...props}
      style={{
        position: "absolute",
        left: 0,
        top: "100%",
        width: box.width,
        transform: `translateX(${box.left}px)`,
        ...props.style,
      }}
    >
      {children}
    </div>,
    root.track,
  );
}

/** The shared box that open panels are moved into. */
function Viewport({ ref, onPointerEnter, onPointerLeave, style, ...props }: React.ComponentProps<"div">) {
  const root = useRoot();
  const element = React.useRef<HTMLDivElement | null>(null);
  const composed = useComposedRefs<HTMLDivElement>(ref, root.setViewport, element);
  const open = root.value !== "";
  const present = usePresence(open, element);
  // Once the exit has played, hide it and forget its size, so no empty box lingers.
  React.useEffect(() => {
    if (!present) root.setSize(null);
  }, [present]);
  return (
    <div
      hidden={!present}
      data-state={open ? "open" : "closed"}
      data-orientation={root.orientation}
      {...props}
      ref={composed}
      onPointerEnter={composeEventHandlers(onPointerEnter, root.cancelClose)}
      onPointerLeave={composeEventHandlers(onPointerLeave, (event) => {
        if (event.pointerType !== "touch") root.startClose();
      })}
      style={
        {
          pointerEvents: open ? undefined : "none",
          "--roc-navigation-menu-viewport-width": root.size ? `${root.size.width}px` : undefined,
          "--roc-navigation-menu-viewport-height": root.size ? `${root.size.height}px` : undefined,
          ...style,
        } as React.CSSProperties
      }
    />
  );
}

export const NavigationMenu = { Root, List, Item, Trigger, Content, Link, Indicator, Viewport };
