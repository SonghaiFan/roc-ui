"use client";
// ROC primitive: a two-state button.
import * as React from "react";
import { Slot } from "./primitive-slot";
import { composeEventHandlers } from "./primitive-utils";
import { useControllableState } from "./use-controllable-state";

type RootProps = Omit<React.ComponentProps<"button">, "defaultValue"> & {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  asChild?: boolean;
};

function Root({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  asChild,
  disabled,
  onClick,
  ...props
}: RootProps) {
  const [pressed, setPressed] = useControllableState(
    pressedProp,
    defaultPressed,
    onPressedChange,
  );
  const Comp: React.ElementType = asChild ? Slot.Root : "button";
  return (
    <Comp
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      data-disabled={disabled ? "" : undefined}
      disabled={disabled}
      {...props}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) setPressed(!pressed);
      })}
    />
  );
}

export const Toggle = { Root };
