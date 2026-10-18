// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "./utils";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { Button } from "./button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group";
const Combobox = ComboboxPrimitive.Root;
function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}
function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("roc-shadcn", cn("roc-s-eb5ef2dbc2d4", className))}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="combobox-trigger-icon"
        className={cn(
          "roc-shadcn",
          "roc-s-33228ff7d583 roc-s-100c22d5776b roc-s-35f35c41d134",
        )}
      />
    </ComboboxPrimitive.Trigger>
  );
}
function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn("roc-shadcn", cn(className))}
      {...props}
    >
      <XIcon className={cn("roc-shadcn", "roc-s-33228ff7d583")} />
    </ComboboxPrimitive.Clear>
  );
}
function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  return (
    <InputGroup
      className={cn("roc-shadcn", cn("roc-s-fe3dd9b783fd", className))}
    >
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            data-slot="input-group-button"
            className={cn(
              "roc-shadcn",
              "roc-s-e621062ecc34 roc-s-b132a0b1aa58",
            )}
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}
function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className={cn("roc-shadcn", "roc-s-014aadadffad roc-s-3eef1ce97dba")}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "roc-shadcn",
            cn(
              "roc-s-065c9a870aec roc-s-d2d9e1f13413 roc-s-b057efba3283 roc-s-3cf6c229faf1 roc-s-c3fec067febd roc-s-700d18e5d1cf roc-s-63338c9b7245 roc-s-d5111d0e9f48 roc-s-3fa8c572949b roc-s-e593c38256e0 roc-s-5bd2afe89f0b roc-s-94ea94fde25f roc-s-7ff0330e1fc7 roc-s-52c48490105e roc-s-aa96ad346e97 roc-s-f599188eb135 roc-s-89f6aab7a3f8 roc-s-3550f48d66b9 roc-s-7720fe004f5c roc-s-66b560f839de roc-s-0ef23a7ab151 roc-s-42ecf04dbf2c roc-s-16be3db26787 roc-s-90ed14f61ef4 roc-s-7d91ece03824 roc-s-03ff64e51af8 roc-s-f83a8e1dcea1 roc-s-216582315b19 roc-s-96ff04dfa9bb roc-s-119f339cfede roc-s-921a59d88de8 roc-s-ac626ac586c7",
              className,
            ),
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}
function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-0c626f7dd7b3 roc-s-f030a1475cdf roc-s-2368e909f3a5 roc-s-1dee6e3ec67d roc-s-8396b73264e8",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-d343f41ba73e roc-s-71556df3b421 roc-s-074569488cca roc-s-02e603944040 roc-s-a8c1dfb1d4ef roc-s-72686d6d04db roc-s-f5d8e661d857 roc-s-c74ab393b96d roc-s-59edd3d33673 roc-s-78905c9e865c roc-s-3e31624aedf3 roc-s-5da55d57a562 roc-s-397f5ba426a0 roc-s-9beb654fcb0d roc-s-bcae9d37090c roc-s-040e748a3fa0 roc-s-eb5ef2dbc2d4",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        data-slot="combobox-item-indicator"
        render={
          <span
            className={cn(
              "roc-shadcn",
              "roc-s-33228ff7d583 roc-s-747355bdc2a2 roc-s-92fbe66c807f roc-s-222f930b8752 roc-s-100c22d5776b roc-s-71556df3b421 roc-s-a503dd374cca",
            )}
          />
        }
      >
        <CheckIcon
          className={cn(
            "roc-shadcn",
            "roc-s-33228ff7d583 roc-s-100c22d5776b roc-s-b0beda8d09b6",
          )}
        />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}
function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("roc-shadcn", cn(className))}
      {...props}
    />
  );
}
function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-e7e01cc7f4df roc-s-a8c1dfb1d4ef roc-s-3992de70b033 roc-s-35f35c41d134 roc-s-900f61c42752 roc-s-fba41043576b roc-s-dd8ccb91d9ac",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}
function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-e564b4081d7a roc-s-58d0413dd93c roc-s-a503dd374cca roc-s-b5edc3ea7c91 roc-s-05ab12448317 roc-s-c74ab393b96d roc-s-35f35c41d134 roc-s-849fcfce6258",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
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
function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-9974acedf3f7 roc-s-faa8a23c68f6 roc-s-71556df3b421 roc-s-70007b876865 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-8fca9236d191 roc-s-b8f483ddb714 roc-s-588daa1a9891 roc-s-a8c1dfb1d4ef roc-s-c74ab393b96d roc-s-7de07d413c13 roc-s-4a85c59e17d7 roc-s-29216b59f77e roc-s-ad6674d2027c roc-s-2211f122f7ab roc-s-b0652d9ff7a3 roc-s-47847fc2ddc3 roc-s-f737c17f8a3e roc-s-c346ff2eedf6 roc-s-9daa2369a41b roc-s-2550b925e96b roc-s-e0b06bb9e41e",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-2961f2b135f3 roc-s-8cfb5a42ef9f roc-s-71556df3b421 roc-s-a503dd374cca roc-s-19e97f3f40e6 roc-s-02e603944040 roc-s-87ecb59f2d2d roc-s-1da2e8f173c5 roc-s-3992de70b033 roc-s-daaac3fbf55e roc-s-963f6168b7d6 roc-s-957a109f887f roc-s-cd97d5aa0367 roc-s-8f4af6248e72 roc-s-7d94f63f5883 roc-s-3187a9490db2",
          className,
        ),
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className={cn(
            "roc-shadcn",
            "roc-s-3addf1ba1cc3 roc-s-0b5a4d1257ab roc-s-8da02faac748",
          )}
          data-slot="combobox-chip-remove"
        >
          <XIcon className={cn("roc-shadcn", "roc-s-33228ff7d583")} />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}
function ComboboxChipsInput({
  className,
  children,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-682771b986a2 roc-s-7bd5bab6d7f4 roc-s-b30fc56058b6",
          className,
        ),
      )}
      {...props}
    />
  );
}
function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}
export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};

import "./combobox.css";
