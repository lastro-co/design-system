import { useState } from "react";

export type PickerView = "days" | "months" | "years";

interface UseCalendarStateProps {
  initialMonth?: Date;
}

interface UseCalendarStateReturn {
  pickerView: PickerView;
  setPickerView: (view: PickerView) => void;
  currentMonth: Date;
  setCurrentMonth: (month: Date) => void;
  handleMonthSelect: (monthIndex: number) => void;
  handleYearSelect: (year: number) => void;
  handleMonthYearChange: (direction: "prev" | "next") => void;
  handleYearNavigate: (direction: "prev" | "next") => void;
}

export function useCalendarState({
  initialMonth,
}: UseCalendarStateProps = {}): UseCalendarStateReturn {
  const [pickerView, setPickerView] = useState<PickerView>("days");
  const [currentMonth, setCurrentMonth] = useState<Date>(
    initialMonth || new Date()
  );

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1);
    setCurrentMonth(newDate);
    setPickerView("days");
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentMonth.getMonth(), 1);
    setCurrentMonth(newDate);
    setPickerView("days");
  };

  const handleMonthYearChange = (direction: "prev" | "next") => {
    const newYear =
      direction === "prev"
        ? currentMonth.getFullYear() - 1
        : currentMonth.getFullYear() + 1;
    const newDate = new Date(newYear, currentMonth.getMonth(), 1);
    setCurrentMonth(newDate);
  };

  const handleYearNavigate = (direction: "prev" | "next") => {
    const yearChange = direction === "prev" ? -100 : 100;
    const newDate = new Date(
      currentMonth.getFullYear() + yearChange,
      currentMonth.getMonth(),
      1
    );
    setCurrentMonth(newDate);
  };

  return {
    pickerView,
    setPickerView,
    currentMonth,
    setCurrentMonth,
    handleMonthSelect,
    handleYearSelect,
    handleMonthYearChange,
    handleYearNavigate,
  };
}
