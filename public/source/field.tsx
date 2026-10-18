// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Label } from "./label";
import { Separator } from "./separator";
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-flex-col roc-u-gap-6",
          "roc-u-has-[>[data-slot=checkbox-group]]:gap-3 roc-u-has-[>[data-slot=radio-group]]:gap-3",
          className,
        ),
      )}
      {...props}
    />
  );
}
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & {
  variant?: "legend" | "label";
}) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-mb-3 roc-u-font-medium",
          "roc-u-data-[variant=legend]:text-base",
          "roc-u-data-[variant=label]:text-sm",
          className,
        ),
      )}
      {...props}
    />
  );
}
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/field-group roc-u-@container/field-group roc-u-flex roc-u-w-full roc-u-flex-col roc-u-gap-7 roc-u-data-[slot=checkbox-group]:gap-3 roc-u-[&>[data-slot=field-group]]:gap-4",
          className,
        ),
      )}
      {...props}
    />
  );
}
const fieldVariants = cva(
  "roc-u-group/field roc-u-flex roc-u-w-full roc-u-gap-3 roc-u-data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "roc-shadcn",
        cn(fieldVariants({ orientation }), className),
      )}
      {...props}
    />
  );
}
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/field-content roc-u-flex roc-u-flex-1 roc-u-flex-col roc-u-gap-1.5 roc-u-leading-snug",
          className,
        ),
      )}
      {...props}
    />
  );
}
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-group/field-label roc-u-peer/field-label roc-u-flex roc-u-w-fit roc-u-gap-2 roc-u-leading-snug roc-u-group-data-[disabled=true]/field:opacity-50",
          "roc-u-has-[>[data-slot=field]]:w-full roc-u-has-[>[data-slot=field]]:flex-col roc-u-has-[>[data-slot=field]]:rounded-md roc-u-has-[>[data-slot=field]]:border roc-u-[&>*]:data-[slot=field]:p-4",
          "roc-u-has-data-[state=checked]:border-primary roc-u-has-data-[state=checked]:bg-primary/5 roc-u-dark:has-data-[state=checked]:bg-primary/10",
          className,
        ),
      )}
      {...props}
    />
  );
}
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-flex roc-u-w-fit roc-u-items-center roc-u-gap-2 roc-u-text-sm roc-u-leading-snug roc-u-font-medium roc-u-group-data-[disabled=true]/field:opacity-50",
          className,
        ),
      )}
      {...props}
    />
  );
}
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-text-sm roc-u-leading-normal roc-u-font-normal roc-u-text-muted-foreground roc-u-group-has-[[data-orientation=horizontal]]/field:text-balance",
          "roc-u-last:mt-0 roc-u-nth-last-2:-mt-1 roc-u-[[data-variant=legend]+&]:-mt-1.5",
          "roc-u-[&>a]:underline roc-u-[&>a]:underline-offset-4 roc-u-[&>a:hover]:text-primary",
          className,
        ),
      )}
      {...props}
    />
  );
}
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u--my-2 roc-u-h-5 roc-u-text-sm roc-u-group-data-[variant=outline]/field-group:-mb-2",
          className,
        ),
      )}
      {...props}
    >
      <Separator
        className={cn(
          "roc-shadcn",
          "roc-u-absolute roc-u-inset-0 roc-u-top-1/2",
        )}
      />
      {children && (
        <span
          className={cn(
            "roc-shadcn",
            "roc-u-relative roc-u-mx-auto roc-u-block roc-u-w-fit roc-u-bg-background roc-u-px-2 roc-u-text-muted-foreground",
          )}
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<
    | {
        message?: string;
      }
    | undefined
  >;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }
    if (!errors?.length) {
      return null;
    }
    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];
    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message;
    }
    return (
      <ul
        className={cn(
          "roc-shadcn",
          "roc-u-ml-4 roc-u-flex roc-u-list-disc roc-u-flex-col roc-u-gap-1",
        )}
      >
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);
  if (!content) {
    return null;
  }
  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-text-sm roc-u-font-normal roc-u-text-destructive",
          className,
        ),
      )}
      {...props}
    >
      {content}
    </div>
  );
}
export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};

import "./field.css";
