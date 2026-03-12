import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "flex select-none items-center gap-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
  {
    variants: {
      variant: {
        input: "text-gray-800 text-sm",
        section: "text-base text-black",
      },
    },
    defaultVariants: {
      variant: "input",
    },
  }
);

interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

function Label({ className, variant, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(labelVariants({ variant }), className)}
      data-slot="label"
      {...props}
    />
  );
}

export { Label, labelVariants };
