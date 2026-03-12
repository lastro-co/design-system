import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../../../icons";
import { YEAR_RANGE } from "../constants";
import { generateYearRange } from "../utils/date-utils";

interface YearPickerProps {
  selectedYear: number;
  onYearSelect: (year: number) => void;
  onNavigate: (direction: "prev" | "next") => void;
}

export function YearPicker({
  selectedYear,
  onYearSelect,
  onNavigate,
}: YearPickerProps) {
  const years = generateYearRange(selectedYear, YEAR_RANGE);

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex items-center justify-between">
        <button
          className="group flex size-8 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-purple-100"
          onClick={() => onNavigate("prev")}
          type="button"
        >
          <ChevronLeftIcon className="size-5 text-purple-800 transition group-hover:text-purple-900" />
        </button>
        <span className="font-semibold text-purple-900">
          {years[0]} - {years.at(-1)}
        </span>
        <button
          className="group flex size-8 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-purple-100"
          onClick={() => onNavigate("next")}
          type="button"
        >
          <ChevronRightIcon className="size-5 text-purple-800 transition group-hover:text-purple-900" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {years.map((year) => (
          <button
            className={cn(
              "rounded-lg px-4 py-2 font-medium text-sm transition",
              year === selectedYear
                ? "bg-purple-800 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-purple-100"
            )}
            key={year}
            onClick={() => onYearSelect(year)}
            type="button"
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
