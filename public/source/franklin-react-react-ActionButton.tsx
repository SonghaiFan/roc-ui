// Extracted from Franklin Board React worktree efca662 (MIT).
import type { ButtonHTMLAttributes } from "react";
const paths = {
  space: "M14 3h7v7 M21 3l-11 11 M10 3H3v18h18v-7",
  image: 'M3 4h18v16H3z M3 16l6-6 5 4 3-3 4 5 M7 7h1',
  duplicate: 'M8 3h12v15H8z M4 7v14h12',
  grid: 'M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h6v6h-6z',
  delete: 'M3 6h18 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
  back: 'M14 5l-7 7 7 7',
  corners: 'M4 10V4h6 M14 4h6v6 M20 14v6h-6 M10 20H4v-6',
  stack: 'M3 7l9-4 9 4-9 4z M3 12l9 4 9-4 M3 17l9 4 9-4',
  unstack: 'M3 3h8v8H3z M13 13h8v8h-8z M16 3l5 5 M21 3l-5 5',
  folder: 'M3 7V4h7l3 3h8v13H3z',
  up: 'M12 20V4 M5 11l7-7 7 7',
  undo: 'M8 5l-5 5 5 5 M3 10h10a6 6 0 0 1 0 12',
  redo: 'M16 5l5 5-5 5 M21 10H11a6 6 0 0 0 0 12',
};
export function ActionButton({ icon, label, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: keyof typeof paths; label: string }) {
  return <button {...props} type="button" className={`fboard-action-icon ${props.className ?? ""}`} aria-label={label} title={label}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[icon]} /></svg></button>;
}
