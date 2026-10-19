"use client";
import * as React from "react";
import { RadioGroup as BaseGroup } from "@base-ui/react/radio-group";
import { Radio as Base } from "@animate-ui/react/primitives/base-ui/radio";
import { Direction } from "./primitive-direction";
import { useDirectionContext } from "./primitive-direction-context";
type RootProps = Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> & {
  value?: string | null; defaultValue?: string; onValueChange?: (value: string) => void;
  name?: string; form?: string; required?: boolean; disabled?: boolean;
  orientation?: "horizontal" | "vertical"; dir?: "ltr" | "rtl"; loop?: boolean;
};
function Root({ onValueChange, orientation, dir, loop: _loop, ...props }: RootProps) {
  const direction = useDirectionContext(dir) ?? "ltr";
  return <Direction.DirectionProvider dir={direction}><BaseGroup {...props} dir={direction}
    aria-orientation={orientation} onValueChange={next => onValueChange?.(next as string)} /></Direction.DirectionProvider>;
}
function Item({ value, ...props }: Omit<React.ComponentProps<"button">, "value"> & { value: string; required?: boolean }) {
  return <Base.Root {...(props as object)} value={value} nativeButton
    render={(p, state) => <button {...p} type="button" data-state={state.checked ? "checked" : "unchecked"} />} />;
}
function Indicator({ forceMount, ...props }: React.ComponentProps<"span"> & { forceMount?: boolean }) {
  return <Base.Indicator {...props} keepMounted={forceMount} data-roc-motion="animate-ui" />;
}
export const RadioGroup = { Root, Item, Indicator };
