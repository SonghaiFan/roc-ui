"use client";
// ROC primitive: a determinate or indeterminate progress bar.
import * as React from "react";

type State = "indeterminate" | "complete" | "loading";
const Context = React.createContext<{ value: number | null; max: number }>({
  value: null,
  max: 100,
});

const stateOf = (value: number | null, max: number): State =>
  value == null ? "indeterminate" : value === max ? "complete" : "loading";

type RootProps = Omit<React.ComponentProps<"div">, "children"> & {
  children?: React.ReactNode;
  value?: number | null;
  max?: number;
  getValueLabel?: (value: number, max: number) => string;
};

function Root({
  value: requested,
  max: requestedMax,
  getValueLabel = (value, max) => `${Math.round((value / max) * 100)}%`,
  ...props
}: RootProps) {
  const max = requestedMax && requestedMax > 0 ? requestedMax : 100;
  const value =
    typeof requested === "number" && requested >= 0 && requested <= max
      ? requested
      : null;
  return (
    <Context.Provider value={{ value, max }}>
      <div
        role="progressbar"
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={value ?? undefined}
        aria-valuetext={value === null ? undefined : getValueLabel(value, max)}
        data-state={stateOf(value, max)}
        data-value={value ?? undefined}
        data-max={max}
        {...props}
      />
    </Context.Provider>
  );
}

function Indicator(props: React.ComponentProps<"div">) {
  const { value, max } = React.useContext(Context);
  return (
    <div
      data-state={stateOf(value, max)}
      data-value={value ?? undefined}
      data-max={max}
      {...props}
    />
  );
}

export const Progress = { Root, Indicator };
