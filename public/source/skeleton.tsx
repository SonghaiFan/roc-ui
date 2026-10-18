// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
import type * as React from "react";
import { cn } from "./utils";
/** Reserve the final content footprint. Announce loading once from the host. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("roc-ui", className)}
      {...props}
    />
  );
}
export { Skeleton };

import "./skeleton.css";
