// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";
import { ChevronDownIcon } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "./primitive-navigation-menu";
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
          "roc-u-group/navigation-menu roc-u-relative roc-u-flex roc-u-max-w-max roc-u-flex-1 roc-u-items-center roc-u-justify-center",
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
          "roc-u-group roc-u-flex roc-u-flex-1 roc-u-list-none roc-u-items-center roc-u-justify-center roc-u-gap-1",
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
      className={cn("roc-shadcn", cn("roc-u-relative", className))}
      {...props}
    />
  );
}
const navigationMenuTriggerStyle = cva(
  "roc-u-group roc-u-inline-flex roc-u-h-9 roc-u-w-max roc-u-items-center roc-u-justify-center roc-u-rounded-md roc-u-bg-background roc-u-px-4 roc-u-py-2 roc-u-text-sm roc-u-font-medium roc-u-transition-[color,box-shadow] roc-u-outline-none roc-u-hover:bg-accent roc-u-hover:text-accent-foreground roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-focus-visible:ring-[3px] roc-u-focus-visible:ring-ring/50 roc-u-focus-visible:outline-1 roc-u-disabled:pointer-events-none roc-u-disabled:opacity-50 roc-u-data-[state=open]:bg-accent/50 roc-u-data-[state=open]:text-accent-foreground roc-u-data-[state=open]:hover:bg-accent roc-u-data-[state=open]:focus:bg-accent",
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
        cn(navigationMenuTriggerStyle(), "roc-u-group", className),
      )}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className={cn(
          "roc-shadcn",
          "roc-u-relative roc-u-top-[1px] roc-u-ml-1 roc-u-size-3 roc-u-transition roc-u-duration-300 roc-u-group-data-[state=open]:rotate-180",
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
          "roc-u-top-0 roc-u-left-0 roc-u-w-full roc-u-p-2 roc-u-pr-2.5 roc-u-data-[motion=from-end]:slide-in-from-right-52 roc-u-data-[motion=from-start]:slide-in-from-left-52 roc-u-data-[motion=to-end]:slide-out-to-right-52 roc-u-data-[motion=to-start]:slide-out-to-left-52 roc-u-data-[motion^=from-]:animate-in roc-u-data-[motion^=from-]:fade-in roc-u-data-[motion^=to-]:animate-out roc-u-data-[motion^=to-]:fade-out roc-u-md:absolute roc-u-md:w-auto",
          "roc-u-group-data-[viewport=false]/navigation-menu:top-full roc-u-group-data-[viewport=false]/navigation-menu:mt-1.5 roc-u-group-data-[viewport=false]/navigation-menu:overflow-hidden roc-u-group-data-[viewport=false]/navigation-menu:rounded-md roc-u-group-data-[viewport=false]/navigation-menu:border roc-u-group-data-[viewport=false]/navigation-menu:bg-popover roc-u-group-data-[viewport=false]/navigation-menu:text-popover-foreground roc-u-group-data-[viewport=false]/navigation-menu:shadow roc-u-group-data-[viewport=false]/navigation-menu:duration-200 roc-u-**:data-[slot=navigation-menu-link]:focus:ring-0 roc-u-**:data-[slot=navigation-menu-link]:focus:outline-none roc-u-group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out roc-u-group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 roc-u-group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 roc-u-group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in roc-u-group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 roc-u-group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
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
          "roc-u-absolute roc-u-top-full roc-u-left-0 roc-u-isolate roc-u-z-50 roc-u-flex roc-u-justify-center",
        ),
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-origin-top-center roc-u-relative roc-u-mt-1.5 roc-u-h-[var(--radix-navigation-menu-viewport-height)] roc-u-w-full roc-u-overflow-hidden roc-u-rounded-md roc-u-border roc-u-bg-popover roc-u-text-popover-foreground roc-u-shadow roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:zoom-out-95 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:zoom-in-90 roc-u-md:w-[var(--radix-navigation-menu-viewport-width)]",
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
          "roc-u-flex roc-u-flex-col roc-u-gap-1 roc-u-rounded-sm roc-u-p-2 roc-u-text-sm roc-u-transition-all roc-u-outline-none roc-u-hover:bg-accent roc-u-hover:text-accent-foreground roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-focus-visible:ring-[3px] roc-u-focus-visible:ring-ring/50 roc-u-focus-visible:outline-1 roc-u-data-[active=true]:bg-accent/50 roc-u-data-[active=true]:text-accent-foreground roc-u-data-[active=true]:hover:bg-accent roc-u-data-[active=true]:focus:bg-accent roc-u-[&_svg:not([class*='size-'])]:size-4 roc-u-[&_svg:not([class*='text-'])]:text-muted-foreground",
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
          "roc-u-top-full roc-u-z-[1] roc-u-flex roc-u-h-1.5 roc-u-items-end roc-u-justify-center roc-u-overflow-hidden roc-u-data-[state=hidden]:animate-out roc-u-data-[state=hidden]:fade-out roc-u-data-[state=visible]:animate-in roc-u-data-[state=visible]:fade-in",
          className,
        ),
      )}
      {...props}
    >
      <div
        className={cn(
          "roc-shadcn",
          "roc-u-relative roc-u-top-[60%] roc-u-h-2 roc-u-w-2 roc-u-rotate-45 roc-u-rounded-tl-sm roc-u-bg-border roc-u-shadow-md",
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
