import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "../../icons.v2";

const iconButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center outline-none ring-0 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
      variant: {
        default:
          "border-0 bg-purple-800 text-white hover:bg-purple-900 active:bg-purple-950 disabled:bg-gray-300",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-50 disabled:border-gray-300 disabled:bg-white",
        ghost:
          "border border-transparent bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800 active:bg-gray-50 active:text-gray-800",
        destructive:
          "border-0 bg-white text-red-600 hover:bg-red-50 hover:text-red-800 active:bg-red-50 active:text-red-800",
      },
    },
    compoundVariants: [
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
      variant: "outline",
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
      variant,
      loading = false,
      asChild = false,
      children,
      disabled,
      type = "button",
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const blockedByLoading = loading && !disabled;
    const blockedForAsChild = asChild && Boolean(disabled);
    const shouldBlockActivation = blockedByLoading || blockedForAsChild;
    const Comp = asChild ? Slot : "button";

    const blockIfInactive = (event: React.SyntheticEvent) => {
      if (!shouldBlockActivation) {
        return false;
      }
      event.preventDefault();
      event.stopPropagation();
      return true;
    };

    return (
      <Comp
        aria-busy={loading || undefined}
        aria-disabled={shouldBlockActivation ? true : undefined}
        className={cn(
          iconButtonVariants({ size, shape, variant, className }),
          blockedByLoading && "pointer-events-none"
        )}
        data-slot="icon-button"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          if (!blockIfInactive(event)) {
            onClick?.(event);
          }
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
          if (
            shouldBlockActivation &&
            (event.key === "Enter" || event.key === " ")
          ) {
            blockIfInactive(event);
          } else {
            onKeyDown?.(event);
          }
        }}
        ref={ref}
        {...(asChild ? {} : { disabled, type })}
        {...props}
      >
        {!asChild && loading ? (
          <LoaderCircleIcon className="size-4 animate-spin" role="status" />
        ) : (
          children
        )}
      </Comp>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
