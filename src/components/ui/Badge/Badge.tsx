import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 select-none items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border py-0.5 font-medium has-[>img]:pl-[3px] has-[>svg]:pl-[3px] [&>img]:size-4 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:antialiased [&>svg]:subpixel-antialiased",
  {
    variants: {
      color: {
        blue: "border-blue-800/10 bg-blue-50 text-blue-800",
        gray: "border-gray-800/10 bg-gray-100 text-gray-800",
        green: "border-green-800/10 bg-green-50 text-green-800",
        orange: "border-orange-800/10 bg-orange-50 text-orange-800",
        purple: "border-purple-800/10 bg-purple-300 text-purple-800",
        red: "border-red-800/10 bg-red-50 text-red-800",
        white: "border-gray-800/10 bg-white text-gray-800",
        yellow: "border-yellow-800/10 bg-yellow-50 text-yellow-800",
      },
      size: {
        small: "px-2 text-xs",
        medium: "px-3 text-sm",
      },
      isNumber: {
        true: "h-5 min-w-5 p-1",
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
          style={{ backgroundColor: dotColor || "currentColor" }}
        />
      )}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
