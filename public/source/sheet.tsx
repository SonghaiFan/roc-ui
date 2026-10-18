// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
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
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "roc-shadcn",
          cn(
            "roc-s-992a93455c71 roc-s-3eef1ce97dba roc-s-222f930b8752 roc-s-302c0d124a94 roc-s-90fc3ec35a37 roc-s-5b272f3c5076 roc-s-0d4ca75de41c roc-s-70dd37c11434 roc-s-16c2539d9622 roc-s-0cb4489c3645 roc-s-e49515ace633 roc-s-bae1e782f277 roc-s-e093c9dc2cfe",
            side === "right" &&
              "roc-s-eb9e48c5dda9 roc-s-a74c4477017c roc-s-57c930dc1c31 roc-s-179cb7404c4a roc-s-8d940fccb093 roc-s-bddf3012e102 roc-s-783958b1d2bd roc-s-4213d5ddc102",
            side === "left" &&
              "roc-s-eb9e48c5dda9 roc-s-635702706586 roc-s-57c930dc1c31 roc-s-179cb7404c4a roc-s-baf794b99c10 roc-s-5984dbdad10e roc-s-55ef7b573ebd roc-s-4213d5ddc102",
            side === "top" &&
              "roc-s-3ba24c062d55 roc-s-98599e4ee250 roc-s-a66e9985b093 roc-s-bbe39cfb5cc6 roc-s-e2dc8825af51 roc-s-b6d5cf8447e4",
            side === "bottom" &&
              "roc-s-3ba24c062d55 roc-s-30150dd033ab roc-s-a66e9985b093 roc-s-894c3815a57f roc-s-79970ba9f493 roc-s-e2f2e0f3f85c",
            className,
          ),
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            className={cn(
              "roc-shadcn",
              "roc-s-747355bdc2a2 roc-s-83ee6d9ede9d roc-s-830b1d2217ca roc-s-30c08d7acd8f roc-s-edf5f892709c roc-s-bd9fbbe5d14a roc-s-2cdd01663c76 roc-s-8da02faac748 roc-s-0d57d3d656f7 roc-s-9db723027e39 roc-s-c7969e2d6842 roc-s-7ba15cadabe2 roc-s-8d3c1014b967 roc-s-c7d98ce9dd2d",
            )}
          >
            <XIcon className={cn("roc-shadcn", "roc-s-100c22d5776b")} />
            <span className={cn("roc-shadcn", "roc-s-32fb090591d9")}>
              Close
            </span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-302c0d124a94 roc-s-70007b876865 roc-s-99df86594a98",
          className,
        ),
      )}
      {...props}
    />
  );
}
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-930e37ac8b7d roc-s-222f930b8752 roc-s-302c0d124a94 roc-s-074569488cca roc-s-99df86594a98",
          className,
        ),
      )}
      {...props}
    />
  );
}
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "roc-shadcn",
        cn("roc-s-87e86ce38eaf roc-s-957a109f887f", className),
      )}
      {...props}
    />
  );
}
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(
        "roc-shadcn",
        cn("roc-s-c74ab393b96d roc-s-35f35c41d134", className),
      )}
      {...props}
    />
  );
}
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};

import "./sheet.css";
