// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { Drawer as DrawerPrimitive } from "vaul";
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
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
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-group/drawer-content roc-u-fixed roc-u-z-50 roc-u-flex roc-u-h-auto roc-u-flex-col roc-u-bg-background",
            "roc-u-data-[vaul-drawer-direction=top]:inset-x-0 roc-u-data-[vaul-drawer-direction=top]:top-0 roc-u-data-[vaul-drawer-direction=top]:mb-24 roc-u-data-[vaul-drawer-direction=top]:max-h-[80vh] roc-u-data-[vaul-drawer-direction=top]:rounded-b-lg roc-u-data-[vaul-drawer-direction=top]:border-b",
            "roc-u-data-[vaul-drawer-direction=bottom]:inset-x-0 roc-u-data-[vaul-drawer-direction=bottom]:bottom-0 roc-u-data-[vaul-drawer-direction=bottom]:mt-24 roc-u-data-[vaul-drawer-direction=bottom]:max-h-[80vh] roc-u-data-[vaul-drawer-direction=bottom]:rounded-t-lg roc-u-data-[vaul-drawer-direction=bottom]:border-t",
            "roc-u-data-[vaul-drawer-direction=right]:inset-y-0 roc-u-data-[vaul-drawer-direction=right]:right-0 roc-u-data-[vaul-drawer-direction=right]:w-3/4 roc-u-data-[vaul-drawer-direction=right]:border-l roc-u-data-[vaul-drawer-direction=right]:sm:max-w-sm",
            "roc-u-data-[vaul-drawer-direction=left]:inset-y-0 roc-u-data-[vaul-drawer-direction=left]:left-0 roc-u-data-[vaul-drawer-direction=left]:w-3/4 roc-u-data-[vaul-drawer-direction=left]:border-r roc-u-data-[vaul-drawer-direction=left]:sm:max-w-sm",
            className,
          ),
        )}
        {...props}
      >
        <div
          className={cn(
            "roc-shadcn",
            "roc-u-mx-auto roc-u-mt-4 roc-u-hidden roc-u-h-2 roc-u-w-[100px] roc-u-shrink-0 roc-u-rounded-full roc-u-bg-muted roc-u-group-data-[vaul-drawer-direction=bottom]/drawer-content:block",
          )}
        />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-flex-col roc-u-gap-0.5 roc-u-p-4 roc-u-group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center roc-u-group-data-[vaul-drawer-direction=top]/drawer-content:text-center roc-u-md:gap-1.5 roc-u-md:text-left",
          className,
        ),
      )}
      {...props}
    />
  );
}
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
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
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "roc-shadcn",
        cn("roc-u-font-semibold roc-u-text-foreground", className),
      )}
      {...props}
    />
  );
}
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        "roc-shadcn",
        cn("roc-u-text-sm roc-u-text-muted-foreground", className),
      )}
      {...props}
    />
  );
}
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};

import "./drawer.css";
