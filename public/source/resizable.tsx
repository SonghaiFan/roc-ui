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
          "roc-s-222f930b8752 roc-s-57c930dc1c31 roc-s-58d0413dd93c roc-s-5c8a9bd15911",
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-86a02c9ddb39 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-a943bea85d66 roc-s-b1cf80175a45 roc-s-f359fcbfc047 roc-s-8fa21a9ac06d roc-s-b9aa6b65b8c6 roc-s-06590d554139 roc-s-39be5a15b766 roc-s-db549d38ff19 roc-s-788fbf3a9c5d roc-s-61740ab1bd1f roc-s-4fd955c4ef55 roc-s-986e32cea4c3 roc-s-c5f832639ef2 roc-s-fb2d65d4342a roc-s-08f085f6a3cd roc-s-239cf1ba5c2f roc-s-09c8e031a498 roc-s-07c408b0b9e0",
          className,
        ),
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "roc-shadcn",
            "roc-s-418e44ad4f9e roc-s-222f930b8752 roc-s-099be97e1fa4 roc-s-eb8f90e771df roc-s-71556df3b421 roc-s-a503dd374cca roc-s-30c08d7acd8f roc-s-4f1a55de40bc roc-s-a943bea85d66",
          )}
        >
          <GripVerticalIcon
            className={cn("roc-shadcn", "roc-s-fe04aff4af4e")}
          />
        </div>
      )}
    </ResizablePrimitive.Separator>
  );
}
export { ResizableHandle, ResizablePanel, ResizablePanelGroup };

import "./resizable.css";
