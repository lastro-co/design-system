"use client";

import { forwardRef } from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../Button";
import { FilterButton, type FilterButtonProps } from "../FilterButton";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

export interface FilterPopoverProps {
  /** Whether the popover is open */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Title displayed in the popover header */
  title?: string;
  /** Number of active filters (passed to FilterButton) */
  count?: number;
  /** Whether the filter is disabled */
  disabled?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Callback when submit button is clicked */
  onSubmit?: () => void;
  /** Text for the submit button */
  submitLabel?: string;
  /** Text for the clear button */
  clearLabel?: string;
  /** Filter content (fields, labels, etc.) */
  children: React.ReactNode;
  /** Additional props for the FilterButton trigger */
  filterButtonProps?: Partial<FilterButtonProps>;
  /** Alignment of the popover */
  align?: "start" | "center" | "end";
  /** Additional className for the popover content */
  className?: string;
}

/**
 * A reusable filter popover with title, clear button, and submit button
 *
 * @example
 * // Basic usage
 * <FilterPopover
 *   title="Filtro de visitas"
 *   count={activeFilters}
 *   onClear={handleClear}
 *   onSubmit={handleSubmit}
 * >
 *   <RadioFilterGroup ... />
 *   <CheckboxFilterGroup ... />
 * </FilterPopover>
 *
 * @example
 * // Controlled open state
 * <FilterPopover
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Filters"
 *   count={3}
 *   onClear={() => reset()}
 *   onSubmit={() => applyFilters()}
 * >
 *   {children}
 * </FilterPopover>
 */
export const FilterPopover = forwardRef<HTMLButtonElement, FilterPopoverProps>(
  (
    {
      open,
      onOpenChange,
      title = "Filtros",
      count = 0,
      disabled = false,
      onClear,
      onSubmit,
      submitLabel = "Filtrar",
      clearLabel = "Limpar",
      children,
      filterButtonProps,
      align = "end",
      className,
    },
    ref
  ) => {
    // When disabled, always close the popover; otherwise preserve controlled/uncontrolled behavior
    const effectiveOpen = disabled ? false : open;

    return (
      <Popover onOpenChange={onOpenChange} open={effectiveOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <FilterButton
            count={count}
            disabled={disabled}
            ref={ref}
            {...filterButtonProps}
          />
        </PopoverTrigger>

        <PopoverContent
          align={align}
          className={cn("flex w-80 flex-col", className)}
        >
          <div className="flex shrink-0 items-center justify-between">
            <h3 className="font-medium text-base text-gray-900 leading-none">
              {title}
            </h3>
            {onClear && (
              <button
                className="cursor-pointer font-semibold text-purple-800 text-sm underline"
                onClick={onClear}
                type="button"
              >
                {clearLabel}
              </button>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

          {onSubmit && (
            <Button
              className="mt-6 w-full shrink-0"
              onClick={onSubmit}
              type="button"
            >
              {submitLabel}
            </Button>
          )}
        </PopoverContent>
      </Popover>
    );
  }
);

FilterPopover.displayName = "FilterPopover";
