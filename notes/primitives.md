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
| `primitive-form-input.tsx`, `primitive-utils.ts` | internal | Hidden checkbox for forms; ref and handler composition |

Components that now install with no `radix-ui` dependency: 44 of the 66 in the gallery, including Button, Badge, Card, Checkbox, Switch, Toggle, Label, Separator, Progress and Avatar.

## Still delegated

These files are one-line re-exports. Replacing one means rewriting that file and nothing else.

Accordion, Alert Dialog, Collapsible, Context Menu, Dialog (also used by Sheet), Direction, Dropdown Menu, Hover Card, Menubar, Navigation Menu, Popover, Radio Group, Scroll Area, Select, Slider, Tabs, Toggle Group, Tooltip.

Suggested order, easiest and most testable first:

1. Collapsible, Accordion, Tabs, Radio Group, Toggle Group: roving focus and disclosure state only.
2. Slider and Scroll Area: pointer capture and measurement.
3. Dialog and Alert Dialog: focus trap, scroll lock, dismissal and focus return.
4. Popover, Tooltip, Hover Card, Dropdown Menu, Context Menu, Menubar, Select, Navigation Menu: positioning, collision handling, typeahead and submenus. Largest.

Direction stays delegated until the others go: Radix components read direction from their own context.

## Not covered

Base UI (Combobox, Toast), Vaul, cmdk, Embla, react-day-picker, input-otp, react-resizable-panels, Recharts, TanStack Table and `@shadcn/react` are specialist libraries and remain external.

## Checks

The native primitives have a browser harness for form submit and reset, indeterminate, keyboard, controlled mode, `asChild` merging and ARIA. One real bug it found: a form-reset listener re-added on every render is skipped when React renders mid-dispatch, so listeners subscribe once and read the latest setter through a ref.
