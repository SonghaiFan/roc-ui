"use client";
// ROC primitive helpers. Small, dependency-free building blocks.
import * as React from "react";

/** Run the caller's handler first; run ours unless the caller prevented default. */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  original: ((event: E) => void) | undefined,
  ours: ((event: E) => void) | undefined,
) {
  return (event: E) => {
    original?.(event);
    if (!event.defaultPrevented) ours?.(event);
  };
}

type PossibleRef<T> = React.Ref<T> | undefined;

/** Merge refs, forwarding React 19 ref cleanups. */
export function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    const cleanups: Array<() => void> = [];
    for (const ref of refs) {
      if (typeof ref === "function") {
        const cleanup = ref(node);
        cleanups.push(
          typeof cleanup === "function" ? cleanup : () => ref(null),
        );
      } else if (ref) {
        (ref as React.RefObject<T | null>).current = node;
        cleanups.push(() => {
          (ref as React.RefObject<T | null>).current = null;
        });
      }
    }
    return () => cleanups.forEach((cleanup) => cleanup());
  };
}

export function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}

export function usePrevious<T>(value: T) {
  const ref = React.useRef({ value, previous: value });
  return React.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
