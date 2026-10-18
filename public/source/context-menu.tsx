// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { ContextMenu as ContextMenuPrimitive } from "./primitive-context-menu";
function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}
function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}
function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}
function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}
function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}
function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-rounded-sm roc-u-px-2 roc-u-py-1.5 roc-u-text-sm roc-u-outline-hidden roc-u-select-none roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-data-[inset]:pl-8 roc-u-data-[state=open]:bg-accent roc-u-data-[state=open]:text-accent-foreground roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4 roc-u-[&_svg:not([class*='text-'])]:text-muted-foreground",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className={cn("roc-shadcn", "roc-u-ml-auto")} />
    </ContextMenuPrimitive.SubTrigger>
  );
}
function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-z-50 roc-u-min-w-[8rem] roc-u-origin-(--radix-context-menu-content-transform-origin) roc-u-overflow-hidden roc-u-rounded-md roc-u-border roc-u-bg-popover roc-u-p-1 roc-u-text-popover-foreground roc-u-shadow-lg roc-u-data-[side=bottom]:slide-in-from-top-2 roc-u-data-[side=left]:slide-in-from-right-2 roc-u-data-[side=right]:slide-in-from-left-2 roc-u-data-[side=top]:slide-in-from-bottom-2 roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:fade-out-0 roc-u-data-[state=closed]:zoom-out-95 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:fade-in-0 roc-u-data-[state=open]:zoom-in-95",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-z-50 roc-u-max-h-(--radix-context-menu-content-available-height) roc-u-min-w-[8rem] roc-u-origin-(--radix-context-menu-content-transform-origin) roc-u-overflow-x-hidden roc-u-overflow-y-auto roc-u-rounded-md roc-u-border roc-u-bg-popover roc-u-p-1 roc-u-text-popover-foreground roc-u-shadow-md roc-u-data-[side=bottom]:slide-in-from-top-2 roc-u-data-[side=left]:slide-in-from-right-2 roc-u-data-[side=right]:slide-in-from-left-2 roc-u-data-[side=top]:slide-in-from-bottom-2 roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:fade-out-0 roc-u-data-[state=closed]:zoom-out-95 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:fade-in-0 roc-u-data-[state=open]:zoom-in-95",
            className,
          ),
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
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
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-gap-2 roc-u-rounded-sm roc-u-py-1.5 roc-u-pr-2 roc-u-pl-8 roc-u-text-sm roc-u-outline-hidden roc-u-select-none roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-data-[disabled]:pointer-events-none roc-u-data-[disabled]:opacity-50 roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4",
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
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className={cn("roc-shadcn", "roc-u-size-4")} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}
function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-gap-2 roc-u-rounded-sm roc-u-py-1.5 roc-u-pr-2 roc-u-pl-8 roc-u-text-sm roc-u-outline-hidden roc-u-select-none roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-data-[disabled]:pointer-events-none roc-u-data-[disabled]:opacity-50 roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4",
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
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon
            className={cn(
              "roc-shadcn",
              "roc-u-size-2 roc-u-fill-current",
            )}
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}
function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-px-2 roc-u-py-1.5 roc-u-text-sm roc-u-font-medium roc-u-text-foreground roc-u-data-[inset]:pl-8",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
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
function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
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
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};

import "./context-menu.css";
