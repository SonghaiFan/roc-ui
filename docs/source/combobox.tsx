// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@animate-ui/react/primitives/base-ui/combobox";
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
      className={cn("roc-shadcn", cn("roc-u-[&_svg:not([class*='size-'])]:size-4", className))}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="combobox-trigger-icon"
        className={cn(
          "roc-shadcn",
          "roc-u-pointer-events-none roc-u-size-4 roc-u-text-muted-foreground",
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
      <XIcon className={cn("roc-shadcn", "roc-u-pointer-events-none")} />
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
      className={cn("roc-shadcn", cn("roc-combobox-input roc-u-w-auto", className))}
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
              "roc-u-group-has-data-[slot=combobox-clear]/input-group:hidden roc-u-data-pressed:bg-transparent",
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
        collisionPadding={12}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className={cn("roc-shadcn", "roc-u-isolate roc-u-z-50")}
      >
        <ComboboxPrimitive.Popup
        data-roc-motion="animate-ui"
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "roc-shadcn",
            cn(
              "roc-u-group/combobox-content roc-u-relative roc-u-max-h-96 roc-u-w-(--anchor-width) roc-u-max-w-(--available-width) roc-u-min-w-[calc(var(--anchor-width)+--spacing(7))] roc-u-origin-(--transform-origin) roc-u-overflow-hidden roc-u-rounded-md roc-u-bg-popover roc-u-text-popover-foreground roc-u-shadow-md roc-u-ring-1 roc-u-ring-foreground/10 roc-u-duration-100 roc-u-data-[chips=true]:min-w-(--anchor-width) roc-u-data-[side=bottom]:slide-in-from-top-2 roc-u-data-[side=left]:slide-in-from-right-2 roc-u-data-[side=right]:slide-in-from-left-2 roc-u-data-[side=top]:slide-in-from-bottom-2 roc-u-*:data-[slot=input-group]:m-1 roc-u-*:data-[slot=input-group]:mb-0 roc-u-*:data-[slot=input-group]:h-8 roc-u-*:data-[slot=input-group]:border-input/30 roc-u-*:data-[slot=input-group]:bg-input/30 roc-u-*:data-[slot=input-group]:shadow-none roc-u-data-open:animate-in roc-u-data-open:fade-in-0 roc-u-data-open:zoom-in-95 roc-u-data-closed:animate-out roc-u-data-closed:fade-out-0 roc-u-data-closed:zoom-out-95",
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
          "roc-u-max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] roc-u-scroll-py-1 roc-u-overflow-y-auto roc-u-p-1 roc-u-data-empty:p-0",
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
          "roc-u-relative roc-u-flex roc-u-w-full roc-u-cursor-default roc-u-items-center roc-u-gap-2 roc-u-rounded-sm roc-u-py-1.5 roc-u-pr-8 roc-u-pl-2 roc-u-text-sm roc-u-outline-hidden roc-u-select-none roc-u-data-highlighted:bg-accent roc-u-data-highlighted:text-accent-foreground roc-u-data-[disabled]:pointer-events-none roc-u-data-[disabled]:opacity-50 roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0 roc-u-[&_svg:not([class*='size-'])]:size-4",
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
              "roc-u-pointer-events-none roc-u-absolute roc-u-right-2 roc-u-flex roc-u-size-4 roc-u-items-center roc-u-justify-center",
            )}
          />
        }
      >
        <CheckIcon
          className={cn(
            "roc-shadcn",
            "roc-u-pointer-events-none roc-u-size-4 roc-u-pointer-coarse:size-5",
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
          "roc-u-px-2 roc-u-py-1.5 roc-u-text-xs roc-u-text-muted-foreground roc-u-pointer-coarse:px-3 roc-u-pointer-coarse:py-2 roc-u-pointer-coarse:text-sm",
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
          "roc-u-hidden roc-u-w-full roc-u-justify-center roc-u-py-2 roc-u-text-center roc-u-text-sm roc-u-text-muted-foreground roc-u-group-data-empty/combobox-content:flex",
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
          "roc-u--mx-1 roc-u-my-1 roc-u-h-px roc-u-bg-border",
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
          "roc-u-flex roc-u-min-h-9 roc-u-flex-wrap roc-u-items-center roc-u-gap-1.5 roc-u-rounded-md roc-u-border roc-u-border-input roc-u-bg-transparent roc-u-bg-clip-padding roc-u-px-2.5 roc-u-py-1.5 roc-u-text-sm roc-u-shadow-xs roc-u-transition-[color,box-shadow] roc-u-focus-within:border-ring roc-u-focus-within:ring-[3px] roc-u-focus-within:ring-ring/50 roc-u-has-aria-invalid:border-destructive roc-u-has-aria-invalid:ring-[3px] roc-u-has-aria-invalid:ring-destructive/20 roc-u-has-data-[slot=combobox-chip]:px-1.5 roc-u-dark:bg-input/30 roc-u-dark:has-aria-invalid:border-destructive/50 roc-u-dark:has-aria-invalid:ring-destructive/40",
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
          "roc-u-flex roc-u-h-[calc(--spacing(5.5))] roc-u-w-fit roc-u-items-center roc-u-justify-center roc-u-gap-1 roc-u-rounded-sm roc-u-bg-muted roc-u-px-1.5 roc-u-text-xs roc-u-font-medium roc-u-whitespace-nowrap roc-u-text-foreground roc-u-has-disabled:pointer-events-none roc-u-has-disabled:cursor-not-allowed roc-u-has-disabled:opacity-50 roc-u-has-data-[slot=combobox-chip-remove]:pr-0",
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
            "roc-u--ml-1 roc-u-opacity-50 roc-u-hover:opacity-100",
          )}
          data-slot="combobox-chip-remove"
        >
          <XIcon className={cn("roc-shadcn", "roc-u-pointer-events-none")} />
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
          "roc-u-min-w-16 roc-u-flex-1 roc-u-outline-none",
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
