"use client";
// ROC primitive: a draggable value or range. Behaviour from Base UI.
// Keeps ROC's markup (Track, Range and Thumbs as siblings) and adds the Control Base UI needs.
import * as React from "react";
import { Slider as Base } from "@animate-ui/react/primitives/base-ui/slider";

type RootProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "dir"
> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  /** Called when a drag or key press ends, with the final value. */
  onValueCommit?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenThumbs?: number;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  name?: string;
  form?: string;
  dir?: "ltr" | "rtl";
};

const asArray = (value: number | readonly number[]) =>
  Array.isArray(value) ? [...value] : [value as number];

type ThumbProps = Omit<React.ComponentProps<"div">, "ref"> & {
  index?: number;
  "aria-label"?: string;
  "aria-valuetext"?: string;
  ref?: React.Ref<any>;
};

function Root({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  minStepsBetweenThumbs,
  dir: _dir,
  children,
  ...props
}: RootProps) {
  // Base UI needs each thumb's index; shadcn infers it from order.
  let next = 0;
  const numbered = React.Children.map(children, (child) =>
    React.isValidElement(child) && child.type === Thumb
      ? React.cloneElement(child as React.ReactElement<ThumbProps>, { index: next++ })
      : child,
  );
  return (
    <Base.Root
      {...(props as object)}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v: number | readonly number[]) => onValueChange?.(asArray(v))}
      onValueCommitted={(v: number | readonly number[]) => onValueCommit?.(asArray(v))}
      minStepsBetweenValues={minStepsBetweenThumbs}
      thumbAlignment="edge"
      // A dragged thumb may cross the other; values stay sorted.
      thumbCollisionBehavior="swap"
    >
      <Base.Control data-slot="slider-control">{numbered}</Base.Control>
    </Base.Root>
  );
}

function Thumb({
  "aria-label": label,
  "aria-valuetext": valueText,
  ...props
}: ThumbProps) {
  return (
    <Base.Thumb
      {...(props as object)}
      getAriaLabel={label ? () => label : undefined}
      getAriaValueText={valueText ? () => valueText : undefined}
    />
  );
}

export const Slider = {
  Root,
  Track: Base.Track as React.ComponentType<Omit<React.ComponentProps<"div">, "ref">>,
  Range: Base.Indicator as React.ComponentType<Omit<React.ComponentProps<"div">, "ref">>,
  Thumb,
};
