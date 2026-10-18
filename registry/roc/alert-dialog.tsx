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
          "roc-s-992a93455c71 roc-s-ce13093ad8c9 roc-s-3eef1ce97dba roc-s-cba3ecce1586 roc-s-0cb4489c3645 roc-s-bb5869ef903b roc-s-bae1e782f277 roc-s-45464a92c1f6",
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
            "roc-s-6f251cb88324 roc-s-992a93455c71 roc-s-b106d8cef296 roc-s-d7e936f862e3 roc-s-3eef1ce97dba roc-s-0f2a693e93e2 roc-s-58d0413dd93c roc-s-ca852e070db7 roc-s-b790580e54ab roc-s-8728d3e02c92 roc-s-90fc3ec35a37 roc-s-49abc543ea42 roc-s-4f1a55de40bc roc-s-5b272f3c5076 roc-s-c432836760e3 roc-s-0d4ca75de41c roc-s-10e9f177b8fc roc-s-4c2ad4dbde51 roc-s-0cb4489c3645 roc-s-bb5869ef903b roc-s-f4cf4be63707 roc-s-bae1e782f277 roc-s-45464a92c1f6 roc-s-9ca352480f25 roc-s-a6360ea2be89",
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
          "roc-s-0f2a693e93e2 roc-s-ffa47a20e6d9 roc-s-4446c26b62a7 roc-s-70007b876865 roc-s-05ab12448317 roc-s-3e74f7f21a0f roc-s-070eebcc4f58 roc-s-dd65da590bfb roc-s-c406108470f8 roc-s-f5e1309ad2eb",
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
          "roc-s-222f930b8752 roc-s-c2c38b387d36 roc-s-074569488cca roc-s-7a68fd2753d6 roc-s-3014d16cc582 roc-s-bd85140e6a7c roc-s-40b618ad2df3",
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
          "roc-s-035bd245837f roc-s-87e86ce38eaf roc-s-04ea8bec9e34",
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
        cn("roc-s-c74ab393b96d roc-s-35f35c41d134", className),
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
          "roc-s-02fd0ea53c0b roc-s-123306850fe1 roc-s-7cf5b58023e6 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-3fa8c572949b roc-s-87ecb59f2d2d roc-s-3654bb6eac3d roc-s-635c19e44a8f",
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
