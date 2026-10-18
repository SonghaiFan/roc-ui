"use client";
// ROC primitive: shared adapter that gives Base UI's Menu parts (and ContextMenu's, which
// share them) the Content/Item/CheckboxItem/ItemIndicator shape ROC components use.
import * as React from "react";
import { createContent, isNativeButton, renderChild } from "./primitive-popup";

type Div = Omit<React.ComponentProps<"div">, "ref"> & { ref?: React.Ref<any> };
type Details = { reason: string; cancel: () => void };

const KindContext = React.createContext<"checkbox" | "radio">("checkbox");
/** Set by an item whose `onSelect` called preventDefault: keep the menu open. */
const KeepOpen = React.createContext<{ current: boolean }>({ current: false });

export function createMenu(
  Base: any,
  prefix: string,
  triggerTag: "button" | "span",
  /** Context menus open to the right of the pointer. */
  defaults: { side?: "right"; align?: "start" } = {},
) {
  const BaseContent = createContent(
    { Positioner: Base.Positioner, Popup: Base.Popup },
    prefix,
  );
  function Content(props: React.ComponentProps<typeof BaseContent>) {
    return <BaseContent aria-orientation="vertical" {...defaults} {...props} />;
  }

  function useGuard(onOpenChange?: (open: boolean) => void) {
    const keepOpen = React.useContext(KeepOpen);
    return (next: boolean, details: Details) => {
      if (!next && details?.reason === "item-press" && keepOpen.current) {
        keepOpen.current = false;
        details.cancel();
        return;
      }
      keepOpen.current = false;
      onOpenChange?.(next);
    };
  }

  type RootProps = {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    children?: React.ReactNode;
  };

  function Guarded({ Part, onOpenChange, ...props }: RootProps & { Part: any }) {
    const guard = useGuard(onOpenChange);
    return <Part {...props} onOpenChange={guard} />;
  }

  function Root(props: RootProps) {
    const keepOpen = React.useRef(false);
    return (
      <KeepOpen.Provider value={keepOpen}>
        <Guarded Part={Base.Root} {...props} />
      </KeepOpen.Provider>
    );
  }

  function Sub({ modal: _modal, ...props }: RootProps) {
    return <Guarded Part={Base.SubmenuRoot} {...props} />;
  }

  type TriggerProps = Omit<React.ComponentProps<"button">, "ref"> & {
    asChild?: boolean;
    ref?: React.Ref<any>;
  };
  function triggerPart(
    Part: any,
    tag: "button" | "span" | "div",
    extra?: (child: React.ReactElement) => object,
  ) {
    return function Trigger({ asChild, children, ...props }: TriggerProps) {
      if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement;
        return (
          <Part
            {...(props as object)}
            {...extra?.(child)}
            render={renderChild(child, (state) => state.open ?? state.popupOpen)}
          />
        );
      }
      const Tag = tag as React.ElementType;
      return (
        <Part
          {...(props as object)}
          render={(p: Record<string, any>, state: { open?: boolean }) => (
            <Tag {...p} data-state={state.open ? "open" : "closed"} />
          )}
        >
          {children}
        </Part>
      );
    };
  }
  const Trigger = triggerPart(Base.Trigger, triggerTag, (child) =>
    triggerTag === "button" ? { nativeButton: isNativeButton(child) } : {},
  );

  type ItemProps = Div & {
    onSelect?: (event: Event | React.SyntheticEvent) => void;
    textValue?: string;
    disabled?: boolean;
    asChild?: boolean;
  };
  function Item({ onSelect, onClick, textValue, asChild, children, ...props }: ItemProps) {
    const keepOpen = React.useContext(KeepOpen);
    const handle = (event: React.MouseEvent<HTMLDivElement>) => {
      keepOpen.current = false;
      onClick?.(event);
      onSelect?.(event);
      if (event.defaultPrevented) keepOpen.current = true;
    };
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement;
      return (
        <Base.Item
          {...(props as object)}
          label={textValue}
          nativeButton={isNativeButton(child)}
          onClick={handle}
          render={child}
        />
      );
    }
    return (
      <Base.Item {...(props as object)} label={textValue} onClick={handle}>
        {children}
      </Base.Item>
    );
  }

  type CheckProps = Omit<Div, "onChange"> & {
    checked?: boolean | "indeterminate";
    onCheckedChange?: (checked: boolean) => void;
    onSelect?: (event: Event | React.SyntheticEvent) => void;
    textValue?: string;
    disabled?: boolean;
  };
  function CheckboxItem({
    checked,
    onCheckedChange,
    onSelect,
    onClick,
    textValue,
    children,
    ...props
  }: CheckProps) {
    const keepOpen = React.useContext(KeepOpen);
    return (
      <KindContext.Provider value="checkbox">
        <Base.CheckboxItem
          {...(props as object)}
          label={textValue}
          checked={checked === undefined ? undefined : checked === true}
          onCheckedChange={(next: boolean) => onCheckedChange?.(next)}
          // shadcn menus close when a checkbox is chosen; Base UI keeps them open.
          closeOnClick
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            keepOpen.current = false;
            onClick?.(event);
            onSelect?.(event);
            if (event.defaultPrevented) keepOpen.current = true;
          }}
          render={(p: Record<string, any>, state: { checked: boolean }) => (
            <div {...p} data-state={state.checked ? "checked" : "unchecked"} />
          )}
        >
          {children}
        </Base.CheckboxItem>
      </KindContext.Provider>
    );
  }

  function RadioGroup({
    onValueChange,
    ...props
  }: Omit<Div, "onChange" | "defaultValue"> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
  }) {
    return (
      <Base.RadioGroup
        {...(props as object)}
        onValueChange={(next: string) => onValueChange?.(next)}
      />
    );
  }

  function RadioItem({
    value,
    onSelect,
    onClick,
    textValue,
    children,
    ...props
  }: Div & {
    value: string;
    onSelect?: (event: Event | React.SyntheticEvent) => void;
    textValue?: string;
    disabled?: boolean;
  }) {
    const keepOpen = React.useContext(KeepOpen);
    return (
      <KindContext.Provider value="radio">
        <Base.RadioItem
          {...(props as object)}
          value={value}
          label={textValue}
          closeOnClick
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            keepOpen.current = false;
            onClick?.(event);
            onSelect?.(event);
            if (event.defaultPrevented) keepOpen.current = true;
          }}
          render={(p: Record<string, any>, state: { checked: boolean }) => (
            <div {...p} data-state={state.checked ? "checked" : "unchecked"} />
          )}
        >
          {children}
        </Base.RadioItem>
      </KindContext.Provider>
    );
  }

  function ItemIndicator({
    forceMount,
    ...props
  }: React.ComponentProps<"span"> & { forceMount?: boolean }) {
    const kind = React.useContext(KindContext);
    const Part = kind === "radio" ? Base.RadioItemIndicator : Base.CheckboxItemIndicator;
    return <Part {...(props as object)} keepMounted={forceMount} />;
  }

  const SubTrigger = triggerPart(Base.SubmenuTrigger, "div");

  function Label(props: Div) {
    return <div {...props} />;
  }

  return {
    Root,
    Trigger,
    Portal: Base.Portal as React.ComponentType<
      { children?: React.ReactNode } & Record<string, unknown>
    >,
    Content,
    Group: Base.Group as React.ComponentType<Div>,
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    ItemIndicator,
    Label,
    Separator: Base.Separator as React.ComponentType<Div>,
    Sub,
    SubTrigger,
    SubContent: Content,
  };
}
