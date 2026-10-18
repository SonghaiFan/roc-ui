"use client";
// ROC primitive: one choice from several, with roving focus and native form participation.
import * as React from "react";
import { FormInput } from "./primitive-form-input";
import { composeEventHandlers, useComposedRefs } from "./primitive-utils";
import {
  ROVING_ROOT,
  handleRovingKey,
  useRovingTabStop,
  type Orientation,
} from "./primitive-roving";
import { useDirectionContext } from "./primitive-direction-context";
import { useControllableState } from "./use-controllable-state";

type Context = {
  name?: string;
  required: boolean;
  disabled: boolean;
  value: string | null;
  setValue: (value: string) => void;
  fallback: string | null;
  arrowFocus: React.RefObject<boolean>;
};
const GroupContext = React.createContext<Context | null>(null);
const ItemContext = React.createContext({ checked: false, disabled: false });
const useGroup = () => {
  const context = React.useContext(GroupContext);
  if (!context) throw new Error("RadioGroup parts must be inside RadioGroup.Root");
  return context;
};

type RootProps = Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> & {
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: Orientation;
  dir?: "ltr" | "rtl";
  loop?: boolean;
};

function Root({
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  required = false,
  disabled = false,
  orientation,
  dir: dirProp,
  loop = true,
  onKeyDown,
  ref,
  ...props
}: RootProps) {
  const dir = useDirectionContext(dirProp);
  const [value, setValue] = useControllableState<string | null>(
    valueProp,
    defaultValue ?? null,
    (next) => next !== null && onValueChange?.(next),
  );
  const roving = useRovingTabStop('[role="radio"][aria-checked="true"]');
  const composed = useComposedRefs<HTMLDivElement>(ref, roving.ref);
  const arrowFocus = React.useRef(false);
  const initial = React.useRef(value);
  const latest = React.useRef(setValue);
  latest.current = setValue;
  const [form, setForm] = React.useState<HTMLFormElement | null>(null);
  React.useEffect(() => {
    setForm(roving.ref.current?.closest("form") ?? null);
  }, [roving.ref]);
  React.useEffect(() => {
    if (!form) return;
    const reset = () => latest.current(initial.current);
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [form]);
  return (
    <GroupContext.Provider
      value={{
        name,
        required,
        disabled,
        value,
        setValue: (next) => setValue(next),
        fallback: roving.fallback,
        arrowFocus,
      }}
    >
      <div
        role="radiogroup"
        aria-required={required}
        aria-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        dir={dir}
        {...{ [ROVING_ROOT]: "" }}
        {...props}
        ref={composed}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          // Arrow keys move focus, and focus checks the radio (see Item).
          arrowFocus.current = true;
          handleRovingKey(event, roving.ref.current, { orientation, dir, loop });
          arrowFocus.current = false;
        })}
      />
    </GroupContext.Provider>
  );
}

type ItemProps = Omit<React.ComponentProps<"button">, "value"> & {
  value: string;
  required?: boolean;
};

function Item({
  value,
  disabled: itemDisabled,
  required: itemRequired,
  onClick,
  onKeyDown,
  onFocus,
  ref,
  children,
  ...props
}: ItemProps) {
  const group = useGroup();
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const composed = useComposedRefs<HTMLButtonElement>(ref, setButton);
  const stopped = React.useRef(false);
  const checked = group.value === value;
  const disabled = group.disabled || !!itemDisabled;
  const required = group.required || !!itemRequired;
  const inForm = button ? !!button.closest("form") : true;
  return (
    <ItemContext.Provider value={{ checked, disabled }}>
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled ? "" : undefined}
        data-roving-item=""
        data-roving-value={value}
        disabled={disabled}
        value={value}
        tabIndex={checked || group.fallback === value ? 0 : -1}
        {...props}
        ref={composed}
        onClick={composeEventHandlers(onClick, (event) => {
          if (!checked) group.setValue(value);
          if (inForm) {
            stopped.current = event.isPropagationStopped();
            if (!stopped.current) event.stopPropagation();
          }
        })}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          // Per the radio pattern, Enter does not check.
          if (event.key === "Enter") event.preventDefault();
        })}
        onFocus={composeEventHandlers(onFocus, () => {
          if (group.arrowFocus.current && !checked) button?.click();
        })}
      >
        {children}
      </button>
      {inForm && (
        <FormInput
          type="radio"
          checked={checked}
          bubbles={!stopped.current}
          name={group.name}
          value={value}
          required={required}
          disabled={disabled}
        />
      )}
    </ItemContext.Provider>
  );
}

function Indicator({
  forceMount,
  ...props
}: React.ComponentProps<"span"> & { forceMount?: boolean }) {
  const { checked, disabled } = React.useContext(ItemContext);
  if (!forceMount && !checked) return null;
  return (
    <span
      data-state={checked ? "checked" : "unchecked"}
      data-disabled={disabled ? "" : undefined}
      {...props}
    />
  );
}

export const RadioGroup = { Root, Item, Indicator };
