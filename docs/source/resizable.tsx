// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { cn } from "./utils";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-h-full roc-u-w-full roc-u-aria-[orientation=vertical]:flex-col",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}
function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-flex roc-u-w-px roc-u-items-center roc-u-justify-center roc-u-bg-border roc-u-after:absolute roc-u-after:inset-y-0 roc-u-after:left-1/2 roc-u-after:w-1 roc-u-after:-translate-x-1/2 roc-u-focus-visible:ring-1 roc-u-focus-visible:ring-ring roc-u-focus-visible:ring-offset-1 roc-u-focus-visible:outline-hidden roc-u-aria-[orientation=horizontal]:h-px roc-u-aria-[orientation=horizontal]:w-full roc-u-aria-[orientation=horizontal]:after:left-0 roc-u-aria-[orientation=horizontal]:after:h-1 roc-u-aria-[orientation=horizontal]:after:w-full roc-u-aria-[orientation=horizontal]:after:translate-x-0 roc-u-aria-[orientation=horizontal]:after:-translate-y-1/2 roc-u-[&[aria-orientation=horizontal]>div]:rotate-90",
          className,
        ),
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "roc-shadcn",
            "roc-u-z-10 roc-u-flex roc-u-h-4 roc-u-w-3 roc-u-items-center roc-u-justify-center roc-u-rounded-xs roc-u-border roc-u-bg-border",
          )}
        >
          <GripVerticalIcon
            className={cn("roc-shadcn", "roc-u-size-2.5")}
          />
        </div>
      )}
    </ResizablePrimitive.Separator>
  );
}
export { ResizableHandle, ResizablePanel, ResizablePanelGroup };

import "./resizable.css";
