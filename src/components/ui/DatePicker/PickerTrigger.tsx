"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronDownIcon } from "../../icons.v2";

export type PickerTriggerState = "default" | "error" | "success";
export type PickerTriggerSize = "small" | "medium" | "large";

// Mirrors the Button size scale so a picker lines up with the buttons around it.
const SIZE_CLASSNAMES: Record<PickerTriggerSize, string> = {
  small: "h-8 px-3 py-1 text-[13px] leading-[18px]",
  medium: "h-10 px-4 py-2 text-sm leading-5",
  large: "h-11 px-6 py-2 text-base leading-6",
};

interface PickerTriggerProps extends React.ComponentProps<"button"> {
  label: React.ReactNode;
  hasValue: boolean;
  state?: PickerTriggerState;
  size?: PickerTriggerSize;
  showIcon?: boolean;
  showChevron?: boolean;
}

/**
 * Internal trigger shared by DatePicker, DateRangePicker and MonthYearPicker (not exported
 * from the package). Rendered through `PopoverTrigger asChild`, so Radix's
 * ref, handlers and aria/data attributes arrive through `props`.
 */
export function PickerTrigger({
  label,
  hasValue,
  state,
  size = "medium",
  showIcon = true,
  showChevron = true,
  className,
  disabled,
  ...props
}: PickerTriggerProps) {
  const valueId = React.useId();
  const isInvalid = state === "error" || Boolean(props["aria-invalid"]);
  const isSuccess = state === "success" && !isInvalid;
  const contentColor = cn(
    hasValue ? "text-gray-700" : "text-gray-600",
    disabled && "text-gray-400"
  );

  // A `<label for>` outranks the content in a button's accessible name, so the
  // selected value would go unannounced; it goes in the description instead.
  // Skipped when the host composes `aria-labelledby` with the value itself.
  const describesValue =
    hasValue && Boolean(props.id) && !props["aria-labelledby"];
  const describedBy =
    [props["aria-describedby"], describesValue && valueId]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <button
      {...props}
      aria-describedby={describedBy}
      aria-invalid={isInvalid}
      className={cn(
        "flex cursor-pointer items-center rounded-md border border-gray-300 bg-white outline-none transition",
        SIZE_CLASSNAMES[size],
        "focus-visible:ring-2 focus-visible:ring-purple-400/15",
        "data-[state=open]:ring-2 data-[state=open]:ring-purple-400/15",
        // Tailwind emits data-* after aria-*, so the purple focus/open
        // border is gated in JS to keep the error border visible.
        isInvalid
          ? "border-red-600"
          : "focus-visible:border-purple-800 data-[state=open]:border-purple-800",
        "disabled:cursor-not-allowed disabled:bg-gray-50",
        isSuccess && "border-green-500",
        className
      )}
      disabled={disabled}
      type="button"
    >
      {showIcon && (
        <CalendarIcon
          aria-hidden="true"
          className={cn("size-4 shrink-0", contentColor)}
        />
      )}
      <span
        className={cn("flex-1 truncate text-left", contentColor)}
        id={valueId}
      >
        {label}
      </span>
      {showChevron && (
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0",
            contentColor,
            !disabled && "opacity-50"
          )}
        />
      )}
    </button>
  );
}
