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
          "roc-s-222f930b8752 roc-s-184ddc11e5f9 roc-s-302c0d124a94 roc-s-074569488cca",
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
          "roc-s-2137fc689640 roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-184ddc11e5f9 roc-s-074569488cca roc-s-c74ab393b96d roc-s-949551edc2b2",
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
          "roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-88b0809ec4a5 roc-s-27ead27a81df roc-s-71556df3b421 roc-s-a503dd374cca roc-s-8ba22fc6f03d roc-s-d5111d0e9f48 roc-s-b005d61d0953 roc-s-87ecb59f2d2d roc-s-d2eb319ba682",
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
          "roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-184ddc11e5f9 roc-s-302c0d124a94 roc-s-08f0549eb630 roc-s-1eb753eb16e8 roc-s-06987024abe7",
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
          "roc-s-222f930b8752 roc-s-81b198a2db84 roc-s-184ddc11e5f9 roc-s-71556df3b421 roc-s-0f9e6672913a roc-s-3992de70b033 roc-s-daaac3fbf55e roc-s-35f35c41d134 roc-s-b331a35b9564",
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
          "roc-s-222f930b8752 roc-s-81b198a2db84 roc-s-184ddc11e5f9 roc-s-71556df3b421 roc-s-0f9e6672913a roc-s-3992de70b033 roc-s-daaac3fbf55e roc-s-35f35c41d134 roc-s-b331a35b9564 roc-s-71a0f6658714",
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
