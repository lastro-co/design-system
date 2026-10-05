import { LastroLoaderIcon } from "@/components/icons.v2";
import { cn } from "@/lib/utils";
import type { IconProps } from "../Icon";
import { iconVariants } from "../Icon";

function Spinner({
  className,
  size,
  color,
  variant: _variant,
  outline: _outline,
  filled: _filled,
  ...props
}: Omit<IconProps, "children" | "aria-label">) {
  return (
    <LastroLoaderIcon
      aria-label="Loader Icon"
      className={cn(iconVariants({ size, color }), "animate-spin", className)}
      role="status"
      {...props}
    />
  );
}

export { Spinner };
