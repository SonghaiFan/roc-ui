# shadcn foundations, adapted for ROC

Version 0.10 includes 25 customized foundations; the earlier 10 source-informed components remain downloadable but are not displayed in the gallery. The starting point is the official shadcn/ui `new-york-v4` source, retained verbatim under `upstream/shadcn/` with URL, retrieval time, checksums and MIT license. The distributed code is in `registry/roc/`.

## What is kept

The composition names (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, etc.), native field props, Radix semantics, controlled/uncontrolled state patterns, `asChild` composition and variant helpers remain available. Dialog, Popover, Dropdown Menu and Tooltip use Radix for focus, dismissal and positioning. The project does not reimplement a generic focus trap.

## What ROC changes

| Foundation | ROC contract |
| --- | --- |
| Button | Optional `pending` and `pendingLabel` reserve one label slot. Feedback changes without moving the button or its neighbours. Native buttons default to `type="button"`; set submit explicitly. |
| Badge, Card, Separator | Neutral scoped surfaces, semantic variants, caller-owned composition and inherited ROC tokens. |
| Input, Textarea | Native fields and refs; no breakpoint-specific replacement. Coarse-pointer sizing avoids tiny controls and text. |
| Checkbox | Checked/indeterminate semantics with a larger interaction target. |
| Switch | The same thumb follows state changes; reversals continue from the current transform. |
| Slider | Direct pointer manipulation and keyboard refinement. `thumbLabels` names multiple thumbs; a single thumb inherits `aria-label`. |
| Tabs | Radix tab semantics plus one measured selection marker. Panels are force-mounted, with inactive panels hidden and inert. An uncontrolled editor retains its DOM node, value and selection. |
| Accordion | Force-mounted content with inert closed panels. Inner CSS grid tracks animate opening, closing and reversal; the Radix measurement wrapper owns no layout animation. |
| Dialog | One open form changes from a centred desktop surface to a bottom-aligned phone surface. Visible height subtracts device/host safe edges. Radix keeps focus trapping, Escape and focus return. |
| Popover, Dropdown Menu, Tooltip | Trigger-relative context, collision-aware placement, keyboard access and reduced-motion paths. Tooltips are supplemental, delayed context, never the only label for an action. |
| Alert | Inline semantic notice with neutral/destructive variants. The caller controls when to announce updates. |
| Avatar | Reserved dimensions for image/fallback, three sizes, presence badge and groups; no layout shift when a portrait loads. |
| Progress | One retained fill, custom `max`, clamped finite values and real Radix progress semantics. Missing/null value means indeterminate, with no `aria-valuenow`; reduced motion uses a static indicator. |
| Skeleton | Static, decorative placeholder. The host supplies dimensions and loading announcements, reserving the final footprint without ambient shimmer. |
| Toggle / Toggle Group | Pressed state, single/multiple selection, roving focus and scoped appearance. Native controls and caller-owned data stay in place. |
| Radio Group | Radio semantics, form integration, disabled options and arrow-key selection. Labels remain caller-composed. |
| Scroll Area | Retained native viewport, Radix scrollbars, keyboard focus, `viewportProps` for refs/accessibility and `scrollbars` (vertical, horizontal or both). Host supplies height/width. |
| Breadcrumb | Semantic path with wrapping, `asChild` links and `aria-current="page"`. Routing remains with the host. |
| Pagination | Current-page links and explicit `disabled` behavior. Disabled links have no `href`, cannot invoke `onClick` and leave the tab order. Host owns the page data and navigation. |

The adaptations use component-scoped CSS rather than shadcn's Tailwind utility strings. Consumers do not need a Tailwind build, gallery CSS or application aliases. Use `--roc-paper`, `--roc-ink`, `--roc-line`, `--roc-muted`, `--roc-marker`, `--roc-radius`, and `--roc-focus` for appearance. Put shared tokens on the document root if portals should inherit them. A themed app with several independent roots may instead use the underlying Radix portal composition.

The registry recursively includes local imports, styles, utilities and both applicable license notices. External dependencies are derived from source imports: React, Radix UI, lucide-react, class-variance-authority and clsx as needed. No legacy Syuze or Franklin application runtime is installed. `upstream/` and gallery demos are not part of an install.

## Continuity boundaries

- Retained Tabs and Accordion panels keep effects alive. The host must pause hidden audio or expensive work when appropriate. Inert prevents interaction; it does not pause side effects.
- Dialog, Popover, Dropdown Menu and Tooltip remain **transient overlays**. Their content unmounts after dismissal. Persistent form data belongs above the overlay. An open dialog retains its actual input across width changes; closing/reopening preserves caller-owned values, not the input DOM node or caret.
- CSS grid/transform transitions reverse from the current position. This is position continuity, not a claim of spring velocity continuity or Syuze motion parity.
- Keep slider thumb count stable during an active gesture. One logical thumb should not change identity because a different range model was supplied.
- For a card that must remain the same reading/editor surface through open and close, use ROC `CardPreview`/`ExpandableCard`. A transient Dialog is a different interaction contract.

## Verification

`npm run check`, registry closure/dependency checks, isolated consumer compilation and server rendering cover the downloadable boundary. Browser scenarios exercise keyboard selection and dismissal, retained editor identity, interrupted Accordion reversal, marker destination, pending-button geometry, dialog phone/desktop geometry and covered bottom edges. Runtime checks are Chromium; this does not certify physical iOS/Android devices or all assistive technologies.

A source-backed issue encountered during adaptation: Radix Collapsible temporarily sets `transitionDuration: 0s` on its content while measuring. Putting the grid transition on that element jumped from 118 px to 0 px within the sampled 50 ms, despite a computed 320 ms transition. Moving the transition to an inner retained wrapper keeps measurement and animation ownership separate. The browser scenario checks an intermediate nonzero height, reversal and the zero-height destination.
