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
        "roc-s-d2d9e1f13413 roc-s-58d0413dd93c roc-s-b40bd2e015fb",
      )}
    >
      <table
        data-slot="table"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-s-58d0413dd93c roc-s-b6be1c620928 roc-s-c74ab393b96d",
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
      className={cn("roc-shadcn", cn("roc-s-b1a450761a78", className))}
      {...props}
    />
  );
}
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("roc-shadcn", cn("roc-s-67612e93fbe6", className))}
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
          "roc-s-894c3815a57f roc-s-44de6d2f7d5f roc-s-daaac3fbf55e roc-s-9e7bada01c5a",
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
          "roc-s-bbe39cfb5cc6 roc-s-eae178841c68 roc-s-5cbdd1b32f1a roc-s-90cc7594aaef roc-s-e75faccf4b1d",
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
          "roc-s-fdd2f85cad6b roc-s-e7e01cc7f4df roc-s-1a5d10977b93 roc-s-0820fd7510bd roc-s-daaac3fbf55e roc-s-963f6168b7d6 roc-s-957a109f887f roc-s-de10e83be1d4 roc-s-6b348c7e5cae",
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
          "roc-s-b97db4a9f432 roc-s-0820fd7510bd roc-s-963f6168b7d6 roc-s-de10e83be1d4 roc-s-6b348c7e5cae",
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
          "roc-s-dc1d1f5a54cf roc-s-c74ab393b96d roc-s-35f35c41d134",
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
