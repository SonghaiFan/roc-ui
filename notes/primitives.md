# Owning the primitives

ROC components should not depend on someone else's package name. Every behavioural dependency now enters through a local `primitive-*` file, so a component imports `./primitive-dialog`, never `radix-ui`.

## Owned

Written in this repository, with the same props and `data-*` attributes the components and CSS already use:

| File | Replaces | Notes |
| --- | --- | --- |
| `primitive-slot.tsx` | `Slot` | `asChild` merges props, handlers (child first), `style`, `className` and refs onto the single child |
| `primitive-label.tsx` | `Label` | Does not select text on double click, except inside form controls |
| `primitive-separator.tsx` | `Separator` | `decorative` removes it from the accessibility tree; `aria-orientation` only when vertical |
| `primitive-aspect-ratio.tsx` | `AspectRatio` | CSS `aspect-ratio` on the wrapper, children fill an absolute inner box |
| `primitive-progress.tsx` | `Progress` | `indeterminate`, `loading` and `complete` states; `aria-valuenow` is absent when indeterminate |
| `primitive-avatar.tsx` | `Avatar` | Fallback shows until the image has loaded, and returns if the image unmounts or fails |
| `primitive-toggle.tsx` | `Toggle` | Controlled or uncontrolled `pressed` |
| `primitive-switch.tsx` | `Switch` | Native form participation, `reset` support, controlled or uncontrolled |
| `primitive-checkbox.tsx` | `Checkbox` | `checked`, unchecked and `indeterminate` (`aria-checked="mixed"`); Space toggles, Enter does not |
| `primitive-tabs.tsx` | `Tabs` | `tablist`/`tab`/`tabpanel` with arrow, Home and End keys, automatic or manual activation, horizontal or vertical, values with spaces in ids |
| `primitive-accordion.tsx` | `Accordion` | `single` (optionally `collapsible`) or `multiple`; arrow keys loop across headers and skip disabled ones |
| `primitive-radio-group.tsx` | `RadioGroup` | Arrow keys move and check, Enter does not, one tab stop, form submit and reset |
| `primitive-toggle-group.tsx` | `ToggleGroup` | `single` (`radiogroup`/`radio`) or `multiple` (`toolbar`/`aria-pressed`), roving focus |
| `primitive-roving.ts` | internal | Shared arrow-key focus movement and single tab stop for the four above; direction comes from the `dir` prop or CSS, not a provider |
| `primitive-form-input.tsx`, `primitive-utils.ts` | internal | Hidden input for forms; ref and handler composition |

Components that now install with no `radix-ui` dependency: 48 of the 66 in the gallery, including Button, Badge, Card, Checkbox, Switch, Toggle, Label, Separator, Progress, Avatar, Tabs, Accordion and Radio Group.

## Still delegated

These files are one-line re-exports. Replacing one means rewriting that file and nothing else.

Alert Dialog, Collapsible, Context Menu, Dialog (also used by Sheet), Direction, Dropdown Menu, Hover Card, Menubar, Navigation Menu, Popover, Scroll Area, Select, Slider, Tooltip.

Suggested order, easiest and most testable first:

1. Collapsible and Slider: disclosure state, then pointer capture.
2. Scroll Area: measurement and custom scrollbars.
3. Dialog and Alert Dialog: focus trap, scroll lock, dismissal and focus return.
4. Popover, Tooltip, Hover Card, Dropdown Menu, Context Menu, Menubar, Select, Navigation Menu: positioning, collision handling, typeahead and submenus. Largest.

Direction stays delegated until the others go: Radix overlays read direction from their own context. The owned primitives read `dir` or the computed CSS direction.

## Not covered

Base UI (Combobox, Toast), Vaul, cmdk, Embla, react-day-picker, input-otp, react-resizable-panels, Recharts, TanStack Table and `@shadcn/react` are specialist libraries and remain external.

## Checks

`tests/parity/` renders Tabs, Accordion, Radio Group and Toggle Group with the owned primitives and with Radix side by side, drives both with the same 43 mouse and keyboard steps, and compares every control's ARIA and state, the visible panels, focus, callbacks, submitted and reset form data and the Tab-key walk. It matches except for:

- Radix makes a radio or toggle group container tabbable after interaction, giving one extra Tab stop. ROC keeps one stop per group, as the ARIA radio pattern describes.
- Pressing a disabled tab with the mouse drops focus to the page; Radix keeps it on the active tab because its list is a focusable container. Native disabled buttons receive no mouse events, so this is left as the browser behaves.
- Radix defers focus moves by a tick and reads key-up state to decide whether an arrow key should check a radio. A key released within that tick (a scripted press, not a person) does not check it. ROC moves focus synchronously.

Bugs the checks found while writing these primitives: a form-reset listener re-added on every render is skipped when React renders mid-dispatch (so listeners subscribe once and read the latest setter through a ref), and an unmounted `AvatarImage` must reset its root so the fallback returns.
