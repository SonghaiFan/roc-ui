# 022 — Retained media and competing CSS transitions

- **Project / files:** `visually-enriched-text`, `src/vet/visual-media.tsx`, `src/vet/styles.css`, `scripts/media-overlay-check.mjs`.
- **Stack:** React 19, native dialog, Web Animations API, Pretext for surrounding prose.
- **Date:** 2026-11-11
- **Before revision:** bed6124 (separate hover/modal media subtrees). Acceptance refers to the subsequent retained-media working tree, not that revision.

## Symptom
The user asked to apply responsive-object-continuity to cropped text thumbnails, hover previews and click-to-open media modals. The original implementation replaced the hover video with a new modal video and had no animated return. During the fix, reduced-motion mode still showed geometry animations.

## Conditions
Image and video anchors in selectable prose; modal over a scrolled page; 390×844 and 800×600 viewports; simulated host top/bottom insets of 112/120px. Native modal focus restoration can trigger an unintended new hover preview when the pointer is still over the source anchor.

## Measurement
Local Chromium checks retained the actual video reference: hover time 0.241056s advanced to 2.659584s in the modal on the identical node. After return, the node remained connected and paused. An image closing-frame probe paused the animation at time zero: visible and first closing bounds were both [517,350,686,480], drift 0px. On 390×844 with simulated covered edges, modal top/bottom were 133/702.71875px, inside the permitted 112–724px interval; resize retained the same image node. Reduced-motion emulation initially exposed eight CSSTransition objects on the stage despite skipping Web Animations. The final regression passes with none.

## Cause
Conditional hover/modal branches remounted stateful media. A host-wide CSS transition rule also interpolated left/top/width/height underneath the presentation owner's computed destinations, including when that owner disabled motion. Restored focus/pointer entry could reopen the preview after closing.

## Didn't work
Merely skipping Web Animations for reduced motion left eight host-owned CSS transitions active. Clearing focus suppression in a microtask allowed the restored source to reopen a preview. Both were observed failures, not hypothetical alternatives.

## Fix
Keep one dialog, stage and img/video at a stable tree position. Native show/showModal promotes the retained tree. Measure its painted bounds before cancelling the previous animation; animate stage geometry and aspect-preserving inner crop separately. Keep captions in a separate bounded scroller. Pause only after return completes, retain playhead, and suppress implicit re-entry until a new intentional hover/focus. Exclude presentation geometry from host CSS transitions. Use a generation guard for interrupted animations and one reduced-motion path. Geometry is capped by device/host safe areas and the visual viewport.

The text background is a static thumbnail/poster projection; the interactive media node is retained across preview, modal and hidden states. This does not claim a single painted node for both CSS background and player. Verification is local Chromium, not Safari/device-wide certification.

## Rule
A retained player needs one geometry animation owner as well as one DOM identity. Audit host-wide transitions when frame positions or reduced-motion checks disagree with the presentation engine.
