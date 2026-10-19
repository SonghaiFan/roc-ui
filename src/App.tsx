import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  CodeXmlIcon,
  Maximize2Icon,
  Minimize2Icon,
  SearchIcon,
  LayoutGridIcon,
  MousePointer2Icon,
  TextCursorInputIcon,
  PanelTopIcon,
  CompassIcon,
  LayersIcon,
  TypeIcon,
  SparklesIcon,
  Columns2Icon,
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
} from "../registry/roc/sheet";
import { motionIds } from "./motion-catalog";
import { collections, collectionFor } from "./collections";
import { ToggleGroup, ToggleGroupItem } from "../registry/roc/toggle-group";
import { foundationIds } from "./foundations";
import { catalog } from "./catalog";
import { FoundationExample } from "./FoundationExamples";
import { ViewportPreview } from "./ViewportPreview";
import { palette, accentForeground, galleryPresets, type GalleryPreset } from "./settings";
import { PreviewControlsTarget } from "./PreviewControls";
import "./site.css";
const repo = "https://github.com/SonghaiFan/roc-ui";
const skill = "https://github.com/SonghaiFan/responsive-object-continuity";
const registry = new URL("./r/", location.href).href;
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
function ComponentDisplayCard({ item, focused, hidden, onFocus, onSource }: {
  item: Item; focused: boolean; hidden: boolean; onFocus: () => void; onSource: () => void;
}) {
  const [controls, setControls] = useState<HTMLDivElement | null>(null);
  return <PreviewControlsTarget value={controls}>
    <Card
      id={item.id}
      className={`component-card component-${item.id}`}
      hidden={hidden}
      role="article"
    >
      <CardHeader className="component-heading">
        <CardTitle role="heading" aria-level={2}>
          <span className="component-family">{collectionFor(item)}</span>
          {item.name}
        </CardTitle>
        <CardAction>
          <div className="preview-header-controls" ref={setControls} />
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
        <FoundationExample id={item.id} />
      </div>
      <CardFooter className="component-footer">
        <span>{item.description}</span>
      </CardFooter>
    </Card>
  </PreviewControlsTarget>;
}
const galleryIds = [...foundationIds, ...motionIds];
const components = galleryIds.map(
  (id) => catalog.find((item) => item.id === id)!,
);
export function App() {
  const embedded = new URLSearchParams(location.search).get("preview") === "1";
  const frame = useRef<HTMLIFrameElement>(null);
  const [focused, setFocused] = useState("");
  const [collection, setCollection] = useState("All");
  const [preset, setPreset] = useState<GalleryPreset>("default");
  const [selected, setSelected] = useState(
    () => components.find((c) => c.id === location.hash.slice(1))?.id ?? "",
  );
  const [query, setQuery] = useState(""), [filter, setFilter] = useState("All");
  const { color, radius, corners, surface, density, font } = galleryPresets.find(item => item.value === preset)!.config;
  const collectionBar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    collectionBar.current?.querySelector<HTMLElement>('[data-state="on"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [collection]);
  useEffect(() => {
    if (embedded) window.scrollTo({ top: 0, behavior: "instant" });
  }, [embedded, query, filter, collection]);
  const visible = components.filter(
    (c) =>
      (collection === "All" || collectionFor(c) === collection) &&
      (filter === "All" || c.actions.includes(filter)) &&
      `${c.name} ${c.description} ${c.rule} ${collectionFor(c)}`.toLowerCase().includes(query.toLowerCase()),
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
  const config = { collection, query, filter, preset };
  const latestConfig = useRef(config);
  latestConfig.current = config;
  const syncFrame = () =>
    frame.current?.contentWindow?.postMessage(
      { type: "roc-config", config: latestConfig.current },
      location.origin,
    );
  useEffect(() => {
    if (!embedded) syncFrame();
  }, [collection, query, filter, preset]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin) return;
      if (embedded && event.source === parent) {
        if (event.data?.type === "roc-config") {
          const c = event.data.config;
          setCollection(c.collection ?? "All");
          setQuery(c.query);
          setFilter(c.filter);
          if (galleryPresets.some(item => item.value === c.preset)) setPreset(c.preset);
        }
        if (event.data?.type === "roc-focus") {
          if (event.data.id === "" || galleryIds.includes(event.data.id))
            setFocused(event.data.id);
          window.scrollTo({ top: 0, behavior: "instant" });
        }
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
    if (embedded)
      parent.postMessage({ type: "roc-focused", id: focused }, location.origin);
  }, [embedded, focused]);
  const leaveDetails = () => {
    setFocused("");
    frame.current?.contentWindow?.postMessage(
      { type: "roc-focus", id: "" },
      location.origin,
    );
  };
  const style = {
    "--roc-accent": palette[color],
    "--roc-marker": `color-mix(in srgb,${palette[color]} 24%,white)`,
    "--roc-accent-foreground": accentForeground[color],
    "--roc-radius": `${radius}px`,
    "--roc-corner-shape": corners === "Smooth" ? "squircle" : "round",
    "--roc-paper": surface === "Paper" ? "#fcfbf7" : "#fff",
    "--preview-font":
      font === "System"
        ? "ui-sans-serif, system-ui, sans-serif"
        : "Georgia, serif",
  } as CSSProperties;
  useLayoutEffect(() => {
    if (!embedded) return;
    for (const [name, value] of Object.entries(style))
      document.documentElement.style.setProperty(name, String(value));
  }, [embedded, preset]);
  if (embedded)
    return (
      <div className="design-space embedded-preview" style={style}>
        <main
          className="preview-canvas"
          data-density={density.toLowerCase()}
          data-focused={!!focused}
        >
          <div className="masonry" aria-label="Component previews">
            {components.map(item => <ComponentDisplayCard key={item.id} item={item} focused={focused === item.id}
              hidden={focused ? item.id !== focused : !visible.includes(item)}
              onFocus={() => { setFocused(focused === item.id ? "" : item.id); window.scrollTo({ top: 0, behavior: "instant" }); }}
              onSource={() => open(item.id)} />)}
          </div>
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
        <span className="top-title">
          Components{" "}
          <Badge variant="secondary" className="count">
            {visible.length}
          </Badge>
        </span>
        <ToggleGroup type="single" value={preset} onValueChange={value => { if (value) setPreset(value as GalleryPreset); }} className="preset-switch" aria-label="Appearance preset">
          {galleryPresets.map(item => <ToggleGroupItem value={item.value} key={item.value} title={item.description}>{item.label}</ToggleGroupItem>)}
        </ToggleGroup>
        <InputGroup className="search">
          <InputGroupAddon>
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search components"
            placeholder="Find a component…"
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
        <nav>
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
          {!focused && <section className="catalog-browser" aria-label="Browse the ROC catalog">
            <div className="catalog-intro"><div><span className="catalog-eyebrow">THE ROC LIBRARY</span><h1>Objects, in continuity.</h1><p>Find a building block. Try its behavior. Make it yours.</p></div><span className="catalog-total">{components.length}<small>components</small></span></div>
            <ToggleGroup type="single" value={collection} onValueChange={value => setCollection(value || "All")} ref={collectionBar} className="collection-switch" aria-label="Component collections">
              {collections.map((group, i) => {
                const Icon = [LayoutGridIcon, MousePointer2Icon, TextCursorInputIcon, CompassIcon, PanelTopIcon, LayersIcon, TypeIcon, SparklesIcon, Columns2Icon][i];
                return <ToggleGroupItem key={group.name} value={group.name} aria-label={group.name} title={group.name}><Icon aria-hidden="true" /><span>{group.name}</span></ToggleGroupItem>;
              })}
            </ToggleGroup>
            <div className="catalog-results"><p><strong>{collection === "All" ? "All components" : collection}</strong><span>{collections.find(c => c.name === collection)?.description}</span></p><output aria-live="polite">{visible.length} results</output></div>
          </section>}
          <ViewportPreview
            frame={frame}
            onLoad={syncFrame}
            componentId={focused}
            detail={components.find((c) => c.id === focused)?.name}
            onBack={leaveDetails}
          />
          <footer className="canvas-footer">
            <span>Responsive Object Continuity</span>
            <span>React · MIT · Source included</span>
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
