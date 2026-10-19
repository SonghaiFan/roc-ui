import { useEffect, useRef, useState, type RefObject } from "react";
import {
  MaximizeIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import { Badge } from "../registry/roc/badge";
import { Button } from "../registry/roc/button";
import { Label } from "../registry/roc/label";
import { Slider } from "../registry/roc/slider";
import { Toggle } from "../registry/roc/toggle";

type Device = "fit" | "desktop" | "tablet" | "phone" | "custom";
const presets = [
  { id: "fit", label: "Fit", width: 0, height: 800 },
  { id: "desktop", label: "Desktop", width: 1024, height: 768 },
  { id: "tablet", label: "Tablet", width: 768, height: 1024 },
  { id: "phone", label: "Phone", width: 390, height: 844 },
] as const;
const breakpoints = [
  { label: "sm", width: 640 },
  { label: "md", width: 768 },
  { label: "lg", width: 1024 },
  { label: "xl", width: 1280 },
  { label: "2xl", width: 1536 },
];
const responsiveBehavior: Record<string, [string, string]> = {
  sidebar: ["Navigation sits beside the editor.", "Navigation becomes a grouped icon bar above the editor. Your draft and selection stay in place."],
  card: ["Actions share a row below the content.", "Actions stack and fill the card width; the draft stays mounted."],
  tabs: ["Tabs take only the space their labels need.", "Tabs become a segmented icon group with 44px targets. Switch views without losing the draft."],
  dialog: ["Open the dialog to see a centered panel with actions in a row.", "Open the dialog to see a bottom-aligned panel with stacked, full-width actions."],
  input: ["Compact fields for pointer and keyboard input.", "Fields use 16px text and 44px targets for easier touch input."],
  textarea: ["An editable surface that grows with its container.", "The same editor uses 16px text. Resize back to check that your draft is retained."],
  select: ["A compact trigger opens the options.", "The trigger and options have taller touch targets. Open the menu to compare."],
  "data-table": ["Sortable columns with pagination in one row.", "Pagination becomes two wide controls below the count. Columns remain a scrollable table so no data is hidden."],
  pagination: ["Previous and next include text labels.", "Previous and next use labeled arrow controls to leave room for page numbers."],
};
const deviceIcons = {
  fit: MaximizeIcon,
  desktop: MonitorIcon,
  tablet: TabletIcon,
  phone: SmartphoneIcon,
  custom: MaximizeIcon,
};
/** One browsing context, resized in place. Media queries, visualViewport and
 * top-layer dialogs all see the selected dimensions, including while moving. */
export function ViewportPreview({
  frame,
  onLoad,
  detail,
  componentId,
  onBack,
}: {
  frame: RefObject<HTMLIFrameElement | null>;
  onLoad: () => void;
  detail?: string;
  componentId?: string;
  onBack: () => void;
}) {
  const stage = useRef<HTMLDivElement>(null),
    drag = useRef<{ x: number; width: number } | null>(null);
  const [device, setDevice] = useState<Device>("fit"),
    [width, setWidth] = useState(1024),
    [height, setHeight] = useState(800),
    [available, setAvailable] = useState(1024),
    [measured, setMeasured] = useState(1024),
    [dragging, setDragging] = useState(false);
  const target = !detail || device === "fit" ? available : width;
  const activeBreakpoint =
    [...breakpoints].reverse().find((point) => measured >= point.width)
      ?.label ?? "base";
  useEffect(() => {
    const observer = new ResizeObserver((entries) =>
      setAvailable(Math.max(0, Math.floor(entries[0].contentRect.width) - 2)),
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
    <section
      className="responsive-preview"
      data-detail={!!detail}
      aria-label={detail ? "Component details" : "Component gallery"}
    >
      {detail && (
        <header className="detail-heading">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← All components
          </Button>
          <h1>{detail}</h1>
        </header>
      )}
      {detail && (
        <div className="viewport-controls">
          <div
            className="device-switch"
            role="group"
            aria-label="Preview viewport"
          >
            {presets.map((preset) => (
              <Toggle
                key={preset.id}
                size="sm"
                pressed={device === preset.id}
                onPressedChange={() => {
                  setDevice(preset.id);
                  if (preset.width) setWidth(preset.width);
                  setHeight(preset.height);
                }}
              >
                {(() => {
                  const Icon = deviceIcons[preset.id];
                  return <Icon aria-hidden="true" />;
                })()}
                <span>{preset.label}</span>
              </Toggle>
            ))}
          </div>
          <output className="viewport-size" aria-label="Viewport dimensions">
            {measured} × {height}{" "}
            <Badge variant="outline" className="active-breakpoint">
              {activeBreakpoint}
            </Badge>
          </output>
          <div className="viewport-range">
            <Label>Viewport width</Label>
            <div className="breakpoint-slider">
              <Slider
                aria-label="Preview width"
                getValueText={() =>
                  `${Math.round(target)} pixels, ${activeBreakpoint}`
                }
                min={320}
                max={1600}
                step={1}
                value={[Math.max(320, Math.min(1600, target))]}
                onValueChange={([next]) => custom(next)}
              />
              <div
                className="breakpoint-markers"
                aria-label="Media breakpoints"
              >
                {breakpoints.map((point) => (
                  <Button
                    key={point.label}
                    variant="ghost"
                    size="xs"
                    style={{ left: `${((point.width - 320) / 1280) * 100}%` }}
                    aria-label={`${point.label} breakpoint: ${point.width} pixels`}
                    aria-pressed={Math.round(target) === point.width}
                    title={`min-width: ${point.width}px`}
                    onClick={() => custom(point.width)}
                  >
                    <span>{point.label}</span>
                    <small>{point.width}</small>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {detail && (
        <p className="responsive-behavior" role="status">
          <strong>{measured <= 640 ? "Narrow layout" : "Wide layout"}</strong>
          {responsiveBehavior[componentId ?? ""]?.[measured <= 640 ? 1 : 0] ??
            "Compare wrapping, scrolling and open controls at each width. This preview has no additional breakpoint-specific guide."}
          <small>Width presets resize the live preview; they do not emulate touch hardware. The markers are width references, not guaranteed layout changes.</small>
        </p>
      )}
      <div className="viewport-stage" ref={stage} data-dragging={dragging}>
        <div
          className="viewport-shell"
          style={{ width: !detail || device === "fit" ? "100%" : target + 2 }}
        >
          <iframe
            ref={frame}
            title="Live component previews"
            className="preview-frame"
            src={`${location.pathname}?preview=1`}
            onLoad={onLoad}
            style={{
              height: detail ? height : "max(800px, calc(100dvh - 100px))",
            }}
          />
          {detail && (
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
                      (e.key === "ArrowLeft" ? -1 : 1) *
                        (e.shiftKey ? 100 : 10),
                  );
                }
              }}
            >
              <span />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
