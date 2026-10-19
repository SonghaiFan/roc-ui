"use client";
import * as React from "react";
import { Accordion as Base } from "@animate-ui/react/primitives/base-ui/accordion";
import { Direction } from "./primitive-direction";
import { useDirectionContext } from "./primitive-direction-context";
type Shared = Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> & { disabled?: boolean; orientation?: "horizontal" | "vertical"; dir?: "ltr" | "rtl" };
type RootProps = Shared & ({ type: "single"; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; collapsible?: boolean } | { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void });
const array = (v: string | string[] | undefined) => v === undefined ? undefined : Array.isArray(v) ? v : v ? [v] : [];
function Root(props: RootProps) {
  const { type, value, defaultValue, onValueChange, dir, ...rest } = props;
  const { collapsible, ...rootProps } = rest as Shared & { collapsible?: boolean };
  const direction = useDirectionContext(dir) ?? "ltr";
  return <Direction.DirectionProvider dir={direction}><Base.Root {...rootProps} dir={direction}
    multiple={type === "multiple"} value={array(value)} defaultValue={array(defaultValue)} keepMounted
    onValueChange={(next: string[], details) => {
      if (type === "single" && !collapsible && !next.length) { details.cancel(); return; }
      if (type === "multiple") props.onValueChange?.(next); else props.onValueChange?.(next[0] ?? "");
    }} /></Direction.DirectionProvider>;
}
function Item(props: React.ComponentProps<"div"> & { value: string; disabled?: boolean }) {
  return <Base.Item {...props} render={(p, state) => <div {...p} data-state={state.open ? "open" : "closed"} />} />;
}
const Header = Base.Header;
function Trigger(props: React.ComponentProps<"button">) {
  return <Base.Trigger {...props} render={(p, state) => <button {...p} data-state={state.open ? "open" : "closed"} />} />;
}
function Content({ forceMount = true, ...props }: React.ComponentProps<"div"> & { forceMount?: boolean }) {
  return <Base.Panel {...props} keepMounted={forceMount} data-roc-motion="animate-ui" />;
}
export const Accordion = { Root, Item, Header, Trigger, Content };
