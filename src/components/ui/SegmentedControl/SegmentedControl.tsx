"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const segmentedControlVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-lg bg-gray-100 p-1"
);

const segmentVariants = cva([
  "cursor-pointer rounded-md px-3 py-1.5 font-medium text-sm",
  "outline-none transition-colors",
  "focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-1",
  "disabled:cursor-default disabled:opacity-45",
  // Styled off Radix's data-state rather than a value comparison in JS: Radix
  // already owns which segment is checked, and this is how the DS's other
  // Radix-backed components do it (RadioGroup, Checkbox).
  //
  // Only the checked segment carries a surface — that is the whole point of
  // the pattern: the track reads as one control, not a row of buttons.
  // shadow-xxs, not shadow-sm: in this DS --shadow-sm is `0 0 16px` with no
  // offset — a 16px blur on a pill this tall spills past the track. --shadow-xxs
  // is the ramp's only offset shadow. It has no other consumer yet, so design
  // signs this off alongside the rest of the values.
  "data-[state=checked]:bg-white data-[state=checked]:text-gray-900",
  "data-[state=checked]:shadow-xxs",
  "data-[state=unchecked]:bg-transparent data-[state=unchecked]:text-gray-600",
  "data-[state=unchecked]:hover:text-gray-800",
]);

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
  "aria-label": string;
}

/**
 * A single control that switches between mutually exclusive views.
 *
 * Pick between the four selectors this DS ships: `Tabs` navigates between
 * sections (underline, no track); `ToggleButtonGroup` is independent pill
 * filters; `ToggleChip` is one standalone chip; `SegmentedControl` is for
 * exclusive options that swap the same view.
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
          className={cn(segmentVariants())}
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
