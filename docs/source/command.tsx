// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "./utils";
import { SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-h-full roc-u-w-full roc-u-flex-col roc-u-overflow-hidden roc-u-rounded-md roc-u-bg-popover roc-u-text-popover-foreground",
          className,
        ),
      )}
      {...props}
    />
  );
}
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className={cn("roc-shadcn", "roc-u-sr-only")}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "roc-shadcn",
          cn("roc-u-overflow-hidden roc-u-p-0", className),
        )}
        showCloseButton={showCloseButton}
      >
        <Command
          className={cn(
            "roc-shadcn",
            "roc-u-**:data-[slot=command-input-wrapper]:h-12 roc-u-[&_[cmdk-group-heading]]:px-2 roc-u-[&_[cmdk-group-heading]]:font-medium roc-u-[&_[cmdk-group-heading]]:text-muted-foreground roc-u-[&_[cmdk-group]]:px-2 roc-u-[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 roc-u-[&_[cmdk-input-wrapper]_svg]:h-5 roc-u-[&_[cmdk-input-wrapper]_svg]:w-5 roc-u-[&_[cmdk-input]]:h-12 roc-u-[&_[cmdk-item]]:px-2 roc-u-[&_[cmdk-item]]:py-3 roc-u-[&_[cmdk-item]_svg]:h-5 roc-u-[&_[cmdk-item]_svg]:w-5",
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className={cn(
        "roc-shadcn",
        "roc-u-flex roc-u-h-9 roc-u-items-center roc-u-gap-2 roc-u-border-b roc-u-px-3",
      )}
    >
      <SearchIcon
        className={cn(
          "roc-shadcn",
          "roc-u-size-4 roc-u-shrink-0 roc-u-opacity-50",
        )}
      />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-flex roc-u-h-10 roc-u-w-full roc-u-rounded-md roc-u-bg-transparent roc-u-py-3 roc-u-text-sm roc-u-outline-hidden roc-u-placeholder:text-muted-foreground roc-u-disabled:cursor-not-allowed roc-u-disabled:opacity-50",
            className,
          ),
        )}
        {...props}
      />
    </div>
  );
}
function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-max-h-[300px] roc-u-scroll-py-1 roc-u-overflow-x-hidden roc-u-overflow-y-auto",
          className,
        ),
      )}
      {...props}
    />
  );
}
function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "roc-shadcn",
        "roc-u-py-6 roc-u-text-center roc-u-text-sm",
      )}
      {...props}
    />
  );
}
function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-overflow-hidden roc-u-p-1 roc-u-text-foreground roc-u-[&_[cmdk-group-heading]]:px-2 roc-u-[&_[cmdk-group-heading]]:py-1.5 roc-u-[&_[cmdk-group-heading]]:text-xs roc-u-[&_[cmdk-group-heading]]:font-medium roc-u-[&_[cmdk-group-heading]]:text-muted-foreground",
          className,
        ),
      )}
      {...props}
    />
  );
}
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u--mx-1 roc-u-h-px roc-u-bg-border",
          className,
        ),
      )}
      {...props}
    />
  );
}
function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-flex roc-u-cursor-default roc-u-items-center roc-u-gap-2 roc-u-rounded-sm roc-u-px-2 roc-u-py-1.5 roc-u-text-sm roc-u-outline-hidden roc-u-select-none roc-u-data-[disabled=true]:pointer-events-none roc-u-data-[disabled=true]:opacity-50 roc-u-data-[selected=true]:bg-accent roc-u-data-[selected=true]:text-accent-foreground roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4 roc-u-[&_svg:not([class*='text-'])]:text-muted-foreground",
          className,
        ),
      )}
      {...props}
    />
  );
}
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
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
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};

import "./command.css";
