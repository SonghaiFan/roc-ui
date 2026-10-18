# Micro-motion audit

All 66 gallery components were reviewed against the [transitions.dev](https://transitions.dev) catalog (free for use in products under its licence; it may not be republished as a motion library). Only transitions that match a component's behaviour were applied. Timing comes from one scale on `:where(.roc-ui, .roc-shadcn)` in `ui-base.css`: `--roc-motion-quick` 150 ms, `--roc-motion-fast` 250 ms, `--roc-motion-medium` 350 ms, `--roc-motion-ease`, `--roc-motion-bounce`, `--roc-motion-blur`. Override them on `.roc-ui` or `.roc-shadcn`. `prefers-reduced-motion` removes all of it.

## Applied

| Components | Transition | Motion |
| --- | --- | --- |
| Dropdown Menu, Popover, Context Menu, Menubar, Hover Card | Menu dropdown | Scale 0.97 → 1 from the trigger's transform origin in 250 ms; 0.99 exit in 150 ms |
| Dialog, Alert Dialog | Modal | Scale 0.96 → 1 in 250 ms; 150 ms exit; scrim fades |
| Tooltip | Tooltip | 0.98 scale and fade in 150 ms; 50 ms exit |
| Select | Menu dropdown | Popper grows from the trigger and settles back; item-aligned fades so it stays over the trigger |
| Combobox | Menu dropdown | Base UI starting/ending-style transition, so it stays mounted while it leaves |
| Sheet | Panel reveal | Slides from its own edge in 350 ms, leaves in 250 ms; scrim fades |
| Navigation Menu | Page side-by-side | Panels slide 12 px toward the trigger they came from with a 2 px blur; viewport or panel grows from the top |
| Tabs | Tabs sliding | Marker and label colour share one 250 ms ease |
| Accordion, Collapsible | Accordion expand | Grid track, 2 px cross-blur of the body and, for Accordion, a vertical chevron flip |
| Switch | Toggle | 350 ms thumb with overshoot, as a transition so reversals stay continuous |
| Checkbox | Checkbox check | Box fills in 150 ms, then the mark draws over 350 ms |
| Radio Group | Checkbox check | Dot pops in with a small overshoot |
| Button | Text states swap | `pending` swaps labels with a blurred 4 px lift in the same slot |
| Input, Textarea, Native Select, Input Group | Error state shake | One 240 ms shake when `aria-invalid="true"` is set |
| Field | Texts reveal | Error text settles in with a 4 px rise and blur |
| Code Block | Icon swap | The copied confirmation arrives small and blurred |
| Avatar (in a group) | Avatar group hover | Hovered avatar lifts 4 px with a bounce on return |
| Progress, Toggle | Shared scale | Existing transitions moved onto the shared durations and eases |

Date Picker inherits Popover, Command inherits Dialog, Pagination inherits Button, Toggle Group inherits Toggle.

## Earlier ten components (installable, not in the gallery)

Voice Player swaps play and pause as an icon swap, Continuous Tabs eases its label colour with the marker, and Focus Lanes de-blurs headings as a lane opens. Folder Fan, Source Stack, Page Book, Image Viewport, Expandable Card, Card Preview, Source Tray and Selection Toolbar are driven by measured geometry or springs, so no library transition fits.

## Already had motion, left unchanged

Toast (Base UI stacking with swipe), Trace (collapsible and chevron), Attachment (shimmer while uploading), Spinner, Questionnaire, Item, Message Scroller, Scroll Area, Table and Breadcrumb hover colour, Input OTP (caret and slot ring), Sidebar (200 ms linear width), Drawer (Vaul owns its gesture and spring), Carousel (Embla), Chart (Recharts; the gallery disables the initial bar animation).

## Deliberately without motion

- **Skeleton** is static by contract: a test asserts it is not an ambient shimmer. A pulse was tried and reverted.
- **Slider and Resizable** are direct manipulation. Easing would lag the pointer.
- **Bubble, Message, Alert, Empty, Card** would need mount animation, which the gallery avoids to prevent startup choreography.
- **Aspect Ratio, Badge, Button Group, Calendar, Direction, Kbd, Label, Marker, Separator, Typography** have no state change a transition fits.

## Not verified in a browser

The Navigation Menu slide between triggers (`data-motion`) needs two triggers; the gallery preview has one. Sidebar, Calendar and Carousel were not changed or exercised beyond the existing scenarios.

## Notes for maintainers

The precompiled catalog dropped Tailwind's `animate-in`/`zoom-in`/`slide-in` classes, so most upstream overlays had no entrance or exit before this pass. Exit motion on Base UI surfaces is a CSS animation or `data-ending-style` transition, which keeps the content mounted until it finishes. `scripts/adapt-catalog.mjs` regenerates the CSS and would overwrite these rules.
