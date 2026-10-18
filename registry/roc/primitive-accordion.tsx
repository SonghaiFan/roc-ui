"use client";
// ROC primitive: a stack of headers that each reveal a panel.
import * as React from "react";
import { useDirectionContext } from "./primitive-direction-context";
import { composeEventHandlers, useComposedRefs } from "./primitive-utils";
import { ROVING_ROOT, handleRovingKey, type Orientation } from "./primitive-roving";

type Context = {
  disabled: boolean;
  orientation: Orientation;
  values: string[];
  open: (value: string) => void;
  close: (value: string) => void;
  collapsible: boolean;
};
const AccordionContext = React.createContext<Context | null>(null);
const ItemContext = React.createContext<{
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
} | null>(null);
const useAccordion = () => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("Accordion parts must be inside Accordion.Root");
  return context;
};
const useItem = () => {
  const context = React.useContext(ItemContext);
  if (!context) throw new Error("Accordion parts must be inside Accordion.Item");
  return context;
};

type Shared = Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> & {
  disabled?: boolean;
  orientation?: Orientation;
  dir?: "ltr" | "rtl";
};
type SingleProps = Shared & {
  type: "single";
  /** Allow the open item to be closed again. */
  collapsible?: boolean;
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
type RootProps = SingleProps | MultipleProps;

const toArray = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value : value ? [value] : [];

function Root(props: RootProps) {
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    orientation = "vertical",
    dir: dirProp,
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
  const collapsible = type === "multiple" || !!(props as SingleProps).collapsible;
  delete (rest as { collapsible?: boolean }).collapsible;
  const [internal, setInternal] = React.useState(() => toArray(defaultValue));
  const values = value === undefined ? internal : toArray(value);
  const change = (next: string[]) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(type === "multiple" ? next : (next[0] ?? ""));
  };
  const root = React.useRef<HTMLDivElement>(null);
  const composed = useComposedRefs<HTMLDivElement>(ref as React.Ref<HTMLDivElement>, root);
  return (
    <AccordionContext.Provider
      value={{
        disabled,
        orientation,
        values,
        collapsible,
        open: (item) => change(type === "multiple" ? [...values, item] : [item]),
        close: (item) =>
          change(values.filter((existing) => existing !== item)),
      }}
    >
      <div
        dir={dir}
        data-orientation={orientation}
        {...{ [ROVING_ROOT]: "" }}
        {...rest}
        ref={composed}
        onKeyDown={composeEventHandlers(onKeyDown, (event) =>
          handleRovingKey(event, root.current, { orientation, dir }),
        )}
      />
    </AccordionContext.Provider>
  );
}

function Item({
  value,
  disabled: itemDisabled,
  ...props
}: React.ComponentProps<"div"> & { value: string; disabled?: boolean }) {
  const accordion = useAccordion();
  const id = React.useId();
  const open = accordion.values.includes(value);
  const disabled = accordion.disabled || !!itemDisabled;
  return (
    <ItemContext.Provider
      value={{
        value,
        open,
        disabled,
        triggerId: `${id}-trigger`,
        contentId: `${id}-content`,
      }}
    >
      <div
        data-orientation={accordion.orientation}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        {...props}
      />
    </ItemContext.Provider>
  );
}

function Header(props: React.ComponentProps<"h3">) {
  const accordion = useAccordion();
  const item = useItem();
  return (
    <h3
      data-orientation={accordion.orientation}
      data-state={item.open ? "open" : "closed"}
      data-disabled={item.disabled ? "" : undefined}
      {...props}
    />
  );
}

function Trigger({ onClick, ...props }: React.ComponentProps<"button">) {
  const accordion = useAccordion();
  const item = useItem();
  return (
    <button
      type="button"
      aria-controls={item.contentId}
      aria-expanded={item.open}
      aria-disabled={(item.open && !accordion.collapsible) || undefined}
      data-orientation={accordion.orientation}
      data-state={item.open ? "open" : "closed"}
      data-disabled={item.disabled ? "" : undefined}
      data-roving-item=""
      disabled={item.disabled}
      {...props}
      id={item.triggerId}
      onClick={composeEventHandlers(onClick, () => {
        if (!item.open) accordion.open(item.value);
        else if (accordion.collapsible) accordion.close(item.value);
      })}
    />
  );
}

function Content({
  forceMount,
  children,
  ...props
}: React.ComponentProps<"div"> & { forceMount?: boolean }) {
  const accordion = useAccordion();
  const item = useItem();
  if (!item.open && !forceMount) return null;
  return (
    <div
      role="region"
      aria-labelledby={item.triggerId}
      data-orientation={accordion.orientation}
      data-state={item.open ? "open" : "closed"}
      data-disabled={item.disabled ? "" : undefined}
      {...props}
      id={item.contentId}
    >
      {children}
    </div>
  );
}

export const Accordion = { Root, Item, Header, Trigger, Content };
