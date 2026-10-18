"use client";
// ROC primitive: sets the reading direction for everything below it.
import * as React from "react";
import { DirectionProvider as BaseProvider } from "@base-ui/react/direction-provider";
import { DirectionContext, useDirectionContext, type Dir } from "./primitive-direction-context";

function DirectionProvider({
  dir,
  children,
}: {
  dir: Dir;
  children?: React.ReactNode;
}) {
  return (
    <DirectionContext.Provider value={dir}>
      <BaseProvider direction={dir}>{children}</BaseProvider>
    </DirectionContext.Provider>
  );
}

/** The direction in effect: the argument, else the provider, else left to right. */
function useDirection(local?: Dir): Dir {
  return useDirectionContext(local) ?? "ltr";
}

export const Direction = { DirectionProvider, useDirection };
