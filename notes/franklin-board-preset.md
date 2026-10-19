# Franklin Board spatial preset

Source inspected: `/Users/songhaifan/Developer/franklin-board`, commit `d10e490`, 2026-10-19. Visual measurements come from the original application. React interactions come from `/private/tmp/franklin-board-react-library`, branch `codex/react-library-foundation`, commit `efca662`.

## Source measurements

| Role | Source value | Source location |
| --- | --- | --- |
| Canvas / ink / accent | `#e7eaeb` / `#22272b` / `#002fa7` | `src/style.css:2` |
| Paper / soft object radius | 16px | `src/style.css:6`, `src/text-editor.css:18` |
| Folder radius | 18px | `src/style.css:6` |
| Dialog radius | 20px | `src/style.css:9` |
| Sharp image | 0px (`radiusKind: 0`) | `src/app.js:45-47` |
| Sticky padding | 23px vertical, 24px horizontal | `src/style.css:6` |
| Folder padding | 27px vertical, 23px horizontal | `src/style.css:6` |
| Early note padding | 29px vertical, 26px horizontal | `src/style.css:6,10` |
| Current document padding | `width * 26 / 280`; document 210 × 297 | `src/text-editor.js:5`, `src/model.js:1` |
| Sticky heading separation | 16px | `src/style.css:10` |
| Folder arrangement gaps | 20px across, 24px between rows and above folder | `src/model.js:5-19` |
| Stack badge | 10px right/bottom; padding 6px 9px; radius 20px | `src/style.css:13` |
| Surface shadow | `0 3px 7px #26303906, 0 10px 20px #26303904` | `src/style.css:6` |
| Current folder face | `#eef6f8`, 1.25px white border | `src/style.css:53` |

These are object-specific rules, not one global radius or margin. Canvas coordinates and camera scale determine the screen-space margins around the original objects; those are not copied as arbitrary CSS margins. Document content is scaled into its retained paper composition. The preset exports both semantic measurements and CSS variables in `registry/roc/franklin-board-preset.ts`.

## Gallery use

Choose **Appearance → Preset → Franklin Board**. Existing previews keep their DOM and drafts. System font is used as a substitute for the source's Unica asset. The selected light/dark theme remains independent of the spatial preset.

Four Interfaces use the existing React worktree implementation directly: Document, Note, Folder and Image stack. Each mounts retained React object nodes with the worktree's store, gesture controller, camera, container layouts and spring solver. No per-object iframe or embedded application runtime is used.

`registry/roc/board-objects.tsx` exports the reusable elements. Supply `initialDocument` to replace demo content, or a `store` created with `createBoardStore` for application-owned state. `onCommit(document)` reports edits and geometry changes for persistence. Keep item IDs and the supplied store stable. The underlying engine also exports `Board`, `defineItemType` and `EditableText` for custom React content. Styles and MIT attribution travel with registry downloads.

The adaptation maps shared ROC tokens, supplies demo content and accepts relative image URLs. It retains source spring parameters, reversal logic and camera behaviour. It uses plain-text editing rather than the original application's Markdown/rich-text editor; storage and proprietary fonts are not included. Source reuse and passing compilation do not establish complete interaction parity with the original application.

## Shared standalone folder motion

`FolderFan` remains a standalone React component, with no Board/store/controller dependency. It shares `folder-motion.ts` with the Board presentation: analytic cover springs, the cancellable 100ms closing handoff, unfolding/refolding profiles and interruption from the last painted frame. Both use `folderFanLayout` and `folderPocket` for geometry. Standalone fits its retained local world into its container; Board retains its existing canvas camera policy. Content remains keyed by item ID. Existing `duration` and `spread` props are deprecated: spring profiles and shared layout now determine motion and spacing.

Validated locally: rapid click reversal, cover handoff cancellation, reduced-motion destinations, standalone item selection, Board folder open/close, independent registry consumer compilation and server rendering. Physical touch-device feel has not been verified.
