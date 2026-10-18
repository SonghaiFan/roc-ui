// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { CheckIcon, CopyIcon } from "lucide-react";
("use client");
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Button } from "./button";
const codeBlockVariants = cva(
  "roc-s-75bf3cc6bdff roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-58d0413dd93c roc-s-184ddc11e5f9 roc-s-302c0d124a94 roc-s-d5111d0e9f48 roc-s-49abc543ea42 roc-s-c74ab393b96d roc-s-43fdcb63de9a roc-s-d37ae36da45c roc-s-28d990dcb89a",
  {
    variants: {
      variant: {
        default:
          "roc-s-4f1a55de40bc roc-s-1267095cdeb7 roc-s-957a109f887f roc-s-2235a6296a5f roc-s-9daa2369a41b",
        destructive:
          "roc-s-4f1a55de40bc roc-s-29b9aa7a43fb roc-s-887b9502d5c7 roc-s-60564e695298",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
function CodeBlock({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof codeBlockVariants> & {
    size?: "default" | "sm";
  }) {
  return (
    <div
      data-slot="code-block"
      data-variant={variant}
      data-size={size}
      className={cn(
        "roc-shadcn",
        cn(codeBlockVariants({ variant }), className),
      )}
      {...props}
    />
  );
}
function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-184ddc11e5f9 roc-s-27ead27a81df roc-s-71556df3b421 roc-s-074569488cca roc-s-0f9e6672913a roc-s-0a702d97ed7d roc-s-35f35c41d134 roc-s-da8324d164e6 roc-s-7a4a1b22ceb7 roc-s-8cef8cf299ec roc-s-2cacba11fbb5",
          className,
        ),
      )}
      {...props}
    />
  );
}
function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-184ddc11e5f9 roc-s-5a3a4ee420c2 roc-s-b902257d46c0 roc-s-c74ab393b96d roc-s-daaac3fbf55e roc-s-957a109f887f roc-s-f469c940b6eb roc-s-8cef8cf299ec roc-s-bcae9d37090c roc-s-09e4611fdeed roc-s-c007d4f16762 roc-s-e1a042407eac roc-s-2a4704b342e2",
          className,
        ),
      )}
      {...props}
    />
  );
}
function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-4dfe6b3bc5be roc-s-5cf4ab3b6fa0 roc-s-8cc46fa87f41 roc-s-222f930b8752 roc-s-27ead27a81df roc-s-71556df3b421 roc-s-19e97f3f40e6 roc-s-c78e60a4c589 roc-s-567578629cc1 roc-s-12a28c222bfc roc-s-b4168d1f4661 roc-s-9a33638f68c2 roc-s-c1f72297d61f roc-s-1922588328c8 roc-s-6a5bccc56a2b roc-s-ab7133c1013c roc-s-a154dcd5b70d roc-s-de134ad67cc8 roc-s-34bb36260ddb roc-s-b88d58fe56f7 roc-s-0611cded818a roc-s-f7b2103e2d2d",
          className,
        ),
      )}
      {...props}
    />
  );
}
function CodeBlockCopyButton({
  value,
  variant = "ghost",
  size = "icon-xs",
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [copyError, setCopyError] = React.useState(false);
  React.useEffect(() => {
    if (!copied) {
      return;
    }
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);
  return (
    <>
      <Button
        data-slot="code-block-copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size}
        aria-label={copied ? "Copied" : "Copy"}
        className={cn("roc-shadcn", cn(className))}
        onClick={async (event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setCopyError(false);
          } catch {
            setCopyError(true);
          }
        }}
        {...props}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <span
        aria-live="polite"
        className={cn("roc-shadcn", "roc-s-32fb090591d9")}
      >
        {copyError
          ? "Copy unavailable. Select and copy the code manually."
          : copied
            ? "Copied"
            : ""}
      </span>
    </>
  );
}
function CodeBlockContent({
  className,
  children,
  style,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  ...props
}: React.ComponentProps<"pre"> & {
  wrap?: boolean;
  lineNumbers?: boolean;
  startLine?: number;
}) {
  return (
    <pre
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      data-numbered={lineNumbers || undefined}
      dir="ltr"
      tabIndex={0}
      style={{ counterReset: `line ${startLine - 1}`, ...style }}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-410da8dfa8ac roc-s-184ddc11e5f9 roc-s-eb3ca07c6bb1 roc-s-51bebba470f2 roc-s-1a26a0d28420 roc-s-0f9e6672913a roc-s-d3cea061f2f3 roc-s-e9347b78185f roc-s-02ded9244507 roc-s-059428494356 roc-s-b30fc56058b6 roc-s-61ee20d5e64f roc-s-32d7924585f7 roc-s-da8324d164e6 roc-s-dbe9a377d646 roc-s-d6c09e659619 roc-s-54c9d5074e55 roc-s-106e8278d276 roc-s-aa0b2903b9ed",
          className,
        ),
      )}
      {...props}
    >
      <code
        data-slot="code-block-code"
        className={cn(
          "roc-shadcn",
          "roc-s-0f2a693e93e2 roc-s-828bd9641689 roc-s-e074b2e4a3c0 roc-s-954af9127360 roc-s-7bf827f36946 roc-s-408407fb2ef6",
        )}
      >
        {lineNumbers && typeof children === "string"
          ? children
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))
          : children}
      </code>
    </pre>
  );
}
const codeBlockLineVariants = cva(
  "roc-s-d2d9e1f13413 roc-s-713d77acec86 roc-s-496aca80e4d8 roc-s-828bd9641689 roc-s-0f9e6672913a roc-s-727530c32632 roc-s-da8324d164e6 roc-s-ff361807cd16 roc-s-fd65279fc876 roc-s-6b3251cca252 roc-s-b1cf80175a45 roc-s-8ae89c0efbd5 roc-s-6f609daa5719 roc-s-3e7de9f36386 roc-s-fe5ede87e8b1 roc-s-2383e30dd82d roc-s-5ab65059a701 roc-s-179aff6b7e41 roc-s-ace76a1f7f1a roc-s-be7ec57ebcf5 roc-s-86ce766c1003 roc-s-144f243fc5f6 roc-s-c64c5520c7af",
  {
    variants: {
      variant: {
        default: "",
        added: "roc-s-87ecb59f2d2d roc-s-418748faca5f",
        removed: "roc-s-556bbcd00fb2 roc-s-8c950c5e6fec roc-s-cab58241d723",
        highlighted: "roc-s-87ecb59f2d2d",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
function CodeBlockLine({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof codeBlockLineVariants>) {
  // An empty line holds a newline so copying a selection keeps blank lines.
  const empty =
    children === undefined ||
    children === null ||
    children === "" ||
    (Array.isArray(children) && children.length === 0);
  return (
    <span
      data-slot="code-block-line"
      data-variant={variant}
      className={cn(
        "roc-shadcn",
        cn(codeBlockLineVariants({ variant }), className),
      )}
      {...props}
    >
      <span
        data-slot="code-block-line-content"
        className={cn("roc-shadcn", "roc-s-184ddc11e5f9")}
      >
        {empty ? "\n" : children}
      </span>
    </span>
  );
}
function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-222f930b8752 roc-s-184ddc11e5f9 roc-s-27ead27a81df roc-s-71556df3b421 roc-s-074569488cca roc-s-0f9e6672913a roc-s-17b03732cf78 roc-s-35f35c41d134 roc-s-da8324d164e6 roc-s-0fc96cca66ac",
          className,
        ),
      )}
      {...props}
    />
  );
}
export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
  CodeBlockFooter,
};

import "./code-block.css";
