"use client";
// ROC primitive: keep children at a fixed width-to-height ratio.
import * as React from "react";

type RootProps = React.ComponentProps<"div"> & { ratio?: number };

function Root({ ratio = 1, style, children, ...props }: RootProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: String(ratio > 0 ? ratio : 1),
      }}
    >
      <div {...props} style={{ ...style, position: "absolute", inset: 0 }}>
        {children}
      </div>
    </div>
  );
}

export const AspectRatio = { Root };
