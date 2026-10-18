# Card preview / return correction

Reference: Syuze `eac9e39c47c913ac389fc84b5717b678bc38f4e5`, reviewed and run on 2026-10-18.

User feedback: ROC did not reproduce the feel of Syuze, especially card preview and return. The old implementation kept the React node but changed layout width, reflowed text and used a generic 480ms FLIP tween. Retained identity alone was insufficient.

## Mechanisms used

- `src/spatial/document-view.js`: same content enters the reader, geometry and scroll are projected together, the return anchor is measured when closing, the content is retained until landing.
- `src/spatial/presentation-motion.js` and `spring.js`: stiffness 100, critical damping, mass .48 opening and .32 closing. This viewer resets velocity on a new target. It is distinct from Syuze canvas motion, which can preserve velocity.
- `asset-preview.js`: returning sources stay in the top layer until reaching their actual anchor.

ROC now shares `card-preview.tsx` between the note and source inspection. A native dialog stays mounted in its return slot, then enters the top layer with the same paper and editor. One fixed typeset composition scales; clipping, corner radius, backdrop reveal and scroll derive from a sampled presentation state. Closing samples the last painted pose, avoiding a first-frame jump caused by advancing time between paints. Return geometry is remeasured during closing.

## Evidence and limits

The current Syuze synthetic canvas fixture was run in visible Chromium after supplying two newer bridge capabilities (`projectTitle` and `canAddCharacter`) in a temporary fixture copy. The maintained Syuze source was not edited. Its document open/close path and ROC's reading path were inspected; their content, full-page destinations and visual styling differ. This is not pixel equality or complete viewer extraction.

ROC's targeted browser scenario covers the same DOM paper/editor, fixed typesetting width, caret and draft preservation, current-pose reversal, landing within one pixel, scroll unwind, mobile viewport bounds, source input identity, and reduced motion. Native top-layer focus replaces the prior inline focus behavior. These are Chromium checks, not Safari or physical-device acceptance.

Remaining work is explicit: folder fan geometry/camera, folder action-specific springs, filing, drag and source pile/spread have not been ported. The gallery-to-inspector transition is also still its separate FLIP tween. None of those is certified as Syuze motion parity by this correction.
