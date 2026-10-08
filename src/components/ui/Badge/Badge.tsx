import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  `inline-flex h-5 w-fit shrink-0 select-none items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border border-transparent py-0.5 font-medium px-2.5 py-0 leading-none
  has-[>img]:pl-1.5 has-[>svg]:pl-1.5 has-[>[data-slot=badge-dot]]:pl-1.5 [&>img]:size-4 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:antialiased [&>svg]:subpixel-antialiased`,
  {
    variants: {
      color: {
        default: "bg-purple-800 text-white",
        secondary: "bg-white text-gray-700",
        destructive: "bg-red-600 text-white",
        outline: "border-gray-800 bg-white text-gray-800",
        blue: "bg-blue-100 text-blue-700",
        gray: "bg-gray-100 text-gray-700",
        green: "bg-green-100 text-green-700",
        orange: "bg-orange-100 text-orange-700",
        purple: "bg-purple-100 text-purple-800",
        red: "bg-red-100 text-red-700",
        yellow: "bg-yellow-100 text-yellow-700",
      },
      size: {
        small: "text-xs",
        medium: "h-6 text-sm",
      },
      isNumber: {
        true: "h-5 min-w-5 px-1",
      },
    },
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
          data-slot="badge-dot"
          style={{ backgroundColor: dotColor || "currentColor" }}
        />
      )}
      <Slottable>{children}</Slottable>
    </Comp>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
