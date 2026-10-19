"use client";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import "./preview-link-card.css";
/** Explicit activation works on pointer, keyboard and touch alike. */
export function PreviewLinkCard({ href, title, description }: { href: string; title: string; description: string }) {
  return <Popover><PopoverTrigger asChild><Button variant="link">{title} ↗</Button></PopoverTrigger><PopoverContent className="roc-preview-link-card">
    <strong>{title}</strong><p>{description}</p><a href={href} target="_blank" rel="noreferrer">Open {title} ↗</a>
  </PopoverContent></Popover>;
}
