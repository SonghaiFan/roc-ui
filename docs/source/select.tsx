// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "./primitive-select";
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-w-fit roc-u-items-center roc-u-justify-between roc-u-gap-2 roc-u-rounded-md roc-u-border roc-u-border-input roc-u-bg-transparent roc-u-px-3 roc-u-py-2 roc-u-text-sm roc-u-whitespace-nowrap roc-u-shadow-xs roc-u-transition-[color,box-shadow] roc-u-outline-none roc-u-focus-visible:border-ring roc-u-focus-visible:ring-[3px] roc-u-focus-visible:ring-ring/50 roc-u-disabled:cursor-not-allowed roc-u-disabled:opacity-50 roc-u-aria-invalid:border-destructive roc-u-aria-invalid:ring-destructive/20 roc-u-data-[placeholder]:text-muted-foreground roc-u-data-[size=default]:h-9 roc-u-data-[size=sm]:h-8 roc-u-*:data-[slot=select-value]:line-clamp-1 roc-u-*:data-[slot=select-value]:flex roc-u-*:data-[slot=select-value]:items-center roc-u-*:data-[slot=select-value]:gap-2 roc-u-dark:bg-input/30 roc-u-dark:hover:bg-input/50 roc-u-dark:aria-invalid:ring-destructive/40 roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4 roc-u-[&_svg:not([class*='text-'])]:text-muted-foreground",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          className={cn("roc-shadcn", "roc-u-size-4 roc-u-opacity-50")}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-relative roc-u-z-50 roc-u-max-h-(--radix-select-content-available-height) roc-u-min-w-[8rem] roc-u-origin-(--radix-select-content-transform-origin) roc-u-overflow-x-hidden roc-u-overflow-y-auto roc-u-rounded-md roc-u-border roc-u-bg-popover roc-u-text-popover-foreground roc-u-shadow-md roc-u-data-[side=bottom]:slide-in-from-top-2 roc-u-data-[side=left]:slide-in-from-right-2 roc-u-data-[side=right]:slide-in-from-left-2 roc-u-data-[side=top]:slide-in-from-bottom-2 roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:fade-out-0 roc-u-data-[state=closed]:zoom-out-95 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:fade-in-0 roc-u-data-[state=open]:zoom-in-95",
            position === "popper" &&
              "roc-u-data-[side=bottom]:translate-y-1 roc-u-data-[side=left]:-translate-x-1 roc-u-data-[side=right]:translate-x-1 roc-u-data-[side=top]:-translate-y-1",
            className,
          ),
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "roc-shadcn",
            cn(
              "roc-u-p-1",
              position === "popper" &&
                "roc-u-w-full roc-u-min-w-[var(--radix-select-trigger-width)] roc-u-scroll-my-1",
            ),
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-px-2 roc-u-py-1.5 roc-u-text-xs roc-u-text-muted-foreground",
          className,
        ),
      )}
      {...props}
    />
  );
}
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-flex roc-u-w-full roc-u-cursor-default roc-u-items-center roc-u-gap-2 roc-u-rounded-sm roc-u-py-1.5 roc-u-pr-8 roc-u-pl-2 roc-u-text-sm roc-u-outline-hidden roc-u-select-none roc-u-focus:bg-accent roc-u-focus:text-accent-foreground roc-u-data-[disabled]:pointer-events-none roc-u-data-[disabled]:opacity-50 roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4 roc-u-[&_svg:not([class*='text-'])]:text-muted-foreground roc-u-*:[span]:last:flex roc-u-*:[span]:last:items-center roc-u-*:[span]:last:gap-2",
          className,
        ),
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className={cn(
          "roc-shadcn",
          "roc-u-absolute roc-u-right-2 roc-u-flex roc-u-size-3.5 roc-u-items-center roc-u-justify-center",
        )}
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className={cn("roc-shadcn", "roc-u-size-4")} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-pointer-events-none roc-u--mx-1 roc-u-my-1 roc-u-h-px roc-u-bg-border",
          className,
        ),
      )}
      {...props}
    />
  );
}
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-justify-center roc-u-py-1",
          className,
        ),
      )}
      {...props}
    >
      <ChevronUpIcon className={cn("roc-shadcn", "roc-u-size-4")} />
    </SelectPrimitive.ScrollUpButton>
  );
}
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-justify-center roc-u-py-1",
          className,
        ),
      )}
      {...props}
    >
      <ChevronDownIcon className={cn("roc-shadcn", "roc-u-size-4")} />
    </SelectPrimitive.ScrollDownButton>
  );
}
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};

import "./select.css";
