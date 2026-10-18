import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ExternalLinkIcon, SearchIcon } from "lucide-react";
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
import { Kbd } from "../registry/roc/kbd";
import { Label } from "../registry/roc/label";
import { Picker } from "./Picker";
import { Slider } from "../registry/roc/slider";
import { Toggle } from "../registry/roc/toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../registry/roc/sheet";
import { foundationIds } from "./foundations";
import { catalog } from "./catalog";
import { FoundationExample } from "./FoundationExamples";
import { AutoHidePanel } from "./AutoHidePanel";
import { ViewportPreview } from "./ViewportPreview";
import { palette, type Settings } from "./settings";
import "./site.css";
const repo = "https://github.com/SonghaiFan/roc-ui";
const skill = "https://github.com/SonghaiFan/responsive-object-continuity";
const registry =
  "https://raw.githubusercontent.com/SonghaiFan/roc-ui/main/public/r/";
type Item = (typeof catalog)[number];
function Copy({ text, label = "Copy" }: { text: string; label?: string }) {
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 1800);
      return () => clearTimeout(timer);
    }
  }, [status]);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setStatus("Copied");
        } catch {
          setStatus("Copy unavailable");
        }
      }}
    >
      {status || label}
    </Button>
  );
}
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
          <div className="install">
            <code>npx shadcn@latest add …/{item.id}.json</code>
            <Copy
              text={`npx shadcn@latest add ${registry}${item.id}.json`}
              label="Copy install"
            />
          </div>
          <Collapsible className="usage" defaultOpen>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Usage
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre>{item.usage}</pre>
            </CollapsibleContent>
          </Collapsible>
          <div className="source-tools">
            <Picker
              label="Source file"
              value={file}
              onValueChange={setFile}
              options={(files.length
                ? files
                : [{ path: `registry/roc/${item.id}.tsx` }]
              ).map((f) => ({ value: f.path.split("/").at(-1)! }))}
            />
            <Copy text={code} label="Copy file" />
          </div>
          <pre className="source-code">
            {error || code || "Loading source…"}
          </pre>
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
const components = foundationIds.map(
  (id) => catalog.find((item) => item.id === id)!,
);
export function App() {
  const embedded = new URLSearchParams(location.search).get("preview") === "1";
  const frame = useRef<HTMLIFrameElement>(null);
  const [focused, setFocused] = useState("");
  const [selected, setSelected] = useState(
    () => components.find((c) => c.id === location.hash.slice(1))?.id ?? "",
  );
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All"),
    [color, setColor] = useState<Settings["color"]>("neutral"),
    [radius, setRadius] = useState(12),
    [surface, setSurface] = useState("White"),
    [density, setDensity] = useState("Comfortable");
  const [font, setFont] = useState("System");
  const visible = components.filter(
    (c) =>
      (filter === "All" || c.actions.includes(filter)) &&
      `${c.name} ${c.description}`.toLowerCase().includes(query.toLowerCase()),
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
  const config = { query, filter, color, radius, surface, density, font };
  const latestConfig = useRef(config);
  latestConfig.current = config;
  const syncFrame = () =>
    frame.current?.contentWindow?.postMessage(
      { type: "roc-config", config: latestConfig.current },
      location.origin,
    );
  useEffect(() => {
    if (!embedded) syncFrame();
  }, [query, filter, color, radius, surface, density, font]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin) return;
      if (embedded && event.source === parent) {
        if (event.data?.type === "roc-config") {
          const c = event.data.config;
          setQuery(c.query);
          setFilter(c.filter);
          setColor(c.color);
          setRadius(c.radius);
          setSurface(c.surface);
          setDensity(c.density);
          setFont(c.font);
        }
        if (event.data?.type === "roc-focus") {
          if (event.data.id === "" || foundationIds.includes(event.data.id))
            setFocused(event.data.id);
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      } else if (
        !embedded &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "roc-focused"
      ) {
        if (event.data.id === "" || foundationIds.includes(event.data.id))
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
    "--roc-radius": `${radius}px`,
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
  }, [embedded, color, radius, surface, font]);
  if (embedded)
    return (
      <div className="design-space embedded-preview" style={style}>
        <main
          className="preview-canvas"
          data-density={density.toLowerCase()}
          data-focused={!!focused}
        >
          <div className="masonry" aria-label="Component previews">
            {components.map((item) => (
              <Card
                id={item.id}
                key={item.id}
                className={`component-card component-${item.id}`}
                hidden={focused ? item.id !== focused : !visible.includes(item)}
                role="article"
              >
                <CardHeader className="component-heading">
                  <CardTitle role="heading" aria-level={2}>
                    {item.name}
                  </CardTitle>
                  <CardAction>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="focus-preview"
                      aria-label={`Focus ${item.name} preview`}
                      aria-pressed={focused === item.id}
                      onClick={() => {
                        setFocused(focused === item.id ? "" : item.id);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }}
                    >
                      ↗
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`View ${item.name} source`}
                      onClick={() => open(item.id)}
                    >
                      <span aria-hidden="true">〈/〉</span>
                    </Button>
                  </CardAction>
                </CardHeader>
                <div className="component-preview" data-component={item.id}>
                  <FoundationExample id={item.id} />
                </div>
                <CardFooter className="component-footer">
                  <span>{item.description}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => open(item.id)}
                    aria-label={`Install ${item.name}`}
                  >
                    ↗
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
        <AutoHidePanel>
          <div className="rail-section">
            <Label className="rail-control">
              <span>Surface</span>
              <Picker
                dark
                label="Surface"
                value={surface}
                onValueChange={setSurface}
                options={[{ value: "Paper" }, { value: "White" }]}
              />
            </Label>
            <div className="rail-control">
              <span>Accent</span>
              <div className="swatches">
                {Object.entries(palette).map(([key, value]) => (
                  <Toggle
                    key={key}
                    aria-label={`${key} accent`}
                    pressed={color === key}
                    onPressedChange={() => setColor(key as Settings["color"])}
                    style={{ background: value }}
                  />
                ))}
              </div>
            </div>
            <Label className="rail-control">
              <span>Type</span>
              <Picker
                dark
                label="Typeface"
                value={font}
                onValueChange={setFont}
                options={[{ value: "System" }, { value: "Serif" }]}
              />
            </Label>
            <div className="rail-control">
              <span>
                Radius <output>{radius}</output>
              </span>
              <Slider
                aria-label="Corner radius"
                min={0}
                max={24}
                step={2}
                value={[radius]}
                onValueChange={([next]) => setRadius(next)}
              />
            </div>
            <Label className="rail-control">
              <span>Spacing</span>
              <Picker
                dark
                label="Spacing"
                value={density}
                onValueChange={setDensity}
                options={[{ value: "Comfortable" }, { value: "Compact" }]}
              />
            </Label>
          </div>
          <div className="rail-section component-index">
            <span className="rail-caption">
              COMPONENTS <b>{components.length.toString().padStart(2, "0")}</b>
            </span>
            {components.map((item, i) => (
              <Button
                variant="ghost"
                size="sm"
                key={item.id}
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                  frame.current?.contentWindow?.postMessage(
                    { type: "roc-focus", id: item.id },
                    location.origin,
                  );
                  window.dispatchEvent(new Event("roc-preview-interact"));
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {item.name}
                <ExternalLinkIcon aria-hidden="true" />
              </Button>
            ))}
          </div>
          <div className="rail-bottom">
            <Button variant="link" size="sm" asChild>
              <a
                href={`${repo}/blob/main/notes/react-design-system.md`}
                target="_blank"
                rel="noreferrer"
              >
                Composition guide ↗
              </a>
            </Button>
          </div>
        </AutoHidePanel>
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
          <ViewportPreview
            frame={frame}
            onLoad={syncFrame}
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
