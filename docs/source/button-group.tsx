// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "./primitive-slot";
import { Separator } from "./separator";
const buttonGroupVariants = cva(
  "roc-u-flex roc-u-w-fit roc-u-items-stretch roc-u-has-[>[data-slot=button-group]]:gap-2 roc-u-[&>*]:focus-visible:relative roc-u-[&>*]:focus-visible:z-10 roc-u-has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md roc-u-[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit roc-u-[&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal: "roc-u-[&>*:not(:first-child)]:rounded-l-none roc-u-[&>*:not(:first-child)]:border-l-0 roc-u-[&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "roc-u-flex-col roc-u-[&>*:not(:first-child)]:rounded-t-none roc-u-[&>*:not(:first-child)]:border-t-0 roc-u-[&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);
function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "roc-shadcn",
        cn(buttonGroupVariants({ orientation }), className),
      )}
      {...props}
    />
  );
}
function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-items-center roc-u-gap-2 roc-u-rounded-md roc-u-border roc-u-bg-muted roc-u-px-4 roc-u-text-sm roc-u-font-medium roc-u-shadow-xs roc-u-[&_svg]:pointer-events-none roc-u-[&_svg:not([class*='size-'])]:size-4",
          className,
        ),
      )}
      {...props}
    />
  );
}
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-m-0! roc-u-self-stretch roc-u-bg-input roc-u-data-[orientation=vertical]:h-auto",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};

import "./button-group.css";
