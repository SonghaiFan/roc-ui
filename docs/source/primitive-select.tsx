"use client";
// ROC primitive: a button that opens a list of options. Behaviour from Base UI.
import * as React from "react";
import { Select as Base } from "@base-ui/react/select";
import { createContent } from "./primitive-popup";

type Div = Omit<React.ComponentProps<"div">, "ref"> & { ref?: React.Ref<any> };

const textOf = (node: React.ReactNode): string =>
  React.Children.toArray(node)
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : React.isValidElement(child)
          ? textOf((child.props as { children?: React.ReactNode }).children)
          : "",
    )
    .join("");

/**
 * The trigger must show the chosen label while the list is closed, but Base UI only
 * knows labels of mounted items. Read `value` and text from the item elements in the
 * tree and hand them over as `items`.
 */
function collectItems(node: React.ReactNode, found: Map<string, string>) {
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as { value?: unknown; children?: React.ReactNode };
    if (typeof props.value === "string") {
      const label = textOf(props.children);
      if (label) found.set(props.value, label);
    }
    if (props.children) collectItems(props.children, found);
  });
}

type RootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
  autoComplete?: string;
  form?: string;
  children?: React.ReactNode;
};

function Root({
  value,
  defaultValue,
  onValueChange,
  onOpenChange,
  dir: _dir,
  children,
  ...props
}: RootProps) {
  const found = new Map<string, string>();
  collectItems(children, found);
  const items = [...found].map(([itemValue, label]) => ({ value: itemValue, label }));
  return (
    <Base.Root
      {...props}
      items={items}
      // shadcn uses "" for "nothing chosen"; Base UI uses null.
      value={value === undefined ? undefined : value === "" ? null : value}
      defaultValue={defaultValue === undefined || defaultValue === "" ? null : defaultValue}
      onValueChange={(next: string | null) => onValueChange?.(next ?? "")}
      onOpenChange={(next: boolean) => onOpenChange?.(next)}
    >
      {children}
    </Base.Root>
  );
}

function Trigger(props: Omit<React.ComponentProps<"button">, "ref"> & { ref?: React.Ref<any> }) {
  return (
    <Base.Trigger
      {...(props as object)}
      render={(p: Record<string, any>, state: { open: boolean }) => (
        <button {...p} data-state={state.open ? "open" : "closed"} />
      )}
    />
  );
}

function Icon({ asChild, children, ...props }: React.ComponentProps<"span"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children))
    return <Base.Icon {...(props as object)} render={children as React.ReactElement} />;
  return <Base.Icon {...(props as object)}>{children}</Base.Icon>;
}

const BaseContent = createContent(
  { Positioner: Base.Positioner, Popup: Base.Popup },
  "select",
);

function Content({
  position = "item-aligned",
  ...props
}: React.ComponentProps<typeof BaseContent> & { position?: "item-aligned" | "popper" }) {
  return (
    <BaseContent
      data-position={position}
      positionerProps={{ alignItemWithTrigger: position !== "popper" }}
      {...props}
    />
  );
}

function Item({
  textValue,
  children,
  ...props
}: Div & { value: string; textValue?: string; disabled?: boolean }) {
  return (
    <Base.Item
      {...(props as object)}
      label={textValue}
      render={(p: Record<string, any>, state: { selected: boolean }) => (
        <div {...p} data-state={state.selected ? "checked" : "unchecked"} />
      )}
    >
      {children}
    </Base.Item>
  );
}

function ItemIndicator({ forceMount, ...props }: React.ComponentProps<"span"> & { forceMount?: boolean }) {
  return <Base.ItemIndicator {...(props as object)} keepMounted={forceMount} />;
}

export const Select = {
  Root,
  Trigger,
  Value: Base.Value as React.ComponentType<
    Omit<React.ComponentProps<"span">, "children"> & {
      placeholder?: React.ReactNode;
      children?: React.ReactNode | ((value: string | null) => React.ReactNode);
    }
  >,
  Icon,
  Portal: Base.Portal as React.ComponentType<{ children?: React.ReactNode } & Record<string, unknown>>,
  Content,
  Viewport: Base.List as React.ComponentType<Div>,
  Group: Base.Group as React.ComponentType<Div>,
  Label: Base.GroupLabel as React.ComponentType<Div>,
  Item,
  ItemText: Base.ItemText as React.ComponentType<React.ComponentProps<"span">>,
  ItemIndicator,
  Separator: Base.Separator as React.ComponentType<Div>,
  ScrollUpButton: Base.ScrollUpArrow as React.ComponentType<Div>,
  ScrollDownButton: Base.ScrollDownArrow as React.ComponentType<Div>,
};
