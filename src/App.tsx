import { franklinBoardPreset } from "../registry/roc/franklin-board-preset";
import { BookmarkCheck } from "./components/animate-ui/icons/bookmark-check";
import { ThemeToggler as AnimateThemeToggler } from "@animate-ui/react/primitives/effects/theme-toggler";
import { ThemeTogglerButton } from "../registry/roc/theme-toggler-button";
import { DesignSystem } from "./DesignSystem";
import { InterfaceExample, interfaceIds, interfaceStories } from "./InterfaceExamples";
import { collections, collectionFor } from "./collections";
import { ToggleGroup, ToggleGroupItem } from "../registry/roc/toggle-group";
import { PreviewControlsTarget } from "./PreviewControls";
import { motionIds } from "./motion-catalog";
import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  CodeXmlIcon,
  ExternalLinkIcon,
  Maximize2Icon,
  Minimize2Icon,
  SearchIcon,
} from "lucide-react";
import { Badge } from "../registry/roc/badge";
import { Button } from "../registry/roc/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../registry/roc/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../registry/roc/collapsible";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from "../registry/roc/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../registry/roc/input-group";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "../registry/roc/code-block";
import { Kbd } from "../registry/roc/kbd";
import { Picker } from "./Picker";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../registry/roc/sheet";
import { foundationIds } from "./foundations";
import { catalog } from "./catalog";
import { FoundationExample } from "./FoundationExamples";

import { ViewportPreview } from "./ViewportPreview";
import { palette, accentForeground, radiusPresets, fontFamilies, type AccentName } from "./settings";
import "./site.css";
const repo = "https://github.com/SonghaiFan/roc-ui";
const skill = "https://github.com/SonghaiFan/responsive-object-continuity";
const registry =
  "https://raw.githubusercontent.com/SonghaiFan/roc-ui/main/public/r/";
