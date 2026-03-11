"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../icons";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { MONTHS_PT_BR, MONTHS_PT_BR_SHORT } from "./constants";

export interface MonthYearPickerProps {
  maxMonth?: number;
  maxYear?: number;
  minYear?: number;
  month: number;
  onChange: (month: number, year: number) => void;
  year: number;
}

export function MonthYearPicker({
  maxMonth: maxMonthProp,
  maxYear: maxYearProp,
  minYear = 2024,
  month,
  onChange,
  year,
}: MonthYearPickerProps) {
  const now = new Date();
  const maxYear = maxYearProp ?? now.getFullYear();
  const maxMonth = maxMonthProp ?? now.getMonth() + 1;
  const [open, setOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(year);

  const handleMonthClick = (selectedMonth: number) => {
    onChange(selectedMonth, displayYear);
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setDisplayYear(year);
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger asChild>
        <button
          className="flex h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-gray-300 bg-white px-4 text-gray-900 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
          type="button"
        >
          {MONTHS_PT_BR[month - 1]}, {year}
          <ChevronDownIcon className="size-5 text-purple-600" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-3">
        {/* Year navigation */}
        <div className="mb-3 flex items-center justify-between">
          <button
            aria-label="Ano anterior"
            className={cn(
              "cursor-pointer rounded p-1 text-gray-600 hover:bg-gray-100",
              displayYear <= minYear &&
                "pointer-events-none cursor-default opacity-30"
            )}
            disabled={displayYear <= minYear}
            onClick={() => setDisplayYear((y) => y - 1)}
            type="button"
          >
            <ChevronLeftIcon size="sm" />
          </button>
          <span className="font-medium text-gray-900 text-sm">
            {displayYear}
          </span>
          <button
            aria-label="Próximo ano"
            className={cn(
              "cursor-pointer rounded p-1 text-gray-600 hover:bg-gray-100",
              displayYear >= maxYear &&
                "pointer-events-none cursor-default opacity-30"
            )}
            disabled={displayYear >= maxYear}
            onClick={() => setDisplayYear((y) => y + 1)}
            type="button"
          >
            <ChevronRightIcon size="sm" />
          </button>
        </div>

        {/* 4x3 month grid */}
        <div className="grid grid-cols-4 gap-1">
          {MONTHS_PT_BR_SHORT.map((label, index) => {
            const monthNumber = index + 1;
            const isSelected = monthNumber === month && displayYear === year;
            const isFuture = displayYear === maxYear && monthNumber > maxMonth;

            return (
              <button
                className={cn(
                  "cursor-pointer rounded-md px-2 py-1.5 text-sm transition hover:bg-gray-100",
                  isSelected
                    ? "bg-purple-100 font-medium text-purple-800 hover:bg-purple-200"
                    : "text-gray-700",
                  isFuture && "pointer-events-none cursor-default opacity-30"
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
      </PopoverContent>
    </Popover>
  );
}
