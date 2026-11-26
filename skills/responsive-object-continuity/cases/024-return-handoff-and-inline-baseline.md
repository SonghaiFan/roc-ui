# 024 — Return handoff and inline baseline continuity

- **Project / files:** `visually-enriched-text`; `src/vet/visual-media.tsx`, `src/vet/styles.css`, `src/vet/spring.ts`
- **Stack:** React, native dialog/top layer, retained media and title, analytic spring
- **Date:** 2026-11-12
- **Implementation evidence:** `b4715b0` retained title; `5a8b246` early title return; `777b682` baseline correction. Earlier `08601c7` introduced the aperture experiment.

## Symptom and conditions

An inline image/video pill expanded into a borderless modal. On return, the text
changed appearance at the last frame; after that was improved, the media still
snapped in size at the end. The user explicitly preferred moving the handoff
before the motion settled. This is a design preference supported by this case,
not proof that people notice changes only at animation endpoints.

## Separate the continuity contracts

- **Identity:** the actual media/text leaf survives; identical strings and matching
  coordinates in two nodes do not establish instance continuity.
- **Geometry:** the moving aperture must meet the actual resting pill, including
  its baseline and line box, not merely an earlier measured placeholder.
- **Appearance:** font, tracking, line-height, shadow, crop and shade must agree at
  handoff. Retaining a node does not preserve inherited styles across parents.
- **Presentation ownership:** native modal top-layer membership, reading-layer
  elevation and the source background each have explicit transition boundaries.

## Measurement

Browser DOM sampling in this session established:

1. An earlier title projection started at the source with `dx=0, dy=0`, yet the
   user still saw a final text change. Coordinate equality alone was insufficient.
2. After the retained-leaf fix and early return, the source contained the **same
   saved title node** while the dialog was still open and `data-moving=true`.
   Reopening and closing again worked in the sampled checks.
3. Immediately before the media disappeared, the source pill was **24 px** high
   but the moving frame converged to **30 px**. The mismatch survived early text
   return; it was a geometry bug, not evidence to shorten the animation again.
4. With a baseline strut, the final sampled frame heights were **24.015625, 24,
   24 px**, against a **24 px** source throughout.

These are browser measurements and user feedback for this implementation, not
cross-browser, screen-reader or exhaustive interruption acceptance.

## Cause

Two problems had accumulated. First, a separately rendered modal title was
hidden at completion while the original text became visible; their shadows and
rendering contexts differed. Retaining the actual title leaf fixed duplication,
but restoring its parent/styles precisely at rest could still expose a seam.

Second, moving the title out left an empty `inline-block`. Its baseline became
its bottom edge. Freezing width and height preserved its box but **not its text
baseline**. The source button grew to 30 px while empty, so the return animation
cached that destination. Returning the title restored the real 24 px line box.

## What did not solve it

- Faster springs and better starting coordinates did not eliminate final-frame
  parent/style switches or a stale destination height.
- Matching only the placeholder's width/height did not preserve its baseline.
- Early title handoff improved the text seam but did not cure the 6 px media jump.
- A CSS thumbnail plus a traveling image can still show two copies; retaining
  the modal image alone does not imply a single media representation at rest.

## Fix

Keep the title leaf, reserve its source slot, and move it under controlled
ownership. When reparenting a React-owned leaf, restore its original parent on
cleanup and verify updates/unmounts; do not generalize this into moving editor
roots or arbitrary interactive subtrees.

During return, restore the title while the aperture still moves, using remaining
geometry rather than an unrelated timeout. VET used remaining title distance
`<= min(12px, 12% of initial distance)` as a tuning value. Preserve color/shadow
through that handoff and stop writing floating geometry to the returned leaf.
Reversal must reacquire the current node and current geometry; reduced motion
must complete cleanup without waiting for a flight.

Preserve the placeholder's inline baseline with a zero-width text strut:

```css
.vet-media-source-label::before { content: '\200b'; }
```

This is the measured fix for this text slot, not a universal placeholder recipe.
Check the actual font, line-height, wrapping and accessibility behavior in a new
host. The final transition must use the same destination geometry before and
after the retained title returns.

## Aperture versus scaling

For the requested reveal effect, animate the clipping window separately from
media dimensions. VET kept the full-size media texture while changing aperture
position/size/corners and its crop offset. It still uses a CSS background at
rest: call that a presentation handoff, not strict same-node media continuity.
Verify crop alignment and do not leave both representations visible. A title
can travel with the same spring without stretching its glyphs.

## Reusable acceptance checks

- Save node references before opening; compare identity during travel and after
  return. Do not infer identity from matching text or screenshots.
- Measure source and moving bounds before removal, while the slot is empty,
  at title handoff, just before settling, and after cleanup. Keep fractional px.
- Compare computed typography/shadows and baseline markers, not only rectangles.
- Confirm handoff occurs while motion is active; confirm there is no new size,
  style or parent swap at rest. Test reopen/reverse after the handoff threshold.
- Keep media aspect ratio, safe-area fit, caption space, keyboard close/focus and
  reduced-motion behavior intact. Verify both image and video where relevant.

## Rule

Preserve the source's **typographic geometry**, not only its outer box. When a
presentation handoff is necessary, perform it during the final moving segment
with matching appearance, then let the remaining motion settle. Never use early
handoff to hide an unmeasured destination mismatch.
