import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 select-none items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border border-transparent py-0.5 font-medium has-[>img]:pl-[3px] has-[>svg]:pl-[3px] [&>img]:size-4 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:antialiased [&>svg]:subpixel-antialiased",
  {
    variants: {
      color: {
        default: "bg-purple-800 text-white",
        secondary: "bg-white text-gray-700",
        destructive: "bg-red-600 text-white",
        outline: "border-gray-800 bg-transparent text-gray-800",
        blue: "bg-blue-100 text-blue-700",
        gray: "bg-gray-100 text-gray-700",
        green: "bg-green-100 text-green-700",
        orange: "bg-orange-100 text-orange-700",
        purple: "bg-purple-100 text-purple-800",
        red: "bg-red-100 text-red-700",
        white: "border-gray-800/10 bg-white text-gray-800",
        yellow: "bg-yellow-100 text-yellow-700",
      },
      size: {
        small: "px-2 text-xs leading-4",
        medium: "px-3 text-sm leading-5",
      },
      isNumber: {
        true: "h-5 min-w-5 p-1",
      },
    },
    compoundVariants: [
      {
        color: "outline",
        size: "small",
        class: "px-[7px] py-px",
      },
      {
        color: "outline",
        size: "medium",
        class: "px-[11px] py-px",
      },
    ],
    defaultVariants: {
      color: "gray",
      size: "small",
      isNumber: false,
    },
  }
);

interface BadgeProps
  extends Omit<React.ComponentProps<"span">, "color">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /** Show a dot indicator before the badge text */
  showDot?: boolean;
  /** Custom color for the dot (defaults to currentColor) */
  dotColor?: string;
}

function Badge({
  className,
  color,
  size,
  isNumber,
  asChild = false,
  showDot = false,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      className={cn(badgeVariants({ color, size, isNumber }), className)}
      data-slot="badge"
      {...props}
    >
      {showDot && (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: dotColor || "currentColor" }}
        />
      )}
      <Slottable>{children}</Slottable>
    </Comp>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
