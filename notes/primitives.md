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

## Base UI behind the seam

Behaviour that is hard to get right (positioning, focus trapping, typeahead) comes from [Base UI](https://base-ui.com/), not Radix. The goal is that `radix-ui` leaves the project. Each primitive keeps the shape ROC components already use (`Content`, `asChild`, `data-state`, the `--radix-*` CSS variables), implemented on Base UI's `Portal > Positioner > Popup` parts by `primitive-popup.tsx`.

| File | Base UI part | Notes |
| --- | --- | --- |
| `primitive-popover.tsx` | `Popover` | `Anchor` positions against a separate element; `modal` supported |
| `primitive-tooltip.tsx` | `Tooltip` | Adds `role="tooltip"` and `aria-describedby`, which Base UI leaves to the caller; reserves the arrow's height in the offset like Radix |
| `primitive-hover-card.tsx` | `PreviewCard` | `openDelay` and `closeDelay` map to the trigger |
| `primitive-collapsible.tsx` | owned | A disclosure needs no library. Closed content leaves an empty hidden region so `aria-controls` stays valid |

Known differences from Radix:

- A Base UI tooltip opens for keyboard focus (`:focus-visible`), not for focus moved by script, so focus returning from a dialog does not pop a tooltip.
- Only one tooltip is open at a time.
- `onOpenChange(false)` can fire twice when a tooltip closes on click.
- Content-level `onOpenAutoFocus`, `onEscapeKeyDown` and `onPointerDownOutside` are not forwarded; Base UI reports these on the root's `onOpenChange` details. No ROC component uses them.

## Still delegated to Radix

Alert Dialog, Context Menu, Dialog (also used by Sheet), Direction, Dropdown Menu, Menubar, Navigation Menu, Scroll Area, Select, Slider. Each is a one-line re-export to replace with a Base UI adapter, checked against Radix with the same parity approach.

## Not covered

Combobox and Toast are written directly on Base UI. Vaul, cmdk, Embla, react-day-picker, input-otp, react-resizable-panels, Recharts, TanStack Table and `@shadcn/react` are specialist libraries and remain external.

## Checks

`tests/parity/` renders Tabs, Accordion, Radio Group and Toggle Group with the owned primitives and with Radix side by side, drives both with the same 43 mouse and keyboard steps, and compares every control's ARIA and state, the visible panels, focus, callbacks, submitted and reset form data and the Tab-key walk. It matches except for:

- Radix makes a radio or toggle group container tabbable after interaction, giving one extra Tab stop. ROC keeps one stop per group, as the ARIA radio pattern describes.
- Pressing a disabled tab with the mouse drops focus to the page; Radix keeps it on the active tab because its list is a focusable container. Native disabled buttons receive no mouse events, so this is left as the browser behaves.
- Radix defers focus moves by a tick and reads key-up state to decide whether an arrow key should check a radio. A key released within that tick (a scripted press, not a person) does not check it. ROC moves focus synchronously.

Bugs the checks found while writing these primitives: a form-reset listener re-added on every render is skipped when React renders mid-dispatch (so listeners subscribe once and read the latest setter through a ref), and an unmounted `AvatarImage` must reset its root so the fallback returns.
