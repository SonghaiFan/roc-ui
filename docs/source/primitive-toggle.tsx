"use client";
import * as React from "react";
import { Toggle as Base } from "@base-ui/react/toggle";
import { Button as AnimatedButton } from "@animate-ui/react/primitives/buttons/button";
type Props = Omit<React.ComponentProps<"button">, "value"> & { value?: string } & { pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (pressed: boolean) => void };
function Root({ onPressedChange, ...props }: Props) {
  return <Base {...props} onPressedChange={next => onPressedChange?.(next)}
    render={(p, state) => <AnimatedButton {...(p as object)} disabled={state.disabled} tapScale={state.disabled ? 1 : 0.97} data-state={state.pressed ? "on" : "off"} />} />;
}
export const Toggle = { Root };
