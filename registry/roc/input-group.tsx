// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-5788e917fbe5 roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-71556df3b421 roc-s-3fa8c572949b roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-7de07d413c13 roc-s-4a85c59e17d7 roc-s-b30fc56058b6 roc-s-9daa2369a41b",
          "roc-s-539ae144f076 roc-s-184ddc11e5f9 roc-s-f3f0724decc6",
          "roc-s-f25292597409",
          "roc-s-5e0ac88fef94",
          "roc-s-715ee4bb5283 roc-s-6d8515239cb7 roc-s-53bbb9df1046",
          "roc-s-f10ad9f740e0 roc-s-62406c48a8a9 roc-s-4339a1685853",
          "roc-s-11b8d8efea69 roc-s-e13ec8b0a083 roc-s-3afc1f2f1b05",
          "roc-s-59c94be4e394 roc-s-d51d614b77a9 roc-s-7be5f41c272b",
          className,
        ),
      )}
      {...props}
    />
  );
}
const inputGroupAddonVariants = cva(
  "roc-s-222f930b8752 roc-s-a66e9985b093 roc-s-1252913b5592 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-074569488cca roc-s-a8c1dfb1d4ef roc-s-c74ab393b96d roc-s-daaac3fbf55e roc-s-35f35c41d134 roc-s-78905c9e865c roc-s-157f30958246 roc-s-630ee4b94ed4 roc-s-3d0d8ecf9bcb",
  {
    variants: {
      align: {
        "inline-start":
          "roc-s-6de69a17604d roc-s-b20bbe8088fe roc-s-65c5d3c1e1d3 roc-s-7aa9d696c37d",
        "inline-end":
          "roc-s-922b168f4b88 roc-s-dd9f1ecfb256 roc-s-bbecdc7798bc roc-s-647dff1fd78c",
        "block-start":
          "roc-s-6de69a17604d roc-s-58d0413dd93c roc-s-c62ec162662e roc-s-0f9e6672913a roc-s-0a702d97ed7d roc-s-15bd882bcea7 roc-s-2922e7dd5610",
        "block-end":
          "roc-s-922b168f4b88 roc-s-58d0413dd93c roc-s-c62ec162662e roc-s-0f9e6672913a roc-s-17b03732cf78 roc-s-d8dae959ce33 roc-s-20aafc100433",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);
function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "roc-shadcn",
        cn(inputGroupAddonVariants({ align }), className),
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}
const inputGroupButtonVariants = cva(
  "roc-s-222f930b8752 roc-s-71556df3b421 roc-s-074569488cca roc-s-c74ab393b96d roc-s-89c3006b2722",
  {
    variants: {
      size: {
        xs: "roc-s-ce1945804664 roc-s-19e97f3f40e6 roc-s-1ccebaa2ad91 roc-s-e7e01cc7f4df roc-s-36a5a94dc738 roc-s-4fe4c85fdcab",
        sm: "roc-s-1fb07b38c63b roc-s-70007b876865 roc-s-3fa8c572949b roc-s-588daa1a9891 roc-s-3b01ee05b16d",
        "icon-xs":
          "roc-s-0712570dcc9f roc-s-1ccebaa2ad91 roc-s-04760bcd507f roc-s-febc93c1bd70",
        "icon-sm": "roc-s-ebd37e04d422 roc-s-04760bcd507f roc-s-febc93c1bd70",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(
        "roc-shadcn",
        cn(inputGroupButtonVariants({ size }), className),
      )}
      {...props}
    />
  );
}
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-71556df3b421 roc-s-074569488cca roc-s-c74ab393b96d roc-s-35f35c41d134 roc-s-bcae9d37090c roc-s-eb5ef2dbc2d4",
          className,
        ),
      )}
      {...props}
    />
  );
}
function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-7bd5bab6d7f4 roc-s-52417259a4f5 roc-s-dad556abfe15 roc-s-8fca9236d191 roc-s-89c3006b2722 roc-s-b55b9ee3d692 roc-s-9279f06cab0e",
          className,
        ),
      )}
      {...props}
    />
  );
}
function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-7bd5bab6d7f4 roc-s-93adf2894f42 roc-s-52417259a4f5 roc-s-dad556abfe15 roc-s-8fca9236d191 roc-s-d3cea061f2f3 roc-s-89c3006b2722 roc-s-b55b9ee3d692 roc-s-9279f06cab0e",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};

import "./input-group.css";
