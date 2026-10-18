// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import {
  XIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";
("use client");
import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cn } from "./utils";
import { Button } from "./button";
const toast = ToastPrimitive.createToastManager();
function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />;
}
function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}
function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-33228ff7d583 roc-s-992a93455c71 roc-s-38b75be6f15a roc-s-ec8003369386 roc-s-3eef1ce97dba roc-s-1752f11474a6 roc-s-fe3dd9b783fd roc-s-6f067cb084a4 roc-s-b30fc56058b6 roc-s-fba1c2b724bd roc-s-b6650f12069f roc-s-89aa1dd466b9 roc-s-867cb2f7c900",
          className,
        ),
      )}
      {...props}
    />
  );
}
function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-e638400d3a78 roc-s-cb20bd519346 roc-s-747355bdc2a2 roc-s-a74c4477017c roc-s-30150dd033ab roc-s-69bb62dcb357 roc-s-58d0413dd93c roc-s-cf404c52763b roc-s-b741b095195e roc-s-4f1a55de40bc roc-s-e593c38256e0 roc-s-5bd2afe89f0b roc-s-0d4ca75de41c roc-s-6340d0b91c62 roc-s-b30fc56058b6 roc-s-78905c9e865c roc-s-b906a32b31ee roc-s-365a4654f7b1 roc-s-392a26f4c1b0",
          "roc-s-de4869e5601e roc-s-7219b97921cd roc-s-33f18f81a3e5 roc-s-2a55a8480633 roc-s-568741366a9d roc-s-d95632988c38",
          "roc-s-6a8ae886c4ee roc-s-70f193b94a55 roc-s-6e1ffa19619f",
          "roc-s-b1cf80175a45 roc-s-fb7546c57e67 roc-s-3bb9d5b6c45d roc-s-65dcbd8dd4a3 roc-s-5dadadb9ebc2 roc-s-5dc0c502c15b",
          "roc-s-5d2fbf18a63b roc-s-fd74f8193e01",
          "roc-s-ecbcfc40de36 roc-s-10da064a4fd5",
          "roc-s-37a43ab6b614",
          "roc-s-1c6ac83dfcfd",
          "roc-s-dcd64e2e7222",
          "roc-s-18cdb1531fe7",
          "roc-s-c3d730f33e6b",
          "roc-s-f595428d08e4",
          "roc-s-3dc300866b5d",
          "roc-s-e80283c1c3ad",
          "roc-s-524d021276bc",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-57c930dc1c31 roc-s-71556df3b421 roc-s-d7db3451d154 roc-s-d5111d0e9f48 roc-s-99df86594a98 roc-s-2cdd01663c76 roc-s-75c4fbfdedac roc-s-7afa4c63bbd8 roc-s-360c121a10de roc-s-26cacc22a312",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "roc-shadcn",
        cn("roc-s-c74ab393b96d roc-s-daaac3fbf55e", className),
      )}
      {...props}
    />
  );
}
function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn(
        "roc-shadcn",
        cn("roc-s-c74ab393b96d roc-s-35f35c41d134", className),
      )}
      {...props}
    />
  );
}
function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("roc-shadcn", cn("roc-s-27ead27a81df", className))}
      {...props}
    />
  );
}
function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-d2d9e1f13413 roc-s-27ead27a81df roc-s-35f35c41d134 roc-s-b1cf80175a45 roc-s-7744ea79f26f roc-s-5dc0c502c15b roc-s-4d6720d47806",
          className,
        ),
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}
function ToastIcon({ type }: { type: string | undefined }) {
  let icon: React.ReactNode = null;
  if (type === "success") {
    icon = <CircleCheckIcon aria-hidden="true" />;
  }
  if (type === "info") {
    icon = <InfoIcon aria-hidden="true" />;
  }
  if (type === "warning") {
    icon = <TriangleAlertIcon aria-hidden="true" />;
  }
  if (type === "error") {
    icon = (
      <OctagonXIcon
        className={cn("roc-shadcn", "roc-s-887b9502d5c7")}
        aria-hidden="true"
      />
    );
  }
  if (type === "loading") {
    icon = (
      <Loader2Icon
        className={cn("roc-shadcn", "roc-s-2c14b55d77e6")}
        aria-hidden="true"
      />
    );
  }
  if (!icon) {
    return null;
  }
  return (
    <span
      data-slot="toast-icon"
      className={cn(
        "roc-shadcn",
        "roc-s-27ead27a81df roc-s-bcae9d37090c roc-s-eb5ef2dbc2d4",
      )}
    >
      {icon}
    </span>
  );
}
function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div
          className={cn(
            "roc-shadcn",
            "roc-s-222f930b8752 roc-s-184ddc11e5f9 roc-s-7bd5bab6d7f4 roc-s-302c0d124a94 roc-s-19e97f3f40e6",
          )}
        >
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}
function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}
const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;
export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
};

import "./toast.css";
