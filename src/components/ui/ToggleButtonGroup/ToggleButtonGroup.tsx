"use client";

import type { VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { Button } from "../Button";
import type { buttonVariants } from "../Button/Button";

interface ToggleButtonGroupOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleButtonGroupProps<T extends string> {
  options: ToggleButtonGroupOption<T>[];
  value: T | undefined;
  onValueChange: (value: T) => void;
  className?: string;
  buttonProps?: Omit<
    React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>,
    "onClick" | "children" | "variant"
  >;
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
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <Button
            {...buttonProps}
            color="purple"
            key={option.value}
            onClick={() => onValueChange(option.value)}
            shape="pill"
            size="small"
            type="button"
            variant={isSelected ? "contained" : "outlined"}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
