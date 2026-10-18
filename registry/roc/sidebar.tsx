// Adapted from shadcn/ui (MIT). ROC keeps one inline sidebar across widths.
"use client";
import * as React from "react";
import { Slot } from "radix-ui";
import { PanelLeft } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "./utils";
import "./sidebar.css";
type SidebarState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};
const Context = React.createContext<SidebarState | null>(null);
export function useSidebar() {
  const value = React.useContext(Context);
  if (!value) throw new Error("Sidebar requires SidebarProvider");
  return value;
}
export function SidebarProvider({
  open: controlled,
  defaultOpen = true,
  onOpenChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
}) {
  const [local, setLocal] = React.useState(defaultOpen);
  const open = controlled ?? local;
  const setOpen = (value: boolean) => {
    if (controlled === undefined) setLocal(value);
    onOpenChange?.(value);
  };
  return (
    <Context.Provider
      value={{ open, setOpen, toggleSidebar: () => setOpen(!open) }}
    >
      <div
        className={cn("roc-ui roc-sidebar-host", className)}
        data-state={open ? "expanded" : "collapsed"}
        {...props}
      >
        {children}
      </div>
    </Context.Provider>
  );
}
export function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"aside">) {
  const { open } = useSidebar();
  return (
    <aside
      {...props}
      className={cn("roc-sidebar", className)}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="roc-sidebar-inner">{children}</div>
    </aside>
  );
}
export function SidebarTrigger({
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, open } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle sidebar"
      aria-expanded={open}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) toggleSidebar();
      }}
    >
      <PanelLeft />
    </Button>
  );
}
export function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("roc-sidebar-inset", className)} {...props} />;
}
export function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("roc-sidebar-header", className)} {...props} />;
}
export const SidebarFooter = SidebarHeader;
export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return <nav className={cn("roc-sidebar-content", className)} {...props} />;
}
export function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("roc-sidebar-group", className)} {...props} />;
}
export function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("roc-sidebar-label", className)} {...props} />;
}
export function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return <ul className={cn("roc-sidebar-menu", className)} {...props} />;
}
export function SidebarMenuItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}
export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : "button"}
      aria-current={isActive ? "page" : undefined}
      className={cn("roc-sidebar-link", className)}
      {...props}
    />
  );
}
export const SidebarInput = Input;
