// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller";
import { cn } from "./utils";
import { ArrowDownIcon } from "lucide-react";
import { Button } from "./button";
function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>,
) {
  return <MessageScrollerPrimitive.Provider {...props} />;
}
function MessageScroller({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/message-scroller roc-u-relative roc-u-flex roc-u-size-full roc-u-min-h-0 roc-u-flex-col roc-u-overflow-hidden",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-size-full roc-u-min-h-0 roc-u-min-w-0 roc-u-scroll-fade-b roc-u-scrollbar-thin roc-u-scrollbar-gutter-stable roc-u-overflow-y-auto roc-u-overscroll-contain roc-u-contain-content roc-u-data-autoscrolling:scrollbar-none roc-u-data-pending-scroll:invisible",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-h-max roc-u-min-h-full roc-u-flex-col roc-u-gap-8",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Item>) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-min-w-0 roc-u-shrink-0 roc-u-[contain-intrinsic-size:auto_10rem] roc-u-[content-visibility:auto]",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MessageScrollerButton({
  direction = "end",
  className,
  children,
  render,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Button> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      data-variant={variant}
      data-size={size}
      direction={direction}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-absolute roc-u-inset-s-1/2 roc-u--translate-x-1/2 roc-u-border-border roc-u-bg-background roc-u-text-foreground roc-u-transition-[translate,scale,opacity] roc-u-duration-200 roc-u-hover:bg-muted roc-u-hover:text-foreground roc-u-data-[active=false]:pointer-events-none roc-u-data-[active=false]:scale-95 roc-u-data-[active=false]:opacity-0 roc-u-data-[active=false]:duration-400 roc-u-data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] roc-u-data-[active=true]:translate-y-0 roc-u-data-[active=true]:scale-100 roc-u-data-[active=true]:opacity-100 roc-u-data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] roc-u-data-[direction=end]:bottom-4 roc-u-data-[direction=end]:data-[active=false]:translate-y-full roc-u-data-[direction=start]:top-4 roc-u-data-[direction=start]:data-[active=false]:-translate-y-full roc-u-rtl:translate-x-1/2 roc-u-data-[direction=start]:[&_svg]:rotate-180",
          className,
        ),
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon />
          <span className={cn("roc-shadcn", "roc-u-sr-only")}>
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  );
}
export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
};

import "./message-scroller.css";
