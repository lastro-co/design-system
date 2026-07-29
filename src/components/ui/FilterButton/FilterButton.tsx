"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { TuneIcon } from "../../icons";
import { Button } from "../Button";

export interface FilterButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
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
      <Button
        className={className}
        disabled={disabled}
        ref={ref}
        size="small"
        variant="outlined"
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
      </Button>
    );
  }
);

FilterButton.displayName = "FilterButton";
