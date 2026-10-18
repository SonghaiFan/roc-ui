# ROC UI

**Objects, in continuity.** A small, interactive design space for reusable React interfaces that preserve object identity, state and context.

[Explore the gallery](https://songhaifan.github.io/roc-ui/) · [Read the ROC skill](https://github.com/SonghaiFan/responsive-object-continuity)

ROC UI turns selected principles from the Responsive Object Continuity skill into copyable components. These are small, standalone implementations inspired by its cases, not a packaged extraction of the complete Syuze or Franklin Board runtime.

## Components

| Component | Continuity contract |
| --- | --- |
| Expandable card | One fixed reading composition; the original editor travels to the top layer and back |
| Folder fan | Stable keyed cards travel between a pocket and an expanded collection |
| Source stack | One source subtree through pile, spread and modal inspection |
| Focus lanes | Shared row coordinates, stable lane order and retained event selection |
| Continuous tabs | One selection marker; label geometry stays fixed |

Each gallery entry includes a working preview, complete source, usage, props, scope and a link to its design case. The gallery imports the same files distributed by the registry.

## Explore the design space

The gallery prioritizes live objects over documentation. Filter by interaction (Hover, Press, Expand, Select), open a component's workspace, and tune it while keeping the same mounted preview. Closing returns that same object and its draft state to the gallery.

- Folder controls: colour, glass/paper material, up/right opening, press/hover trigger, spread and duration.
- Reading previews use Syuze’s critically damped presentation profiles (opening mass .48, return mass .32, stiffness 100). Other transitions retain duration controls; source duration controls spread only.
- A compact phone-width preview helps inspect layout; actual mobile layout stacks the preview above its controls.
- Settings are encoded in the URL and restored by shared links and browser navigation. Reset restores defaults.
- “Reverse mid-flight” and “Edit, close & return” are interactive continuity exercises.
- Source view includes copyable usage reflecting the current settings. The full source and CLI install still use the component defaults.
- Design rationale and known boundaries are available in “Why it moves this way”.

The gallery borrows the preview-first, compact-inspector interaction pattern observed on [Bencho](https://bencho.dev/); the components and styles here are independently implemented. No Bencho code or assets are bundled.

## Install with shadcn

In a React project already configured for shadcn:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/SonghaiFan/roc-ui/main/public/r/folder-fan.json
```

Replace `folder-fan` with any component name in the table, using kebab-case. Files install into `components/roc` at the project root. Adjust your import to your project's alias configuration. All required local files are included; layout components share `use-continuity.ts`; reading previews additionally include `card-preview.tsx` and `presentation-spring.ts` and every component shares `roc.css`. React 19+ is the supported baseline. There is no runtime animation-package dependency.

```tsx
import { FolderFan } from "./components/roc/folder-fan";

export function Collection() {
  return (
    <FolderFan
      title="Collected ideas"
      items={[
        { id: "note", label: "A first thought", color: "#fff9ed" },
        { id: "photo", label: "The garden", color: "#edf0e6" },
      ]}
      material="glass"
      direction="up"
      spread={12}
      duration={560}
      onSelect={(id) => console.log(id)}
    />
  );
}
```

For manual installation, copy all files listed in the chosen `public/r/*.json` payload (including the two presentation helpers for card/source previews) from `registry/roc` into one directory. Components import the stylesheet themselves. Customize the prefixed CSS and `--roc-*` tokens. Re-adding another component may ask about shared-file replacement; preserve your local customizations.

## 中文

ROC 是一个基于对象连续性原则的组件设计空间。可以直接操作演示、查看源码，再把组件复制进自己的项目。组件采用 React + TypeScript + CSS，通过浏览器动画保持对象在不同布局中的连续性。

首版包含卡片展开、文件夹展开、来源卡片、焦点上下文栏和连续选择指示器。它们是独立的小组件，不是完整画布编辑器，也不声称与 Syuze 原版动效一比一。

## Develop

Requires a current Node.js LTS release and npm.

```sh
npm ci
npm run dev
# http://127.0.0.1:4186
```

The local server builds on startup; rerun `npm run build` after editing. It is intentionally a small static gallery, without HMR or a server backend.

```sh
npm run check
npm run build
npm test
```

`npm run build` generates the gallery in `dist`, shadcn items in `public/r`, source downloads in `public/source`, and a GitHub Pages snapshot in `docs`. The checked-in `public/r` files support direct raw-GitHub installation. Rebuild before publishing source changes. GitHub Pages serves `main:/docs`.

To validate with the official registry builder:

```sh
npx shadcn@latest build registry.json --output /tmp/roc-registry-check
```

`tests/browser.scenario.js` is a Playwright CLI scenario (not an `@playwright/test` spec). With the dev server running, open the local page in a named CLI session, then run it with `run-code --filename tests/browser.scenario.js` from this repository. It checks retained nodes across gallery/detail, draft state, focus return and confinement, URL settings and browser back, hover, source viewing, interrupted folder motion, narrow layout and reduced motion.

## Boundaries

- Card/source inspection uses the actual analytic, critically damped Syuze presentation profiles. Like that viewer, retargeting starts with zero velocity. Other components still use layout retargeting and CSS transitions; they are not a physical copy of the Syuze canvas.
- Expandable card is now a native modal reading surface with a fixed composition width. Width changes scale its content; long content scrolls and unwinds during return. The prior `duration` prop is deprecated and ignored for reading presentation.
- Folder fan is intended for 2–5 non-interactive compact cards. It provides unfolding, not drag-to-file or a board data model.
- Source stack is intended for 2–4 sources; caller-provided controls stay mounted. Inspection uses the same native modal presentation as the document card.
- Focus lanes use discrete zero-based rows. Event IDs should be unique across lanes. They are not quantitative time-scale charts.
- Continuous tabs uses selection buttons, not ARIA tabs/tabpanels. The application owns selected content.
- Reduced motion, keyboard controls and focus return are covered by the local scenarios. Chromium checks do not certify every browser, assistive technology or device.

The focused `tests/card-preview.scenario.js` scenario checks paper/editor identity, unchanged typesetting, caret preservation, interruption, landing geometry, scroll return, phone resize, source inspection and reduced motion. See [the source comparison](notes/syuze-card-presentation.md) for measured scope and remaining differences.

## License

[MIT](LICENSE). ROC UI is an independent project and is not affiliated with shadcn/ui. The linked ROC cases provide provenance and design rationale; no third-party project assets or proprietary fonts are bundled.
