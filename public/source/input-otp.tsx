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
        "roc-s-222f930b8752 roc-s-71556df3b421 roc-s-074569488cca roc-s-7d94f63f5883",
        containerClassName,
      )}
      className={cn("roc-shadcn", cn("roc-s-db567af109b7", className))}
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
        cn("roc-s-222f930b8752 roc-s-71556df3b421", className),
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
          "roc-s-d2d9e1f13413 roc-s-222f930b8752 roc-s-539ae144f076 roc-s-6bb768bd2263 roc-s-71556df3b421 roc-s-a503dd374cca roc-s-582305bd5096 roc-s-baf794b99c10 roc-s-1267095cdeb7 roc-s-c74ab393b96d roc-s-7de07d413c13 roc-s-9952ed32207c roc-s-b30fc56058b6 roc-s-18124ac5a3c8 roc-s-8281a5bc6910 roc-s-77677d75e38f roc-s-1fac1d7d1df3 roc-s-1cd4fc90ffcb roc-s-e1a91ca4c90d roc-s-f365ce803878 roc-s-d4dc38c0d646 roc-s-8c61c3cda480 roc-s-17ad384cb01c roc-s-9daa2369a41b roc-s-82b5f48135e0",
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
            "roc-s-33228ff7d583 roc-s-747355bdc2a2 roc-s-ce13093ad8c9 roc-s-222f930b8752 roc-s-71556df3b421 roc-s-a503dd374cca",
          )}
        >
          <div
            className={cn(
              "roc-shadcn",
              "roc-s-099be97e1fa4 roc-s-86a02c9ddb39 roc-s-c5580f5631cf roc-s-e710919d2da4 roc-s-9af9d554c39b",
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
