"use client";
// ROC primitive: arrow-key focus movement and a single tab stop for a group of items.
// Items mark themselves with `data-roving-item`; each group marks its root `data-roving-root`.
import * as React from "react";

export type Orientation = "horizontal" | "vertical";
export const ROVING_ROOT = "data-roving-root";
export const ROVING_ITEM = "[data-roving-item]";

const INTENT: Record<string, "prev" | "next" | "first" | "last"> = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last",
};

/** Items that belong to this group (not to a nested one) and can take focus. */
export function focusableItems(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(ROVING_ITEM)).filter(
    (item) =>
      item.closest(`[${ROVING_ROOT}]`) === root &&
      !item.matches(":disabled, [data-disabled]"),
  );
}

/** Move focus for an arrow/Home/End key. Returns whether the key was handled. */
export function handleRovingKey(
  event: React.KeyboardEvent,
  root: HTMLElement | null,
  options: { orientation?: Orientation; dir?: "ltr" | "rtl"; loop?: boolean },
) {
  if (!root || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
    return false;
  const current = (event.target as HTMLElement).closest<HTMLElement>(ROVING_ITEM);
  if (!current || current.closest(`[${ROVING_ROOT}]`) !== root) return false;
  const rtl = (options.dir ?? getComputedStyle(root).direction) === "rtl";
  let key = event.key;
  if (rtl && key === "ArrowLeft") key = "ArrowRight";
  else if (rtl && key === "ArrowRight") key = "ArrowLeft";
  const { orientation, loop = true } = options;
  if (orientation === "vertical" && (key === "ArrowLeft" || key === "ArrowRight"))
    return false;
  if (orientation === "horizontal" && (key === "ArrowUp" || key === "ArrowDown"))
    return false;
  const intent = INTENT[key];
  if (!intent) return false;
  event.preventDefault();
  const items = focusableItems(root);
  const index = items.indexOf(current);
  let target: HTMLElement | undefined;
  if (intent === "first") target = items[0];
  else if (intent === "last") target = items[items.length - 1];
  else {
    const step = intent === "next" ? 1 : -1;
    const next = index + step;
    target = loop
      ? items[(next + items.length) % items.length]
      : items[next];
  }
  if (target && target !== current) target.focus();
  return true;
}

/**
 * One tab stop per group: the selected item, or the first enabled item when none
 * is selected. Items read `fallback` and compare it to their `data-roving-value`.
 */
export function useRovingTabStop(selectedSelector: string) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = React.useState<string | null>(null);
  React.useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = focusableItems(root);
    const next = items.some((item) => item.matches(selectedSelector))
      ? null
      : (items[0]?.dataset.rovingValue ?? null);
    setFallback((previous) => (previous === next ? previous : next));
  });
  return { ref, fallback };
}
