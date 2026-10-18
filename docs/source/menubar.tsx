// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { Menubar as MenubarPrimitive } from "./primitive-menubar";
function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-h-9 roc-u-items-center roc-u-gap-1 roc-u-rounded-md roc-u-border roc-u-bg-background roc-u-p-1 roc-u-shadow-xs",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}
function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}
function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-items-center roc-u-rounded-sm roc-u-px-2 roc-u-py-1 roc-u-text-sm roc-u-font-medium roc-u-outline-hidden roc-u-select-none roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-data-[state=open]:bg-accent roc-u-data-[state=open]:text-accent-foreground",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-z-50 roc-u-min-w-[12rem] roc-u-origin-(--radix-menubar-content-transform-origin) roc-u-overflow-hidden roc-u-rounded-md roc-u-border roc-u-bg-popover roc-u-p-1 roc-u-text-popover-foreground roc-u-shadow-md roc-u-data-[side=bottom]:slide-in-from-top-2 roc-u-data-[side=left]:slide-in-from-right-2 roc-u-data-[side=right]:slide-in-from-left-2 roc-u-data-[side=top]:slide-in-from-bottom-2 roc-u-data-[state=closed]:fade-out-0 roc-u-data-[state=closed]:zoom-out-95 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:fade-in-0 roc-u-data-[state=open]:zoom-in-95",
            className,
          ),
        )}
        {...props}
      />
    </MenubarPortal>
  );
}
function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-gap-2 roc-u-rounded-sm roc-u-px-2 roc-u-py-1.5 roc-u-text-sm roc-u-outline-hidden roc-u-select-none roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-data-[disabled]:pointer-events-none roc-u-data-[disabled]:opacity-50 roc-u-data-[inset]:pl-8 roc-u-data-[variant=destructive]:text-destructive roc-u-data-[variant=destructive]:focus:bg-destructive/10 roc-u-data-[variant=destructive]:focus:text-destructive roc-u-dark:data-[variant=destructive]:focus:bg-destructive/20 roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4 roc-u-[&_svg:not([class*='text-'])]:text-muted-foreground roc-u-data-[variant=destructive]:*:[svg]:text-destructive!",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-gap-2 roc-u-rounded-xs roc-u-py-1.5 roc-u-pr-2 roc-u-pl-8 roc-u-text-sm roc-u-outline-hidden roc-u-select-none roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-data-[disabled]:pointer-events-none roc-u-data-[disabled]:opacity-50 roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4",
          className,
        ),
      )}
      checked={checked}
      {...props}
    >
      <span
        className={cn(
          "roc-shadcn",
          "roc-u-pointer-events-none roc-u-absolute roc-u-left-2 roc-u-flex roc-u-size-3.5 roc-u-items-center roc-u-justify-center",
        )}
      >
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className={cn("roc-shadcn", "roc-u-size-4")} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}
function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-gap-2 roc-u-rounded-xs roc-u-py-1.5 roc-u-pr-2 roc-u-pl-8 roc-u-text-sm roc-u-outline-hidden roc-u-select-none roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-data-[disabled]:pointer-events-none roc-u-data-[disabled]:opacity-50 roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4",
          className,
        ),
      )}
      {...props}
    >
      <span
        className={cn(
          "roc-shadcn",
          "roc-u-pointer-events-none roc-u-absolute roc-u-left-2 roc-u-flex roc-u-size-3.5 roc-u-items-center roc-u-justify-center",
        )}
      >
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon
            className={cn(
              "roc-shadcn",
              "roc-u-size-2 roc-u-fill-current",
            )}
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}
function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-px-2 roc-u-py-1.5 roc-u-text-sm roc-u-font-medium roc-u-data-[inset]:pl-8",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u--mx-1 roc-u-my-1 roc-u-h-px roc-u-bg-border",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-ml-auto roc-u-text-xs roc-u-tracking-widest roc-u-text-muted-foreground",
          className,
        ),
      )}
      {...props}
    />
  );
}
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-rounded-sm roc-u-px-2 roc-u-py-1.5 roc-u-text-sm roc-u-outline-none roc-u-select-none roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-data-[inset]:pl-8 roc-u-data-[state=open]:bg-accent roc-u-data-[state=open]:text-accent-foreground",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon
        className={cn(
          "roc-shadcn",
          "roc-u-ml-auto roc-u-h-4 roc-u-w-4",
        )}
      />
    </MenubarPrimitive.SubTrigger>
  );
}
function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-z-50 roc-u-min-w-[8rem] roc-u-origin-(--radix-menubar-content-transform-origin) roc-u-overflow-hidden roc-u-rounded-md roc-u-border roc-u-bg-popover roc-u-p-1 roc-u-text-popover-foreground roc-u-shadow-lg roc-u-data-[side=bottom]:slide-in-from-top-2 roc-u-data-[side=left]:slide-in-from-right-2 roc-u-data-[side=right]:slide-in-from-left-2 roc-u-data-[side=top]:slide-in-from-bottom-2 roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:fade-out-0 roc-u-data-[state=closed]:zoom-out-95 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:fade-in-0 roc-u-data-[state=open]:zoom-in-95",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};

import "./menubar.css";
