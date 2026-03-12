"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "../../icons";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer group flex size-[18px] shrink-0 items-center justify-center rounded-[3px]",
        "border-[0.09375em] border-gray-600 outline-none",
        "disabled:border-gray-300",
        "aria-invalid:border-red-600",
        "data-[state=checked]:border-purple-800 data-[state=checked]:bg-purple-800",
        "data-[state=checked]:disabled:border-gray-600 data-[state=checked]:disabled:bg-gray-600",
        className
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="block bg-purple-800 text-current group-disabled:bg-gray-600"
        data-slot="checkbox-indicator"
      >
        <CheckIcon className="size-[9px] text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
