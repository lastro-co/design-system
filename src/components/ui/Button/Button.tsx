import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "../../icons.v2";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium outline-none ring-0 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:text-gray-700 disabled:opacity-45 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-purple-800 text-white hover:bg-purple-900 active:bg-purple-950 disabled:bg-gray-300",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-50 disabled:border-gray-300 disabled:bg-white",
        ghost: "text-purple-800 hover:bg-purple-50 active:bg-purple-50",
        link: "text-purple-800 hover:underline active:underline disabled:text-gray-600 aria-disabled:text-gray-600",
        destructive:
          "bg-red-600 text-white hover:bg-red-800 active:bg-red-800 disabled:bg-gray-300",
        "ghost-destructive": "text-red-600 hover:bg-red-50 active:bg-red-50",
        dark: "bg-gray-700 text-white hover:bg-gray-900 active:bg-gray-900 disabled:bg-gray-300",
      },
      size: {
        small: "h-8 px-3 py-1 text-[13px] leading-[18px] has-[>svg]:px-2.5",
        medium: "h-10 px-4 py-2 text-sm leading-5 has-[>svg]:px-4",
        large: "h-11 px-6 py-2 text-base leading-6 has-[>svg]:px-6",
      },
    },
    compoundVariants: [
      // Link ignores size-driven height/padding — dimension follows content
      {
        variant: "link",
        size: ["small", "medium", "large"],
        class: "h-auto px-0 py-0 has-[>svg]:px-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  }
);

interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "color">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
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
          buttonVariants({ variant, size, className }),
          blockedByLoading && "pointer-events-none"
        )}
        data-slot="button"
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
        {asChild ? (
          children
        ) : (
          <>
            {loading && (
              <LoaderCircleIcon className="size-4 animate-spin" role="status" />
            )}
            {children}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
