// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { Menubar as MenubarPrimitive } from "radix-ui";
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
          "roc-s-222f930b8752 roc-s-539ae144f076 roc-s-71556df3b421 roc-s-19e97f3f40e6 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-5b272f3c5076 roc-s-1dee6e3ec67d roc-s-7de07d413c13",
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
          "roc-s-222f930b8752 roc-s-71556df3b421 roc-s-02e603944040 roc-s-e7e01cc7f4df roc-s-1fcf28756bb1 roc-s-c74ab393b96d roc-s-daaac3fbf55e roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-4027d9c589b6 roc-s-1952cd5b00aa",
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
            "roc-s-3eef1ce97dba roc-s-40632e2f551e roc-s-0bcaea6638f7 roc-s-d5111d0e9f48 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-e593c38256e0 roc-s-1dee6e3ec67d roc-s-5bd2afe89f0b roc-s-94ea94fde25f roc-s-89f6aab7a3f8 roc-s-3550f48d66b9 roc-s-7720fe004f5c roc-s-66b560f839de roc-s-bb5869ef903b roc-s-f4cf4be63707 roc-s-bae1e782f277 roc-s-45464a92c1f6 roc-s-9ca352480f25",
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-074569488cca roc-s-02e603944040 roc-s-e7e01cc7f4df roc-s-a8c1dfb1d4ef roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-397f5ba426a0 roc-s-9beb654fcb0d roc-s-6fa6a8ade7c4 roc-s-f3f7a9c5e1b3 roc-s-e2bb4ac97190 roc-s-353a727facfd roc-s-98a28c2293f7 roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4 roc-s-8637dfd54fbb roc-s-82b114bbff3d",
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-074569488cca roc-s-30c08d7acd8f roc-s-a8c1dfb1d4ef roc-s-98a5b6fff1d2 roc-s-75b27e813dcc roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-397f5ba426a0 roc-s-9beb654fcb0d roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4",
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
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className={cn("roc-shadcn", "roc-s-100c22d5776b")} />
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-074569488cca roc-s-30c08d7acd8f roc-s-a8c1dfb1d4ef roc-s-98a5b6fff1d2 roc-s-75b27e813dcc roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-397f5ba426a0 roc-s-9beb654fcb0d roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4",
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
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon
            className={cn(
              "roc-shadcn",
              "roc-s-9e7600197f38 roc-s-717b342c2d01",
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
          "roc-s-e7e01cc7f4df roc-s-a8c1dfb1d4ef roc-s-c74ab393b96d roc-s-daaac3fbf55e roc-s-6fa6a8ade7c4",
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
          "roc-s-abba77319850 roc-s-d8747231f142 roc-s-ae2c4b060bb9 roc-s-a943bea85d66",
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
          "roc-s-cc51bda60e7e roc-s-3992de70b033 roc-s-e1683b3c030a roc-s-35f35c41d134",
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
          "roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-02e603944040 roc-s-e7e01cc7f4df roc-s-a8c1dfb1d4ef roc-s-c74ab393b96d roc-s-b30fc56058b6 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-6fa6a8ade7c4 roc-s-4027d9c589b6 roc-s-1952cd5b00aa",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon
        className={cn(
          "roc-shadcn",
          "roc-s-cc51bda60e7e roc-s-099be97e1fa4 roc-s-829c550fac1a",
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
          "roc-s-3eef1ce97dba roc-s-e9ab1547c94d roc-s-0bcaea6638f7 roc-s-d5111d0e9f48 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-e593c38256e0 roc-s-1dee6e3ec67d roc-s-5bd2afe89f0b roc-s-0d4ca75de41c roc-s-89f6aab7a3f8 roc-s-3550f48d66b9 roc-s-7720fe004f5c roc-s-66b560f839de roc-s-0cb4489c3645 roc-s-bb5869ef903b roc-s-f4cf4be63707 roc-s-bae1e782f277 roc-s-45464a92c1f6 roc-s-9ca352480f25",
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
