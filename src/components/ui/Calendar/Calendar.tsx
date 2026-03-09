"use client";

import { format, isSameDay } from "date-fns";
import { ptBR as ptBRLocale } from "date-fns/locale";
import * as React from "react";
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { cn } from "../../../lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../icons";
import { MONTHS_PT_BR } from "./constants";
import type { PickerView } from "./hooks";
import { generateYearRange, parseDateString } from "./utils/date-utils";

// Calendar component definitions
const CalendarRoot = ({
  className,
  rootRef,
  pickerMode,
  displayMonth,
  onMonthChange,
  onPickerModeChange,
  ...props
}: {
  className?: string;
  rootRef?: React.Ref<HTMLDivElement>;
  pickerMode?: PickerView;
  displayMonth?: Date;
  onMonthChange?: (date: Date) => void;
  onPickerModeChange?: (mode: PickerView) => void;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const currentYear = displayMonth?.getFullYear() || new Date().getFullYear();
  const years = generateYearRange(currentYear, 6);

  const handleMonthSelect = (monthIndex: number) => {
    if (displayMonth && onMonthChange) {
      const newDate = new Date(displayMonth.getFullYear(), monthIndex, 1);
      onMonthChange(newDate);
      onPickerModeChange?.("days");
    }
  };

  const handleYearSelect = (year: number) => {
    if (displayMonth && onMonthChange) {
      const newDate = new Date(year, displayMonth.getMonth(), 1);
      onMonthChange(newDate);
      onPickerModeChange?.("days");
    }
  };

  const renderPickerList = () => {
    if (pickerMode === "months" && displayMonth) {
      return (
        <div className="-mx-3 absolute inset-x-0 top-16 bottom-0 z-30 flex flex-col overflow-y-auto border-gray-300 border-t bg-white px-2 pb-2">
          {MONTHS_PT_BR.map((month, index) => {
            const isSelected = displayMonth.getMonth() === index;
            return (
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-left font-normal text-base transition-colors",
                  isSelected ? "bg-purple-300 text-sm" : "hover:bg-gray-100"
                )}
                key={month}
                onClick={() => handleMonthSelect(index)}
                type="button"
              >
                {isSelected && (
                  <CheckIcon className="size-5" color={"purple-900"} />
                )}
                <span className={cn(!isSelected && "ml-6")}>{month}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (pickerMode === "years" && displayMonth) {
      return (
        <div className="-mx-3 absolute inset-x-0 top-16 bottom-0 z-30 flex flex-col overflow-y-auto border-gray-300 border-t bg-white px-2 pb-2">
          {years.map((year) => {
            const isSelected = displayMonth.getFullYear() === year;
            return (
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-left font-normal text-base transition-colors",
                  isSelected ? "bg-purple-300 text-sm" : "hover:bg-gray-100"
                )}
                key={year}
                onClick={() => handleYearSelect(year)}
                type="button"
              >
                {isSelected && (
                  <CheckIcon className="size-5" color={"purple-900"} />
                )}
                <span className={cn(!isSelected && "ml-6")}>{year}</span>
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      {...props}
      className={cn(className, "relative")}
      data-slot="calendar"
      ref={rootRef}
    >
      {props.children}
      {renderPickerList()}
    </div>
  );
};

const CalendarChevron = () => <></>;

const CalendarWeekNumber = ({
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td {...props}>
    <div className="flex size-(--cell-size) items-center justify-center text-center">
      {children}
    </div>
  </td>
);

interface CalendarMonthCaptionProps {
  displayMonth: Date;
  pickerMode: PickerView;
  onPickerModeChange: (mode: PickerView) => void;
  onMonthChange?: (date: Date) => void;
}

const CalendarMonthCaption = ({
  displayMonth,
  pickerMode,
  onPickerModeChange,
  onMonthChange,
}: CalendarMonthCaptionProps) => {
  const handlePreviousMonth = () => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange?.(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange?.(newDate);
  };

  const handlePreviousYear = () => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(newDate.getFullYear() - 1);
    onMonthChange?.(newDate);
  };

  const handleNextYear = () => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(newDate.getFullYear() + 1);
    onMonthChange?.(newDate);
  };

  return (
    <div className="relative z-10 flex items-center justify-center gap-4 py-2">
      {/* Month Section */}
      <div className="flex items-center gap-1">
        <button
          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-purple-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePreviousMonth();
          }}
          type="button"
        >
          <ChevronLeftIcon className="size-5" />
        </button>

        <button
          className="!text-pur relative z-20 flex cursor-pointer items-center gap-1.5 rounded-2xl bg-white px-3 py-0.5 font-medium text-sm transition-all hover:bg-gray-100 active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPickerModeChange(pickerMode === "months" ? "days" : "months");
          }}
          type="button"
        >
          {(() => {
            const month = format(displayMonth, "MMM", { locale: ptBRLocale });
            return month.charAt(0).toUpperCase() + month.slice(1);
          })()}
          <ChevronDownIcon className="size-6" color={"purple-900"} />
        </button>

        <button
          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-purple-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNextMonth();
          }}
          type="button"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>

      {/* Year Section */}
      <div className="flex items-center gap-1">
        <button
          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-purple-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePreviousYear();
          }}
          type="button"
        >
          <ChevronLeftIcon className="size-5" />
        </button>

        <button
          className="!text-purple-900 relative z-20 flex cursor-pointer items-center gap-1.5 rounded-2xl bg-white px-3 py-0.5 font-medium text-sm transition-all hover:bg-gray-100 active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPickerModeChange(pickerMode === "years" ? "days" : "years");
          }}
          type="button"
        >
          {displayMonth.getFullYear()}
          <ChevronDownIcon className="size-6" color={"purple-900"} />
        </button>

        <button
          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-purple-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNextYear();
          }}
          type="button"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
};

