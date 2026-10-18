"use client";
// ROC primitive: render the caller's single child with our props merged in (`asChild`).
import * as React from "react";
import { composeRefs } from "./primitive-utils";

type AnyProps = Record<string, any>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const merged: AnyProps = { ...childProps };
  for (const key in childProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    if (/^on[A-Z]/.test(key)) {
      if (slotValue && childValue) {
        merged[key] = (...args: unknown[]) => {
          const result = childValue(...args);
          slotValue(...args);
          return result;
        };
      } else if (slotValue) merged[key] = slotValue;
    } else if (key === "style") {
      merged[key] = { ...slotValue, ...childValue };
    } else if (key === "className") {
      merged[key] = [slotValue, childValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...merged };
}

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  ref?: React.Ref<any>;
};

function Root({ children, ref, ...slotProps }: SlotProps) {
  if (!React.isValidElement(children)) {
    if (React.Children.count(children) > 1) throw new Error("Slot needs one child");
    return null;
  }
  const child = children as React.ReactElement<AnyProps>;
  return React.cloneElement(child, {
    ...mergeProps(slotProps, child.props),
    ref: ref ? composeRefs(ref, child.props.ref) : child.props.ref,
  });
}

export const Slot = { Root };
