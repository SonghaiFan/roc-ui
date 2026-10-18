"use client";
// ROC primitive: shared adapter that gives Base UI's Portal > Positioner > Popup
// parts the shape ROC components use: a single `Content`, `asChild` triggers,
// `data-state`, and the `--roc-popup-*` variables.
import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { composeRefs } from "./primitive-utils";

export type Side = "top" | "right" | "bottom" | "left";
export type Align = "start" | "center" | "end";

export type PositionProps = {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  /** Set false to keep the popup on its requested side even when it overflows. */
  avoidCollisions?: boolean;
  /** Keep the popup in view while the trigger scrolls out ("always"). */
  sticky?: "partial" | "always";
};

/** Render `child` with Base UI's props merged in, plus `data-state`. */
export function renderChild(
  child: React.ReactElement,
  open: (state: any) => boolean,
  openValue = "open",
  extra?: (state: any) => Record<string, any>,
) {
  return (props: Record<string, any>, state: any) =>
    React.cloneElement(
      child,
      mergeProps(child.props as Record<string, any>, props, {
        "data-state": open(state) ? openValue : "closed",
        ...extra?.(state),
      }) as Record<string, any>,
    );
}

/** Triggers must opt out of native-button behaviour when they render something else. */
export const isNativeButton = (child: React.ReactElement) =>
  typeof child.type !== "string" || child.type === "button";

/** Base UI reports logical sides for submenus; ROC CSS and components use physical ones. */
export function physicalSide(side: string | undefined) {
  if (side !== "inline-start" && side !== "inline-end") return side;
  const rtl =
    typeof document !== "undefined" && document.documentElement.dir === "rtl";
  return (side === "inline-end") !== rtl ? "right" : "left";
}

/** A popup copies its own z-index to the positioner, so stacking matches the CSS. */
function useStackingOf(ref: React.RefObject<HTMLElement | null>) {
  const [zIndex, setZIndex] = React.useState<string>();
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const value = getComputedStyle(ref.current).zIndex;
    setZIndex(value === "auto" ? undefined : value);
  });
  return zIndex;
}

type Parts = { Positioner: React.ElementType; Popup: React.ElementType };

/**
 * Build a Content component. `prefix` names the CSS variables that ROC and shadcn CSS
 * reads (`--roc-<prefix>-content-transform-origin` and friends).
 */
export function createContent(parts: Parts, prefix: string, openValue = "open") {
  type Props = Omit<React.ComponentProps<"div">, "ref"> &
    PositionProps & {
      ref?: React.Ref<HTMLDivElement>;
      anchor?: Element | null;
      /** Extra props for Base UI's Positioner, such as `alignItemWithTrigger`. */
      positionerProps?: Record<string, unknown>;
      /** Keep mounted while closed. Not needed: Portal handles presence. */
      forceMount?: boolean;
    };
  return function Content({
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding = 12,
    avoidCollisions = true,
    sticky,
    anchor,
    positionerProps,
    forceMount: _forceMount,
    style,
    ref,
    children,
    ...props
  }: Props) {
    const popup = React.useRef<HTMLDivElement | null>(null);
    const stacking = useStackingOf(popup);
    return (
      <parts.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        collisionAvoidance={
          avoidCollisions ? undefined : { side: "none", align: "none" }
        }
        sticky={sticky === "always"}
        anchor={anchor ?? undefined}
        {...positionerProps}
        style={{ zIndex: stacking }}
      >
        <parts.Popup
          data-roc-motion="animate-ui"
          {...props}
          ref={composeRefs(ref, popup)}
          render={(popupProps: Record<string, any>, state: { open: boolean }) => (
            <div
              {...popupProps}
              data-side={physicalSide(popupProps["data-side"])}
              data-state={state.open ? openValue : "closed"}
            />
          )}
          style={
            {
              [`--roc-${prefix}-content-transform-origin`]: "var(--transform-origin)",
              [`--roc-${prefix}-content-available-height`]: "var(--available-height)",
              [`--roc-${prefix}-content-available-width`]: "var(--available-width)",
              [`--roc-${prefix}-trigger-width`]: "var(--anchor-width)",
              [`--roc-${prefix}-trigger-height`]: "var(--anchor-height)",
              ...style,
            } as React.CSSProperties
          }
        >
          {children}
        </parts.Popup>
      </parts.Positioner>
    );
  };
}
