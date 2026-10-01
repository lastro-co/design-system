"use client";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../../icons.v2";
import type { buttonVariants } from "../Button";
import type { PickerTriggerState } from "../DatePicker/PickerTrigger";
import { PickerTrigger } from "../DatePicker/PickerTrigger";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { CALENDAR_SURFACE_CLASSNAME } from "./Calendar";
import { MONTHS_PT_BR, MONTHS_PT_BR_SHORT } from "./constants";

const DEFAULT_MIN_YEAR = 2024;

const YEAR_NAV_BUTTON_CLASSNAME =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:cursor-default disabled:opacity-30";

export interface MonthYearPickerProps
  extends Omit<
    React.ComponentProps<"button">,
    "value" | "onChange" | "children"
  > {
  /** Last selectable month (1-12) within `maxYear`. Defaults to the current month. */
  maxMonth?: number;
  maxYear?: number;
  minYear?: number;
  /** Selected month, 1-indexed (1 = Janeiro). Leave empty for no selection. */
  month?: number;
  /** Receives the picked month (1-indexed) and year. */
  onChange: (month: number, year: number) => void;
  placeholder?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  state?: PickerTriggerState;
  /** Overrides "today" for the current-month marker and the `maxYear`/`maxMonth` defaults. */
  today?: Date;
  year?: number;
}

export function MonthYearPicker({
  maxMonth: maxMonthProp,
  maxYear: maxYearProp,
  minYear = DEFAULT_MIN_YEAR,
  month,
  onChange,
  placeholder = "Selecione o mês",
  size,
  state = "default",
  today,
  year,
  className,
  disabled,
  ...props
}: MonthYearPickerProps) {
  const now = today ?? new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const maxYear = maxYearProp ?? currentYear;
  const maxMonth = maxMonthProp ?? currentMonth;
  const hasValue = month !== undefined && year !== undefined;

  const [open, setOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(year ?? currentYear);

  const handleMonthClick = (selectedMonth: number) => {
    onChange(selectedMonth, displayYear);
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setDisplayYear(year ?? currentYear);
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger asChild>
        <PickerTrigger
          {...props}
          // Figma 1279:2013 / 1279:2024: no calendar icon, the chevron in both
          // states, and the trigger hugs its label.
          className={cn("w-fit gap-2", className)}
          disabled={disabled}
          hasValue={hasValue}
          label={hasValue ? `${MONTHS_PT_BR[month - 1]}, ${year}` : placeholder}
          showIcon={false}
          size={size ?? "medium"}
          state={state}
        />
      </PopoverTrigger>

      <PopoverContent
        // End-aligned (unlike DatePicker/DateRangePicker): consumers place this
        // picker in right-aligned page-title actions, so opening leftwards keeps
        // it on screen.
        align="end"
        // The inner container draws the Calendar surface; dropping the
        // popover's avoids a double border and shadow.
        className="w-auto border-0 bg-transparent p-0 shadow-none"
      >
        <div className={cn("w-fit p-4", CALENDAR_SURFACE_CLASSNAME)}>
          <div className="flex w-56.5 flex-col gap-4">
            <div className="flex items-center justify-between">
              <button
                aria-label="Ano anterior"
                className={YEAR_NAV_BUTTON_CLASSNAME}
                disabled={displayYear <= minYear}
                onClick={() => setDisplayYear((y) => y - 1)}
                type="button"
              >
                <ChevronLeftIcon aria-hidden="true" className="size-4" />
              </button>
              <span className="font-semibold text-gray-900 text-sm leading-5">
                {displayYear}
              </span>
              <button
                aria-label="Próximo ano"
                className={YEAR_NAV_BUTTON_CLASSNAME}
                disabled={displayYear >= maxYear}
                onClick={() => setDisplayYear((y) => y + 1)}
                type="button"
              >
                <ChevronRightIcon aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {MONTHS_PT_BR_SHORT.map((label, index) => {
                const monthNumber = index + 1;
                const isSelected =
                  hasValue && monthNumber === month && displayYear === year;
                const isCurrent =
                  displayYear === currentYear && monthNumber === currentMonth;
                const isFuture =
                  displayYear === maxYear && monthNumber > maxMonth;

                return (
                  <button
                    aria-current={isCurrent ? "date" : undefined}
                    aria-pressed={isSelected}
                    className={cn(
                      "h-10 cursor-pointer rounded-lg text-[13px] leading-[19.5px] transition-colors",
                      isSelected
                        ? "bg-purple-800 font-medium text-white shadow-xxs"
                        : "text-gray-600 hover:bg-gray-100",
                      isCurrent &&
                        !isSelected &&
                        "font-semibold text-purple-800",
                      isFuture &&
                        "pointer-events-none cursor-default opacity-30"
                    )}
                    disabled={isFuture}
                    key={label}
                    onClick={() => handleMonthClick(monthNumber)}
                    type="button"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
