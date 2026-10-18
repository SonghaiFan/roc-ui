"use client";
// ROC primitive: a checkbox with an indeterminate state and native form participation.
import * as React from "react";
import { FormInput } from "./primitive-form-input";
import { composeEventHandlers, useComposedRefs } from "./primitive-utils";
import { useControllableState } from "./use-controllable-state";

export type CheckedState = boolean | "indeterminate";
const Context = React.createContext<{ checked: CheckedState; disabled: boolean }>({
  checked: false,
  disabled: false,
});
const mixed = (checked: CheckedState): checked is "indeterminate" =>
  checked === "indeterminate";
const stateOf = (checked: CheckedState) =>
  mixed(checked) ? "indeterminate" : checked ? "checked" : "unchecked";

type RootProps = Omit<
  React.ComponentProps<"button">,
  "value" | "defaultChecked" | "checked"
> & {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
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
  onKeyDown,
  ref,
  ...props
}: RootProps) {
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const composed = useComposedRefs<HTMLButtonElement>(ref, setButton);
  const stopped = React.useRef(false);
  const inForm = button ? !!form || !!button.closest("form") : true;
  const [checked, setChecked] = useControllableState<CheckedState>(
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
        role="checkbox"
        aria-checked={mixed(checked) ? "mixed" : checked}
        aria-required={required}
        data-state={stateOf(checked)}
        data-disabled={disabled ? "" : undefined}
        disabled={disabled}
        value={value}
        {...props}
        ref={composed}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          // Checkboxes toggle on Space, not Enter.
          if (event.key === "Enter") event.preventDefault();
        })}
        onClick={composeEventHandlers(onClick, (event) => {
          setChecked(mixed(checked) ? true : !checked);
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

function Indicator({
  forceMount,
  style,
  ...props
}: React.ComponentProps<"span"> & { forceMount?: boolean }) {
  const { checked, disabled } = React.useContext(Context);
  if (!forceMount && !mixed(checked) && checked !== true) return null;
  return (
    <span
      data-state={stateOf(checked)}
      data-disabled={disabled ? "" : undefined}
      {...props}
      style={{ pointerEvents: "none", ...style }}
    />
  );
}

export const Checkbox = { Root, Indicator };
