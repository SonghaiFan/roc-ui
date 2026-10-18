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
 * Build a Content component. `prefix` names the CSS variables that Radix-era CSS
 * reads (`--radix-<prefix>-content-transform-origin` and friends).
 */
export function createContent(parts: Parts, prefix: string, openValue = "open") {
  type Props = Omit<React.ComponentProps<"div">, "ref"> &
    PositionProps & {
      ref?: React.Ref<HTMLDivElement>;
      anchor?: Element | null;
      /** Keep mounted while closed. Not needed: Portal handles presence. */
      forceMount?: boolean;
    };
  return function Content({
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    avoidCollisions = true,
    sticky,
    anchor,
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
        style={{ zIndex: stacking }}
      >
        <parts.Popup
          {...props}
          ref={composeRefs(ref, popup)}
          render={(popupProps: Record<string, any>, state: { open: boolean }) => (
            <div {...popupProps} data-state={state.open ? openValue : "closed"} />
          )}
          style={
            {
              [`--radix-${prefix}-content-transform-origin`]: "var(--transform-origin)",
              [`--radix-${prefix}-content-available-height`]: "var(--available-height)",
              [`--radix-${prefix}-content-available-width`]: "var(--available-width)",
              [`--radix-${prefix}-trigger-width`]: "var(--anchor-width)",
              [`--radix-${prefix}-trigger-height`]: "var(--anchor-height)",
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
