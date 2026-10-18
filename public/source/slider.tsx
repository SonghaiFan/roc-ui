// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
"use client";

import * as React from "react";
import { cn } from "./utils";
import { Slider as SliderPrimitive } from "radix-ui";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbLabels?: string[];
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn("roc-ui", className)}
      {...props}
    >
      <SliderPrimitive.Track data-slot="slider-track" className={cn("roc-ui")}>
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn("roc-ui")}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          aria-label={
            thumbLabels?.[index] ??
            (_values.length === 1 ? props["aria-label"] : undefined)
          }
          data-slot="slider-thumb"
          key={index}
          className="roc-ui"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };

import "./slider.css";
