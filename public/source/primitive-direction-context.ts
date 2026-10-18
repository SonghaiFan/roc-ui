"use client";
// ROC primitive: the reading direction set by a DirectionProvider, with no dependencies.
import * as React from "react";

export type Dir = "ltr" | "rtl";

export const DirectionContext = React.createContext<Dir | undefined>(undefined);

/** A `dir` prop wins, then the provider; undefined means "use the CSS direction". */
export function useDirectionContext(local?: Dir): Dir | undefined {
  return local ?? React.useContext(DirectionContext);
}
