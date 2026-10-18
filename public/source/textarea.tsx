// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt and upstream provenance.
import * as React from "react";
import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("roc-ui", className)}
      {...props}
    />
  );
}

export { Textarea };

import "./textarea.css";
