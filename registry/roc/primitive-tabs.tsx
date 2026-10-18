"use client";
// ROC primitive: tabs with roving focus, automatic or manual activation.
import * as React from "react";
import { composeEventHandlers, useComposedRefs } from "./primitive-utils";
import {
  ROVING_ROOT,
  handleRovingKey,
  useRovingTabStop,
  type Orientation,
} from "./primitive-roving";
import { useControllableState } from "./use-controllable-state";

type Context = {
  baseId: string;
  value: string | undefined;
  setValue: (value: string) => void;
  orientation: Orientation;
  dir?: "ltr" | "rtl";
  activationMode: "automatic" | "manual";
};
const TabsContext = React.createContext<Context | null>(null);
const ListContext = React.createContext<string | null>(null);
const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("Tabs parts must be inside Tabs.Root");
  return context;
};
// Values may contain spaces; ids may not.
const slug = (value: string) => encodeURIComponent(value).replace(/%/g, "_");
const triggerId = (base: string, value: string) => `${base}-trigger-${slug(value)}`;
const contentId = (base: string, value: string) => `${base}-content-${slug(value)}`;

type RootProps = Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: Orientation;
  dir?: "ltr" | "rtl";
  activationMode?: "automatic" | "manual";
};

function Root({
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  dir,
  activationMode = "automatic",
  ...props
}: RootProps) {
  const baseId = React.useId();
  const [value, setValue] = useControllableState<string | undefined>(
    valueProp,
    defaultValue,
    (next) => next !== undefined && onValueChange?.(next),
  );
  return (
    <TabsContext.Provider
      value={{
        baseId,
        value,
        setValue: (next) => setValue(next),
        orientation,
        dir,
        activationMode,
      }}
    >
      <div dir={dir} data-orientation={orientation} {...props} />
    </TabsContext.Provider>
  );
}

function List({ onKeyDown, ref, ...props }: React.ComponentProps<"div">) {
  const context = useTabs();
  const roving = useRovingTabStop('[role="tab"][aria-selected="true"]');
  const composed = useComposedRefs<HTMLDivElement>(ref, roving.ref);
  return (
    <ListContext.Provider value={roving.fallback}>
      <div
        role="tablist"
        aria-orientation={context.orientation}
        data-orientation={context.orientation}
        {...{ [ROVING_ROOT]: "" }}
        {...props}
        ref={composed}
        onKeyDown={composeEventHandlers(onKeyDown, (event) =>
          handleRovingKey(event, roving.ref.current, {
            orientation: context.orientation,
            dir: context.dir,
          }),
        )}
      />
    </ListContext.Provider>
  );
}

type TriggerProps = Omit<React.ComponentProps<"button">, "value"> & {
  value: string;
};

function Trigger({
  value,
  disabled = false,
  onMouseDown,
  onKeyDown,
  onFocus,
  ...props
}: TriggerProps) {
  const context = useTabs();
  const fallback = React.useContext(ListContext);
  const selected = context.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={contentId(context.baseId, value)}
      data-state={selected ? "active" : "inactive"}
      data-disabled={disabled ? "" : undefined}
      data-orientation={context.orientation}
      data-roving-item=""
      data-roving-value={value}
      disabled={disabled}
      tabIndex={selected || fallback === value ? 0 : -1}
      {...props}
      id={triggerId(context.baseId, value)}
      onMouseDown={composeEventHandlers(onMouseDown, (event) => {
        // Select on press, like a native tab strip; never on a modified click.
        if (!disabled && event.button === 0 && !event.ctrlKey)
          context.setValue(value);
        else event.preventDefault();
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (event.key === " " || event.key === "Enter") context.setValue(value);
      })}
      onFocus={composeEventHandlers(onFocus, () => {
        if (!selected && !disabled && context.activationMode === "automatic")
          context.setValue(value);
      })}
    />
  );
}

type ContentProps = Omit<React.ComponentProps<"div">, "value"> & {
  value: string;
  /** Keep the panel mounted while inactive. */
  forceMount?: boolean;
};

function Content({ value, forceMount, children, ...props }: ContentProps) {
  const context = useTabs();
  const active = context.value === value;
  if (!active && !forceMount) return null;
  return (
    <div
      role="tabpanel"
      aria-labelledby={triggerId(context.baseId, value)}
      data-state={active ? "active" : "inactive"}
      data-orientation={context.orientation}
      hidden={!active}
      tabIndex={0}
      {...props}
      id={contentId(context.baseId, value)}
    >
      {children}
    </div>
  );
}

export const Tabs = { Root, List, Trigger, Content };
