import { type CSSProperties, type ReactNode } from "react";

const scheme = [
  { name: "Primary", value: "#121316" },
  { name: "Secondary", value: "#2563eb" },
  { name: "Tertiary", value: "#f97316" },
  { name: "Neutral", value: "#71717a" },
];

export function DesignSystem({ children }: { children: ReactNode }) {
  return <div className="token-board token-primitive-board">
    <div className="token-scheme" aria-label="Technical Precision colour scheme">
      <div className="token-label">Technical Precision · colour scheme</div>
      <div className="token-colors">{scheme.map(({ name, value }) => <div key={name} className="token-color" style={{ "--swatch": value, "--swatch-ink": "white" } as CSSProperties}>
        <span className="token-color-label"><strong>{name}</strong><code>{value.toUpperCase()}</code></span>
        <span className="token-color-scale" aria-hidden="true">{[100, 82, 64, 46, 28, 10].map(mix => <i key={mix} style={{ background: `color-mix(in srgb, ${value} ${mix}%, white)` }} />)}</span>
      </div>)}</div>
    </div>
    <div className="design-system-primitives">{children}</div>
  </div>;
}
