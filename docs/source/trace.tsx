// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { ChevronRightIcon } from "lucide-react";
import * as React from "react";
import { cn } from "./utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="trace"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-w-full roc-u-min-w-0 roc-u-flex-col roc-u-gap-2 roc-u-*:has-[>[data-slot=trace-line]]:flex roc-u-*:has-[>[data-slot=trace-line]]:w-fit roc-u-*:has-[>[data-slot=trace-line]]:max-w-full roc-u-*:has-[>[data-slot=trace-line]]:min-w-0 roc-u-*:has-[>[data-slot=trace-line]]:rounded-md roc-u-*:has-[>[data-slot=trace-line]]:text-left roc-u-*:has-[>[data-slot=trace-line]]:outline-none roc-u-*:has-[>[data-slot=trace-line]]:focus-visible:ring-3 roc-u-*:has-[>[data-slot=trace-line]]:focus-visible:ring-ring/50",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TraceLine({
  className,
  status,
  ...props
}: React.ComponentProps<"span"> & {
  status?: "running" | "error" | "pending";
}) {
  return (
    <span
      data-slot="trace-line"
      data-status={status}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-w-fit roc-u-max-w-full roc-u-min-w-0 roc-u-items-center roc-u-gap-2 roc-u-text-sm roc-u-text-muted-foreground roc-u-transition-colors roc-u-in-[a,button]:cursor-pointer roc-u-in-[a:hover,button:hover]:text-foreground roc-u-data-[status=error]:text-destructive roc-u-data-[status=error]:in-[a:hover,button:hover]:text-destructive roc-u-data-[status=pending]:opacity-60 roc-u-data-[status=running]:*:data-[slot=trace-title]:shimmer",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TraceIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-icon"
      aria-hidden="true"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-size-4 roc-u-shrink-0 roc-u-items-center roc-u-justify-center roc-u-[&_svg]:pointer-events-none roc-u-[&_svg:not([class*='size-'])]:size-4 roc-u-[[data-slot=trace-title]~&]:-ml-1",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-title"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-min-w-0 roc-u-truncate roc-u-motion-reduce:shimmer-none",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TraceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-description"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-shrink-0 roc-u-text-muted-foreground/70 roc-u-tabular-nums",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TraceCollapsible({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible>, "open"> &
  (
    | {
        open?: undefined;
      }
    | {
        open: boolean;
        onOpenChange: NonNullable<
          React.ComponentProps<typeof Collapsible>["onOpenChange"]
        >;
      }
  )) {
  return (
    <Collapsible
      data-slot="trace-collapsible"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-w-full roc-u-min-w-0 roc-u-flex-col",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TraceCollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger>) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/trace-collapsible-trigger roc-u-flex roc-u-w-fit roc-u-max-w-full roc-u-min-w-0 roc-u-cursor-pointer roc-u-items-center roc-u-gap-1 roc-u-rounded-md roc-u-text-left roc-u-text-muted-foreground roc-u-transition-colors roc-u-outline-none roc-u-hover:text-foreground roc-u-focus-visible:ring-3 roc-u-focus-visible:ring-ring/50 roc-u-has-[[data-status=error]]:text-destructive",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <TraceIcon
        className={cn("roc-shadcn", "roc-u-transition-transform roc-u-group-aria-expanded/trace-collapsible-trigger:rotate-90")}
      >
        <ChevronRightIcon />
      </TraceIcon>
    </CollapsibleTrigger>
  );
}
function TraceCollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      className={cn(
        "roc-shadcn",
        "roc-u-h-(--collapsible-panel-height) roc-u-min-w-0 roc-u-overflow-hidden roc-u-transition-[height] roc-u-duration-200 roc-u-data-ending-style:h-0 roc-u-data-starting-style:h-0",
      )}
      {...props}
    >
      <div
        data-slot="trace-collapsible-content-inner"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-mt-2 roc-u-mb-1 roc-u-ml-[calc(--spacing(2)-1px)] roc-u-min-w-0 roc-u-border-l roc-u-pr-1 roc-u-pl-4 roc-u-leading-relaxed roc-u-wrap-break-word roc-u-text-muted-foreground",
            className,
          ),
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}
export {
  Trace,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
};

import "./trace.css";
