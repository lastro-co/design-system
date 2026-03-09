import { cn } from "../../../../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../../../icons";
import { MONTHS_PT_BR } from "../constants";

interface MonthPickerProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthSelect: (month: number) => void;
  onYearChange: (direction: "prev" | "next") => void;
}

export function MonthPicker({
  selectedMonth,
  selectedYear,
  onMonthSelect,
  onYearChange,
}: MonthPickerProps) {
  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex items-center justify-between">
        <button
          className="group flex size-8 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-purple-100"
          onClick={() => onYearChange("prev")}
          type="button"
        >
          <ChevronLeftIcon className="size-5 text-purple-800 transition group-hover:text-purple-900" />
        </button>
        <span className="font-semibold text-purple-900">{selectedYear}</span>
        <button
          className="group flex size-8 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-purple-100"
          onClick={() => onYearChange("next")}
          type="button"
        >
          <ChevronRightIcon className="size-5 text-purple-800 transition group-hover:text-purple-900" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {MONTHS_PT_BR.map((month, index) => (
          <button
            className={cn(
              "rounded-lg px-4 py-2 font-medium text-sm transition",
              index === selectedMonth
                ? "bg-purple-800 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-purple-100"
            )}
            key={month}
            onClick={() => onMonthSelect(index)}
            type="button"
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}
