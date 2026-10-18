# Primitive parity

Each scenario renders a primitive with ROC's own `primitive-*` file and with `radix-ui` on separate page loads (`?tree=native|radix`), drives both with identical steps, and diffs the results. `parity.scenario.js` covers Tabs, Accordion, Radio Group and Toggle Group; `popover.scenario.js` covers Popover (including `asChild`, controlled and anchored); `popups.scenario.js` covers Tooltip, Hover Card and Collapsible; `dialogs.scenario.js` covers Dialog and Alert Dialog (focus trap and return, scroll lock, inert outside, outside click, Escape, controlled mode). The first renders the same trees with ROC's own `primitive-*` files and with `radix-ui`, drives both with identical mouse and keyboard steps, and compares each control's ARIA and state, the visible panels, focus, callback log, form data and the Tab-key walk.

```sh
node tests/parity/build.mjs
npx http-server tests/parity/dist -p 4191   # any static server on 4191; pages: index.html, popover.html, popups.html, dialogs.html
# run parity.scenario.js with the same Playwright runner as the other scenarios
```

Expected result: only the differences documented in `notes/primitives.md`. For `parity.scenario.js` these are the harness's own initial focus, one extra Radix tab stop on a group container, and focus after pressing a disabled tab. For the popup scenarios they are Radix's anchored popover rendering at the page origin, Radix tooltips closing more slowly, and Radix's collapsible `aria-controls` not matching its content id. Use it when replacing another delegated primitive: add that primitive to the harness tree and compare before deleting the Radix re-export.
