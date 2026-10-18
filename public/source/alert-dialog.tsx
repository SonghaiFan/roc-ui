// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { AlertDialog as AlertDialogPrimitive } from "./primitive-alert-dialog";
import { Button } from "./button";
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-fixed roc-u-inset-0 roc-u-z-50 roc-u-bg-black/50 roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:fade-out-0 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:fade-in-0",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AlertDialogContent({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "default" | "sm";
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "roc-shadcn",
          cn(
            "roc-u-group/alert-dialog-content roc-u-fixed roc-u-top-[50%] roc-u-left-[50%] roc-u-z-50 roc-u-grid roc-u-w-full roc-u-max-w-[calc(100%-2rem)] roc-u-translate-x-[-50%] roc-u-translate-y-[-50%] roc-u-gap-4 roc-u-rounded-lg roc-u-border roc-u-bg-background roc-u-p-6 roc-u-shadow-lg roc-u-duration-200 roc-u-data-[size=sm]:max-w-xs roc-u-data-[state=closed]:animate-out roc-u-data-[state=closed]:fade-out-0 roc-u-data-[state=closed]:zoom-out-95 roc-u-data-[state=open]:animate-in roc-u-data-[state=open]:fade-in-0 roc-u-data-[state=open]:zoom-in-95 roc-u-data-[size=default]:sm:max-w-lg",
            className,
          ),
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-grid roc-u-grid-rows-[auto_1fr] roc-u-place-items-center roc-u-gap-1.5 roc-u-text-center roc-u-has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] roc-u-has-data-[slot=alert-dialog-media]:gap-x-6 roc-u-sm:group-data-[size=default]/alert-dialog-content:place-items-start roc-u-sm:group-data-[size=default]/alert-dialog-content:text-left roc-u-sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-flex-col-reverse roc-u-gap-2 roc-u-group-data-[size=sm]/alert-dialog-content:grid roc-u-group-data-[size=sm]/alert-dialog-content:grid-cols-2 roc-u-sm:flex-row roc-u-sm:justify-end",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-text-lg roc-u-font-semibold roc-u-sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "roc-shadcn",
        cn("roc-u-text-sm roc-u-text-muted-foreground", className),
      )}
      {...props}
    />
  );
}
function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-mb-2 roc-u-inline-flex roc-u-size-16 roc-u-items-center roc-u-justify-center roc-u-rounded-md roc-u-bg-muted roc-u-sm:group-data-[size=default]/alert-dialog-content:row-span-2 roc-u-*:[svg:not([class*='size-'])]:size-8",
          className,
        ),
      )}
      {...props}
    />
  );
}
function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={cn("roc-shadcn", cn(className))}
        {...props}
      />
    </Button>
  );
}
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={cn("roc-shadcn", cn(className))}
        {...props}
      />
    </Button>
  );
}
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};

import "./alert-dialog.css";
