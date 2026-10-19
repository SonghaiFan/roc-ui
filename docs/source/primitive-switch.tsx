"use client";
// Base UI owns switch state and form participation; Animate UI measures the thumb.
import * as React from "react";
import { Switch as Base } from "@animate-ui/react/primitives/base-ui/switch";
type RootProps = Omit<React.ComponentProps<"button">, "checked" | "defaultChecked" | "value"> & {
  checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (checked: boolean) => void;
  required?: boolean; name?: string; form?: string; value?: string;
};
function Root({ onCheckedChange, ...props }: RootProps) {
  return <Base.Root {...(props as object)} nativeButton onCheckedChange={next => onCheckedChange?.(next)}
    render={(p, state) => <button {...p} type="button" data-state={state.checked ? "checked" : "unchecked"} />} />;
}
function Thumb(props: React.ComponentProps<"span">) {
  return <Base.Thumb {...props} data-roc-motion="animate-ui" />;
}
export const Switch = { Root, Thumb };
