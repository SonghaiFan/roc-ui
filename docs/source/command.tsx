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
          "roc-s-222f930b8752 roc-s-57c930dc1c31 roc-s-58d0413dd93c roc-s-302c0d124a94 roc-s-d5111d0e9f48 roc-s-3fa8c572949b roc-s-e593c38256e0 roc-s-5bd2afe89f0b",
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
      <DialogHeader className={cn("roc-shadcn", "roc-s-32fb090591d9")}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "roc-shadcn",
          cn("roc-s-d5111d0e9f48 roc-s-04760bcd507f", className),
        )}
        showCloseButton={showCloseButton}
      >
        <Command
          className={cn(
            "roc-shadcn",
            "roc-s-10a03fa28f14 roc-s-8fcda2a38df2 roc-s-2d72ddbc758f roc-s-fa4dcbaf770b roc-s-77408629f84a roc-s-ba17ce9c01c5 roc-s-ec0a1ada694a roc-s-3db94f770644 roc-s-98d11503a494 roc-s-ecc052a24bb2 roc-s-95ecca1d7827 roc-s-567d75db6837 roc-s-6d82666deb29",
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
        "roc-s-222f930b8752 roc-s-539ae144f076 roc-s-71556df3b421 roc-s-074569488cca roc-s-bbe39cfb5cc6 roc-s-0f9e6672913a",
      )}
    >
      <SearchIcon
        className={cn(
          "roc-shadcn",
          "roc-s-100c22d5776b roc-s-27ead27a81df roc-s-0b5a4d1257ab",
        )}
      />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-s-222f930b8752 roc-s-fdd2f85cad6b roc-s-58d0413dd93c roc-s-3fa8c572949b roc-s-8fca9236d191 roc-s-d3cea061f2f3 roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-20315da78444 roc-s-db567af109b7 roc-s-4600b77303d6",
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
          "roc-s-e4cdcd06ee9f roc-s-f030a1475cdf roc-s-3b82279f859f roc-s-2368e909f3a5",
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
        "roc-s-54402b76b277 roc-s-05ab12448317 roc-s-c74ab393b96d",
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
          "roc-s-d5111d0e9f48 roc-s-1dee6e3ec67d roc-s-957a109f887f roc-s-8fcda2a38df2 roc-s-2eef4a416e7c roc-s-159a1790006f roc-s-2d72ddbc758f roc-s-fa4dcbaf770b",
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
          "roc-s-abba77319850 roc-s-ae2c4b060bb9 roc-s-a943bea85d66",
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-074569488cca roc-s-02e603944040 roc-s-e7e01cc7f4df roc-s-a8c1dfb1d4ef roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-ae189665dda5 roc-s-119c7ba8f69c roc-s-9909245679cf roc-s-d688e57af012 roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4 roc-s-8637dfd54fbb",
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
          "roc-s-cc51bda60e7e roc-s-3992de70b033 roc-s-e1683b3c030a roc-s-35f35c41d134",
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