type Item = (typeof catalog)[number];
function SourcePanel({ item, close }: { item: Item; close: () => void }) {
  const [files, setFiles] = useState<{ path: string; content: string }[]>([]),
    [file, setFile] = useState(`${item.id}.tsx`),
    [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`./r/${item.id}.json`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error("Source unavailable");
        return r.json();
      })
      .then((payload) => setFiles(payload.files))
      .catch((e) => {
        if (e.name !== "AbortError")
          setError("Couldn't load the source. Open GitHub to read it.");
      });
    return () => controller.abort();
  }, [item.id]);
  const code = files.find((f) => f.path.endsWith(`/${file}`))?.content ?? "";
  return (
    <Sheet open onOpenChange={(open) => !open && close()}>
      <SheetContent className="source-panel" showCloseButton={false}>
        <div className="panel-body">
          <SheetHeader>
            <div>
              <span className="eyebrow">COMPONENT SOURCE</span>
              <SheetTitle>{item.name}</SheetTitle>
            </div>
            <SheetClose asChild>
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Close source"
              >
                ×
              </Button>
            </SheetClose>
          </SheetHeader>
          <SheetDescription className="panel-description">
            {item.description}
          </SheetDescription>
          <CodeBlock className="install" size="sm">
            <CodeBlockHeader>
              <CodeBlockTitle>Install</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton
                  value={`npx shadcn@latest add ${registry}${item.id}.json`}
                />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent wrap>
              {`npx shadcn@latest add …/${item.id}.json`}
            </CodeBlockContent>
          </CodeBlock>
          <Collapsible className="usage" defaultOpen>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Usage
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CodeBlock size="sm">
                <CodeBlockContent wrap>{item.usage}</CodeBlockContent>
              </CodeBlock>
            </CollapsibleContent>
          </Collapsible>
          <CodeBlock className="source-code-block">
            <CodeBlockHeader>
              <CodeBlockTitle>
                <Picker
                  label="Source file"
                  value={file}
                  onValueChange={setFile}
                  options={(files.length
                    ? files
                    : [{ path: `registry/roc/${item.id}.tsx` }]
                  ).map((f) => ({ value: f.path.split("/").at(-1)! }))}
                />
              </CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={code} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent className="source-code" lineNumbers>
              {error || code || "Loading source…"}
            </CodeBlockContent>
          </CodeBlock>
          <Collapsible className="contract">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Behaviour &amp; boundaries
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p>{item.rule}</p>
              <p>{item.limit}</p>
              <Button variant="link" size="sm" asChild>
                <a
                  href={`${repo}/blob/main/notes/react-design-system.md`}
                  target="_blank"
                  rel="noreferrer"
                >
                  React component contracts ↗
                </a>
              </Button>
            </CollapsibleContent>
          </Collapsible>
          <footer>
            <span>React · TypeScript · CSS · MIT</span>
            <Button variant="link" size="sm" asChild>
              <a
                href={`${repo}/tree/main/registry/roc`}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub ↗
              </a>
            </Button>
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  );
}
function ComponentDisplayCard({ item, focused, hidden, onFocus, onSource, children, displayId, starred, onStar }: {
  item: Item; focused: boolean; hidden: boolean; onFocus: () => void; onSource: () => void; children?: ReactNode; displayId?: string; starred?: boolean; onStar?: () => void;
}) {
  const [controls, setControls] = useState<HTMLDivElement | null>(null);
  return <PreviewControlsTarget value={controls}>
    <Card
      id={displayId ?? item.id}
      className={`component-card component-${item.id}`}
      hidden={hidden}
      role="article"
    >
      <CardHeader className="component-heading">
        <CardTitle role="heading" aria-level={2}>
          <span className="component-family">{interfaceStories[item.id]?.origin ?? collectionFor(item)}</span>
          {item.name}
        </CardTitle>
        <CardAction>
          <div className="preview-header-controls" ref={setControls} />
          {onStar && <Button variant="ghost" size="icon-sm" aria-label={`${starred ? "Unsave" : "Save"} ${item.name}`} aria-pressed={starred} onClick={onStar}><BookmarkCheck animateOnHover size={16} className={starred ? "bookmark-icon is-saved" : "bookmark-icon"} aria-hidden="true" /></Button>}
          <Button
            variant="ghost"
            size="icon-sm"
            className="focus-preview"
            aria-label={`Focus ${item.name} preview`}
            aria-pressed={focused}
            onClick={onFocus}
          >
            {focused ? (
              <Minimize2Icon aria-hidden="true" />
            ) : (
              <Maximize2Icon aria-hidden="true" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${item.name} source and install`}
            title="Source & install"
            onClick={onSource}
          >
            <CodeXmlIcon aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <div className="component-preview" data-component={item.id}>
        {children ?? (interfaceIds.includes(item.id) ? <InterfaceExample id={item.id} /> : <FoundationExample id={item.id} />)}
      </div>
      <CardFooter className="component-footer">
        <span>{interfaceStories[item.id]?.principle ?? item.description}</span>
      </CardFooter>
    </Card>
  </PreviewControlsTarget>;
}
const designSystemIds = ["typography", "button", "badge", "card", "input", "toggle-group", "theme-toggler-button"];
const primitiveIds = [...foundationIds, ...motionIds];
const galleryIds = [...new Set([...primitiveIds, ...designSystemIds, ...interfaceIds])];
const components = galleryIds.map(
  (id) => catalog.find((item) => item.id === id)!,
);
export function App() {
  const embedded = new URLSearchParams(location.search).get("preview") === "1";
  const frame = useRef<HTMLIFrameElement>(null);
  const [focused, setFocused] = useState("");
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [appearancePreset, setAppearancePreset] = useState("ROC");
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try { const saved = JSON.parse(localStorage.getItem("roc-starred-primitives") ?? "null"); return Array.isArray(saved) ? saved.filter(id => primitiveIds.includes(id)) : designSystemIds; } catch { return designSystemIds; }
  });
  const toggleStar = (id: string) => setStarredIds(current => {
    const next = current.includes(id) ? current.filter(value => value !== id) : [...current, id];
    if (embedded) parent.postMessage({ type: "roc-stars", value: next }, location.origin);
    return next;
  });
  useEffect(() => { if (!embedded) localStorage.setItem("roc-starred-primitives", JSON.stringify(starredIds)); }, [embedded, starredIds]);
  const focusReturn = useRef("");
  const skipReturn = useRef(false);
  const [selected, setSelected] = useState(
    () => components.find((c) => c.id === location.hash.slice(1))?.id ?? "",
  );
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All"),
    [color, setColor] = useState<AccentName>("black"),
    [radius, setRadius] = useState(12),
    [corners, setCorners] = useState("Smooth"),
    [surface, setSurface] = useState("Light"),
    [density, setDensity] = useState("Comfortable");
  const [font, setFont] = useState("System");
  const [collection, setCollection] = useState("All");
  const visible = components.filter(
    (c) =>
      (interfaceIds.includes(c.id) || collection === "All" || collectionFor(c) === collection) &&
      (filter === "All" || c.actions.includes(filter)) &&
      `${c.name} ${c.description} ${collectionFor(c)}`.toLowerCase().includes(query.toLowerCase()),
  );
  const open = (id: string) => {
    if (embedded) {
      parent.postMessage({ type: "roc-source", id }, location.origin);
      return;
    }
    history.pushState(null, "", `#${id}`);
    setSelected(id);
  };
  const close = () => {
    history.replaceState(null, "", location.pathname + location.search);
    setSelected("");
  };
  useEffect(() => {
    const route = () =>
      setSelected(
        components.find((c) => c.id === location.hash.slice(1))?.id ?? "",
      );
    window.addEventListener("popstate", route);
    return () => window.removeEventListener("popstate", route);
  }, []);
  useEffect(() => {
    const search = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !selected &&
        !(
          event.target instanceof HTMLElement &&
          event.target.closest("input,textarea,[contenteditable]")
        )
      ) {
        event.preventDefault();
        if (embedded) {
          parent.postMessage({ type: "roc-search" }, location.origin);
          return;
        }
        document
          .querySelector<HTMLInputElement>('[aria-label="Search components"]')
          ?.focus();
      }
    };
    window.addEventListener("keydown", search);
    return () => window.removeEventListener("keydown", search);
  }, [selected]);
  const config = { collection, query, filter, color, radius, corners, surface, density, font, starredIds, appearancePreset };
  const latestConfig = useRef(config);
  latestConfig.current = config;
  const syncFrame = () =>
    frame.current?.contentWindow?.postMessage(
      { type: "roc-config", config: latestConfig.current },
      location.origin,
    );
  useEffect(() => {
    if (!embedded) syncFrame();
  }, [collection, query, filter, color, radius, corners, surface, density, font, starredIds, appearancePreset]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin) return;
      if (embedded && event.source === parent) {
        if (event.data?.type === "roc-config") {
          const c = event.data.config;
          setCollection(c.collection ?? "All");
          setQuery(c.query);
          setFilter(c.filter);
          setColor(c.color);
          setRadius(c.radius);
          setCorners(c.corners);
          setSurface(c.surface);
          setDensity(c.density);
          setFont(c.font);
          setAppearancePreset(c.appearancePreset ?? "ROC");
          if (Array.isArray(c.starredIds)) setStarredIds(c.starredIds.filter((id: string) => primitiveIds.includes(id)));
        }
        if (event.data?.type === "roc-section" && ["design-system", "primitives", "interfaces"].includes(event.data.id)) {
          skipReturn.current = true;
          setFocused("");
          requestAnimationFrame(() => document.getElementById(event.data.id)?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }));
        }
        if (event.data?.type === "roc-focus") {
          if (event.data.id === "" || galleryIds.includes(event.data.id))
            setFocused(event.data.id);
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      } else if (!embedded && event.source === frame.current?.contentWindow && event.data?.type === "roc-stars") {
        if (Array.isArray(event.data.value)) setStarredIds(event.data.value.filter((id: string) => primitiveIds.includes(id)));
      } else if (!embedded && event.source === frame.current?.contentWindow && event.data?.type === "roc-category") {
        if (collections.some(group => group.name === event.data.value)) setCollection(event.data.value);
      } else if (!embedded && event.source === frame.current?.contentWindow && event.data?.type === "roc-theme") {
        const { setting, value } = event.data;
        if (setting === "color" && Object.hasOwn(palette, value)) setColor(value as AccentName);
        if (setting === "radius" && radiusPresets.some(preset => Number(preset.value) === value)) setRadius(value);
        if (setting === "font" && Object.hasOwn(fontFamilies, value)) setFont(value);
        if (setting === "surface" && ["Dark", "Light"].includes(value)) setSurface(value);
        if (setting === "corners" && ["Smooth", "Rounded"].includes(value)) setCorners(value);
        if (setting === "density" && ["Comfortable", "Compact"].includes(value)) setDensity(value);
      } else if (
        !embedded &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "roc-focused"
      ) {
        if (event.data.id === "" || galleryIds.includes(event.data.id))
          setFocused(event.data.id);
      } else if (
        !embedded &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "roc-preview-interact"
      ) {
        window.dispatchEvent(new Event("roc-preview-interact"));
      } else if (
        !embedded &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "roc-search"
      ) {
        document
          .querySelector<HTMLInputElement>('[aria-label="Search components"]')
          ?.focus();
      } else if (
        !embedded &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "roc-source"
      ) {
        const id = event.data.id;
        if (components.some((c) => c.id === id)) {
          history.pushState(null, "", `#${id}`);
          setSelected(id);
        }
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [embedded]);
  useEffect(() => {
    if (!embedded) return;
    const interact = () =>
      parent.postMessage({ type: "roc-preview-interact" }, location.origin);
    document.addEventListener("pointerdown", interact, true);
    document.addEventListener("focusin", interact);
    return () => {
      document.removeEventListener("pointerdown", interact, true);
      document.removeEventListener("focusin", interact);
    };
  }, [embedded]);
  useEffect(() => {
    if (embedded)
      parent.postMessage({ type: "roc-focused", id: focused }, location.origin);
  }, [embedded, focused]);
  useLayoutEffect(() => {
    if (!embedded) return;
    if (focused) { focusReturn.current = focused; return; }
    const id = focusReturn.current;
    focusReturn.current = "";
    if (skipReturn.current) { skipReturn.current = false; return; }
    if (!id) return;
    const task = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" }));
    return () => cancelAnimationFrame(task);
  }, [embedded, focused]);
  const leaveDetails = () => {
    setFocused("");
    frame.current?.contentWindow?.postMessage(
      { type: "roc-focus", id: "" },
      location.origin,
    );
  };
  const style = {
    ...(appearancePreset === "Franklin Board" ? franklinBoardPreset.variables : { "--roc-canvas": "var(--roc-paper)", "--roc-radius-object": `${radius}px`, "--roc-radius-folder": `${radius}px`, "--roc-radius-image": `${radius}px`, "--roc-folder-paper": "var(--roc-paper)", "--roc-object-shadow": "none" }),
    "--roc-selected-accent": "#121316",
    "--roc-secondary": "#2563eb",
    "--roc-tertiary": "#f97316",
    "--roc-neutral": "#71717a",
    "--roc-selected-accent-foreground": accentForeground[color],
    "--roc-accent": surface === "Dark" ? "#f5f5f5" : "#121316",
    "--roc-accent-foreground": surface === "Dark" && color === "black" ? "#171717" : accentForeground[color],
    "--roc-radius": `${radius}px`,
    "--roc-corner-shape": corners === "Smooth" ? "squircle" : "round",
    "--roc-paper": surface === "Dark" ? "#1c1c1e" : "#fff",
    "--roc-ink": surface === "Dark" ? "#eeeeee" : "#252525",
    "--roc-muted": surface === "Dark" ? "#a3a3a3" : "#737373",
    "--roc-line": surface === "Dark" ? "#3b3b3d" : "#e5e5e5",
    "--roc-marker": surface === "Dark" ? "#343438" : "#efefef",
    "--preview-font": fontFamilies[font as keyof typeof fontFamilies] ?? fontFamilies.System,
    "--roc-font-body": fontFamilies[font as keyof typeof fontFamilies] ?? fontFamilies.System,
    "--roc-font-heading": fontFamilies[font as keyof typeof fontFamilies] ?? fontFamilies.System,
    "--roc-font-control": fontFamilies[font as keyof typeof fontFamilies] ?? fontFamilies.System,
  } as unknown as CSSProperties;
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = surface.toLowerCase();
    document.documentElement.classList.toggle("dark", surface === "Dark");
    document.documentElement.style.colorScheme = surface.toLowerCase();
    for (const [name, value] of Object.entries(style))
      document.documentElement.style.setProperty(name, String(value));
  }, [embedded, color, radius, corners, surface, font, appearancePreset]);
  if (embedded)
    return (
      <div className="design-space embedded-preview" style={style}>
        <main
          className="preview-canvas"
          data-density={density.toLowerCase()}
          data-focused={!!focused}
        >
          <section id="design-system" className="gallery-layer foundation-layer" aria-labelledby="design-system-title" hidden={!!focused && !starredIds.includes(focused)}>
            <div className="layer-heading" hidden={!!focused}><span className="layer-number">01</span><div><h1 id="design-system-title">Design System</h1><p>The shared visual language. Colour, typography, corners and space.</p></div><span className="layer-meta">Saved primitives</span></div>
            <DesignSystem>
              {components.filter(item => starredIds.includes(item.id)).sort((a, b) => starredIds.indexOf(a.id) - starredIds.indexOf(b.id)).map(item => <ComponentDisplayCard key={item.id} displayId={`starred-${item.id}`} starred onStar={() => toggleStar(item.id)} item={item} focused={focused === item.id} hidden={!!focused && focused !== item.id} onFocus={() => setFocused(focused === item.id ? "" : item.id)} onSource={() => open(item.id)}>
                {item.id === "theme-toggler-button" ? <AnimateThemeToggler theme={surface === "Dark" ? "dark" : "light"} resolvedTheme={surface === "Dark" ? "dark" : "light"} setTheme={theme => { const value = theme === "dark" ? "Dark" : "Light"; setSurface(value); parent.postMessage({ type: "roc-theme", setting: "surface", value }, location.origin); }}>{({ effective, toggleTheme }) => <ThemeTogglerButton dark={effective === "dark"} onDarkChange={dark => toggleTheme(dark ? "dark" : "light")} />}</AnimateThemeToggler> : undefined}
              </ComponentDisplayCard>)}
            </DesignSystem>
            <div className="layer-connection"><span>Shared tokens</span><span>Used by primitives and interfaces ↓</span></div>
          </section>
          <section id="primitives" className="gallery-layer" aria-labelledby="primitives-title" hidden={!!focused && (!primitiveIds.includes(focused) || starredIds.includes(focused))}>
            <div className="layer-heading" hidden={!!focused}><span className="layer-number">02</span><div><h2 id="primitives-title">Primitives</h2><p>One behaviour at a time. Built with the same visual foundations.</p></div><span className="layer-meta">{primitiveIds.length} components</span></div>
            <div className="catalog-browser" hidden={!!focused}>
              <ToggleGroup type="single" value={collection} onValueChange={value => {
                setCollection(value || "All");
                parent.postMessage({ type: "roc-category", value: value || "All" }, location.origin);
              }} className="collection-switch" aria-label="Component categories">
                {collections.map(group => <ToggleGroupItem key={group.name} value={group.name} aria-label={group.name}>{group.name}</ToggleGroupItem>)}
              </ToggleGroup>
              <div className="catalog-results"><p>{collections.find(group => group.name === collection)?.description}</p><output aria-live="polite">{visible.filter(item => primitiveIds.includes(item.id)).length} results</output></div>
            </div>
            <div className="masonry" aria-label="Primitive previews">
              {components.filter(item => primitiveIds.includes(item.id)).map(item => <ComponentDisplayCard key={item.id} starred={starredIds.includes(item.id)} onStar={() => toggleStar(item.id)} item={item} focused={focused === item.id}
                hidden={focused ? item.id !== focused : !visible.includes(item)}
                onFocus={() => { setFocused(focused === item.id ? "" : item.id); window.scrollTo({ top: 0, behavior: "instant" }); }}
                onSource={() => open(item.id)} />)}
            </div>
            <div className="layer-connection" hidden={!!focused}><span>Composed behaviours</span><span>Combined into complete experiences ↓</span></div>
          </section>
          <section id="interfaces" className="gallery-layer" aria-labelledby="interfaces-title" hidden={!!focused && !interfaceIds.includes(focused)}>
            <div className="layer-heading" hidden={!!focused}><span className="layer-number">03</span><div><h2 id="interfaces-title">Interfaces</h2><p>Complete interactions, drawn from real projects. Try the flow, keep the context.</p></div><span className="layer-meta">{interfaceIds.length} practice cases</span></div>
            <div className="masonry interface-gallery" aria-label="Interface practice cases">
              {components.filter(item => interfaceIds.includes(item.id)).map(item => <ComponentDisplayCard key={item.id} item={item} focused={focused === item.id}
                hidden={focused ? item.id !== focused : !visible.includes(item)}
                onFocus={() => { setFocused(focused === item.id ? "" : item.id); window.scrollTo({ top: 0, behavior: "instant" }); }}
                onSource={() => open(item.id)} />)}
            </div>
          </section>
          {!focused && !visible.length && (
            <Empty className="empty">
              <EmptyHeader>
                <EmptyTitle>No matching components.</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setFilter("All");
                    setCollection("All");
                  }}
                >
                  Clear search
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </main>
      </div>
    );
  return (
    <div className="design-space">
      <header className="topbar">
        <a className="brand" href={location.pathname} aria-label="ROC home">
          roc
        </a>
        <nav className="level-navigation" aria-label="Gallery levels">
          {[["design-system", "Design System"], ["primitives", "Primitives"], ["interfaces", "Interfaces"]].map(([id, label], i) => <Button key={id} variant="ghost" size="sm" onClick={() => {
            leaveDetails();
            frame.current?.contentWindow?.postMessage({ type: "roc-section", id }, location.origin);
          }}><span>{String(i + 1).padStart(2, "0")}</span>{label}</Button>)}
        </nav>
        <Sheet open={appearanceOpen} onOpenChange={setAppearanceOpen}>
          <SheetTrigger asChild><Button variant="ghost" size="sm" aria-label="Appearance settings">Appearance</Button></SheetTrigger>
          <SheetContent side="left" className="source-panel appearance-panel" showCloseButton={false}>
            <div className="panel-body">
              <SheetHeader><SheetTitle>Appearance</SheetTitle><SheetClose asChild><Button variant="ghost" size="icon-sm" aria-label="Close appearance">×</Button></SheetClose></SheetHeader>
              <SheetDescription>Shared settings for every preview.</SheetDescription>
              <div className="appearance-controls">
                <label>Preset<Picker label="Appearance preset" value={appearancePreset} onValueChange={value => { setAppearancePreset(value); setRadius(value === "Franklin Board" ? 16 : 12); setCorners("Rounded"); setFont("System"); setDensity("Comfortable"); }} options={[{ value: "ROC" }, { value: "Franklin Board" }]} /></label>
                <div className="appearance-scheme"><span>Colour scheme</span><strong>Technical Precision</strong><div aria-label="Primary, Secondary, Tertiary and Neutral colour scheme">{["#121316", "#2563eb", "#f97316", "#71717a"].map(value => <span key={value} style={{ background: value }} />)}</div></div>
                <label>Theme<Picker label="Theme" value={surface} onValueChange={setSurface} options={[{ value: "Light" }, { value: "Dark" }]} /></label>
                <label>Typeface<Picker label="Typeface" value={font} onValueChange={setFont} options={[{ value: "System" }, { value: "Serif" }]} /></label>
                <label>Corner style<Picker label="Corner style" value={corners} onValueChange={setCorners} options={[{ value: "Smooth" }, { value: "Rounded" }]} /></label>
                <label>Radius<Picker label="Corner radius" value={String(radius)} onValueChange={value => setRadius(Number(value))} options={radiusPresets} /></label>
                <label>Density<Picker label="Density" value={density} onValueChange={setDensity} options={[{ value: "Comfortable" }, { value: "Compact" }]} /></label>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <InputGroup className="search">
          <InputGroupAddon>
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search components"
            placeholder="Find a component or case…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              leaveDetails();
            }}
          />
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <Picker
          className="filter"
          label="Interaction"
          value={filter}
          onValueChange={(value) => {
            setFilter(value);
            leaveDetails();
          }}
          options={[
            "All",
            ...new Set(components.flatMap((item) => item.actions)),
          ].map((value) => ({ value }))}
        />
        <nav className="external-navigation">
          <Button variant="link" size="sm" asChild>
            <a href={skill} target="_blank" rel="noreferrer">
              Principles ↗
            </a>
          </Button>
          <Button variant="link" size="sm" asChild>
            <a href={repo} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </Button>
        </nav>
      </header>
      <div className="workspace">
        <main className="canvas" data-density={density.toLowerCase()}>
          <ViewportPreview
            frame={frame}
            onLoad={syncFrame}
            detail={components.find((c) => c.id === focused)?.name}
            onBack={leaveDetails}
          />
          <footer className="canvas-footer">
            <span>Responsive Object Continuity</span>
            <span>Design System → Primitives → Interfaces</span>
          </footer>
        </main>
      </div>
      {selected && (
        <SourcePanel
          key={selected}
          item={catalog.find((c) => c.id === selected)!}
          close={close}
        />
      )}
    </div>
  );
}
