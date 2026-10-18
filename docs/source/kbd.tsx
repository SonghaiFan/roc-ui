// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.
"use client";
import { cn } from "./utils";
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-33228ff7d583 roc-s-123306850fe1 roc-s-c6413460bac9 roc-s-8cfb5a42ef9f roc-s-0112b62f436b roc-s-71556df3b421 roc-s-a503dd374cca roc-s-19e97f3f40e6 roc-s-02e603944040 roc-s-87ecb59f2d2d roc-s-87f513ceef7b roc-s-b902257d46c0 roc-s-3992de70b033 roc-s-daaac3fbf55e roc-s-35f35c41d134 roc-s-78905c9e865c",
          "roc-s-be87a4a64d81",
          "roc-s-7f7a55614e26 roc-s-4bc346e97ace roc-s-0b6a1cfb5e6d",
          className,
        ),
      )}
      {...props}
    />
  );
}
function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn(
        "roc-shadcn",
        cn(
          "roc-s-123306850fe1 roc-s-71556df3b421 roc-s-19e97f3f40e6",
          className,
        ),
      )}
      {...props}
    />
  );
}
export { Kbd, KbdGroup };

import "./kbd.css";
