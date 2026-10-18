# ROC React design system

Version 0.5 separates reusable components from the gallery and from the original applications. The gallery is one consumer of the registry, not a runtime required by it.

## Dependency boundary

```text
src/                       gallery, sample content, theme controls, navigation
  ↓ imports
registry/roc/*.tsx          React components and explicit props
  ↓ imports
component.css + surface.css component styles and small shared surface rules
pure TypeScript helpers    geometry and analytic springs
```

Registry files do not import `src/`, application stores, routers, databases, generated assets or Syuze/Franklin runtime modules. The original ten components depend on React 19. The fifteen shadcn-derived foundations also declare Radix, icon and utility packages where imported; see [foundation contracts](shadcn-foundations.md). CSS imports require a bundler that handles CSS. DOM selection, media, animation and native dialog/popover work run after mount; the components also server-render without accessing `window` during render.

The original MIT notice remains in each install. Source provenance identifies where a behaviour came from, not a requirement to install that application.

## Component contracts

| Component | Caller owns | Component owns |
| --- | --- | --- |
| `CardPreview` / `ExpandableCard` | children, `open` / `defaultOpen`, `onOpenChange`, labels | one retained composition, modal promotion, measured return slot, focus return |
| `FolderFan` | keyed items, `open` / `defaultOpen`, selection callback | compact card layout, hover/pinned interaction, folder shell |
| `SourceStack` | keyed React content, open state and labels | pile/spread geometry and retained card inspection |
| `FocusLanes` | lanes/events, focus `value`, `onValueChange`, `selectedId`, `onSelect` | shared row coordinates and context strips |
| `ContinuousTabs` | selection `value` and `onValueChange`, React labels | one moving marker and selection buttons |
| `ImageViewport` | image child, natural dimensions, active state | local pan/zoom/Fit and gesture handling |
| `VoicePlayerRoot` | media URL, optional playback group, control composition | audio element, local playback state and context |
| `SelectionToolbar` | editor ref, action list, format/disabled state, command adapter | selected Range, React action buttons and contextual reveal |
| `PageBook` | pre-paginated React content, cover, page-change callback | local turn state, paper/cover motion and shading |
| `SourceTray` | keyed sized children, open state, close side effects | shelf geometry and retained keyed shells |

Root components accept `className` and `style`. Shared tokens inherit from the host: `--roc-paper`, `--roc-ink`, `--roc-line`, `--roc-muted`, `--roc-accent`, `--roc-radius`. Component-specific tokens remain available in each CSS file. There is no global page reset and no gallery stylesheet in install payloads.

Optional controlled state uses the conventional contract: provide `open`/`value` and the change callback, or omit it and use internal state. `PageBook` and image gestures currently keep their transient state local; they do not require an external store. `onOpenChange` reports a requested state change; `SourceTray.onSettled` reports completion of the physical movement.

## Compose audio controls

```tsx
import {
  VoicePlayerRoot, VoicePlayButton, VoiceSeek, VoiceTime,
} from "./components/roc/voice-player";

<VoicePlayerRoot src={recordingUrl} onPlaybackChange={setPlaying}>
  <VoicePlayButton />
  <VoiceTime />
  <VoiceSeek />
</VoicePlayerRoot>
```

`VoicePlayer` is the convenience composition. Custom controls can consume `useVoicePlayer()`. A group created with `createPlaybackGroup()` is opt-in, local to the caller, and pauses other group members when playback starts. Changing the URL resets media position; no application-specific URL synchronization or transcript behaviour is imposed.

## Plug in an editor

```tsx
<SelectionToolbar
  editor={editorRef}
  actions={[{ id: "comment", label: "Comment", content: "+ Comment" }]}
  onFormat={(command, range) => addComment(range.toString())}
/>
```

No `execCommand`, editor schema or format restrictions live in the component. The gallery's browser-formatting adapter is demo code only. Production editors own commands, disabled states and model updates.

