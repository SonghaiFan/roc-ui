"use client";
// ROC primitive: a set of toggles that behave as one choice (single) or many (multiple).
import * as React from "react";
import { useDirectionContext } from "./primitive-direction-context";
import { Toggle } from "./primitive-toggle";
import { composeEventHandlers, useComposedRefs } from "./primitive-utils";
import {
  ROVING_ROOT,
  handleRovingKey,
  useRovingTabStop,
  type Orientation,
} from "./primitive-roving";

type Context = {
  type: "single" | "multiple";
  values: string[];
  disabled: boolean;
  orientation?: Orientation;
  activate: (value: string) => void;
  deactivate: (value: string) => void;
  fallback: string | null;
};
const GroupContext = React.createContext<Context | null>(null);
const useGroup = () => {
  const context = React.useContext(GroupContext);
  if (!context) throw new Error("ToggleGroup parts must be inside ToggleGroup.Root");
  return context;
};

type Shared = Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> & {
  disabled?: boolean;
  orientation?: Orientation;
  dir?: "ltr" | "rtl";
  loop?: boolean;
  /** Arrow keys move focus between items. Defaults to true. */
  rovingFocus?: boolean;
};
type SingleProps = Shared & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};
type MultipleProps = Shared & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

const toArray = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value : value ? [value] : [];

function Root(props: SingleProps | MultipleProps) {
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    orientation,
    dir: dirProp,
    loop = true,
    rovingFocus = true,
    onKeyDown,
    ref,
    ...rest
  } = props as Shared & {
    type: "single" | "multiple";
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: any) => void;
  };
  const dir = useDirectionContext(dirProp);
  const [internal, setInternal] = React.useState(() => toArray(defaultValue));
  const values = value === undefined ? internal : toArray(value);
  const change = (next: string[]) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(type === "multiple" ? next : (next[0] ?? ""));
  };
  const roving = useRovingTabStop(
    '[aria-pressed="true"], [role="radio"][aria-checked="true"]',
  );
  const composed = useComposedRefs<HTMLDivElement>(ref, roving.ref);
  return (
    <GroupContext.Provider
      value={{
        type,
        values,
        disabled,
        orientation,
        fallback: roving.fallback,
        activate: (item) => change(type === "multiple" ? [...values, item] : [item]),
        deactivate: (item) => change(values.filter((existing) => existing !== item)),
      }}
    >
      <div
        role={!rovingFocus ? "group" : type === "single" ? "radiogroup" : "toolbar"}
        dir={dir}
        data-orientation={orientation}
        {...{ [ROVING_ROOT]: "" }}
        {...rest}
        ref={composed}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          if (rovingFocus)
            handleRovingKey(event, roving.ref.current, { orientation, dir, loop });
        })}
      />
    </GroupContext.Provider>
  );
}

type ItemProps = Omit<React.ComponentProps<typeof Toggle.Root>, "pressed" | "defaultPressed" | "value"> & {
  value: string;
};

function Item({ value, disabled, ...props }: ItemProps) {
  const group = useGroup();
  const pressed = group.values.includes(value);
  const single = group.type === "single";
  return (
    <Toggle.Root
      data-orientation={group.orientation}
      data-roving-item=""
      data-roving-value={value}
      tabIndex={pressed || group.fallback === value ? 0 : -1}
      {...(single ? { role: "radio", "aria-checked": pressed, "aria-pressed": undefined } : {})}
      {...props}
      disabled={group.disabled || disabled}
      pressed={pressed}
      onPressedChange={(next) =>
        next ? group.activate(value) : group.deactivate(value)
      }
    />
  );
}

export const ToggleGroup = { Root, Item };
