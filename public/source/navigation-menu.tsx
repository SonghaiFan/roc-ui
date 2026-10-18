// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";
import { ChevronDownIcon } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-973828d22eaf roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-c134b3a295c1 roc-s-7bd5bab6d7f4 roc-s-71556df3b421 roc-s-a503dd374cca",
          className,
        ),
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}
function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-ad936fcbed63 roc-s-222f930b8752 roc-s-7bd5bab6d7f4 roc-s-bae566d754a0 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-19e97f3f40e6",
          className,
        ),
      )}
      {...props}
    />
  );
}
function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("roc-shadcn", cn("roc-s-d2d9e1f13413", className))}
      {...props}
    />
  );
}
const navigationMenuTriggerStyle = cva(
  "roc-s-ad936fcbed63 roc-s-123306850fe1 roc-s-539ae144f076 roc-s-1a3b2d110302 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-3fa8c572949b roc-s-5b272f3c5076 roc-s-9513b3968002 roc-s-b5edc3ea7c91 roc-s-c74ab393b96d roc-s-daaac3fbf55e roc-s-4a85c59e17d7 roc-s-b30fc56058b6 roc-s-37ad15a95595 roc-s-9f1f77b92dcb roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-365a4654f7b1 roc-s-392a26f4c1b0 roc-s-1df9125eebaf roc-s-8d3c1014b967 roc-s-4600b77303d6 roc-s-c08b523d742c roc-s-1952cd5b00aa roc-s-6683d6959637 roc-s-4b2c04c28c89",
);
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        "roc-shadcn",
        cn(navigationMenuTriggerStyle(), "roc-s-ad936fcbed63", className),
      )}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className={cn(
          "roc-shadcn",
          "roc-s-d2d9e1f13413 roc-s-dada435c833d roc-s-0ffd487f26ca roc-s-5e34f5313859 roc-s-70dd37c11434 roc-s-f07df86364db roc-s-a51b5996d2bb",
        )}
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-98599e4ee250 roc-s-635702706586 roc-s-58d0413dd93c roc-s-b97db4a9f432 roc-s-337853ce1f54 roc-s-728c5d7f3de3 roc-s-5d46523c1c03 roc-s-2b80965601b8 roc-s-c368656c7cea roc-s-38eca4883b01 roc-s-0658d6c18b89 roc-s-386139ab31b5 roc-s-371d804c0267 roc-s-6776c24a9e8d roc-s-2cf968c3a3a4",
          "roc-s-842853f9122e roc-s-3407916e928d roc-s-07651829db95 roc-s-decf6bb870dc roc-s-70f47c59e1f5 roc-s-232ba64daa76 roc-s-d88c860b5728 roc-s-75cce7e2a885 roc-s-554c034d57b4 roc-s-b5fca8f9f38f roc-s-06df00951969 roc-s-05128f05d839 roc-s-595e06d193f8 roc-s-07b3d1890bd0 roc-s-b78a061cc2f0 roc-s-8ca7c2d5f56b roc-s-9569d612f0b4",
          className,
        ),
      )}
      {...props}
    />
  );
}
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-747355bdc2a2 roc-s-b726f5a347ca roc-s-635702706586 roc-s-014aadadffad roc-s-3eef1ce97dba roc-s-222f930b8752 roc-s-a503dd374cca",
        ),
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-s-59495c682798 roc-s-d2d9e1f13413 roc-s-5a06344d3117 roc-s-25728bc0c8aa roc-s-58d0413dd93c roc-s-d5111d0e9f48 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-e593c38256e0 roc-s-5bd2afe89f0b roc-s-0bb09d80600e roc-s-0cb4489c3645 roc-s-f4cf4be63707 roc-s-bae1e782f277 roc-s-9995e5162991 roc-s-bdc127d6ea39",
            className,
          ),
        )}
        {...props}
      />
    </div>
  );
}
function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-302c0d124a94 roc-s-19e97f3f40e6 roc-s-02e603944040 roc-s-b97db4a9f432 roc-s-c74ab393b96d roc-s-9952ed32207c roc-s-b30fc56058b6 roc-s-37ad15a95595 roc-s-9f1f77b92dcb roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-365a4654f7b1 roc-s-392a26f4c1b0 roc-s-1df9125eebaf roc-s-6f2003b19dc6 roc-s-1f9c6b72388b roc-s-2923539ebbde roc-s-28a6c82f3618 roc-s-eb5ef2dbc2d4 roc-s-8637dfd54fbb",
          className,
        ),
      )}
      {...props}
    />
  );
}
function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-b726f5a347ca roc-s-33a37c4040fd roc-s-222f930b8752 roc-s-de88511473d1 roc-s-0ccd70f0f8e5 roc-s-a503dd374cca roc-s-d5111d0e9f48 roc-s-e3e9a7bfd8b5 roc-s-9f01b8ed6147 roc-s-56324c1d0658 roc-s-5fdc53977ab3",
          className,
        ),
      )}
      {...props}
    >
      <div
        className={cn(
          "roc-shadcn",
          "roc-s-d2d9e1f13413 roc-s-10f17fdc5a9c roc-s-f5728694f674 roc-s-d4ea834145ae roc-s-c80411b7591f roc-s-9940adbaae5b roc-s-a943bea85d66 roc-s-94ea94fde25f",
        )}
      />
    </NavigationMenuPrimitive.Indicator>
  );
}
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};

import "./navigation-menu.css";
