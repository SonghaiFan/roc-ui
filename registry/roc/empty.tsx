// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-184ddc11e5f9 roc-s-7bd5bab6d7f4 roc-s-302c0d124a94 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-8c7e0067a9a5 roc-s-49abc543ea42 roc-s-8450eb0f1857 roc-s-c432836760e3 roc-s-05ab12448317 roc-s-f032143bc1c9 roc-s-1fc5f6c75526",
          className,
        ),
      )}
      {...props}
    />
  );
}
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-6f067cb084a4 roc-s-302c0d124a94 roc-s-71556df3b421 roc-s-074569488cca roc-s-05ab12448317",
          className,
        ),
      )}
      {...props}
    />
  );
}
const emptyMediaVariants = cva(
  "roc-s-02fd0ea53c0b roc-s-222f930b8752 roc-s-27ead27a81df roc-s-71556df3b421 roc-s-a503dd374cca roc-s-bcae9d37090c roc-s-040e748a3fa0",
  {
    variants: {
      variant: {
        default: "roc-s-8fca9236d191",
        icon: "roc-s-222f930b8752 roc-s-d0a383a9c24f roc-s-27ead27a81df roc-s-71556df3b421 roc-s-a503dd374cca roc-s-49abc543ea42 roc-s-87ecb59f2d2d roc-s-957a109f887f roc-s-144c5576b3c2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(emptyMediaVariants({ variant, className })),
      )}
      {...props}
    />
  );
}
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-035bd245837f roc-s-daaac3fbf55e roc-s-70250f0caadd",
          className,
        ),
      )}
      {...props}
    />
  );
}
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-7f47e6d3ec0f roc-s-35f35c41d134 roc-s-e1bd2eaca11c roc-s-30f54d824d9e roc-s-e8926eea1512",
          className,
        ),
      )}
      {...props}
    />
  );
}
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-6f067cb084a4 roc-s-184ddc11e5f9 roc-s-302c0d124a94 roc-s-71556df3b421 roc-s-90fc3ec35a37 roc-s-c74ab393b96d roc-s-f032143bc1c9",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};

import "./empty.css";
