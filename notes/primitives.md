# Primitive implementation boundaries

The [project constitution](../CONSTITUTION.md) governs this document. ROC is a collection of ROC skill practice cases. Local adapters support coherent UI/UX and reuse; owning primitives or avoiding libraries is not a goal.

## Responsibilities

- **Interaction:** use mature libraries for state, keyboard behavior, accessibility, form participation, focus and dismissal. Current examples predominantly use Base UI.
- **Animation:** use existing animation implementations where suitable. Current examples use Animate UI, including its Base UI adapters, text primitives and shared motion settings.
- **ROC:** choose visual tokens, defaults, content, composition and interaction contracts that demonstrate object continuity. Review the final UI/UX in the running case.

These responsibilities do not mandate a single technology stack. Specialist libraries and native elements remain valid when they fit the case better.

## Current seams

| Cases | Implementation |
| --- | --- |
| Checkbox, Switch, Radio, Toggle, Toggle Group | Base UI state/form/keyboard behavior, Animate UI indicators/thumb/button/group motion, ROC state-attribute and compound-API adapters |
| Accordion, Collapsible | Animate UI's Base UI disclosure panels with retained content by default; ROC visual wrappers |
| Tabs | Animate UI's Base UI tabs, shared selection marker and panel motion; ROC variants and retained panels |
| Dialog, Alert Dialog, Sheet; Popover, Tooltip, Hover Card; menus and Select | Existing Animate UI Base UI adapters behind ROC trigger/content/portal APIs |
| Slider, Combobox, Toast | Animate UI Base UI implementations with ROC presentation |
| Scroll Area, Direction | Base UI behavior directly |
| Text effects | Installed Animate UI primitives with ROC styling and demo controls |
| Charts, tables, calendar, carousel, resizable panels, drawers | Existing specialist libraries; selected for the actual interaction |
| Navigation Menu and source-informed spatial cases | Existing case-specific implementations; replace only when the alternative improves the case and preserves its interaction contract |
| Slot, Label, Separator, Aspect Ratio and other small presentation helpers | Native/React composition where sufficient |

`RocMotionProvider` bridges ROC's public pace/reduced-motion/check defaults to `AnimateUIProvider`. ROC-only compositions consume Animate UI's timing tokens. Library providers should share this setting rather than maintaining conflicting motion policies.

Legacy `data-state`, `asChild`, single/multiple selection and compound component APIs may be translated at local seams. Such translation must not duplicate a library's keyboard, focus or form state machine. Keep animation-owned transforms and indicator drawing free from competing CSS motion.

## Validation

Build registry payloads from current sources and check dependency closure. Validate isolated consumers as well as the gallery. For interaction changes, exercise keyboard and pointer paths, native forms/reset, disabled/mixed states, retained drafts, focus/dismissal and reduced motion. Historical parity tests are reference evidence, not a requirement to preserve every old library's internal implementation.
