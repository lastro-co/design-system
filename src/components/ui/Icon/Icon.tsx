import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentProps, FC } from "react";
import { cn } from "../../../lib/utils";

const iconVariants = cva("flex items-center justify-center", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-10 w-10",
    },
    color: {
      "blue-600": "text-blue-600",
      "gray-600": "text-gray-600",
      "gray-900": "text-gray-900",
      "green-600": "text-green-600",
      "purple-800": "text-purple-800",
      "purple-900": "text-purple-900",
      "red-600": "text-red-600",
      white: "text-white",
      "yellow-600": "text-yellow-600",
    },
    variant: {
      outline: "",
      filled: "",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});

export interface IconProps
  extends Omit<ComponentProps<"svg">, "color">,
    VariantProps<typeof iconVariants> {
  children?: React.ReactNode;
  outline?: React.ReactNode;
  filled?: React.ReactNode;
  viewBox?: string;
  "aria-label": string;
}

const Icon: FC<IconProps> = ({
  size,
  color,
  variant,
  className,
  children,
  outline,
  filled,
  viewBox = "0 0 24 24",
  "aria-label": ariaLabel,
  ...props
}) => {
  const hasVariants = outline !== undefined && filled !== undefined;
  const resolvedVariant = hasVariants ? (variant ?? "outline") : undefined;

  let content: React.ReactNode;
  if (hasVariants) {
    content = resolvedVariant === "filled" ? filled : outline;
  } else {
    content = children;
  }

  const finalAriaLabel =
    hasVariants && resolvedVariant
      ? `${ariaLabel} ${resolvedVariant}`
      : ariaLabel;

  return (
    <svg
      aria-label={finalAriaLabel}
      className={cn(iconVariants({ size, color, variant }), className)}
      fill="currentColor"
      role="img"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{finalAriaLabel}</title>
      {content}
    </svg>
  );
};

Icon.displayName = "Icon";

export { Icon, iconVariants };
