import type * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleChipProps
  extends Omit<React.ComponentProps<"button">, "onClick" | "onChange"> {
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
}

function ToggleChip({
  selected,
  onSelectedChange,
  className,
  children,
  ...props
}: ToggleChipProps) {
  return (
    <button
      {...props}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600",
        selected
          ? "border-purple-600 bg-purple-50 text-purple-800"
          : "border-gray-200 bg-white text-gray-700 hover:border-purple-100",
        className
      )}
      onClick={() => onSelectedChange(!selected)}
      type="button"
    >
      {children}
    </button>
  );
}

export { ToggleChip, type ToggleChipProps };
