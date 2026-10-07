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
  disabledDates?: Date[];
  state?: "default" | "error" | "success";
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  className,
  disabled,
  disabledDates,
  state = "default",
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

  const isInvalid = state === "error" || Boolean(props["aria-invalid"]);
  const isSuccess = state === "success" && !isInvalid;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled}>
        <div
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 transition",
            "focus-within:border-purple-800 focus-within:ring-2 focus-within:ring-purple-400/15",
            "has-aria-invalid:border-red-600",
            disabled &&
              "pointer-events-none cursor-not-allowed select-none bg-gray-50",
            isSuccess && "border-green-500",
            className
          )}
        >
          <input
            aria-invalid={isInvalid}
            className={cn(
              "w-full bg-white p-0 text-gray-800 text-sm leading-5 outline-none transition placeholder:text-gray-500",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:opacity-50",
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
              "block shrink-0 text-gray-600 transition [&_svg]:size-4",
              disabled && "text-gray-400"
            )}
          >
            <CalendarIcon size="sm" />
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
          disabled={disabledDates}
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
