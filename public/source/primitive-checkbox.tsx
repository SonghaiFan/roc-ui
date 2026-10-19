"use client";
// Base UI owns checkbox state and forms; Animate UI owns the indicator animation.
import * as React from "react";
import { Checkbox as Base } from "@animate-ui/react/primitives/base-ui/checkbox";

type CheckedState = boolean | "indeterminate";
type RootProps = Omit<React.ComponentProps<"button">, "checked" | "defaultChecked" | "value"> & {
  checked?: CheckedState; defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  required?: boolean; name?: string; form?: string; value?: string;
};
function Root({ checked, defaultChecked, onCheckedChange, children, ...props }: RootProps) {
  const [mixed, setMixed] = React.useState(defaultChecked === "indeterminate");
  return <Base.Root {...(props as object)} nativeButton checked={checked === undefined ? undefined : checked === true}
    defaultChecked={defaultChecked === true} indeterminate={checked === "indeterminate" || (checked === undefined && mixed)}
    onCheckedChange={next => { setMixed(false); onCheckedChange?.(next); }}
    render={(p, state) => <button {...p} type="button" data-state={state.indeterminate ? "indeterminate" : state.checked ? "checked" : "unchecked"} />}>
    {children}
  </Base.Root>;
}
function Indicator({ forceMount, ...props }: React.ComponentProps<"span"> & { forceMount?: boolean }) {
  return <Base.Indicator {...props} keepMounted={forceMount} data-roc-motion="animate-ui" />;
}
export const Checkbox = { Root, Indicator };
