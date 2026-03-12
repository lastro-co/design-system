"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { TuneIcon } from "../../icons";

export interface FilterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text label for the button */
  label?: string;
  /** Position of the label relative to icon/counter */
  labelPosition?: "left" | "right";
  /** Number of active filters (shows counter badge when > 0) */
  count?: number;
  /** Custom icon to display (defaults to TuneIcon) */
  icon?: React.ReactNode;
  /** Whether to show the icon when count > 0 (default: false, shows counter instead) */
  showIconWithCount?: boolean;
}

/**
 * A reusable filter button with optional counter badge
 *
 * @example
 * // Basic usage
 * <FilterButton label="Filtros" count={3} onClick={handleClick} />
 *
 * @example
 * // With label on right
 * <FilterButton label="Filter" labelPosition="right" count={0} />
 *
 * @example
 * // With custom icon
 * <FilterButton label="Sort" icon={<SortIcon />} count={1} />
 */
export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    {
      label = "Filtros",
      labelPosition = "left",
      count = 0,
      icon,
      showIconWithCount = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const hasActiveFilters = count > 0;
    const IconComponent = icon ?? (
      <TuneIcon
        className={cn(disabled ? "text-gray-600" : "text-purple-800")}
      />
    );

    const labelElement = label && (
      <span
        className={cn(
          "font-normal font-sans text-sm",
          hasActiveFilters ? "text-purple-900" : "text-gray-600",
          disabled && "text-gray-400"
        )}
      >
        {label}
      </span>
    );

    const counterElement = hasActiveFilters && (
      <span
        className={cn(
          "flex items-center justify-center",
          "size-5 rounded-full",
          "bg-purple-500 text-white",
          "font-display font-medium text-xs leading-none"
        )}
      >
        {count}
      </span>
    );

    const iconOrCounter =
      hasActiveFilters && !showIconWithCount ? counterElement : IconComponent;

    return (
      <button
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-4 py-2",
          "cursor-pointer transition-colors duration-200",
          hasActiveFilters
            ? "border-purple-100 bg-purple-100"
            : "border-gray-200 bg-white hover:bg-gray-50",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        disabled={disabled}
        ref={ref}
        type="button"
        {...props}
      >
        {labelPosition === "left" ? (
          <>
            {labelElement}
            {iconOrCounter}
            {showIconWithCount && hasActiveFilters && counterElement}
          </>
        ) : (
          <>
            {iconOrCounter}
            {showIconWithCount && hasActiveFilters && counterElement}
            {labelElement}
          </>
        )}
      </button>
    );
  }
);

FilterButton.displayName = "FilterButton";
