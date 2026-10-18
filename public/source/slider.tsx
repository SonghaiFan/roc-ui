// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
"use client";

import * as React from "react";
import { cn } from "./utils";
import { Slider as SliderPrimitive } from "./primitive-slider";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  getValueText,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbLabels?: string[];
  /** Spoken value for a thumb, e.g. "640 pixels, sm". Defaults to the number. */
  getValueText?: (value: number, index: number) => string;
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
      // One thumb carries the label itself; a range labels the group.
      aria-label={_values.length > 1 ? ariaLabel : undefined}
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
            (_values.length === 1 ? ariaLabel : undefined)
          }
          aria-valuetext={getValueText?.(_values[index], index)}
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
