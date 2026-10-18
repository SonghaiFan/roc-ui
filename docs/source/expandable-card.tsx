"use client";
import { type ReactNode } from "react";
import { CardPreview } from "./card-preview";
import "./roc.css";
export interface ExpandableCardProps { title: string; eyebrow?: string; children: ReactNode; defaultOpen?: boolean; color?: string; /** @deprecated Presentation uses Syuze's physical profiles. */ duration?: number }
/** A first-page preview of the same retained reading composition. */
export function ExpandableCard({ title, eyebrow = "FIELD NOTES", children, defaultOpen = false, color }: ExpandableCardProps) {
  return <div className="roc-expand"><CardPreview label={title} color={color} defaultOpen={defaultOpen} openLabel="Open note ↗" closeLabel="Close note ↙">
    <span className="roc-eyebrow">{eyebrow}</span><h3>{title}</h3>
    <div className="roc-paper-body">{children}</div>
  </CardPreview></div>;
}
