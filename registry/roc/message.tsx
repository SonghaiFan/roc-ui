// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-min-w-0 roc-u-flex-col roc-u-gap-2",
          className,
        ),
      )}
      {...props}
    />
  );
}
function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end";
}) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/message roc-u-relative roc-u-flex roc-u-w-full roc-u-min-w-0 roc-u-gap-2 roc-u-text-sm roc-u-data-[align=end]:flex-row-reverse",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-w-fit roc-u-min-w-8 roc-u-shrink-0 roc-u-items-center roc-u-justify-center roc-u-self-end roc-u-overflow-hidden roc-u-rounded-full roc-u-bg-muted roc-u-group-has-data-[slot=message-footer]/message:-translate-y-8",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-w-full roc-u-min-w-0 roc-u-flex-col roc-u-gap-2.5 roc-u-wrap-break-word roc-u-group-data-[align=end]/message:*:data-slot:self-end",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-max-w-full roc-u-min-w-0 roc-u-items-center roc-u-px-3 roc-u-text-xs roc-u-font-medium roc-u-text-muted-foreground roc-u-group-has-data-[variant=ghost]/message:px-0",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-max-w-full roc-u-min-w-0 roc-u-items-center roc-u-px-3 roc-u-text-xs roc-u-font-medium roc-u-text-muted-foreground roc-u-group-has-data-[variant=ghost]/message:px-0 roc-u-group-data-[align=end]/message:justify-end",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
};

import "./message.css";
