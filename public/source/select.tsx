// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
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
          "roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-71556df3b421 roc-s-32c92bb1fde4 roc-s-074569488cca roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-8fca9236d191 roc-s-0f9e6672913a roc-s-b5edc3ea7c91 roc-s-c74ab393b96d roc-s-963f6168b7d6 roc-s-7de07d413c13 roc-s-4a85c59e17d7 roc-s-b30fc56058b6 roc-s-b906a32b31ee roc-s-365a4654f7b1 roc-s-392a26f4c1b0 roc-s-db567af109b7 roc-s-4600b77303d6 roc-s-1fac1d7d1df3 roc-s-5491fd0b4dc5 roc-s-540fbd6aa889 roc-s-4519a2e9495a roc-s-bb554e6b177f roc-s-c2f0a5ec4d37 roc-s-3fa59d92df97 roc-s-ea3977c6d87c roc-s-1c33b99a35b2 roc-s-9daa2369a41b roc-s-2d1843c40e8c roc-s-c88f65aa011e roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4 roc-s-8637dfd54fbb",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          className={cn("roc-shadcn", "roc-s-100c22d5776b roc-s-0b5a4d1257ab")}
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
            "roc-s-d2d9e1f13413 roc-s-3eef1ce97dba roc-s-c94cde061b6d roc-s-e9ab1547c94d roc-s-f7dba7cc75ac roc-s-3b82279f859f roc-s-2368e909f3a5 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-e593c38256e0 roc-s-5bd2afe89f0b roc-s-94ea94fde25f roc-s-89f6aab7a3f8 roc-s-3550f48d66b9 roc-s-7720fe004f5c roc-s-66b560f839de roc-s-0cb4489c3645 roc-s-bb5869ef903b roc-s-f4cf4be63707 roc-s-bae1e782f277 roc-s-45464a92c1f6 roc-s-9ca352480f25",
            position === "popper" &&
              "roc-s-b2b0fc159cf8 roc-s-4489b22da92f roc-s-ed40fce0f2eb roc-s-462270e7521d",
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
              "roc-s-1dee6e3ec67d",
              position === "popper" &&
                "roc-s-4b782fd2821c roc-s-58d0413dd93c roc-s-09365d2a0df7 roc-s-7293b977658f",
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
          "roc-s-e7e01cc7f4df roc-s-a8c1dfb1d4ef roc-s-3992de70b033 roc-s-35f35c41d134",
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-074569488cca roc-s-02e603944040 roc-s-a8c1dfb1d4ef roc-s-72686d6d04db roc-s-f5d8e661d857 roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-a8c1861c5d03 roc-s-a85c4c5d7465 roc-s-397f5ba426a0 roc-s-9beb654fcb0d roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4 roc-s-8637dfd54fbb roc-s-15764d323d31 roc-s-0862cbb62f8d roc-s-87f6eccf0eeb",
          className,
        ),
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className={cn(
          "roc-shadcn",
          "roc-s-747355bdc2a2 roc-s-92fbe66c807f roc-s-222f930b8752 roc-s-61c000c8a98a roc-s-71556df3b421 roc-s-a503dd374cca",
        )}
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className={cn("roc-shadcn", "roc-s-100c22d5776b")} />
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
          "roc-s-33228ff7d583 roc-s-abba77319850 roc-s-d8747231f142 roc-s-ae2c4b060bb9 roc-s-a943bea85d66",
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
          "roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-a503dd374cca roc-s-1fcf28756bb1",
          className,
        ),
      )}
      {...props}
    >
      <ChevronUpIcon className={cn("roc-shadcn", "roc-s-100c22d5776b")} />
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
          "roc-s-222f930b8752 roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-a503dd374cca roc-s-1fcf28756bb1",
          className,
        ),
      )}
      {...props}
    >
      <ChevronDownIcon className={cn("roc-shadcn", "roc-s-100c22d5776b")} />
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
