"use client";
// ROC primitive: a menu opened by right click or long press. Behaviour from Base UI.
import { ContextMenu as Base } from "@animate-ui/react/primitives/base-ui/context-menu";
import { createMenu } from "./primitive-menu-core";

export const ContextMenu = createMenu(Base, "context-menu", "span", {
  side: "right",
  align: "start",
});
