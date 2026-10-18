"use client";
import { useCallback, useLayoutEffect, useRef } from "react";

/** Measure before changing layout; retain actual nodes and retarget from their visible pose.
 * Layout retargeting preserves the current measured pose; release velocity is not preserved.
 */
export function useContinuity(duration = 480) {
  const root = useRef<HTMLDivElement>(null);
  const before = useRef(new Map<HTMLElement, DOMRect>());
  const animations = useRef(new Map<HTMLElement, Animation>());
  const change = useCallback((update: () => void) => {
    before.current.clear();
    root.current
      ?.querySelectorAll<HTMLElement>("[data-roc-item]")
      .forEach((node) => {
        before.current.set(node, node.getBoundingClientRect());
      });
    update();
  }, []);
  useLayoutEffect(() => {
    if (!before.current.size) return;
    const configured = Number.parseFloat(
      root.current
        ? getComputedStyle(root.current).getPropertyValue("--roc-duration")
        : "",
    );
    const timing = Number.isFinite(configured) ? configured : duration;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const [node, old] of before.current) {
      animations.current.get(node)?.cancel();
      if (!node.isConnected || reduced) continue;
      const next = node.getBoundingClientRect();
      if (!next.width || !next.height) continue;
      const scale = node.dataset.rocScale !== "false";
      const animation = node.animate(
        [
          {
            translate: `${old.x - next.x}px ${old.y - next.y}px`,
            scale: scale
              ? `${old.width / next.width} ${old.height / next.height}`
              : "1",
          },
          { translate: "0px 0px", scale: "1" },
        ],
        { duration: timing, easing: "cubic-bezier(.22,.8,.25,1)" },
      );
      animations.current.set(node, animation);
      void animation.finished
        .then(() => {
          if (animations.current.get(node) === animation)
            animations.current.delete(node);
        })
        .catch(() => {});
    }
    before.current.clear();
  });
  useLayoutEffect(
    () => () => {
      animations.current.forEach((a) => a.cancel());
    },
    [],
  );
  return { root, change };
}
