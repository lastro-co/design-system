import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "../Spinner";

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap font-medium outline-none transition-all duration-200 ease-out disabled:pointer-events-none disabled:border-none disabled:bg-gray-300 disabled:text-gray-600 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*="size-"])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        contained: "",
        outlined: "border",
      },
      color: {
        purple: "",
        error: "",
        black: "",
      },
      size: {
        small: "h-8 p-3 text-sm has-[>svg]:px-2.5",
        medium: "h-9 px-6 py-3 text-sm has-[>svg]:px-4",
        large: "h-11 px-8 py-3 text-lg has-[>svg]:px-6",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      // purple variants
      {
        variant: "contained",
        color: "purple",
        class: "bg-purple-800 text-white hover:bg-purple-600",
      },
      {
        variant: "outlined",
        color: "purple",
        class: "border-purple-800 bg-white text-purple-800 hover:bg-purple-300",
      },
      // Error variants
      {
        variant: "contained",
        color: "error",
        class: "bg-red-800 text-white hover:bg-red-600",
      },
      {
        variant: "outlined",
        color: "error",
        class: "border-red-800 bg-white text-red-800 hover:bg-red-50",
      },
      // Black variants
      {
        variant: "contained",
        color: "black",
        class: "bg-gray-900 text-white hover:bg-black",
      },
      {
        variant: "outlined",
        color: "black",
        class: "border-gray-900 bg-white text-gray-900 hover:bg-gray-300",
      },
    ],
    defaultVariants: {
      variant: "contained",
      color: "purple",
      size: "medium",
      shape: "default",
    },
  }
);

interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "color">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  color,
  shape,
  loading = false,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = "button";

  const getSpinnerSize = (): "sm" | "md" | "lg" => {
    if (size === "small") {
      return "sm";
    }
    if (size === "large") {
      return "lg";
    }
    return "md";
  };

  const spinnerSize = getSpinnerSize();

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, color, shape, className }),
        "relative"
      )}
      data-slot="button"
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size={spinnerSize} />
        </div>
      )}
      <span
        className={cn(
          "inline-flex items-center justify-center gap-2",
          loading && "opacity-0"
        )}
      >
        {children}
      </span>
    </Comp>
  );
}

export { Button, buttonVariants };