// Wrapper components to pass additional props
const createCalendarRootWrapper =
  (
    displayMonth: Date,
    pickerMode: PickerView,
    onMonthChange: (date: Date) => void,
    onPickerModeChange: (mode: PickerView) => void
  ) =>
  (props: any) => (
    <CalendarRoot
      {...props}
      displayMonth={displayMonth}
      onMonthChange={onMonthChange}
      onPickerModeChange={onPickerModeChange}
      pickerMode={pickerMode}
    />
  );

const createCalendarCaptionWrapper =
  (
    displayMonth: Date,
    pickerMode: PickerView,
    onPickerModeChange: (mode: PickerView) => void,
    onMonthChange: (date: Date) => void
  ) =>
  () => (
    <CalendarMonthCaption
      displayMonth={displayMonth}
      onMonthChange={onMonthChange}
      onPickerModeChange={onPickerModeChange}
      pickerMode={pickerMode}
    />
  );

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  formatters,
  components,
  locale = ptBR,
  month: controlledMonth,
  onMonthChange,
  enabledDates,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  enabledDates?: Date[] | string[];
}) {
  const defaultClassNames = getDefaultClassNames();
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    controlledMonth || new Date()
  );
  const [pickerMode, setPickerMode] = React.useState<PickerView>("days");

  const displayMonth = controlledMonth || internalMonth;

  const handleMonthChange = (date: Date) => {
    if (!controlledMonth) {
      setInternalMonth(date);
    }
    onMonthChange?.(date);
  };

  // Convert enabledDates to Date objects and create disabled matcher
  const disabledMatcher = React.useMemo(() => {
    if (!enabledDates || enabledDates.length === 0) {
      return props.disabled;
    }

    return (date: Date) => {
      const parsedDates = enabledDates
        .map((d: Date | string) =>
          typeof d === "string" ? parseDateString(d) : d
        )
        .filter((d: Date | null): d is Date => d !== null);

      return !parsedDates.some((enabledDate: Date) =>
        isSameDay(enabledDate, date)
      );
    };
  }, [enabledDates, props.disabled]);

  const customFormatters = {
    formatWeekdayName: (date: Date) =>
      format(date, "EEEEE", { locale: ptBRLocale }),
    ...formatters,
  };

  return (
    <DayPicker
      captionLayout="label"
      className={cn(
        "group/calendar overflow-hidden bg-background p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      classNames={{
        root: cn("w-[360px]", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex h-(--cell-size) w-full items-center justify-between",
          pickerMode !== "days" && "hidden",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "inline-flex items-center justify-center rounded-full transition-colors hover:bg-purple-300",
          "size-7 select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "inline-flex items-center justify-center rounded-full transition-colors hover:bg-purple-300",
          "size-7 select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "relative z-10 flex w-full items-center justify-center px-(--cell-size) py-2",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-6 font-medium text-md",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-full px-2 hover:bg-purple-300",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-8 items-center gap-1 rounded-md pr-1 pl-2 font-medium text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none rounded-md font-normal text-base text-gray-900",
          defaultClassNames.weekday
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "select-none text-[0.8rem] text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none rounded-full p-0 text-center",
          defaultClassNames.day
        ),
        outside: cn(
          "text-gray-600 aria-selected:text-gray-600",
          defaultClassNames.outside
        ),
        selected: cn(
          "group/day relative aspect-square h-full w-full select-none rounded-full p-0 text-center hover:bg-gray-300",
          defaultClassNames.selected
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: createCalendarRootWrapper(
          displayMonth,
          pickerMode,
          handleMonthChange,
          setPickerMode
        ),
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        CaptionLabel: createCalendarCaptionWrapper(
          displayMonth,
          pickerMode,
          setPickerMode,
          handleMonthChange
        ),
        ...components,
      }}
      disabled={disabledMatcher}
      formatters={customFormatters}
      locale={locale}
      month={displayMonth}
      onMonthChange={handleMonthChange}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors",
        !modifiers.disabled &&
          "hover:bg-gray-100 dark:hover:text-accent-foreground",
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal text-base text-gray-900 leading-none data-[range-end=true]:rounded-full data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-full data-[range-end=true]:rounded-r-md data-[range-start=true]:rounded-l-md data-[range-end=true]:bg-purple-900 data-[range-middle=true]:bg-accent data-[range-start=true]:bg-purple-900 data-[selected-single=true]:bg-purple-900 data-[range-end=true]:text-gray-900 data-[range-middle=true]:text-accent-foreground data-[range-start=true]:text-white data-[selected-single=true]:text-white group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-0 group-data-[focused=true]/day:ring-0 [&>span]:text-base [&>span]:opacity-70",
        defaultClassNames.day,
        modifiers.outside && !modifiers.selected && "text-gray-600!",
        className
      )}
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected}
      ref={ref}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
