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
          "roc-s-992a93455c71 roc-s-ce13093ad8c9 roc-s-3eef1ce97dba roc-s-cba3ecce1586 roc-s-0cb4489c3645 roc-s-bb5869ef903b roc-s-bae1e782f277 roc-s-45464a92c1f6",
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
            "roc-s-08e3dc5dec35 roc-s-992a93455c71 roc-s-3eef1ce97dba roc-s-222f930b8752 roc-s-a66e9985b093 roc-s-302c0d124a94 roc-s-5b272f3c5076",
            "roc-s-d9fa5b42a0be roc-s-a601576b1200 roc-s-2305ef0cb333 roc-s-6755d856efd3 roc-s-db44a019f8c8 roc-s-eec9636783e1",
            "roc-s-54ec71bbb4f4 roc-s-4b1801b9d2ed roc-s-d2730b0d5bfd roc-s-b15f9b92a89f roc-s-eb346766c4b9 roc-s-d11bb29f4945",
            "roc-s-b9637f35aee7 roc-s-14d1bc4eb1f8 roc-s-ee60cb12b9e3 roc-s-0c0b6fc3fb6a roc-s-a3e649aac6ae",
            "roc-s-d30f0988fb00 roc-s-f6da55047272 roc-s-8ab9012051ed roc-s-f9afab055378 roc-s-c564b4f84a1d",
            className,
          ),
        )}
        {...props}
      >
        <div
          className={cn(
            "roc-shadcn",
            "roc-s-1752f11474a6 roc-s-dc1d1f5a54cf roc-s-e564b4081d7a roc-s-f5728694f674 roc-s-2e20485042ce roc-s-27ead27a81df roc-s-b005d61d0953 roc-s-87ecb59f2d2d roc-s-a14cef733988",
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
          "roc-s-222f930b8752 roc-s-302c0d124a94 roc-s-11773e883e74 roc-s-99df86594a98 roc-s-d228ec38d8fb roc-s-52135e280da5 roc-s-fee66e134c2c roc-s-9557c80c6991",
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
          "roc-s-930e37ac8b7d roc-s-222f930b8752 roc-s-302c0d124a94 roc-s-074569488cca roc-s-99df86594a98",
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
        cn("roc-s-87e86ce38eaf roc-s-957a109f887f", className),
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
        cn("roc-s-c74ab393b96d roc-s-35f35c41d134", className),
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
