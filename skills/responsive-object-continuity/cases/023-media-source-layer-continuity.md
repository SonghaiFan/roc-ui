# 023 — Media must emerge above prose, below its source label

- **Project / files:** visually-enriched-text; src/vet/visual-media.tsx, src/vet/styles.css
- **Stack:** React 19, native dialog, analytic spring
- **Date:** 2026-11-12

## Historical scope

This records an earlier hover-preview design. Later VET changes removed hover
previews and promote clicked modals before opening so all prose stays beneath.
Do not apply delayed promotion as a universal requirement. For the subsequent
retained-title, early-return and baseline fixes, read
[024](024-return-handoff-and-inline-baseline.md).

## Symptom
Surrounding prose showed through an expanded photograph. Previously the source words disappeared during return, then popped back after collapse.

## Conditions
Inline cropped media background expanding into a hover preview or clicked modal within a reading surface.

## Measurement
Browser DOM sampling found the first stage rectangle exactly matched the source rectangle (200.6875 by 36 px, zero difference). elementFromPoint confirmed the source above the preview and unrelated overlapping prose beneath it. Opening/closing video frames 0, 3 and 9 retained the same video node and visible source. Reduced-motion close cleared the raised marker; a 390 px viewport placed the modal at x=12..368.

## Cause
A negative preview z-index put all prose in front. Immediate native-modal promotion put even the source behind the top layer.

## Didn't work
Raising the entire reading surface preserved words but made unrelated prose overlap the media. Text shadows did not address ownership of the overlapping region.

## Fix
Keep the existing media node above prose and raise only the actual source anchor one layer higher. Open modeless during the outbound flight, then promote the same dialog to modal on settlement. Demote before the return flight. Remove source elevation after closing. Suppress focus-driven preview reopening during native dialog handoffs. Prevent host active transforms from changing the source measurement.

## Rule
Specify occlusion relationships separately from motion geometry. A source label may remain above a traveling object without lifting the whole document; native top-layer promotion belongs at an explicit transition boundary. Tests here establish sampled geometry and layering, not exhaustive touch or screen-reader acceptance.

## Follow-up: the background must leave with the media

The user subsequently observed two images: the source CSS thumbnail remained while the retained media expanded. During flight and preview, suppress the source background and let the stage own the image; restore it only after return settlement. Drive source text color from the existing spring shading value. Browser inspection confirmed backgroundImage=none for image and video previews, then the original URL restored on close with the same image node still connected. This refines the rule: retaining the media node is insufficient if a decorative source copy remains visibly behind.
