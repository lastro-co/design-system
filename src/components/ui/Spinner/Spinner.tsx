import { cn } from "@/lib/utils";
import { LoaderIcon } from "../../icons";
import type { IconProps } from "../Icon";

function Spinner({
  className,
  size,
  ...props
}: Omit<IconProps, "children" | "aria-label">) {
  return (
    <LoaderIcon
      className={cn("animate-spin", className)}
      role="status"
      size={size}
      {...props}
    />
  );
}

export { Spinner };
