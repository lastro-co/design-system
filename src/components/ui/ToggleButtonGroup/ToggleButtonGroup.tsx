"use client";

import { cn } from "@/lib/utils";
import { ToggleChip } from "../ToggleChip";

interface ToggleButtonGroupOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleButtonGroupProps<T extends string> {
  options: ToggleButtonGroupOption<T>[];
  value: T | undefined;
  onValueChange: (value: T) => void;
  className?: string;
  buttonProps?: Omit<React.ComponentProps<"button">, "onClick" | "children">;
}

export function ToggleButtonGroup<T extends string>({
  options,
  value,
  onValueChange,
  className,
  buttonProps = {},
}: ToggleButtonGroupProps<T>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {options.map((option) => (
        <ToggleChip
          {...buttonProps}
          key={option.value}
          // a group never deselects: clicking the active option re-emits it
          onSelectedChange={() => onValueChange(option.value)}
          selected={value === option.value}
        >
          {option.label}
        </ToggleChip>
      ))}
    </div>
  );
}
