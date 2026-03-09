"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Switch as SwitchPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/utils";

const switchVariants = cva(
  [
    "peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs",
    "cursor-pointer outline-none transition-all",
    "focus-visible:ring-2 focus-visible:ring-current/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=checked]:bg-current",
    "data-[state=unchecked]:bg-gray-200",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "h-3.5 w-6",
        sm: "h-[18px] w-8",
        md: "h-[22px] w-10",
        lg: "h-[26px] w-12",
        xl: "h-[30px] w-14",
        "2xl": "h-[34px] w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const switchThumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white ring-0",
    "transition-transform",
    "data-[state=checked]:translate-x-[calc(100%-2px)]",
    "data-[state=unchecked]:translate-x-0",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-3",
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
        xl: "size-7",
        "2xl": "size-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

function Switch({ className, size, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(switchVariants({ size }), className)}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(switchThumbVariants({ size }))}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}

Switch.displayName = "Switch";

export { Switch, switchVariants };
