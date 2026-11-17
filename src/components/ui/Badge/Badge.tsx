import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  `inline-flex h-5 w-fit shrink-0 select-none items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border border-transparent py-0.5 font-medium px-2 py-0 leading-none
  has-[>img]:pl-1.5 has-[>svg]:pl-1.5 has-[>[data-slot=badge-icon]]:pl-1.5 has-[>img]:pr-2.5 has-[>svg]:pr-2.5 has-[>[data-slot=badge-icon]]:pr-2.5 [&>img]:size-4 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:antialiased [&>svg]:subpixel-antialiased`,
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
        coral: "bg-coral-600 text-white",
      },
      size: {
        small: "text-xs",
        medium: "h-6 text-xs",
      },
      isNumber: {
        true: "h-5 min-w-5 px-1",
      },
      iconOnly: {
        true: "aspect-square px-0 has-[>[data-slot=badge-icon]]:px-0 has-[>img]:px-0 has-[>svg]:px-0",
      },
      // A circle around the icon that opens into a pill with `expandLabel` on
      // hover or keyboard focus. 3px padding plus the 1px border keeps it a 24px circle at
      // medium size while closed.
      expandable: {
        true: "group/badge gap-0 px-0.75 has-[>[data-slot=badge-icon]]:px-0.75 has-[>img]:px-0.75 has-[>svg]:px-0.75",
      },
    },
    defaultVariants: {
      color: "gray",
      size: "small",
      isNumber: false,
      iconOnly: false,
      expandable: false,
    },
  }
);

interface BadgeProps
  extends Omit<React.ComponentProps<"span">, "color">,
    Omit<VariantProps<typeof badgeVariants>, "expandable"> {
  asChild?: boolean;
  /**
   * Text the badge reveals on hover or keyboard focus. Closed, it is an
   * icon-only circle (`iconOnly` is ignored); open, a pill with icon and text.
   * Give the badge an `aria-label` too: the text is clipped while closed.
   */
  expandLabel?: string;
}

function Badge({
  className,
  color,
  size,
  isNumber,
  iconOnly,
  asChild = false,
  expandLabel,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  const expandable = Boolean(expandLabel);

  return (
    <Comp
      className={cn(
        badgeVariants({
          color,
          size,
          isNumber,
          iconOnly: expandable ? false : iconOnly,
          expandable,
        }),
        className
      )}
      data-slot="badge"
      {...props}
    >
      <Slottable>{children}</Slottable>
      {expandable && (
        // A 0fr -> 1fr grid track animates to the text's own width, which a
        // width transition cannot do without a fixed size.
        <span
          className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-200 ease-out group-hover/badge:grid-cols-[1fr] group-focus-visible/badge:grid-cols-[1fr] motion-reduce:transition-none"
          data-slot="badge-expand-label"
        >
          <span className="min-w-0 overflow-hidden">
            <span className="block pr-1.5 pl-1">{expandLabel}</span>
          </span>
        </span>
      )}
    </Comp>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