## Compose a tray

```tsx
<SourceTray
  open={expanded}
  onOpenChange={setExpanded}
  items={items.map(item => ({
    id: item.id, width: 240, height: 180,
    content: <YourRenderer item={item} />,
  }))}
  onSettled={open => { if (!open) pauseYourMedia(); }}
/>
```

The tray never queries descendant audio or knows what an attachment is. Its geometry is a pure function. Its transform writer retains position and velocity on interruption. Hosts choose the content and side effects.

## Gallery

The design space shows only the fifteen customized shadcn foundations in CSS masonry columns with natural card heights. The earlier ten components remain downloadable but are not imported by the gallery. Page chrome and gallery wrappers stay neutral regardless of component theme. Appearance controls live in a left overlay opened with Style: hover/click to reveal, leave or interact with the preview to dismiss, Pin to retain, Escape to close and return focus. Hidden controls are inert. The overlay never reserves layout space or remounts the preview. Responsive controls are available only in component details. The width slider marks sm 640, md 768, lg 1024, xl 1280 and 2xl 1536 as clickable reference points; the readout reports the active interval. Returning to the gallery hides these controls and fills the workspace again. A persistent preview iframe supplies real viewport dimensions: Fit, Desktop 1024 × 768, Tablet 768 × 1024, Phone 390 × 844, or a custom width from 320–1600 px. The frame is resized, never re-keyed or navigated during a size switch. Media queries, `visualViewport`, native dialogs and popovers are scoped to that viewport. Theme/filter changes cross the same-origin boundary, while component state stays inside the retained frame. The component focus action uses the same keyed article, giving components the full viewport width for breakpoint inspection. The overview uses CSS width from its first layout; it never animates from a provisional measured width. Masonry wrappers do not animate position during loading, filtering, resizing or intrinsic content changes. Meaningful motion stays inside the components and the user-operated detail viewport. Components remain in one keyed React tree when filtering, resizing or changing the theme. Source inspection opens a separate native dialog containing code; it never moves the running preview. Column order follows DOM order down each column, then across; keyboard order follows that same DOM order.

The layout is informed by the [shadcn create preview](https://ui.shadcn.com/create?item=preview). No shadcn site source or assets are copied.

## Verification

- `npm run check`: strict TypeScript.
- `npm run build && npm test`: every registry payload matches source and includes all local JS/CSS imports; no legacy factory, gallery dependency or sample asset is installed.
- `npm run test:consumer`: materializes only downloaded registry payloads, compiles and server-renders all twenty-five, and builds a standalone browser fixture under `dist/consumer-check/`. Run after building. A subsequent build removes that fixture before deployment.
- `tests/consumer.scenario.js`: independent StrictMode consumer, no gallery CSS; controlled siblings, custom audio composition and custom editor action.
- `tests/design-space.scenario.js`: shadcn-only gallery, masonry dimensions, filtering, source inspection, retained editor identity and mobile layout.
- `tests/neutral-shell.scenario.js`: automatic/pinned panel visibility, keyboard focus return, neutral chrome, full canvas width, retained edits and narrow-host access.
- `tests/legacy/card-preview.scenario.js` (historical v0.8 gallery only): focused reading-surface geometry and return checks.
- `tests/masonry-startup.scenario.js`: first-layout width, zero startup card drift/animations at desktop and phone sizes, and retained editors through host resize.
- `tests/responsive-preview.scenario.js`: real viewport dimensions, pointer/keyboard resizing, detail-only controls, clickable media breakpoints, retained editor/document identity, gallery round trips and narrow-host controls.

Current runtime verification is Chromium. Motion remains source-informed; this refactor does not claim pixel-for-pixel parity with the full Syuze application. `PageBook` expects pre-paginated reading content; its single/spread breakpoint regroups pages and should not be used to preserve stateful editors inside those pages. Folder fan is a compact, non-interactive card collection; use the tray for arbitrary interactive children.
