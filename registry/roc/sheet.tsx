// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "./primitive-dialog";
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-fixed roc-u-inset-0 roc-u-z-50 roc-u-bg-black/50 roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:fade-out-0 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:fade-in-0",
          className,
        ),
      )}
      {...props}
    />
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-fixed roc-u-z-50 roc-u-flex roc-u-flex-col roc-u-gap-4 roc-u-bg-background roc-u-shadow-lg roc-u-transition roc-u-ease-in-out roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:duration-300 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:duration-500",
            side === "right" &&
              "roc-u-inset-y-0 roc-u-right-0 roc-u-h-full roc-u-w-3/4 roc-u-border-l roc-u-data-[state=closed]:slide-out-to-right roc-u-data-[state=open]:slide-in-from-right roc-u-sm:max-w-sm",
            side === "left" &&
              "roc-u-inset-y-0 roc-u-left-0 roc-u-h-full roc-u-w-3/4 roc-u-border-r roc-u-data-[state=closed]:slide-out-to-left roc-u-data-[state=open]:slide-in-from-left roc-u-sm:max-w-sm",
            side === "top" &&
              "roc-u-inset-x-0 roc-u-top-0 roc-u-h-auto roc-u-border-b roc-u-data-[state=closed]:slide-out-to-top roc-u-data-[state=open]:slide-in-from-top",
            side === "bottom" &&
              "roc-u-inset-x-0 roc-u-bottom-0 roc-u-h-auto roc-u-border-t roc-u-data-[state=closed]:slide-out-to-bottom roc-u-data-[state=open]:slide-in-from-bottom",
            className,
          ),
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            className={cn(
              "roc-shadcn",
              "roc-u-absolute roc-u-top-4 roc-u-right-4 roc-u-rounded-xs roc-u-opacity-70 roc-u-ring-offset-background roc-u-transition-opacity roc-u-hover:opacity-100 roc-u-focus:ring-2 roc-u-focus:ring-ring roc-u-focus:ring-offset-2 roc-u-focus:outline-hidden roc-u-disabled:pointer-events-none roc-u-data-[state=open]:bg-secondary",
            )}
          >
            <XIcon className={cn("roc-shadcn", "roc-u-size-4")} />
            <span className={cn("roc-shadcn", "roc-u-sr-only")}>
              Close
            </span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-flex-col roc-u-gap-1.5 roc-u-p-4",
          className,
        ),
      )}
      {...props}
    />
  );
}
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-mt-auto roc-u-flex roc-u-flex-col roc-u-gap-2 roc-u-p-4",
          className,
        ),
      )}
      {...props}
    />
  );
}
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "roc-shadcn",
        cn("roc-u-font-semibold roc-u-text-foreground", className),
      )}
      {...props}
    />
  );
}
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(
        "roc-shadcn",
        cn("roc-u-text-sm roc-u-text-muted-foreground", className),
      )}
      {...props}
    />
  );
}
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};

import "./sheet.css";
