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
          "roc-s-222f930b8752 roc-s-302c0d124a94 roc-s-8c7e0067a9a5",
          "roc-s-b1e58eec23df roc-s-cabdc03fe0ef",
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
          "roc-s-7fc057c6b049 roc-s-daaac3fbf55e",
          "roc-s-de65f8da41a3",
          "roc-s-fcdc268a7949",
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
          "roc-s-220da3c77607 roc-s-222d94de2f4b roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-302c0d124a94 roc-s-cc30d00b6367 roc-s-4254beb8e289 roc-s-2faa4581af77",
          className,
        ),
      )}
      {...props}
    />
  );
}
const fieldVariants = cva(
  "roc-s-83f8e50d0580 roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-d7db3451d154 roc-s-993a85d2fa04",
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
          "roc-s-1f03f05ae1d7 roc-s-222f930b8752 roc-s-7bd5bab6d7f4 roc-s-302c0d124a94 roc-s-70007b876865 roc-s-4c3c66460268",
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
          "roc-s-755d2f1faff3 roc-s-3eb9a8785fde roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-074569488cca roc-s-4c3c66460268 roc-s-5038cf153bcf",
          "roc-s-2120dbf3ec49 roc-s-140979c1a385 roc-s-1bcfe349a4ba roc-s-82fdadbd8969 roc-s-584be9d521b5",
          "roc-s-473474db8aa1 roc-s-e381b7741992 roc-s-bfbf8664f3ef",
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
          "roc-s-222f930b8752 roc-s-8cfb5a42ef9f roc-s-71556df3b421 roc-s-074569488cca roc-s-c74ab393b96d roc-s-4c3c66460268 roc-s-daaac3fbf55e roc-s-5038cf153bcf",
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
          "roc-s-c74ab393b96d roc-s-7844ca2c6709 roc-s-52101fc7d8bb roc-s-35f35c41d134 roc-s-f9abeb5519b1",
          "roc-s-d3a06646ec72 roc-s-9a9db3cd4e21 roc-s-f402ac9b1f67",
          "roc-s-e1bd2eaca11c roc-s-30f54d824d9e roc-s-e8926eea1512",
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
          "roc-s-d2d9e1f13413 roc-s-15c71dfec7d2 roc-s-c6413460bac9 roc-s-c74ab393b96d roc-s-1304a3025ea1",
          className,
        ),
      )}
      {...props}
    >
      <Separator
        className={cn(
          "roc-shadcn",
          "roc-s-747355bdc2a2 roc-s-ce13093ad8c9 roc-s-4e45f4841abb",
        )}
      />
      {children && (
        <span
          className={cn(
            "roc-shadcn",
            "roc-s-d2d9e1f13413 roc-s-1752f11474a6 roc-s-496aca80e4d8 roc-s-8cfb5a42ef9f roc-s-5b272f3c5076 roc-s-e7e01cc7f4df roc-s-35f35c41d134",
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
          "roc-s-73f62657fa5e roc-s-222f930b8752 roc-s-abcade9f1f8d roc-s-302c0d124a94 roc-s-19e97f3f40e6",
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
          "roc-s-c74ab393b96d roc-s-52101fc7d8bb roc-s-887b9502d5c7",
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
