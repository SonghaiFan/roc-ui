# Primitive parity

Renders the same Tabs, Accordion, Radio Group and Toggle Group trees with ROC's own `primitive-*` files and with `radix-ui`, drives both with identical mouse and keyboard steps, and compares each control's ARIA and state, the visible panels, focus, callback log, form data and the Tab-key walk.

```sh
node tests/parity/build.mjs
npx http-server tests/parity/dist -p 4191   # any static server on 4191
# run parity.scenario.js with the same Playwright runner as the other scenarios
```

Expected result: only the differences documented in `notes/primitives.md` (initial focus of the harness itself, one extra Radix tab stop on the group container, focus after pressing a disabled tab). Use it when replacing another delegated primitive: add that primitive to the harness tree and compare before deleting the Radix re-export.
