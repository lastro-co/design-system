"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const segmentedControlVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-lg bg-gray-100 p-1"
);

const segmentVariants = cva(
  [
    "cursor-pointer rounded-md px-3 py-1.5 font-medium text-sm",
    "outline-none transition-colors",
    "focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-1",
    "disabled:cursor-default disabled:opacity-45",
  ],
  {
    variants: {
      // Only the selected segment carries a surface. That is the whole point of
      // the pattern: the track reads as one control, not as a row of buttons.
      isActive: {
        true: "bg-white text-gray-900 shadow-sm",
        false: "bg-transparent text-gray-600 hover:text-gray-800",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SegmentedControlProps<T extends string>
  extends Omit<
    React.ComponentProps<typeof RadioGroupPrimitive.Root>,
    "value" | "onValueChange" | "children" | "orientation"
  > {
  options: SegmentedControlOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** Names the group for assistive tech. Required — a control with three
   * unlabelled options tells a screen reader nothing about what it switches. */
  "aria-label": string;
}

/**
 * A single control that switches between mutually exclusive views.
 *
 * Built on Radix's radio group rather than on Button: the selected state has to
 * reach assistive tech as `aria-checked`, which a row of buttons conveys by
 * colour alone. Radix also gives arrow-key navigation, which is what users of
 * this pattern expect.
 */
function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn(segmentedControlVariants(), className)}
      data-slot="segmented-control"
      onValueChange={(next) => onValueChange(next as T)}
      orientation="horizontal"
      value={value}
      {...props}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          className={cn(segmentVariants({ isActive: value === option.value }))}
          data-slot="segment"
          disabled={option.disabled}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}

export { SegmentedControl, segmentedControlVariants, segmentVariants };
export type { SegmentedControlOption, SegmentedControlProps };
