# ROC UI

**Objects, in continuity.** A small, interactive design space for reusable React interfaces that preserve object identity, state and context.

[Explore the gallery](https://songhaifan.github.io/roc-ui/) · [Read the ROC skill](https://github.com/SonghaiFan/responsive-object-continuity)

ROC UI turns selected principles from the Responsive Object Continuity skill into copyable components. These are small, standalone implementations inspired by its cases, not a packaged extraction of the complete Syuze or Franklin Board runtime.

## Components

| Component | Continuity contract |
| --- | --- |
| Expandable card | One mounted content subtree; drafts survive opening and closing |
| Folder fan | Stable keyed cards travel between a pocket and an expanded collection |
| Source stack | One source subtree through pile, spread and inline inspection |
| Focus lanes | Shared row coordinates, stable lane order and retained event selection |
| Continuous tabs | One selection marker; label geometry stays fixed |

Each gallery entry includes a working preview, complete source, usage, props, scope and a link to its design case. The gallery imports the same files distributed by the registry.

## Install with shadcn

In a React project already configured for shadcn:

```sh
npx shadcn@latest add https://raw.githubusercontent.com/SonghaiFan/roc-ui/main/public/r/folder-fan.json
```

Replace `folder-fan` with any component name in the table, using kebab-case. Files install into `components/roc` at the project root. Adjust your import to your project's alias configuration. All required local files are included; the three layout components share `use-continuity.ts` and every component shares `roc.css`. React 19+ is the supported baseline. There is no runtime animation-package dependency.

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
      onSelect={(id) => console.log(id)}
    />
  );
}
```

For manual installation, copy the chosen TSX file, `use-continuity.ts` and `roc.css` from `registry/roc` into one directory. Components import the stylesheet themselves. Customize the prefixed CSS and `--roc-*` tokens. Re-adding another component may ask about shared-file replacement; preserve your local customizations.

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

`tests/browser.scenario.js` is a Playwright CLI scenario (not an `@playwright/test` spec). With the dev server running, open the local page in a named CLI session, then run it with `run-code --filename tests/browser.scenario.js` from this repository. It checks retained nodes and drafts, focus return, selection geometry, source viewing, narrow layout and reduced motion.

## Boundaries

- This first release uses position-continuous layout retargeting and CSS transitions. It does not preserve release velocity or emulate Syuze's physical spring profiles.
- Expandable card is an in-place disclosure. It allows text reflow and is not a modal or fixed-typesetting document presentation.
- Folder fan is intended for 2–5 non-interactive compact cards. It provides unfolding, not drag-to-file or a board data model.
- Source stack is intended for 2–4 sources; caller-provided controls stay mounted. It is inline inspection, not a focus-trapped dialog.
- Focus lanes use discrete zero-based rows. Event IDs should be unique across lanes. They are not quantitative time-scale charts.
- Continuous tabs uses selection buttons, not ARIA tabs/tabpanels. The application owns selected content.
- Reduced motion, keyboard controls and focus return are covered by the local scenarios. Chromium checks do not certify every browser, assistive technology or device.

## License

[MIT](LICENSE). ROC UI is an independent project and is not affiliated with shadcn/ui. The linked ROC cases provide provenance and design rationale; no third-party project assets or proprietary fonts are bundled.
