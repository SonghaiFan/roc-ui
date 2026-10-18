// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
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
          "roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-02e603944040 roc-s-e7e01cc7f4df roc-s-a8c1dfb1d4ef roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-6fa6a8ade7c4 roc-s-4027d9c589b6 roc-s-1952cd5b00aa roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4 roc-s-8637dfd54fbb",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className={cn("roc-shadcn", "roc-s-cc51bda60e7e")} />
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
          "roc-s-3eef1ce97dba roc-s-e9ab1547c94d roc-s-46e43ffa5bf3 roc-s-d5111d0e9f48 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-e593c38256e0 roc-s-1dee6e3ec67d roc-s-5bd2afe89f0b roc-s-0d4ca75de41c roc-s-89f6aab7a3f8 roc-s-3550f48d66b9 roc-s-7720fe004f5c roc-s-66b560f839de roc-s-0cb4489c3645 roc-s-bb5869ef903b roc-s-f4cf4be63707 roc-s-bae1e782f277 roc-s-45464a92c1f6 roc-s-9ca352480f25",
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
            "roc-s-3eef1ce97dba roc-s-be6b61edce8b roc-s-e9ab1547c94d roc-s-46e43ffa5bf3 roc-s-3b82279f859f roc-s-2368e909f3a5 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-e593c38256e0 roc-s-1dee6e3ec67d roc-s-5bd2afe89f0b roc-s-94ea94fde25f roc-s-89f6aab7a3f8 roc-s-3550f48d66b9 roc-s-7720fe004f5c roc-s-66b560f839de roc-s-0cb4489c3645 roc-s-bb5869ef903b roc-s-f4cf4be63707 roc-s-bae1e782f277 roc-s-45464a92c1f6 roc-s-9ca352480f25",
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-074569488cca roc-s-02e603944040 roc-s-e7e01cc7f4df roc-s-a8c1dfb1d4ef roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-397f5ba426a0 roc-s-9beb654fcb0d roc-s-6fa6a8ade7c4 roc-s-f3f7a9c5e1b3 roc-s-e2bb4ac97190 roc-s-353a727facfd roc-s-98a28c2293f7 roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4 roc-s-8637dfd54fbb roc-s-82b114bbff3d",
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-074569488cca roc-s-02e603944040 roc-s-a8c1dfb1d4ef roc-s-98a5b6fff1d2 roc-s-75b27e813dcc roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-397f5ba426a0 roc-s-9beb654fcb0d roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4",
          className,
        ),
      )}
      checked={checked}
      {...props}
    >
      <span
        className={cn(
          "roc-shadcn",
          "roc-s-33228ff7d583 roc-s-747355bdc2a2 roc-s-5b9fdf1819c4 roc-s-222f930b8752 roc-s-61c000c8a98a roc-s-71556df3b421 roc-s-a503dd374cca",
        )}
      >
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className={cn("roc-shadcn", "roc-s-100c22d5776b")} />
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-074569488cca roc-s-02e603944040 roc-s-a8c1dfb1d4ef roc-s-98a5b6fff1d2 roc-s-75b27e813dcc roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-397f5ba426a0 roc-s-9beb654fcb0d roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4",
          className,
        ),
      )}
      {...props}
    >
      <span
        className={cn(
          "roc-shadcn",
          "roc-s-33228ff7d583 roc-s-747355bdc2a2 roc-s-5b9fdf1819c4 roc-s-222f930b8752 roc-s-61c000c8a98a roc-s-71556df3b421 roc-s-a503dd374cca",
        )}
      >
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon
            className={cn(
              "roc-shadcn",
              "roc-s-9e7600197f38 roc-s-717b342c2d01",
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
          "roc-s-e7e01cc7f4df roc-s-a8c1dfb1d4ef roc-s-c74ab393b96d roc-s-daaac3fbf55e roc-s-957a109f887f roc-s-6fa6a8ade7c4",
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
          "roc-s-abba77319850 roc-s-d8747231f142 roc-s-ae2c4b060bb9 roc-s-a943bea85d66",
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
          "roc-s-cc51bda60e7e roc-s-3992de70b033 roc-s-e1683b3c030a roc-s-35f35c41d134",
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
