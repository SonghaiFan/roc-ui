"use client";
// ROC primitive: a scrollable region with custom scrollbars. Behaviour from Base UI.
import * as React from "react";
import { ScrollArea as Base } from "@base-ui/react/scroll-area";

type Div = Omit<React.ComponentProps<"div">, "ref"> & { ref?: React.Ref<any> };

/** Radix props that have no Base UI counterpart are accepted and ignored. */
function Root({
  type: _type,
  scrollHideDelay: _scrollHideDelay,
  dir: _dir,
  ...props
}: Div & {
  type?: "auto" | "always" | "scroll" | "hover";
  scrollHideDelay?: number;
  dir?: "ltr" | "rtl";
}) {
  return <Base.Root {...(props as object)} />;
}

function ScrollAreaScrollbar({
  forceMount,
  ...props
}: Div & { orientation?: "vertical" | "horizontal"; forceMount?: boolean }) {
  return <Base.Scrollbar {...(props as object)} keepMounted={forceMount} />;
}

export const ScrollArea = {
  Root,
  Viewport: Base.Viewport as React.ComponentType<Div>,
  ScrollAreaScrollbar,
  ScrollAreaThumb: Base.Thumb as React.ComponentType<Div>,
  Corner: Base.Corner as React.ComponentType<Div>,
};
