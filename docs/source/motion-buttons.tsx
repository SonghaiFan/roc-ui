"use client";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "./button";
import { CountingNumber } from "./counting-number";
import { cn } from "./utils";
import "./motion-buttons.css";

type ButtonProps = ComponentProps<typeof Button>;
export function CopyButton({ text, children = "Copy", ...props }: ButtonProps & { text: string }) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <span className="roc-copy-button"><Button {...props} onClick={async e => {
    props.onClick?.(e); if (e.defaultPrevented) return;
    try { await navigator.clipboard.writeText(text); setStatus("Copied"); }
    catch { setStatus("Copy unavailable"); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 2000);
  }}>{children}</Button><span className="roc-copy-feedback" role="status">{status}</span></span>;
}
export function IconButton({ icon, label, ...props }: Omit<ButtonProps, "children" | "aria-label"> & { icon: ReactNode; label: string }) {
  return <Button variant="outline" size="icon" {...props} aria-label={label} title={label}><span aria-hidden="true">{icon}</span></Button>;
}
export function FlipButton({ children, back, className, ...props }: ButtonProps & { back: ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return <Button {...props} className={cn("roc-flip-button", className)} aria-pressed={flipped} onClick={e => { props.onClick?.(e); if (!e.defaultPrevented) setFlipped(!flipped); }}><span data-flipped={flipped}><span aria-hidden={flipped}>{children}</span><span aria-hidden={!flipped}>{back}</span></span></Button>;
}
export function LiquidButton({ className, ...props }: ButtonProps) { return <Button {...props} className={cn("roc-liquid-button", className)} />; }
export function RippleButton({ className, children, ...props }: ButtonProps) {
  const [pulse, setPulse] = useState(0);
  return <Button {...props} className={cn("roc-ripple-button", className)} onClick={e => { props.onClick?.(e); if (!e.defaultPrevented) setPulse(n => n + 1); }}>{children}{pulse > 0 && <span key={pulse} aria-hidden="true" className="roc-button-ripple" />}</Button>;
}
export function ThemeTogglerButton({ dark, onDarkChange, ...props }: Omit<ButtonProps, "children"> & { dark: boolean; onDarkChange: (dark: boolean) => void }) {
  return <Button variant="outline" {...props} aria-pressed={dark} aria-label={dark ? "Use light appearance" : "Use dark appearance"} onClick={e => { props.onClick?.(e); if (!e.defaultPrevented) onDarkChange(!dark); }}><span aria-hidden="true">{dark ? "☾" : "☀"}</span><span>{dark ? "Dark" : "Light"}</span></Button>;
}
export function GithubStars({ count, label = "Stars" }: { count: number; label?: string }) { return <span className="roc-ui roc-github-stars"><span aria-hidden="true">☆</span><CountingNumber value={count} /><span>{label}</span></span>; }
export function GithubStarsButton({ count, href, children = "View repository" }: { count: number; href: string; children?: ReactNode }) {
  return <Button variant="outline" asChild><a href={href} target="_blank" rel="noreferrer">{children}<GithubStars count={count} label="" /></a></Button>;
}
