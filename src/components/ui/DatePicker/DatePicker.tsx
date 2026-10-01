"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as React from "react";
import type { Matcher } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar, Popover, PopoverContent, PopoverTrigger } from "..";
import type { PickerTriggerState } from "./PickerTrigger";
import { PickerTrigger } from "./PickerTrigger";

const LABEL_FORMAT = "d 'de' MMMM 'de' yyyy";

interface DatePickerProps
  extends Omit<
    React.ComponentProps<"button">,
    "value" | "onChange" | "children"
  > {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabledDates?: Matcher | Matcher[];
  state?: PickerTriggerState;
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
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <PickerTrigger
          {...props}
          className={cn("w-full gap-1.5", className)}
          disabled={disabled}
          hasValue={Boolean(value)}
          label={
            value ? format(value, LABEL_FORMAT, { locale: ptBR }) : placeholder
          }
          // Figma shows the chevron only while empty (1279:1581 vs 1279:1595).
          showChevron={!value}
          state={state}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        // The Calendar draws its own surface; dropping the popover's avoids a
        // double border and shadow.
        className="w-auto border-0 bg-transparent p-0 shadow-none"
      >
        {/* The content unmounts on close, so every open re-seeds the visible
            month from the current `value` (or today). */}
        <Calendar
          defaultMonth={value}
          disabled={disabledDates}
          mode="single"
          onSelect={handleSelect}
          selected={value}
        />
      </PopoverContent>
    </Popover>
  );
}
