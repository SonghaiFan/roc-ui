// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "./primitive-slot";
import { Button } from "./button";
const attachmentVariants = cva(
  "roc-u-group/attachment roc-u-relative roc-u-flex roc-u-w-fit roc-u-max-w-full roc-u-min-w-0 roc-u-shrink-0 roc-u-flex-wrap roc-u-rounded-xl roc-u-border roc-u-bg-card roc-u-text-card-foreground roc-u-transition-colors roc-u-focus-within:ring-1 roc-u-focus-within:ring-ring/50 roc-u-has-[>a,>button]:hover:bg-muted/50 roc-u-data-[state=error]:border-destructive/30 roc-u-data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default:
          "roc-u-gap-2 roc-u-text-sm roc-u-has-data-[slot=attachment-content]:px-2.5 roc-u-has-data-[slot=attachment-content]:py-2 roc-u-has-data-[slot=attachment-media]:p-2",
        sm: "roc-u-gap-2.5 roc-u-text-xs roc-u-has-data-[slot=attachment-content]:px-2 roc-u-has-data-[slot=attachment-content]:py-1.5 roc-u-has-data-[slot=attachment-media]:p-1.5",
        xs: "roc-u-gap-1.5 roc-u-rounded-lg roc-u-text-xs roc-u-has-data-[slot=attachment-content]:px-1.5 roc-u-has-data-[slot=attachment-content]:py-1 roc-u-has-data-[slot=attachment-media]:p-1",
      },
      orientation: {
        horizontal: "roc-u-min-w-40 roc-u-items-center",
        vertical: "roc-u-w-24 roc-u-flex-col roc-u-has-data-[slot=attachment-content]:w-30",
      },
    },
  },
);
function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done";
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(
        "roc-shadcn",
        cn(attachmentVariants({ size, orientation }), className),
      )}
      {...props}
    />
  );
}
const attachmentMediaVariants = cva(
  "roc-u-relative roc-u-flex roc-u-aspect-square roc-u-w-10 roc-u-shrink-0 roc-u-items-center roc-u-justify-center roc-u-overflow-hidden roc-u-rounded-lg roc-u-bg-muted roc-u-text-foreground roc-u-group-data-[orientation=vertical]/attachment:w-full roc-u-group-data-[size=sm]/attachment:w-8 roc-u-group-data-[size=xs]/attachment:w-7 roc-u-group-data-[size=xs]/attachment:rounded-md roc-u-group-data-[state=error]/attachment:bg-destructive/10 roc-u-group-data-[state=error]/attachment:text-destructive roc-u-group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! roc-u-[&_svg]:pointer-events-none roc-u-[&_svg:not([class*='size-'])]:size-4 roc-u-group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 roc-u-group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "roc-u-opacity-60 roc-u-group-data-[state=done]/attachment:opacity-100 roc-u-group-data-[state=idle]/attachment:opacity-100 roc-u-*:[img]:aspect-square roc-u-*:[img]:w-full roc-u-*:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
);
function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(attachmentMediaVariants({ variant }), className),
      )}
      {...props}
    />
  );
}
function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-max-w-full roc-u-min-w-0 roc-u-flex-1 roc-u-leading-tight roc-u-group-data-[orientation=vertical]/attachment:px-1",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-block roc-u-max-w-full roc-u-min-w-0 roc-u-truncate roc-u-font-medium roc-u-group-data-[state=processing]/attachment:shimmer roc-u-group-data-[state=uploading]/attachment:shimmer",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-mt-0.5 roc-u-block roc-u-min-w-0 roc-u-truncate roc-u-text-xs roc-u-text-muted-foreground roc-u-group-data-[state=error]/attachment:text-destructive/80",
          "roc-u-max-w-full",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-z-20 roc-u-flex roc-u-shrink-0 roc-u-items-center roc-u-group-data-[orientation=vertical]/attachment:absolute roc-u-group-data-[orientation=vertical]/attachment:top-3 roc-u-group-data-[orientation=vertical]/attachment:right-3 roc-u-group-data-[orientation=vertical]/attachment:gap-1",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn("roc-shadcn", cn(className))}
      {...props}
    />
  );
}
function AttachmentTrigger({
  className,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="attachment-trigger"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-absolute roc-u-inset-0 roc-u-z-10 roc-u-outline-none",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-min-w-0 roc-u-scroll-fade-x roc-u-snap-x roc-u-snap-mandatory roc-u-scroll-px-1 roc-u-scrollbar-none roc-u-gap-3 roc-u-overflow-x-auto roc-u-overscroll-x-contain roc-u-py-1 roc-u-*:data-[slot=attachment]:flex-none roc-u-*:data-[slot=attachment]:snap-start",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
};

import "./attachment.css";
