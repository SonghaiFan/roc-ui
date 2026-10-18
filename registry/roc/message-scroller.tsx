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
          "roc-s-db75359a0c52 roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-4f43603c850c roc-s-410da8dfa8ac roc-s-302c0d124a94 roc-s-d5111d0e9f48",
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
          "roc-s-4f43603c850c roc-s-410da8dfa8ac roc-s-184ddc11e5f9 roc-s-99a63ca0c52a roc-s-51bebba470f2 roc-s-09aad479281c roc-s-2368e909f3a5 roc-s-998780cdef87 roc-s-c4265f330f92 roc-s-650161021cc7 roc-s-04930ecc6966",
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
          "roc-s-222f930b8752 roc-s-6cf42399d79e roc-s-7b9529b85009 roc-s-302c0d124a94 roc-s-a407069306f8",
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
          "roc-s-184ddc11e5f9 roc-s-27ead27a81df roc-s-95540cecf6da roc-s-56e120c241b2",
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
          "roc-s-747355bdc2a2 roc-s-6fb641e783f0 roc-s-832dd3994685 roc-s-b1e6016d4f99 roc-s-5b272f3c5076 roc-s-957a109f887f roc-s-2d87f6d61329 roc-s-10e9f177b8fc roc-s-e435a78a4f9f roc-s-4d6720d47806 roc-s-ef91e8451302 roc-s-9948be366c01 roc-s-39e04c00e01f roc-s-50e4a4ee72fb roc-s-341087410cfb roc-s-bc80033e68d5 roc-s-ffaa59b4cdcd roc-s-2c56d5bd1e6c roc-s-19b26cdb9c62 roc-s-0af8706ebfef roc-s-a1b3e37a03be roc-s-c1f23b4f38ef roc-s-e77b6702fb02 roc-s-68ba1bf2c65e roc-s-da969f284c81",
          className,
        ),
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon />
          <span className={cn("roc-shadcn", "roc-s-32fb090591d9")}>
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
