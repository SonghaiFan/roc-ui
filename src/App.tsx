import { useEffect, useRef, useState, type CSSProperties } from "react";
import { catalog } from "./catalog";
import { Example } from "./Examples";
import { defaults, palette, type Settings } from "./settings";
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
    <button
      className="copy"
      type="button"
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
    </button>
  );
}
function SourcePanel({ item, close }: { item: Item; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [files, setFiles] = useState<{ path: string; content: string }[]>([]),
    [file, setFile] = useState(`${item.id}.tsx`),
    [error, setError] = useState("");
  useEffect(() => {
    const node = dialog.current!;
    node.showModal();
    return () => node.close();
  }, []);
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
    <dialog
      ref={dialog}
      className="source-panel"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-labelledby="source-title"
    >
      <div className="panel-body">
        <header>
          <div>
            <span className="eyebrow">COMPONENT SOURCE</span>
            <h2 id="source-title">{item.name}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close source"
            onClick={close}
          >
            ×
          </button>
        </header>
        <p className="panel-description">{item.description}</p>
        <div className="install">
          <code>npx shadcn@latest add …/{item.id}.json</code>
          <Copy
            text={`npx shadcn@latest add ${registry}${item.id}.json`}
            label="Copy install"
          />
        </div>
        <details className="usage" open>
          <summary>Usage</summary>
          <pre>{item.usage}</pre>
        </details>
        <div className="source-tools">
          <select
            aria-label="Source file"
            value={file}
            onChange={(e) => setFile(e.target.value)}
          >
            {(files.length
              ? files
              : [{ path: `registry/roc/${item.id}.tsx` }]
            ).map((f) => (
              <option key={f.path} value={f.path.split("/").at(-1)}>
                {f.path.split("/").at(-1)}
              </option>
            ))}
          </select>
          <Copy text={code} label="Copy file" />
        </div>
        <pre className="source-code">{error || code || "Loading source…"}</pre>
        <details className="contract">
          <summary>Behaviour & boundaries</summary>
          <p>{item.rule}</p>
          <p>{item.limit}</p>
          <a
            href={`${repo}/blob/main/notes/react-design-system.md`}
            target="_blank"
            rel="noreferrer"
          >
            React component contracts ↗
          </a>
        </details>
        <footer>
          <span>React · TypeScript · CSS · MIT</span>
          <a
            href={`${repo}/tree/main/registry/roc`}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub ↗
          </a>
        </footer>
      </div>
    </dialog>
  );
}
const order = [
  "continuous-tabs",
  "voice-player",
  "source-tray",
  "folder-fan",
  "expandable-card",
  "selection-toolbar",
  "image-viewport",
  "focus-lanes",
  "page-book",
  "source-stack",
];
const components = order.map((id) => catalog.find((item) => item.id === id)!);
const hints: Record<string, string> = {
  "continuous-tabs": "Move between views",
  "voice-player": "Play, seek, change speed",
  "source-tray": "Unfold the original objects",
  "folder-fan": "Open a collection",
  "expandable-card": "Read, edit, return to its place",
  "selection-toolbar": "Select text to reveal the toolbar",
  "image-viewport": "Pan, zoom, fit",
  "focus-lanes": "Focus without losing context",
  "page-book": "Turn a page or drag its edge",
  "source-stack": "Spread, inspect, gather",
};
export function App() {
  const [selected, setSelected] = useState(
    () => catalog.find((c) => c.id === location.hash.slice(1))?.id ?? "",
  );
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All"),
    [color, setColor] = useState<Settings["color"]>("sage"),
    [radius, setRadius] = useState(12),
    [surface, setSurface] = useState("Paper"),
    [density, setDensity] = useState("Comfortable");
  const [font, setFont] = useState("System");
  const settings = { ...defaults, color };
  const visible = components.filter(
    (c) =>
      (filter === "All" || c.actions.includes(filter)) &&
      `${c.name} ${c.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const open = (id: string) => {
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
        catalog.find((c) => c.id === location.hash.slice(1))?.id ?? "",
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
        document
          .querySelector<HTMLInputElement>('[aria-label="Search components"]')
          ?.focus();
      }
    };
    window.addEventListener("keydown", search);
    return () => window.removeEventListener("keydown", search);
  }, [selected]);
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
  return (
    <div className="design-space" style={style}>
      <header className="topbar">
        <a className="brand" href={location.pathname}>
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          <b>roc</b>
        </a>
        <span className="top-divider" />
        <span className="top-title">Component design space</span>
        <span className="release">0.5</span>
        <nav>
          <a href={skill} target="_blank" rel="noreferrer">
            Principles ↗
          </a>
          <a href={repo} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </header>
      <div className="workspace">
        <aside className="design-controls" aria-label="Design settings">
          <div className="rail-heading">
            <span>Make it yours</span>
            <span>⌘</span>
          </div>
          <div className="rail-section">
            <span className="rail-caption">APPEARANCE</span>
            <label className="rail-control">
              <span>Surface</span>
              <select
                aria-label="Surface"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
              >
                <option>Paper</option>
                <option>White</option>
              </select>
            </label>
            <div className="rail-control">
              <span>Accent</span>
              <div className="swatches">
                {Object.entries(palette).map(([key, value]) => (
                  <button
                    type="button"
                    key={key}
                    aria-label={`${key} accent`}
                    aria-pressed={color === key}
                    style={{ background: value }}
                    onClick={() => setColor(key as Settings["color"])}
                  />
                ))}
              </div>
            </div>
            <label className="rail-control">
              <span>Type</span>
              <select
                aria-label="Typeface"
                value={font}
                onChange={(e) => setFont(e.target.value)}
              >
                <option>System</option>
                <option>Serif</option>
              </select>
            </label>
            <label className="rail-control">
              <span>
                Radius <output>{radius}</output>
              </span>
              <input
                aria-label="Corner radius"
                type="range"
                min={0}
                max={24}
                step={2}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              />
            </label>
            <label className="rail-control">
              <span>Spacing</span>
              <select
                aria-label="Spacing"
                value={density}
                onChange={(e) => setDensity(e.target.value)}
              >
                <option>Comfortable</option>
                <option>Compact</option>
              </select>
            </label>
          </div>
          <div className="rail-section component-index">
            <span className="rail-caption">
              COMPONENTS <b>{components.length.toString().padStart(2, "0")}</b>
            </span>
            {components.map((item, i) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                  requestAnimationFrame(() =>
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({
                        behavior: matchMedia("(prefers-reduced-motion: reduce)")
                          .matches
                          ? "instant"
                          : "smooth",
                        block: "center",
                      }),
                  );
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {item.name}
                <span>↗</span>
              </button>
            ))}
          </div>
          <div className="rail-bottom">
            <p>
              Independent React components.
              <br />
              Own the code. Keep the feel.
            </p>
            <a
              href={`${repo}/blob/main/notes/react-design-system.md`}
              target="_blank"
              rel="noreferrer"
            >
              Composition guide ↗
            </a>
          </div>
        </aside>
        <main className="canvas" data-density={density.toLowerCase()}>
          <div className="canvas-toolbar">
            <div>
              <span className="status-dot" />
              <h1>All components</h1>
              <span className="count">{visible.length}</span>
            </div>
            <label className="search">
              <span>⌕</span>
              <input
                aria-label="Search components"
                placeholder="Find a component…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd>/</kbd>
            </label>
            <select
              className="filter"
              aria-label="Interaction"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {["All", "Select", "Press", "Expand", "Drag", "Play", "Edit"].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
          </div>
          <div className="masonry" aria-label="Component previews">
            {components.map((item) => (
              <article
                id={item.id}
                key={item.id}
                className={`component-card component-${item.id}`}
                hidden={!visible.includes(item)}
              >
                <header className="component-heading">
                  <h2>{item.name}</h2>
                  <button
                    type="button"
                    aria-label={`View ${item.name} source`}
                    onClick={() => open(item.id)}
                  >
                    <span aria-hidden="true">〈/〉</span>
                  </button>
                </header>
                <div className="component-preview" data-component={item.id}>
                  <Example id={item.id} settings={settings} />
                </div>
                <footer className="component-footer">
                  <span>{hints[item.id]}</span>
                  <button
                    type="button"
                    onClick={() => open(item.id)}
                    aria-label={`Install ${item.name}`}
                  >
                    ↗
                  </button>
                </footer>
              </article>
            ))}
          </div>
          {!visible.length && (
            <div className="empty">
              No matching components.{" "}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                }}
              >
                Clear search
              </button>
            </div>
          )}
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
