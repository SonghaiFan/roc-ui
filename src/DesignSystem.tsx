import { useState, type CSSProperties } from "react";
import { ArrowUpRightIcon, CheckIcon, HomeIcon, SearchIcon, UserRoundIcon } from "lucide-react";
import { Button } from "../registry/roc/button";
import { Input } from "../registry/roc/input";
import { Progress } from "../registry/roc/progress";
import { palette, radiusPresets, spacingScale, type AccentName } from "./settings";

export function DesignSystem({ color, radius, font, onColor, onRadius, onFont }: {
  color: AccentName; radius: number; font: string;
  onColor: (value: AccentName) => void; onRadius: (value: number) => void; onFont: (value: string) => void;
}) {
  const [destination, setDestination] = useState("Home");
  const [saved, setSaved] = useState(false);
  return <div className="roc-ui token-board" aria-label="Shared design tokens">
    <div className="token-colors">
      {Object.entries(palette).map(([name, value]) => <button key={name} className="token-color" aria-label={`Use ${name} token`} aria-pressed={name === color} onClick={() => onColor(name as AccentName)} style={{ "--swatch": value, "--swatch-ink": name === "white" || name === "yellow" ? "#252525" : "white" } as CSSProperties}>
        <span className="token-color-label"><strong>{name}</strong><code>{value.toUpperCase()}</code>{name === color && <CheckIcon size={12} aria-hidden="true" />}</span>
        <span className="token-color-scale" aria-hidden="true">{[100, 82, 64, 46, 28, 10].map(mix => <i key={mix} style={{ background: `color-mix(in srgb, ${value} ${mix}%, white)` }} />)}</span>
      </button>)}
      <p className="token-note">Accent · foreground · surface · line</p>
    </div>
    <div className="token-type-column">
      <div className="token-tile token-type"><div className="token-label"><span>Heading</span><button onClick={() => onFont(font === "System" ? "Serif" : "System")} aria-label="Change token typeface">{font} <ArrowUpRightIcon size={11} aria-hidden="true" /></button></div><div className="token-aa">Aa</div><code>--roc-font-heading</code></div>
      <div className="token-tile token-type"><div className="token-label"><span>Body & controls</span><span>{font}</span></div><div className="token-body-sample">Objects keep<br />their place.</div><code>--roc-font-body</code></div>
      <div className="token-tile token-type token-mono"><div className="token-label"><span>Label & code</span><span>Mono</span></div><div className="token-aa">Aa</div><code>--roc-font-mono</code></div>
    </div>
    <div className="token-control-column">
      <div className="token-tile"><div className="token-label"><span>Buttons</span><span>Shared defaults</span></div><div className="token-button-grid"><Button onClick={() => setSaved(!saved)}>{saved ? "Saved" : "Primary"}</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outlined</Button><Button variant="ghost">Ghost</Button></div><p className="token-note">One typeface. One control rhythm.</p></div>
      <div className="token-tile"><div className="token-label"><span>Feedback</span><span>Accent & line</span></div><div className="token-progress"><Progress value={70} aria-label="Token progress at 70 percent" /><Progress value={45} aria-label="Token progress at 45 percent" /><Progress value={90} aria-label="Token progress at 90 percent" /></div><code>--roc-accent / --roc-line</code></div>
      <div className="token-tile"><div className="token-label"><span>Spacing</span><span>4 px rhythm</span></div><div className="token-spacing">{spacingScale.map(value => <div key={value}><span style={{ height: value }} /><code>{value}</code></div>)}</div><code>--roc-space-1 … --roc-space-8</code></div>
    </div>
    <div className="token-detail-column">
      <div className="token-tile"><div className="token-label"><span>Inputs</span><span>Same control tokens</span></div><label className="token-search"><SearchIcon size={14} aria-hidden="true" /><Input aria-label="Design token input" placeholder="Try an input…" /></label><div className="token-navigation" role="group" aria-label="Token navigation example">{[{ name: "Home", Icon: HomeIcon }, { name: "Search", Icon: SearchIcon }, { name: "Profile", Icon: UserRoundIcon }].map(({ name, Icon }) => <Button key={name} variant={destination === name ? "default" : "ghost"} size="icon-sm" aria-label={name} aria-pressed={destination === name} onClick={() => setDestination(name)}><Icon aria-hidden="true" /></Button>)}</div></div>
      <div className="token-tile token-radii"><div className="token-label"><span>Corners</span><span>{radius} px</span></div><div className="token-radius-options">{radiusPresets.map(option => <button key={option.value} aria-label={`${option.label} radius token`} aria-pressed={radius === Number(option.value)} onClick={() => onRadius(Number(option.value))}><span style={{ borderRadius: Number(option.value) }} /><code>{option.value}</code></button>)}</div><code>--roc-radius</code></div>
      <div className="token-tile token-composition"><div className="token-label"><span>Applied together</span><span>Live preview</span></div><div className="token-mini-surface"><span className="token-mini-dot" /><div><strong>A single visual language</strong><p>Colour, type, corners and space.</p></div><Button variant="ghost" size="icon-sm" aria-label="Mark token example saved" onClick={() => setSaved(!saved)}><CheckIcon aria-hidden="true" /></Button></div></div>
    </div>
  </div>;
}
