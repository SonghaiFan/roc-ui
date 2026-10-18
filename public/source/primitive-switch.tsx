"use client";
// ROC primitive: an on/off switch with native form participation.
import * as React from "react";
import { motion } from "motion/react";
import { motionTokens, useShouldReduceMotion, useTempoTransition } from "@animate-ui/react/utils/motion";
import { FormInput } from "./primitive-form-input";
import { composeEventHandlers, useComposedRefs } from "./primitive-utils";
import { useControllableState } from "./use-controllable-state";

const Context = React.createContext({ checked: false, disabled: false });

type RootProps = Omit<
  React.ComponentProps<"button">,
  "value" | "defaultChecked" | "checked"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
  name?: string;
  form?: string;
  value?: string | number | readonly string[];
};

function Root({
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  required,
  disabled,
  name,
  form,
  value = "on",
  onClick,
  ref,
  ...props
}: RootProps) {
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const composed = useComposedRefs<HTMLButtonElement>(ref, setButton);
  const stopped = React.useRef(false);
  const inForm = button ? !!form || !!button.closest("form") : true;
  const [checked, setChecked] = useControllableState(
    checkedProp,
    defaultChecked ?? false,
    onCheckedChange,
  );
  const initial = React.useRef(checked);
  // Subscribe once per form and read the latest setter: a listener re-added
  // mid-dispatch is skipped, which would drop this control from a reset.
  const latest = React.useRef(setChecked);
  latest.current = setChecked;
  React.useEffect(() => {
    const owner = button?.form;
    if (!owner) return;
    const reset = () => latest.current(initial.current);
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [button]);
  return (
    <Context.Provider value={{ checked, disabled: !!disabled }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-required={required}
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled ? "" : undefined}
        disabled={disabled}
        value={value}
        {...props}
        ref={composed}
        onClick={composeEventHandlers(onClick, (event) => {
          setChecked(!checked);
          if (inForm) {
            stopped.current = event.isPropagationStopped();
            if (!stopped.current) event.stopPropagation();
          }
        })}
      />
      {inForm && (
        <FormInput
          checked={checked}
          bubbles={!stopped.current}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          form={form}
        />
      )}
    </Context.Provider>
  );
}

function Thumb(props: React.ComponentProps<"span">) {
  const { checked, disabled } = React.useContext(Context);
  const reduce = useShouldReduceMotion();
  const transition = useTempoTransition(motionTokens.spring.thumb);
  const Thumb: React.ElementType = motion.span;
  return (
    <Thumb
      initial={false}
      animate={{ x: checked ? "var(--roc-switch-travel, 16px)" : 0 }}
      transition={reduce ? { duration: 0 } : transition}
      data-roc-motion="animate-ui"
      data-state={checked ? "checked" : "unchecked"}
      data-disabled={disabled ? "" : undefined}
      {...props}
    />
  );
}

export const Switch = { Root, Thumb };
