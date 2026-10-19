# Full shadcn catalog in ROC

The gallery covers the 66 entries in the official shadcn/ui Components catalog retrieved on 2026-10-18. Blocks and the separate AI Elements collection are outside this catalog. The gallery exposes three appearance presets in its header. Ten earlier ROC components remain installable but are not displayed in the gallery.

## Distribution

Each item ships React/TypeScript source, the complete local import closure, scoped CSS, compatible dependency ranges, and attribution. It has no imports from the gallery, Syuze, Franklin, or demo data. Consumers need React 19 and CSS import support, but no Tailwind configuration or global reset.

The additional upstream utility styles are precompiled into namespaced classes and compiler variables. This preserves complex primitive selectors without leaking a global utility stylesheet into the host. Shared ROC tokens include `--roc-ink`, `--roc-paper`, `--roc-accent`, `--roc-radius`, and `--roc-focus`. The gallery's neutral shell is separate from the installed components.

Original sources live in `upstream/shadcn`, with URL, timestamp and SHA-256 in the manifest. Data Table, Date Picker and Typography are compositions based on official documentation, rather than invented registry primitives. The `adapt-catalog.mjs` script records the initial import transformation; rerunning it overwrites subsequent behavior refinements, so review its output before replacing current source.

## Intentional ROC behavior

- Collapsible retains its child tree, animates one grid track and makes closed content inert. Hidden content still has mounted effects; hosts own pausing media or background work.
- Sidebar is a retained inline aside, with container-responsive width and controlled/uncontrolled expansion. At viewport widths of 640px or less, the same navigation becomes a grouped icon bar above the content. It does not swap to a mobile Sheet, persist cookies, or register global shortcuts. This intentionally differs from upstream's off-canvas mobile sidebar.
- Chart keeps its last nonzero dimensions while the host hides it. The demo reserves a 190px chart footprint and disables initial bar animation. Chart data and accessible alternatives belong to the caller.
- Data Table uses TanStack Table v8, with sorting, filtering, pagination and a required `getRowId`. A host must provide stable domain IDs. This is a recipe, not a complete remote-data application.
- Date Picker composes the installed Calendar, Popover and Button. Calendar uses React DayPicker semantics.
- Transient overlays keep the same content tree while open and resizing. Closing can unmount content; persistent values belong above the overlay. The examples demonstrate this distinction for Drawer and Sheet.
- Questionnaire and Message Scroller use the official `@shadcn/react` primitives. The demo submission is local; no API calls, uploads, authentication or AI generation are included.
- Code Block displays native selectable code and optional line numbering. It does not bundle syntax highlighting or execute code.
- Toast uses a Base UI manager. Mount one Toaster per application, or pass independent managers to isolate notification domains.
- Carousel keeps slides mounted and supports Embla pointer and keyboard navigation. There is no autoplay in the demo.

## Gallery

The 109 previews use the existing keyed React tree and one iframe. Component details contain the viewport presets and breakpoint slider. The overview stays full-width and uses CSS masonry columns without automatic position animation. New previews reserve media/chart/scroll geometry before asynchronous initialization.

## Catalog

- accordion
- alert
- alert-dialog
- aspect-ratio
- attachment
- avatar
- badge
- breadcrumb
- bubble
- button
- button-group
- calendar
- card
- carousel
- chart
- checkbox
- code-block
- collapsible
- combobox
- command
- context-menu
- data-table
- date-picker
- dialog
- direction
- drawer
- dropdown-menu
- empty
- field
- hover-card
- input
- input-group
- input-otp
- item
- kbd
- label
- marker
- menubar
- message
- message-scroller
- native-select
- navigation-menu
- pagination
- popover
- progress
- questionnaire
- radio-group
- resizable
- scroll-area
- select
- separator
- sheet
- sidebar
- skeleton
- slider
- spinner
- switch
- table
- tabs
- textarea
- toast
- toggle
- toggle-group
- tooltip
- trace
- typography

## Validation

The build includes a registry closure/license/dependency check and an independent consumer assembled from the published JSON payloads. That consumer is typechecked and server-rendered separately from the gallery. Browser scenarios cover selection, filtering, sorting, pagination, validation, retained drafts, focus restoration, panel keyboard resizing, questionnaire navigation, overlay dismissal, reduced motion, and phone overflow. The startup scenario records the first and settled masonry geometry and counts card animations.

Verified for v0.11.0: 228 registry checks; independent consumer strict TypeScript and server rendering; 27 new gallery interaction assertions; 18 startup assertions. At host widths 1440, 390, and 1440 px, the first iframe widths were already 1398, 364, and 1398 px, with 0 px card drift and 0 masonry animations. Browser measurements are Chromium evidence, not a claim of exhaustive device certification.

## Responsive behavior

At viewport widths of 640px or less, Card actions stack, horizontal Tabs stretch, Sidebar navigation moves above its content, and Data Table pagination becomes two full-width controls below the count. Dialog retains its bottom alignment and now stacks actions. Input, Textarea and Select expose mobile text/target sizes even in mouse-driven narrow previews. These rules ship with the registry components, not only with gallery styles. Table columns remain scrollable rather than hiding data. Other primitives retain their structure unless their existing styles define an adaptation.

The detail toolbar describes these behaviors and distinguishes width resizing from touch-device emulation. It retains the same iframe and component tree across presets.

SidebarMenuButton and TabsTrigger accept an optional `icon`. At mobile widths, icon-bearing controls visually hide their text while retaining it as the accessible name. Controls without icons retain their text. Desktop shows both icon and label. The same controls, selection and content survive resizing; Sidebar `asChild` continues to use the caller-owned child unchanged.

The gallery has no appearance sidebar or component-index panel. Default, Paper and Compact presets package surface, accent, typography, corners, radius and density in the header. Each card has one Source & install action. Motion example controls are rendered into its card header through a scoped portal; standalone examples retain their inline controls.

## Independent motion collection (2026-10-19)

The gallery now has 109 previews and the registry has 119 packages (including 10 earlier ROC packages). Forty-three new entries cover text and number transitions, finite content effects, action variants and responsive layouts. `catalog/motion.json` drives the new gallery entries and registry build; `catalog/coverage.json` records all 73 reference purposes and their ROC equivalents. These implementations are authored in ROC and depend directly on Base UI/Motion or browser APIs. Animate UI is removed from package.json and the lockfile.

The collection filters retain previews rather than unmounting them. Motion examples use explicit Play/Reset or Update value controls; they do not run recurring ambient effects while browsing. Reduced-motion handling is shared by motion-config. Native CSS interactions also honor the operating-system preference. Forced provider reduction applies to Motion-based effects; CSS feedback follows the system media query.

The equivalents intentionally differ where useful: Image Zoom is a contained inspectable crop, Preview Link Card requires explicit activation, GitHub counts are passed by the caller, and Theme Toggler is a local surface rather than a global theme manager. Text effects animate supplied strings; host applications own any phrase rotation schedule. Cursor, Magnetic and Tilt are pointer decorations and do not replace essential interactions on touch.
