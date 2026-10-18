// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "roc-shadcn",
        "roc-u-relative roc-u-w-full roc-u-overflow-x-auto",
      )}
    >
      <table
        data-slot="table"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-w-full roc-u-caption-bottom roc-u-text-sm",
            className,
          ),
        )}
        {...props}
      />
    </div>
  );
}
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("roc-shadcn", cn("roc-u-[&_tr]:border-b", className))}
      {...props}
    />
  );
}
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("roc-shadcn", cn("roc-u-[&_tr:last-child]:border-0", className))}
      {...props}
    />
  );
}
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-border-t roc-u-bg-muted/50 roc-u-font-medium roc-u-[&>tr]:last:border-b-0",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-border-b roc-u-transition-colors roc-u-hover:bg-muted/50 roc-u-has-aria-expanded:bg-muted/50 roc-u-data-[state=selected]:bg-muted",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-h-10 roc-u-px-2 roc-u-text-left roc-u-align-middle roc-u-font-medium roc-u-whitespace-nowrap roc-u-text-foreground roc-u-[&:has([role=checkbox])]:pr-0 roc-u-[&>[role=checkbox]]:translate-y-[2px]",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-p-2 roc-u-align-middle roc-u-whitespace-nowrap roc-u-[&:has([role=checkbox])]:pr-0 roc-u-[&>[role=checkbox]]:translate-y-[2px]",
          className,
        ),
      )}
      {...props}
    />
  );
}
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-mt-4 roc-u-text-sm roc-u-text-muted-foreground",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

import "./table.css";
