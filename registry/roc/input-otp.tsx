// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import * as React from "react";
import { cn } from "./utils";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "roc-shadcn",
        "roc-u-flex roc-u-items-center roc-u-gap-2 roc-u-has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("roc-shadcn", cn("roc-u-disabled:cursor-not-allowed", className))}
      {...props}
    />
  );
}
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "roc-shadcn",
        cn("roc-u-flex roc-u-items-center", className),
      )}
      {...props}
    />
  );
}
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "roc-shadcn",
        cn(
          "roc-u-relative roc-u-flex roc-u-h-9 roc-u-w-9 roc-u-items-center roc-u-justify-center roc-u-border-y roc-u-border-r roc-u-border-input roc-u-text-sm roc-u-shadow-xs roc-u-transition-all roc-u-outline-none roc-u-first:rounded-l-md roc-u-first:border-l roc-u-last:rounded-r-md roc-u-aria-invalid:border-destructive roc-u-data-[active=true]:z-10 roc-u-data-[active=true]:border-ring roc-u-data-[active=true]:ring-[3px] roc-u-data-[active=true]:ring-ring/50 roc-u-data-[active=true]:aria-invalid:border-destructive roc-u-data-[active=true]:aria-invalid:ring-destructive/20 roc-u-dark:bg-input/30 roc-u-dark:data-[active=true]:aria-invalid:ring-destructive/40",
          className,
        ),
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div
          className={cn(
            "roc-shadcn",
            "roc-u-pointer-events-none roc-u-absolute roc-u-inset-0 roc-u-flex roc-u-items-center roc-u-justify-center",
          )}
        >
          <div
            className={cn(
              "roc-shadcn",
              "roc-u-h-4 roc-u-w-px roc-u-animate-caret-blink roc-u-bg-foreground roc-u-duration-1000",
            )}
          />
        </div>
      )}
    </div>
  );
}
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="roc-ui"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

import "./input-otp.css";
