"use client";
// ROC primitive: a menu opened from a button. Behaviour from Base UI.
import { Menu as Base } from "@animate-ui/react/primitives/base-ui/menu";
import { createMenu } from "./primitive-menu-core";

export const DropdownMenu = createMenu(Base, "dropdown-menu", "button");
