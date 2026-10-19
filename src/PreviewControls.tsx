import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

const ControlsTarget = createContext<HTMLDivElement | null>(null);
export const PreviewControlsTarget = ControlsTarget.Provider;

export function PreviewControls({ children }: { children: ReactNode }) {
  const target = useContext(ControlsTarget);
  return target ? createPortal(children, target) : null;
}
