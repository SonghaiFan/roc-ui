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
import { Toast as ToastPrimitive } from "@animate-ui/react/primitives/base-ui/toast";
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
          "roc-u-pointer-events-none roc-u-fixed roc-u-inset-x-4 roc-u-bottom-4 roc-u-z-50 roc-u-mx-auto roc-u-w-auto roc-u-max-w-sm roc-u-outline-none roc-u-sm:right-4 roc-u-sm:left-auto roc-u-sm:mx-0 roc-u-sm:w-full",
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
        data-roc-motion="animate-ui"
      data-slot="toast"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/toast roc-u-pointer-events-auto roc-u-absolute roc-u-right-0 roc-u-bottom-0 roc-u-z-[calc(1000-var(--toast-index))] roc-u-w-full roc-u-origin-bottom roc-u-rounded-2xl roc-u-border roc-u-bg-popover roc-u-text-popover-foreground roc-u-shadow-lg roc-u-will-change-transform roc-u-outline-none roc-u-select-none roc-u-focus-visible:border-ring roc-u-focus-visible:ring-[3px] roc-u-focus-visible:ring-ring/50",
          "roc-u-[--gap:0.75rem] roc-u-[--height:var(--toast-frontmost-height,var(--toast-height))] roc-u-[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] roc-u-[--peek:0.75rem] roc-u-[--scale:calc(max(0,1-(var(--toast-index)*0.1)))] roc-u-[--shrink:calc(1-var(--scale))]",
          "roc-u-h-(--height) roc-u-[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] roc-u-[transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
          "roc-u-after:absolute roc-u-after:top-full roc-u-after:left-0 roc-u-after:h-[calc(var(--gap)+1px)] roc-u-after:w-full roc-u-after:content-['']",
          "roc-u-data-expanded:h-(--toast-height) roc-u-data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
          "roc-u-data-limited:opacity-0 roc-u-data-starting-style:[transform:translateY(150%)]",
          "roc-u-[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
          "roc-u-data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
          "roc-u-data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
          "roc-u-data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
          "roc-u-data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
          "roc-u-data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
          "roc-u-data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
          "roc-u-data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
          "roc-u-data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
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
          "roc-u-flex roc-u-h-full roc-u-items-center roc-u-gap-3 roc-u-overflow-hidden roc-u-p-4 roc-u-transition-opacity roc-u-duration-250 roc-u-ease-[cubic-bezier(0.22,1,0.36,1)] roc-u-data-behind:opacity-0 roc-u-data-expanded:opacity-100",
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
        cn("roc-u-text-sm roc-u-font-medium", className),
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
        cn("roc-u-text-sm roc-u-text-muted-foreground", className),
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
      className={cn("roc-shadcn", cn("roc-u-shrink-0", className))}
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
          "roc-u-relative roc-u-shrink-0 roc-u-text-muted-foreground roc-u-after:absolute roc-u-after:-inset-2 roc-u-after:content-[''] roc-u-hover:text-foreground",
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
        className={cn("roc-shadcn", "roc-u-text-destructive")}
        aria-hidden="true"
      />
    );
  }
  if (type === "loading") {
    icon = (
      <Loader2Icon
        className={cn("roc-shadcn", "roc-u-animate-spin")}
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
        "roc-u-shrink-0 roc-u-[&_svg]:pointer-events-none roc-u-[&_svg:not([class*='size-'])]:size-4",
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
            "roc-u-flex roc-u-min-w-0 roc-u-flex-1 roc-u-flex-col roc-u-gap-1",
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
