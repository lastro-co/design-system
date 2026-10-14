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
        "inline-flex h-8 cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-full border px-2 font-normal font-text text-sm leading-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 disabled:cursor-not-allowed disabled:opacity-45",
        selected
          ? "border-purple-800/10 bg-purple-100 text-purple-800"
          : "border-gray-200 bg-white text-gray-600 hover:border-purple-100",
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
