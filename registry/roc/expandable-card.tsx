"use client";
import { type ReactNode, type CSSProperties } from "react";
import { CardPreview } from "./card-preview";
import "./expandable-card.css";
export interface ExpandableCardProps {
  open?: boolean;
  className?: string;
  style?: CSSProperties;
  onOpenChange?: (open: boolean) => void;
  openLabel?: string;
  closeLabel?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  color?: string;
  /** @deprecated Presentation uses Syuze's physical profiles. */ duration?: number;
}
/** A first-page preview of the same retained reading composition. */
export function ExpandableCard({
  open,
  title,
  eyebrow,
  children,
  defaultOpen = false,
  color,
  className = "",
  style,
  onOpenChange,
  openLabel = "Open preview ↗",
  closeLabel = "Return ↙",
}: ExpandableCardProps) {
  return (
    <div className={`roc-expand ${className}`} style={style}>
      <CardPreview
        open={open}
        label={title}
        color={color}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        openLabel={openLabel}
        closeLabel={closeLabel}
      >
        {eyebrow && <span className="roc-eyebrow">{eyebrow}</span>}
        <h3>{title}</h3>
        <div className="roc-paper-body">{children}</div>
      </CardPreview>
    </div>
  );
}
