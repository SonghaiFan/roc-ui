"use client";
// ROC primitive: the hidden native checkbox that lets a custom control join a <form>.
import * as React from "react";
import { usePrevious } from "./primitive-utils";

type Props = Omit<React.ComponentProps<"input">, "checked"> & {
  checked: boolean | "indeterminate";
  /** Let the synthetic click bubble to ancestors such as a form `onChange`. */
  bubbles?: boolean;
};

export function FormInput({ checked, bubbles = true, style, ...props }: Props) {
  const ref = React.useRef<HTMLInputElement>(null);
  const previous = usePrevious(checked);
  React.useEffect(() => {
    const input = ref.current;
    const set = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "checked",
    )?.set;
    if (input && set && previous !== checked) {
      input.indeterminate = checked === "indeterminate";
      set.call(input, checked === "indeterminate" ? false : checked);
      input.dispatchEvent(new Event("click", { bubbles }));
    }
  }, [previous, checked, bubbles]);
  const initial = React.useRef(checked === "indeterminate" ? false : checked);
  return (
    <input
      type="checkbox"
      aria-hidden
      defaultChecked={initial.current}
      {...props}
      tabIndex={-1}
      ref={ref}
      style={{
        ...style,
        position: "absolute",
        pointerEvents: "none",
        opacity: 0,
        margin: 0,
        transform: "translateX(-100%)",
      }}
    />
  );
}
