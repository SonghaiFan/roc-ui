"use client";
// ROC primitive: a row of menus. Behaviour from Base UI.
import * as React from "react";
import { Menu as BaseMenu } from "@animate-ui/react/primitives/base-ui/menu";
import { Menubar as BaseMenubar } from "@animate-ui/react/primitives/base-ui/menubar";
import { createMenu } from "./primitive-menu-core";

const menu = createMenu(BaseMenu, "menubar", "button");

function Root({
  loop = true,
  dir: _dir,
  value: _value,
  defaultValue: _defaultValue,
  onValueChange: _onValueChange,
  ...props
}: React.ComponentProps<"div"> & {
  loop?: boolean;
  dir?: "ltr" | "rtl";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return <BaseMenubar {...(props as object)} loopFocus={loop} />;
}

export const Menubar = {
  ...menu,
  Root,
  /** One menu in the bar. The bar needs no `value`: each menu owns its state. */
  Menu: menu.Root,
};
