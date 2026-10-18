# Extracted components — ROC 0.4

Five additional components are distributed by the registry and used directly in the gallery.

| Component | Source | Preserved | Adaptations / exclusions |
| --- | --- | --- | --- |
| ImageViewport | Franklin React `ImageViewport.tsx`, `core/image-view.ts`, `motion/position.ts`, `motion/spring.ts` | Pointer-anchor zoom, bounds, pan, pinch handlers, keyboard commands, spring Fit, retained img | Local imports and CSS namespace; fixes zoom readout to report clamped scale. This is the inner image viewport, not full board presentation. |
| VoicePlayer | Syuze `src/spatial/voice-item.js` | Original DOM/audio controls, seek, speed, playback group, error states, URL-change time restore and disposal | Thin React lifecycle wrapper. Host supplies URL and playback group. Demo is a generated tone, not a private recording. |
| SelectionToolbar | Syuze `src/spatial/notes-toolbar.js`, `spring.js` | Original saved Range, selection restoration, active formatting state, action-specific reveal spring | React lifecycle wrapper; native popover isolates viewport positioning from transformed hosts. Host supplies format adapter. No editor package required. |
| PageBook | Syuze `src/components/memoir/MemoirBook.tsx` | Cover/paper profiles, shared angle/shade, cover centering, pointer release velocity, flip threshold, single/spread faces | Caller supplies pre-paginated pages. Container sizing replaces whole-viewport sizing. Includes cleanup and cancelled-drag return. Excludes memoir data, pagination engine, chapter navigation and gather entrance; serializes turns. |
| SourceTray | Syuze `document-source-fan.js`, `model.js`, `motion.js`, `spring.js` | Native shelf geometry, unfold/refold springs, current-pose motion, same source controls, pause-on-gather | Container-relative coordinates; keyed React children replace business attachment factory, preserving nodes across content updates. Host supplies real asset renderers. No forced document viewer for voice/photo sources. |

## Source snapshots

Syuze: `eac9e39c47c913ac389fc84b5717b678bc38f4e5`.
Franklin React: actively developed worktree based on `d10e4908e72ad2ecfe4539f56c5c492e0193ba6f`; those React files were uncommitted at extraction, so the base SHA is not a published implementation snapshot. The copied source in this repository is the reproducible extracted version.

The native helper modules retain their MIT copyright notice; `SOURCE-LICENSE.txt` is included in each registry payload. The JavaScript source and TypeScript declaration files ship together. All local imports are included by the registry builder.

## Media and consumers

The SVG landscape and WAV tone are generated test assets. Registry components accept caller-owned media URLs and do not embed those samples, authentication, storage or AI calls. Installing a component copies implementation source into the consuming project.

For source changes, rebuild and run `npm test` to check every payload against its actual local imports. Run `tests/extracted.scenario.js` with the Playwright CLI for real browser interactions. Physical-phone touch behavior and assistive technology acceptance remain separate checks.

The larger source map still distinguishes these extracted modules from pending board recipes. No claim is made that all 14 candidates or Syuze's complete runtime have been extracted.

## Validation recorded

- Ten registry payloads pass source/import completeness checks.
- All five new components were installed through the shadcn CLI into an isolated React consumer; its TypeScript compile passed.
- 24 Chromium interaction assertions passed, including audio playback/seek/rate/mutual exclusion, live editor Range restoration, source node identity, book turns and phone layout.
- The local sample server needed audio MIME/Content-Length and byte-range responses; without byte-range support, audio seeking reset to zero. This was a fixture-serving issue, not replaced by a mock media check.

Five additional gesture/source-view checks and 23 existing gallery regression checks passed (52 Chromium assertions in total). The book drag check samples coupled angle/shade before release; image pan uses actual pointer input.
