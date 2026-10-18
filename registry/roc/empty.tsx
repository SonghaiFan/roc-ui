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
          "roc-u-flex roc-u-min-w-0 roc-u-flex-1 roc-u-flex-col roc-u-items-center roc-u-justify-center roc-u-gap-6 roc-u-rounded-lg roc-u-border-dashed roc-u-p-6 roc-u-text-center roc-u-text-balance roc-u-md:p-12",
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
          "roc-u-flex roc-u-max-w-sm roc-u-flex-col roc-u-items-center roc-u-gap-2 roc-u-text-center",
          className,
        ),
      )}
      {...props}
    />
  );
}
const emptyMediaVariants = cva(
  "roc-u-mb-2 roc-u-flex roc-u-shrink-0 roc-u-items-center roc-u-justify-center roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "roc-u-bg-transparent",
        icon: "roc-u-flex roc-u-size-10 roc-u-shrink-0 roc-u-items-center roc-u-justify-center roc-u-rounded-lg roc-u-bg-muted roc-u-text-foreground roc-u-[&_svg:not([class*='size-'])]:size-6",
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
          "roc-u-text-lg roc-u-font-medium roc-u-tracking-tight",
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
          "roc-u-text-sm/relaxed roc-u-text-muted-foreground roc-u-[&>a]:underline roc-u-[&>a]:underline-offset-4 roc-u-[&>a:hover]:text-primary",
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
          "roc-u-flex roc-u-w-full roc-u-max-w-sm roc-u-min-w-0 roc-u-flex-col roc-u-items-center roc-u-gap-4 roc-u-text-sm roc-u-text-balance",
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
