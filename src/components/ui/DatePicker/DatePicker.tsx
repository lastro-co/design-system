"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "../../icons";
import { Calendar, Popover, PopoverContent, PopoverTrigger } from "..";
import { useDatePicker } from "./hooks";

interface DatePickerProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  className,
  disabled,
  ...props
}: DatePickerProps) {
  const {
    inputValue,
    open,
    month,
    setOpen,
    setMonth,
    handleInputChange,
    handleCalendarSelect,
  } = useDatePicker({ value, onChange });

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled}>
        <div
          className={cn(
            "flex h-12 w-full items-center gap-3 rounded-md border border-gray-300 bg-white p-3 pl-4 transition",
            disabled &&
              "pointer-events-none cursor-not-allowed select-none bg-gray-100",
            props["aria-invalid"] && "border-red-600",
            className
          )}
        >
          <input
            className={cn(
              "w-full bg-transparent p-0 text-base text-gray-900 leading-5 outline-none transition placeholder:text-gray-600",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600",
              "selection:bg-text-gray-900 selection:text-purple-foreground"
            )}
            data-slot="input"
            disabled={disabled}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            type="text"
            value={inputValue}
            {...props}
          />
          <span
            className={cn(
              "block text-purple-800 transition",
              disabled && "text-gray-600"
            )}
          >
            <CalendarIcon size="lg" />
          </span>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        alignOffset={-8}
        className="w-auto overflow-hidden rounded-xl p-0"
        sideOffset={10}
      >
        <Calendar
          captionLayout="dropdown"
          mode="single"
          month={month}
          onMonthChange={setMonth}
          onSelect={handleCalendarSelect}
          selected={value}
        />
      </PopoverContent>
    </Popover>
  );
}
