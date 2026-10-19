"use client";
import * as React from "react";
import { ToggleGroup as BaseGroup } from "@animate-ui/react/primitives/base-ui/toggle-group";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { Direction } from "./primitive-direction";
import { useDirectionContext } from "./primitive-direction-context";
type Shared = Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> & {
  disabled?: boolean; orientation?: "horizontal" | "vertical"; dir?: "ltr" | "rtl"; loop?: boolean; rovingFocus?: boolean;
};
type RootProps = Shared & ({ type: "single"; value?: string; defaultValue?: string; onValueChange?: (value: string) => void } | { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void });
const Single = React.createContext(false);
const array = (v: string | string[] | undefined) => v === undefined ? undefined : Array.isArray(v) ? v : v ? [v] : [];
function Root(props: RootProps) {
  const { type, value, defaultValue, onValueChange, dir, loop = true, rovingFocus: _rovingFocus, orientation = "horizontal", ...rest } = props;
  const direction = useDirectionContext(dir) ?? "ltr";
  return <Direction.DirectionProvider dir={direction}><Single.Provider value={type === "single"}>
    <BaseGroup {...rest} dir={direction} orientation={orientation} loopFocus={loop} multiple={type === "multiple"}
      value={array(value)} defaultValue={array(defaultValue)} role={type === "single" ? "radiogroup" : "toolbar"}
      onValueChange={(next: string[]) => { if (type === "multiple") props.onValueChange?.(next); else props.onValueChange?.(next[0] ?? ""); }} />
  </Single.Provider></Direction.DirectionProvider>;
}
function Item(props: Omit<React.ComponentProps<"button">, "value"> & { value: string }) {
  const single = React.useContext(Single);
  return <BaseToggle {...props} render={(p, state) => <button {...p} type="button"
    role={single ? "radio" : p.role} aria-checked={single ? state.pressed : undefined}
    aria-pressed={single ? undefined : state.pressed} data-state={state.pressed ? "on" : "off"} />} />;
}
export const ToggleGroup = { Root, Item };
