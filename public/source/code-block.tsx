// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { CheckIcon, CopyIcon } from "lucide-react";
("use client");
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Button } from "./button";
const codeBlockVariants = cva(
  "roc-u-group/code-block roc-u-relative roc-u-flex roc-u-w-full roc-u-min-w-0 roc-u-flex-col roc-u-overflow-hidden roc-u-rounded-lg roc-u-text-sm roc-u-has-[>[data-slot=code-block-content]:focus-visible]:ring-3 roc-u-has-[>[data-slot=code-block-content]:focus-visible]:ring-ring/50 roc-u-data-[size=sm]:text-xs",
  {
    variants: {
      variant: {
        default:
          "roc-u-border roc-u-border-input roc-u-text-foreground roc-u-has-[>[data-slot=code-block-content]:focus-visible]:border-ring roc-u-dark:bg-input/30",
        destructive:
          "roc-u-border roc-u-border-destructive/30 roc-u-text-destructive roc-u-dark:border-destructive/40",
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
          "roc-u-flex roc-u-min-w-0 roc-u-shrink-0 roc-u-items-center roc-u-gap-2 roc-u-px-3 roc-u-pt-3 roc-u-text-muted-foreground roc-u-group-data-[size=sm]/code-block:px-2.5 roc-u-group-data-[size=sm]/code-block:pt-2.5 roc-u-group-data-[variant=destructive]/code-block:text-destructive roc-u-*:has-[>[data-slot=code-block-title]]:min-w-0",
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
          "roc-u-min-w-0 roc-u-truncate roc-u-font-sans roc-u-text-sm roc-u-font-medium roc-u-text-foreground roc-u-group-data-[size=sm]/code-block:text-xs roc-u-group-data-[variant=destructive]/code-block:text-destructive roc-u-[&_svg]:pointer-events-none roc-u-[&_svg]:inline-block roc-u-[&_svg]:align-middle roc-u-[&_svg:not([class*='size-'])]:size-3.5 roc-u-*:[svg]:me-1.5",
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
          "roc-u--my-1 roc-u-ms-auto roc-u--me-1.5 roc-u-flex roc-u-shrink-0 roc-u-items-center roc-u-gap-1 roc-u-[[data-slot=code-block]>&]:absolute roc-u-[[data-slot=code-block]>&]:end-2 roc-u-[[data-slot=code-block]>&]:top-2 roc-u-[[data-slot=code-block]>&]:z-10 roc-u-[[data-slot=code-block]>&]:m-0 roc-u-[[data-slot=code-block]>&]:opacity-0 roc-u-[[data-slot=code-block]>&]:transition-opacity roc-u-[[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 roc-u-[[data-slot=code-block]>&]:group-hover/code-block:opacity-100 roc-u-group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:end-1.5 roc-u-group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:top-1.5 roc-u-[[data-slot=code-block]>&]:pointer-coarse:opacity-100 roc-u-[[data-slot=code-block]>&]:*:[button]:bg-background roc-u-[[data-slot=code-block]>&]:*:[button]:ring-1 roc-u-[[data-slot=code-block]>&]:*:[button]:ring-foreground/10",
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
        className={cn("roc-shadcn", "roc-u-sr-only")}
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
          "roc-u-min-h-0 roc-u-min-w-0 roc-u-scroll-fade-x roc-u-scrollbar-thin roc-u-overflow-auto roc-u-px-3 roc-u-py-3 roc-u-text-start roc-u-font-mono roc-u-leading-relaxed roc-u-outline-none roc-u-group-has-data-[slot=code-block-footer]/code-block:pb-2 roc-u-group-has-data-[slot=code-block-header]/code-block:pt-2 roc-u-group-data-[size=sm]/code-block:px-2.5 roc-u-group-data-[size=sm]/code-block:py-2.5 roc-u-group-data-[size=sm]/code-block:group-has-data-[slot=code-block-header]/code-block:pt-1.5 roc-u-data-wrap:scroll-fade-y roc-u-data-wrap:wrap-break-word roc-u-data-wrap:whitespace-pre-wrap",
          className,
        ),
      )}
      {...props}
    >
      <code
        data-slot="code-block-code"
        className={cn(
          "roc-shadcn",
          "roc-u-grid roc-u-min-h-lh roc-u-min-w-max roc-u-content-start roc-u-in-data-numbered:grid-cols-[auto_1fr] roc-u-in-data-wrap:min-w-0",
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
  "roc-u-relative roc-u--mx-3 roc-u-block roc-u-min-h-lh roc-u-px-3 roc-u-group-data-[size=sm]/code-block:-mx-2.5 roc-u-group-data-[size=sm]/code-block:px-2.5 roc-u-before:min-w-6 roc-u-before:text-end roc-u-before:text-muted-foreground roc-u-after:absolute roc-u-after:start-1 roc-u-after:top-0 roc-u-after:text-muted-foreground roc-u-after:select-none roc-u-in-data-numbered:col-span-2 roc-u-in-data-numbered:grid roc-u-in-data-numbered:grid-cols-subgrid roc-u-in-data-numbered:gap-x-3 roc-u-in-data-numbered:[counter-increment:line] roc-u-in-data-numbered:before:content-[counter(line)] roc-u-in-data-numbered:before:select-none roc-u-in-data-numbered:supports-[content:counter(line)_/_'']:before:content-[counter(line)_/_'']",
  {
    variants: {
      variant: {
        default: "",
        added: "roc-u-bg-muted roc-u-after:content-['+']",
        removed: "roc-u-bg-destructive/10 roc-u-after:text-destructive roc-u-after:content-['−']",
        highlighted: "roc-u-bg-muted",
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
        className={cn("roc-shadcn", "roc-u-min-w-0")}
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
          "roc-u-flex roc-u-min-w-0 roc-u-shrink-0 roc-u-items-center roc-u-gap-2 roc-u-px-3 roc-u-pb-3 roc-u-text-muted-foreground roc-u-group-data-[size=sm]/code-block:px-2.5 roc-u-group-data-[size=sm]/code-block:pb-2.5",
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
