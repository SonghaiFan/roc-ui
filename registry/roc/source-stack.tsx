"use client";
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useContinuity } from "./use-continuity";
import { CardPreview } from "./card-preview";
import "./source-stack.css";
import { useControllableState } from "./use-controllable-state";
export interface SourceItem {
  id: string;
  title: string;
  kind: string;
  content: ReactNode;
  color?: string;
}
/** Sources keep one composition through pile, spread and top-layer inspection. */
export interface SourceStackProps {
  items: SourceItem[];
  color?: string;
  duration?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  openLabel?: ReactNode;
  closeLabel?: ReactNode;
}
export function SourceStack({
  items,
  color,
  duration,
  open,
  defaultOpen = false,
  onOpenChange,
  className = "",
  style,
  openLabel = "Unfold",
  closeLabel = "Gather",
}: SourceStackProps) {
  const [spread, setSpread] = useControllableState(
    open,
    defaultOpen,
    onOpenChange,
  );
  const { root, change } = useContinuity(),
    id = useId(),
    toggle = useRef<HTMLButtonElement>(null);
  return (
    <div
      ref={root}
      style={
        {
          "--roc-duration": duration ? `${duration}ms` : undefined,
          ...style,
        } as CSSProperties
      }
      className={`roc-sources ${spread ? "is-spread" : ""} ${className}`}
      onClick={event => { if (spread && (event.target === event.currentTarget || event.target === event.currentTarget.querySelector(".roc-source-items"))) change(() => setSpread(false)); }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && spread) {
          e.stopPropagation();
          change(() => setSpread(false));
          toggle.current?.focus();
        }
      }}
    >
      <button
        type="button"
        ref={toggle}
        className="roc-text-button roc-source-toggle"
        aria-expanded={spread}
        aria-label={typeof openLabel === "string" ? openLabel : "Unfold sources"}
        hidden={spread}
        aria-controls={id}
        onClick={() => change(() => setSpread(!spread))}
      >
        <span className="roc-ui-sr-only">{openLabel}</span>
      </button>
      <div
        id={id}
        className="roc-source-items"
        inert={!spread}
        aria-hidden={!spread}
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            data-roc-item
            className="roc-source"
            style={{
              left: spread
                ? `${items.length <= 1 ? 50 : 16 + (index / (items.length - 1)) * 68}%`
                : "50%",
              top: spread ? 35 : 30 + index * 6,
              transform: `translateX(-50%) rotate(${spread ? 0 : (index - (items.length - 1) / 2) * 7}deg)`,
              zIndex: index + 1,
            }}
          >
            <CardPreview
              label={item.title}
              previewHeight={175}
              compositionWidth={360}
              openLabel="Inspect ↗"
              closeLabel="Return ↙"
              color={
                color
                  ? `color-mix(in srgb, ${color} ${12 + index * 12}%, white)`
                  : item.color
              }
            >
              <span className="roc-eyebrow">{item.kind}</span>
              <h3>{item.title}</h3>
              <div className="roc-source-content">{item.content}</div>
            </CardPreview>
          </article>
        ))}
      </div>
    </div>
  );
}
