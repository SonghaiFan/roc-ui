"use client";
import { useState } from "react";
/** An optional owner, not a mandatory store or application provider. */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [local, setLocal] = useState(defaultValue),
    current = value === undefined ? local : value;
  return [
    current,
    (next) => {
      if (Object.is(current, next)) return;
      if (value === undefined) setLocal(next);
      onChange?.(next);
    },
  ];
}
