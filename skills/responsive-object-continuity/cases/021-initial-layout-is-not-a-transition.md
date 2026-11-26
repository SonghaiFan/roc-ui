# 021 — Initial masonry layout is not a user transition

- **Project / files:** ROC UI, `src/App.tsx`, `src/ViewportPreview.tsx`, `src/site.css`, `tests/masonry-startup.scenario.js`
- **Baseline:** `3daa6bf` (v0.9.0)
- **Stack:** React 19, native CSS columns, iframe viewport, ResizeObserver, Web Animations API
- **Date:** 2026-10-18

## Symptom

Refreshing the gallery made the masonry cards shuffle, jump and flicker. The user explicitly rejected the excess motion: the layout was reorganizing without an interaction that needed explanation.

## Conditions

The overview mounted at a provisional 1024 px width. A ResizeObserver then measured the available width and changed the iframe shell width, which had a 480 ms CSS transition. Inside the frame, another ResizeObserver animated each card position with a 320 ms FLIP transition on every canvas resize. Native column balancing and wrapping changed the destinations during that width transition.

## Measurement

A first Chromium startup probe counted 284 calls to `Element.animate` on `.component-card` during one refresh. This is a sampled run, not a fixed count. Source inspection established the provisional width, width transition and observer-driven animation chain.

After the fix, a probe injected immediately before the application bundle observed the first committed gallery layout and subsequent ResizeObserver notifications. At host widths 1440, 390 and 1440 px, the iframe widths were respectively 1398, 364 and 1398 px from the first observation onward. Measured initial-to-settled card-position drift was 0 px and masonry card-animation calls were 0. The original Tabs editor and its draft survived a desktop-to-phone host resize. These are Chromium observations, not universal-device certification.

## Cause

Measurement initialization was treated as a meaningful interaction. A width animation continuously changed the browser's column layout while a second animation owner repeatedly chased those changing card destinations. Preserving DOM identity did not make the resulting motion useful or coherent.

## Fix

- Give overview and Fit shells `width: 100%` directly in CSS layout, rather than rendering a guessed numeric width and correcting it after mount.
- Disable width transitions in overview mode.
- Remove the gallery-wide observer and automatic card FLIP animations. Leave native masonry layout and stable keyed component nodes intact.
- Keep component-owned interaction motion and user-operated detail viewport controls. Do not mask initialization with delayed visibility, fades or replacement trees.

The responsive-detail regression scenario verifies preset widths, exact breakpoint markers, drag/keyboard resizing and editor identity through the gallery/detail round trip.

## Rule

Initial layout and passive measurement corrections are not user transitions. Render the initial arrangement at its real dimensions; reserve motion for a meaningful state change with a clear owner and destination. Object continuity does not require animating every container reflow.
