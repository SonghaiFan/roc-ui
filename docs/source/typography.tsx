// Composed from the shadcn/ui Typography documentation (MIT).
import * as React from "react";
import { cn } from "./utils";
import "./typography.css";
export function Typography({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("roc-ui roc-typography", className)} {...props} />;
}
export function TypographyH1(props: React.ComponentProps<"h1">) {
  return <h1 {...props} />;
}
export function TypographyH2(props: React.ComponentProps<"h2">) {
  return <h2 {...props} />;
}
export function TypographyH3(props: React.ComponentProps<"h3">) {
  return <h3 {...props} />;
}
export function TypographyP(props: React.ComponentProps<"p">) {
  return <p {...props} />;
}
export function TypographyBlockquote(
  props: React.ComponentProps<"blockquote">,
) {
  return <blockquote {...props} />;
}
export function TypographyCode(props: React.ComponentProps<"code">) {
  return <code {...props} />;
}
export function TypographyMuted({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("roc-typography-muted", className)} {...props} />;
}
