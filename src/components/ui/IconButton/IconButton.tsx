import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "../../icons.v2";

const iconButtonVariants = cva(
  "[&_svg]:!size-4 inline-flex shrink-0 cursor-pointer items-center justify-center outline-none ring-0 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        small: "size-8",
        medium: "size-10",
        large: "size-12",
      },
      shape: {
        circular: "rounded-full",
        square: "",
      },
      color: {
        purple: "",
        error: "",
        black: "",
      },
      variant: {
        outlined: "border",
        contained: "border-0",
        ghost: "border border-transparent bg-transparent",
      },
    },
    compoundVariants: [
      // purple variants
      {
        variant: "contained",
        color: "purple",
        class:
          "bg-purple-800 text-white hover:bg-purple-900 active:bg-purple-950 disabled:bg-gray-300",
      },
      {
        variant: "outlined",
        color: "purple",
        class:
          "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-50 disabled:border-gray-300 disabled:bg-white",
      },
      {
        variant: "ghost",
        color: "purple",
        class: "text-purple-800 hover:bg-purple-50 active:bg-purple-50",
      },
      // black variants
      {
        variant: "contained",
        color: "black",
        class:
          "bg-gray-700 text-white hover:bg-gray-900 active:bg-gray-900 disabled:bg-gray-300",
      },
      {
        variant: "outlined",
        color: "black",
        class:
          "border-gray-900 bg-white text-gray-900 hover:bg-gray-300 active:bg-gray-300 disabled:border-gray-300 disabled:bg-white",
      },
      {
        variant: "ghost",
        color: "black",
        class: "text-gray-900 hover:bg-gray-100 active:bg-gray-100",
      },
      // error variants
      {
        variant: "contained",
        color: "error",
        class:
          "bg-red-600 text-white hover:bg-red-800 active:bg-red-800 disabled:bg-gray-300",
      },
      {
        variant: "outlined",
        color: "error",
        class:
          "border-red-800 bg-white text-red-600 hover:bg-red-50 active:bg-red-50 disabled:border-gray-300 disabled:bg-white",
      },
      {
        variant: "ghost",
        color: "error",
        class: "text-red-600 hover:bg-red-50 active:bg-red-50",
      },
      // square radius scales with size
      {
        shape: "square",
        size: "small",
        class: "rounded-lg",
      },
      {
        shape: "square",
        size: "medium",
        class: "rounded-[10px]",
      },
      {
        shape: "square",
        size: "large",
        class: "rounded-xl",
      },
    ],
    defaultVariants: {
      variant: "outlined",
      color: "black",
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
  asChild?: boolean;
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
      loading = false,
      asChild = false,
      children,
      disabled,
      type = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(
            iconButtonVariants({ size, shape, color, variant, className })
          )}
          data-slot="icon-button"
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const blockedByLoading = loading && !disabled;

    return (
      <button
        aria-busy={loading || undefined}
        aria-disabled={blockedByLoading ? true : undefined}
        className={cn(
          iconButtonVariants({ size, shape, color, variant, className }),
          blockedByLoading && "pointer-events-none"
        )}
        data-slot="icon-button"
        disabled={disabled}
        onClick={blockedByLoading ? undefined : onClick}
        ref={ref}
        type={type}
        {...props}
      >
        {loading ? (
          <LoaderCircleIcon className="size-4 animate-spin" role="status" />
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
