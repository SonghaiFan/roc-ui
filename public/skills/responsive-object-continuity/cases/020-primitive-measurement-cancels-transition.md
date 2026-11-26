# 020 — A primitive's measurement cancels its layout transition

- **Project / files:** ROC UI, `registry/roc/accordion.tsx`, `accordion.css`, `tests/foundations.scenario.js`.
- **Stack:** React 19, shadcn/ui new-york-v4 source, radix-ui 1.8.1, CSS grid transitions, Chromium.
- **Date:** 2026-10-18

## Symptom

A retained Accordion editor snapped shut instead of folding. The same editor node survived, but there was no intermediate layout frame.

## Conditions

`Accordion.Content forceMount` retained the editor. The `grid-template-rows: 1fr → 0fr` transition was applied directly to the Radix content element. The gallery's focused desktop preview reproduced the problem; no claim about other browser engines was needed to establish the cause.

## Measurement

A browser sample read `getBoundingClientRect().height`, computed `gridTemplateRows`, computed `transitionDuration`, inline style, `data-state` and `hidden` before a trigger click, 50 ms after it and after settling. The open height was 118 px; at 50 ms it was already 0 px, despite a computed duration of 0.32 s. `hidden` was false in both states and the node was retained.

## Cause

Radix Collapsible's layout effect temporarily writes `transitionDuration: "0s"` and `animationName: "none"` on its content, reads its geometry, then restores the styles. That forced measurement commits the grid's endpoint without motion. A later computed-style snapshot sees the restored duration and hides the temporary override.

## Didn't work

Keeping `forceMount`, a stable node and a CSS transition on the measurement owner prevented remounting but did not provide motion continuity. Increasing duration was not tested and is not a demonstrated remedy.

## Fix

Keep the primitive as the semantic and measurement wrapper. Animate an inner retained layout wrapper:

```tsx
<AccordionPrimitive.Content forceMount inert={!open} aria-hidden={!open}>
  <div className="layout" data-open={open}>
    <div className="clip"><div className="body">{children}</div></div>
  </div>
</AccordionPrimitive.Content>
```

The layout wrapper transitions grid tracks between 1fr and 0fr; the clip has `min-height: 0` and `overflow: hidden`. Closed content is inert, so retained descendants are not keyboard targets. Reduced motion removes the travel. The focused browser scenario now observes a nonzero intermediate height, interrupts and reverses the collapse, verifies the same editor/value, and verifies a zero-height closed destination.

## Rule

Do not put a layout transition on an element whose styles or geometry are temporarily controlled by a primitive's measurement phase. Separate measurement/semantics from the animated layout layer. A restored computed transition and a retained node are not proof of intermediate motion. CSS reversal here preserves position, not necessarily spring velocity.
