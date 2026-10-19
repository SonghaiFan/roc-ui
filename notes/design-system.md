# One gallery, three levels

The [constitution](../CONSTITUTION.md) defines ROC as a practice-case collection. The gallery is one continuous page, ordered from visual foundations through individual behaviours to complete interfaces.

## Design System

`registry/roc/tokens.css` declares shared semantic tokens: ink, muted text, surface, line, accent/foreground, focus, body/heading/control/mono fonts, type size, control weight, radius, spacing and control height. Both `ui-base.css` and `surface.css` import it, so primitives and source-informed interface cases can use the same visual foundation without importing gallery code. Existing component-specific tokens remain override points.

`src/DesignSystem.tsx` presents those tokens as a live style board. Its colours, typography, radius, inputs and buttons show the current shared settings. The specimen cards themselves are the controls: click the heading, spacing or surface card to change its setting; choose a colour or radius directly, and switch corner style within the corners card. There are no appearance dropdowns. There is no separate Appearance panel. The gallery host forwards them to its persistent preview frame and applies them to the frame document for portal content too.

## Primitives

The second section contains individual behaviour cases grouped into the eight established categories. Category selection affects primitives only. Search and interaction filters can match either primitive or interface cases.

## Interfaces

The third section composes the earlier extracted reading surfaces, folders, source stacks, focus lanes, continuous reading views, image viewports, audio sources, selection actions, page books and source trays with demo content and existing primitives. Their source provenance and continuity principle are shown with each case. A case need not be rewritten merely to fit a single library or implementation style.

## Continuity

All three levels live inside one preview document. Filters hide the existing keyed cases; they do not replace the component tree. Focusing a case hides surrounding sections and resizes that same preview frame. Returning should land back at the same case. Header links are section anchors, not page tabs. Source inspection is separate from the running case.
