import { useEffect, useRef, useState, type RefObject } from "react";

type Device = "fit" | "desktop" | "tablet" | "phone" | "custom";
const presets = [
  { id: "fit", label: "Fit", width: 0, height: 800 },
  { id: "desktop", label: "Desktop", width: 1024, height: 768 },
  { id: "tablet", label: "Tablet", width: 768, height: 1024 },
  { id: "phone", label: "Phone", width: 390, height: 844 },
] as const;
function DeviceIcon({ kind }: { kind: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      {kind === "desktop" ? (
        <>
          <rect x="2" y="3" width="16" height="11" rx="1.5" />
          <path d="M7 18h6M10 14v4" />
        </>
      ) : kind === "phone" ? (
        <>
          <rect x="6" y="2" width="8" height="16" rx="2" />
          <path d="M9 15.5h2" />
        </>
      ) : kind === "tablet" ? (
        <>
          <rect x="3" y="2" width="14" height="16" rx="2" />
          <path d="M9 15.5h2" />
        </>
      ) : (
        <path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4M3 3l5 5m9-5-5 5M3 17l5-5m9 5-5-5" />
      )}
    </svg>
  );
}
/** One browsing context, resized in place. Media queries, visualViewport and
 * top-layer dialogs all see the selected dimensions, including while moving. */
export function ViewportPreview({
  frame,
  onLoad,
}: {
  frame: RefObject<HTMLIFrameElement | null>;
  onLoad: () => void;
}) {
  const stage = useRef<HTMLDivElement>(null),
    drag = useRef<{ x: number; width: number } | null>(null);
  const [device, setDevice] = useState<Device>("fit"),
    [width, setWidth] = useState(1024),
    [height, setHeight] = useState(800),
    [available, setAvailable] = useState(1024),
    [measured, setMeasured] = useState(1024),
    [dragging, setDragging] = useState(false);
  const target = device === "fit" ? available : width;
  useEffect(() => {
    const observer = new ResizeObserver((entries) =>
      setAvailable(
        Math.max(
          320,
          Math.min(1600, Math.floor(entries[0].contentRect.width) - 32),
        ),
      ),
    );
    observer.observe(stage.current!);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver((entries) =>
      setMeasured(Math.round(entries[0].contentRect.width)),
    );
    observer.observe(frame.current!);
    return () => observer.disconnect();
  }, [frame]);
  const custom = (next: number) => {
    setDevice("custom");
    setWidth(Math.max(320, Math.min(1600, Math.round(next))));
  };
  return (
    <section className="responsive-preview" aria-label="Responsive preview">
      <div className="viewport-controls">
        <div
          className="device-switch"
          role="group"
          aria-label="Preview viewport"
        >
          {presets.map((preset) => (
            <button
              type="button"
              key={preset.id}
              aria-pressed={device === preset.id}
              onClick={() => {
                setDevice(preset.id);
                if (preset.width) setWidth(preset.width);
                setHeight(preset.height);
              }}
            >
              <DeviceIcon kind={preset.id} />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
        <label className="viewport-range">
          <span>Width</span>
          <input
            aria-label="Preview width"
            type="range"
            min="320"
            max="1600"
            step="1"
            value={Math.max(320, target)}
            onChange={(e) => custom(Number(e.target.value))}
          />
        </label>
        <output className="viewport-size" aria-label="Viewport dimensions">
          {measured} × {height}
        </output>
      </div>
      <div className="viewport-stage" ref={stage} data-dragging={dragging}>
        <div className="viewport-shell" style={{ width: target + 2 }}>
          <iframe
            ref={frame}
            title="Live component previews"
            className="preview-frame"
            src={`${location.pathname}?preview=1`}
            onLoad={onLoad}
            style={{ height }}
          />
          <div
            role="separator"
            aria-label="Resize preview"
            aria-orientation="vertical"
            aria-valuemin={320}
            aria-valuemax={1600}
            aria-valuenow={Math.round(target)}
            tabIndex={0}
            className="viewport-resizer"
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = { x: e.clientX, width: measured };
              setDragging(true);
              custom(measured);
            }}
            onPointerMove={(e) => {
              if (drag.current) {
                const space = stage.current!.clientWidth - 32,
                  start =
                    drag.current.width <= space
                      ? (space + drag.current.width) / 2
                      : drag.current.width,
                  edge = start + e.clientX - drag.current.x;
                custom(edge <= space ? 2 * edge - space : edge);
              }
            }}
            onPointerUp={(e) => {
              drag.current = null;
              setDragging(false);
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onPointerCancel={() => {
              drag.current = null;
              setDragging(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault();
                custom(
                  target +
                    (e.key === "ArrowLeft" ? -1 : 1) * (e.shiftKey ? 100 : 10),
                );
              }
            }}
          >
            <span />
          </div>
        </div>
      </div>
      <p className="viewport-hint">
        Resize the same live view. Open a component with ↗ to inspect its
        responsive layout.
      </p>
    </section>
  );
}
