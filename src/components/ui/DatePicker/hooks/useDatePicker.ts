import { format } from "date-fns";
import { useState } from "react";

import { formatInputDate } from "../utils/date-format";
import { parseInputDate } from "../utils/date-validation";

export interface UseDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export interface UseDatePickerReturn {
  inputValue: string;
  open: boolean;
  month: Date | undefined;
  setOpen: (open: boolean) => void;
  setMonth: (month: Date | undefined) => void;
  handleInputChange: (value: string) => void;
  handleCalendarSelect: (date: Date | undefined) => void;
}

/**
 * Custom hook to manage DatePicker state and logic
 * Handles input formatting, validation, and calendar interaction
 */
export function useDatePicker({
  value,
  onChange,
}: UseDatePickerProps): UseDatePickerReturn {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(value || new Date());
  const [inputValue, setInputValue] = useState(
    value ? format(value, "dd/MM/yyyy") : ""
  );

  const handleInputChange = (value: string) => {
    const formatted = formatInputDate(value);
    setInputValue(formatted);

    if (formatted === "") {
      onChange?.(undefined);
      return;
    }

    const date = parseInputDate(formatted);
    if (date) {
      onChange?.(date);
      setMonth(date);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    onChange?.(date);
    setInputValue(date ? format(date, "dd/MM/yyyy") : "");
    setOpen(false);
  };

  return {
    inputValue,
    open,
    month,
    setOpen,
    setMonth,
    handleInputChange,
    handleCalendarSelect,
  };
}
