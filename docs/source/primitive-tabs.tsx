"use client";
import * as React from "react";
import { Tabs as Base } from "@animate-ui/react/primitives/base-ui/tabs";
import { Direction } from "./primitive-direction";
import { useDirectionContext } from "./primitive-direction-context";
type RootProps = Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> & {
  value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical"; dir?: "ltr" | "rtl"; activationMode?: "automatic" | "manual";
};
const Activation = React.createContext(true);
function Root({ onValueChange, activationMode = "automatic", dir, ...props }: RootProps) {
  const direction = useDirectionContext(dir) ?? "ltr";
  return <Direction.DirectionProvider dir={direction}><Activation.Provider value={activationMode === "automatic"}>
    <Base.Root {...props} dir={direction} onValueChange={next => onValueChange?.(String(next))} />
  </Activation.Provider></Direction.DirectionProvider>;
}
function List({ loop = true, ...props }: React.ComponentProps<"div"> & { loop?: boolean }) {
  const activateOnFocus = React.useContext(Activation);
  return <Base.List {...props} activateOnFocus={activateOnFocus} loopFocus={loop} />;
}
function Trigger(props: React.ComponentProps<"button"> & { value: string }) {
  return <Base.Tab {...props} render={(p, state) => <button {...p} data-state={state.active ? "active" : "inactive"} />} />;
}
function Content({ forceMount = true, ...props }: React.ComponentProps<"div"> & { value: string; forceMount?: boolean }) {
  return <Base.Panel {...props} keepMounted={forceMount} data-roc-motion="animate-ui" />;
}
export const Tabs = { Root, List, Trigger, Content };
