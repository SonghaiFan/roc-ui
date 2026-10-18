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
          "roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-184ddc11e5f9 roc-s-302c0d124a94 roc-s-074569488cca roc-s-c77e591158e6 roc-s-e38a4d9daa63 roc-s-4f4a8e1c0099 roc-s-5846de8b54b1 roc-s-f30331c99a30 roc-s-829f3b09738b roc-s-c93baf97ce1a roc-s-42b38536b564 roc-s-c7a1c97c7c8d",
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
          "roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-81b198a2db84 roc-s-184ddc11e5f9 roc-s-71556df3b421 roc-s-074569488cca roc-s-c74ab393b96d roc-s-35f35c41d134 roc-s-eae178841c68 roc-s-7edc6e83a8a8 roc-s-0683f21b1e6b roc-s-ab4c7e69b7ba roc-s-7812f5060410 roc-s-c89c6805bb54 roc-s-a3c6952473b3",
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
          "roc-s-222f930b8752 roc-s-100c22d5776b roc-s-27ead27a81df roc-s-71556df3b421 roc-s-a503dd374cca roc-s-bcae9d37090c roc-s-eb5ef2dbc2d4 roc-s-d703d695cc41",
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
          "roc-s-184ddc11e5f9 roc-s-5a3a4ee420c2 roc-s-4ec29b929ff2",
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
          "roc-s-27ead27a81df roc-s-4a6125f67a92 roc-s-ba2d0eea2e16",
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
          "roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-184ddc11e5f9 roc-s-302c0d124a94",
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
          "roc-s-b265c436f35d roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-81b198a2db84 roc-s-184ddc11e5f9 roc-s-d2fa8848968d roc-s-71556df3b421 roc-s-19e97f3f40e6 roc-s-3fa8c572949b roc-s-1a5d10977b93 roc-s-35f35c41d134 roc-s-eae178841c68 roc-s-b30fc56058b6 roc-s-4d6720d47806 roc-s-20add1417b2f roc-s-392a26f4c1b0 roc-s-21d6118f588a",
          className,
        ),
      )}
      {...props}
    >
      {children}
      <TraceIcon
        className={cn("roc-shadcn", "roc-s-48a1d34f1a08 roc-s-5196b4b76fe0")}
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
        "roc-s-2d7a81b8ac8e roc-s-184ddc11e5f9 roc-s-d5111d0e9f48 roc-s-3578a3f09fa1 roc-s-10e9f177b8fc roc-s-c754b07be9bc roc-s-b0685045945f",
      )}
      {...props}
    >
      <div
        data-slot="trace-collapsible-content-inner"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-s-f28fea81a5cd roc-s-c6121c8e713a roc-s-32a6587a83f0 roc-s-184ddc11e5f9 roc-s-8d940fccb093 roc-s-1a52da5bc88c roc-s-0c3bdb637654 roc-s-059428494356 roc-s-1eb753eb16e8 roc-s-35f35c41d134",
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
