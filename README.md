# ROC UI

A React design system for objects that keep their identity through interaction.

[Open the design space](https://songhaifan.github.io/roc-ui/) · [Component contracts](notes/react-design-system.md) · [ROC design skill](https://github.com/SonghaiFan/responsive-object-continuity)

Sixty-six customized shadcn components, displayed together in a responsive masonry canvas. Try the live objects, adjust the theme, inspect their source, and install only what you need. React + TypeScript + component-scoped CSS. MIT licensed.

## shadcn foundations

All **66 entries** in the official shadcn/ui component catalog are available in the gallery, plus ROC's own **Edge Panel** (67 cards). The original 25 foundations are joined by calendars, date pickers, tables, charts, command menus, comboboxes, drawers, sheets, resizable panels, sidebars, fields, input groups, OTP inputs, messages, questionnaires, traces, and more. The complete list and implementation boundaries are recorded in [the catalog coverage](notes/catalog-coverage.md).

Official source snapshots, recipe documentation, hashes, and the MIT license are preserved. ROC owns its primitives (`primitive-*` files). Simple behaviour is written in the repository; positioning, focus trapping and menus come from [Base UI](https://base-ui.com/) behind the same seam; specialist libraries cover charts, carousels and tables. No component installs Radix — see [notes/primitives.md](notes/primitives.md). ROC adds retained disclosure content, an inline sidebar that keeps one tree across widths, stable chart measurements, neutral tokens, reduced-motion styles, and independently installable source.

[Adaptation contracts and limits](notes/shadcn-foundations.md) · [Original source snapshots](upstream/shadcn/)

```sh
npx shadcn@latest add https://raw.githubusercontent.com/SonghaiFan/roc-ui/main/public/r/tabs.json
```

The CLI installs the selected component, its local source/CSS and its declared packages. No Tailwind setup is required. Use the familiar compound API:

```tsx
<Tabs defaultValue="write">
  <TabsList>
    <TabsTrigger value="write">Write</TabsTrigger>
    <TabsTrigger value="read">Read</TabsTrigger>
  </TabsList>
  <TabsContent value="write"><Textarea aria-label="Draft" /></TabsContent>
  <TabsContent value="read">Reading view</TabsContent>
</Tabs>
```

Install `textarea` separately for this composition. Tabs and Accordion retain inactive editors; transient overlays retain caller-owned data but unmount their contents after dismissal.

## Earlier source-informed components

These ten earlier experiments are retained as downloadable source for existing consumers, but are no longer shown or imported by the design space.

| Component | Behaviour |
| --- | --- |
| Expandable card | Retained reading composition, modal preview and return to its measured slot |
| Folder fan | Keyed cards unfold from a collection |
| Source stack | Pile, spread and inspect the same content |
| Focus lanes | Expand one lane while retaining context and shared coordinates |
| Continuous tabs | One marker follows a controlled selection |
| Image viewport | Pointer-anchored zoom, constrained pan and spring Fit |
| Voice player | Composable React audio controls, seeking, rate and optional playback groups |
| Selection toolbar | Caller-defined actions over a retained selection Range |
| Page book | Custom cover, paper turns, drag release and shading |
| Source tray | Renderer-neutral children with source shelf geometry and reversible springs |

The components are informed by Syuze and Franklin Board. Their application stores, business models, routing, attachment services and DOM widget factories are excluded. The gallery imports exactly the files distributed by the registry. Sample content and appearance controls live separately in `src/`.

## Install

In a React project configured for shadcn:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/SonghaiFan/roc-ui/main/public/r/voice-player.json
```

Replace `voice-player` with any component's kebab-case name. Files install into `components/roc`. React 19+ and CSS import support are required; each payload declares version-compatible dependencies. Complex components install their own upstream dependencies, such as Embla, Vaul, Recharts, or TanStack Table v8. Each item includes its own stylesheet, small shared surface rules, necessary TypeScript helpers and the MIT notice. It does not install the gallery or unrelated component styles.

```tsx
import { VoicePlayer } from "./components/roc/voice-player";

<VoicePlayer src={recordingUrl} label="Recording" />
```

Or compose controls yourself:

```tsx
import {
  VoicePlayerRoot, VoicePlayButton, VoiceTime,
} from "./components/roc/voice-player";

<VoicePlayerRoot src={recordingUrl}>
  <VoiceTime />
  <VoicePlayButton />
</VoicePlayerRoot>
```

For manual installation, copy every file listed in the selected `public/r/*.json` payload into one directory. Components import their own CSS. Customize root `className`/`style`, inherited `--roc-*` tokens or the source itself. Preserve local customizations when the CLI asks about replacing shared files.

See [React component contracts](notes/react-design-system.md) for controlled state, custom editor actions, tray composition, SSR and known limits.

## Design space

The masonry canvas fills the workspace with the 66 customized shadcn components and ROC's Edge Panel at their natural heights. The page chrome stays neutral. The gallery uses its final CSS width from the first layout, with no startup or automatic masonry travel animation. Move the pointer to the left edge, or hover or click Style, to reveal the left appearance panel (the gallery's own [Edge Panel](registry/roc/edge-panel.tsx) — the same component you can install) for surface, accent, typography, radius and spacing. It hides when you leave or interact with the preview; pin it to keep it open. The panel floats above the canvas, so showing it never resizes or reloads the components. Open a component with its heading ↗ or choose it in the Style panel to enter component details. Responsive controls appear only in this detail panel. The viewport toolbar switches between Fit, Desktop (1024 × 768), Tablet (768 × 1024) and Phone (390 × 844). Drag the right edge or use the width slider for intermediate widths. Click the slider markers to test sm (640), md (768), lg (1024), xl (1280) and 2xl (1536 px); the readout reports the active width interval. These are standard media-width reference points, not a claim that every component changes layout at every marker. Returning to All components hides the controls and restores the full-width masonry gallery without remounting the components. One retained iframe provides real CSS media queries and viewport-bound dialogs; switching sizes does not reload the previews. Filtering hides components without unmounting them. Source inspection leaves the live preview in place. Source links use component hashes; theme controls are local to the session.

The layout follows the preview-first approach of [shadcn create](https://ui.shadcn.com/create?item=preview). No reference-site source or assets are bundled.

## 中文

ROC 设计空间只展示 66 个基于 shadcn/ui 重做的组件。早期 10 个来自 Syuze / Franklin 交互经验的组件保留下载源码，不再出现在画廊。响应式设备切换、宽度滑块和媒体断点标记仅在组件详情中显示。基础组件保留组合 API 和 Radix / Base UI 可访问性语义，再加入 ROC 的保留节点、响应式布局和连续反馈。ROC 是一套独立的 React 组件，设计空间采用 masonry 布局，直接铺开所有可操作的组件。组件不依赖 Syuze、Franklin Board 或画廊运行时；示例数据、业务行为和展示页面与可下载代码分开。可组合音频控件、自定义选区操作，或把自己的 React 内容放进托盘。来源项目的物理参数和对象连续性原则被保留为可复用行为，而不是打包整个应用。

## Develop and verify

```sh
npm ci
npm run dev
# http://127.0.0.1:4186

npm run check
npm run build
npm test
npm run test:consumer
```

The dev server builds once on startup; rebuild after edits. `npm run build` generates registry payloads in `public/r`, downloadable source in `public/source`, and the GitHub Pages snapshot in `docs`. Pages serves `main:/docs`.

`test:consumer` compiles and server-renders only the downloaded registry files, then creates an independent StrictMode browser fixture. Browser scenarios in `tests/masonry-startup.scenario.js`, `tests/design-space.scenario.js`, `tests/consumer.scenario.js`, `tests/responsive-preview.scenario.js`, `tests/neutral-shell.scenario.js`, `tests/foundations.scenario.js`, `tests/foundations-consumer.scenario.js`, `tests/more-foundations.scenario.js` and `tests/more-foundations-consumer.scenario.js` run through Playwright CLI `run-code --filename …`. They currently target port 4190; adjust the origin for your server. Run the final build after consumer tests to remove the temporary fixture before deployment.

## Provenance and scope

[Source extraction map](notes/component-source-map.md) · [Original mechanism notes](notes/extracted-components.md) · [Reading presentation comparison](notes/syuze-card-presentation.md)

The library does not claim full motion parity with Syuze. Folder fan is a compact collection, not drag-to-file. Focus lanes use discrete rows. Continuous tabs is a selection group, not a tabpanel framework. Page book accepts pre-paginated reading content; application pagination is separate. Chromium validation does not certify every browser or device.

## License

[MIT](LICENSE). Independent of shadcn/ui. No proprietary fonts or third-party project assets are bundled.
