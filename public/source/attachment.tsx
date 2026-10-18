// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "radix-ui";
import { Button } from "./button";
const attachmentVariants = cva(
  "roc-s-7dc46014311f roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-81b198a2db84 roc-s-184ddc11e5f9 roc-s-27ead27a81df roc-s-faa8a23c68f6 roc-s-6ad537f2bbaa roc-s-4f1a55de40bc roc-s-16a9cd6c3710 roc-s-ee73a37f6b8a roc-s-eae178841c68 roc-s-ffc76056b3ba roc-s-2211f122f7ab roc-s-4e40aee410f5 roc-s-de3a9fac636c roc-s-79d229f5dd53",
  {
    variants: {
      size: {
        default:
          "roc-s-074569488cca roc-s-c74ab393b96d roc-s-425931076a99 roc-s-98236ea1afb6 roc-s-cfc256fd857f",
        sm: "roc-s-08f0549eb630 roc-s-3992de70b033 roc-s-c781fe2a72d3 roc-s-cbf1bde027aa roc-s-6da902603cc0",
        xs: "roc-s-70007b876865 roc-s-49abc543ea42 roc-s-3992de70b033 roc-s-8d2a49776e93 roc-s-14ae10de3835 roc-s-c35a8a397faf",
      },
      orientation: {
        horizontal: "roc-s-f0ebff9e366e roc-s-71556df3b421",
        vertical: "roc-s-b29fddfef42c roc-s-302c0d124a94 roc-s-eea4ceb16768",
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
  "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-129d6f9b1e07 roc-s-512f7ceb0b0e roc-s-27ead27a81df roc-s-71556df3b421 roc-s-a503dd374cca roc-s-d5111d0e9f48 roc-s-49abc543ea42 roc-s-87ecb59f2d2d roc-s-957a109f887f roc-s-cbebfa0b3d78 roc-s-ab03ac0040c6 roc-s-e00ba0b0fa5e roc-s-3ace78fc242f roc-s-0c65e27e5f8a roc-s-55ad0d8e7721 roc-s-fc22a1c9e79a roc-s-bcae9d37090c roc-s-eb5ef2dbc2d4 roc-s-34607717f111 roc-s-3866ee69ecc7",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "roc-s-5efd07d899d9 roc-s-cb181f3648de roc-s-e4c0de20f3b2 roc-s-3ef3066f82d9 roc-s-fe2e25edabfb roc-s-ad1690316c60",
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
          "roc-s-81b198a2db84 roc-s-184ddc11e5f9 roc-s-7bd5bab6d7f4 roc-s-bd41d85960e4 roc-s-9d31285888a8",
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
          "roc-s-496aca80e4d8 roc-s-81b198a2db84 roc-s-184ddc11e5f9 roc-s-5a3a4ee420c2 roc-s-daaac3fbf55e roc-s-d54ef7dbea77 roc-s-18c5d963437a",
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
          "roc-s-7afae652585f roc-s-496aca80e4d8 roc-s-184ddc11e5f9 roc-s-5a3a4ee420c2 roc-s-3992de70b033 roc-s-35f35c41d134 roc-s-5df1eee1b27e",
          "roc-s-81b198a2db84",
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
          "roc-s-d2d9e1f13413 roc-s-4e8f0a87a0dc roc-s-222f930b8752 roc-s-27ead27a81df roc-s-71556df3b421 roc-s-6feee9d76f90 roc-s-6a641790bda9 roc-s-0942a004304b roc-s-96eb45262a23",
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
          "roc-s-747355bdc2a2 roc-s-ce13093ad8c9 roc-s-418e44ad4f9e roc-s-b30fc56058b6",
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
          "roc-s-222f930b8752 roc-s-184ddc11e5f9 roc-s-eb3ca07c6bb1 roc-s-25a90a2d78c3 roc-s-78e8e15ae146 roc-s-3ae2dd1c8162 roc-s-7d02e62c543b roc-s-d7db3451d154 roc-s-b40bd2e015fb roc-s-0569931d14e9 roc-s-1fcf28756bb1 roc-s-5ad165dd1d7d roc-s-46e439759a3a",
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
