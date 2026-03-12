import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600",
  {
    variants: {
      size: {
        small: "size-8",
        medium: "size-9",
        large: "size-11",
      },
      shape: {
        circular: "rounded-full",
        square: "rounded-md",
      },
      color: {
        default: "",
        purple: "",
      },
      variant: {
        outlined: "border",
        contained: "border-0",
        ghost: "border border-transparent bg-transparent",
      },
    },
    compoundVariants: [
      // Default variants
      {
        variant: "contained",
        color: "default",
        class: "bg-gray-300 hover:bg-gray-200",
      },
      {
        variant: "outlined",
        color: "default",
        class:
          "border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-300",
      },
      // purple variants
      {
        variant: "contained",
        color: "purple",
        class: "bg-purple-800 hover:bg-purple-600",
      },
      {
        variant: "outlined",
        color: "purple",
        class:
          "border-purple-800 bg-white hover:border-purple-300 hover:bg-purple-300",
      },
      // Ghost variants
      {
        variant: "ghost",
        color: "default",
        class: "text-gray-900 hover:bg-gray-100",
      },
      {
        variant: "ghost",
        color: "purple",
        class: "text-purple-800 hover:bg-purple-50",
      },
    ],
    defaultVariants: {
      variant: "outlined",
      color: "default",
      size: "medium",
      shape: "square",
    },
  }
);

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "color">,
    VariantProps<typeof iconButtonVariants> {
  children: ReactNode;
  loading?: boolean;
  "aria-label": string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      size,
      shape,
      color,
      variant,
      loading,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const getSpinnerSize = () => {
      if (size === "small") {
        return "16px";
      }
      return "20px";
    };

    const spinnerSize = getSpinnerSize();

    return (
      <button
        className={cn(
          iconButtonVariants({ size, shape, color, variant }),
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        type={type}
        {...props}
      >
        {loading ? (
          <div
            className="animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{
              width: spinnerSize,
              height: spinnerSize,
            }}
          />
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
