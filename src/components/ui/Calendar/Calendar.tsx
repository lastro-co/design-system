"use client";

import { format, getDay, isSameDay } from "date-fns";
import { ptBR as ptBRLocale } from "date-fns/locale";
import * as React from "react";
import {
  type Chevron,
  type DateRange,
  type Day,
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/icons.v2";
import { cn } from "@/lib/utils";
import { MONTHS_PT_BR, WEEKDAYS_PT_BR_SHORT } from "./constants";
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
                  "flex cursor-pointer items-center gap-2 px-4 py-3 text-left font-normal text-base transition-colors",
                  isSelected ? "bg-purple-100 text-sm" : "hover:bg-gray-100"
                )}
                key={month}
                onClick={() => handleMonthSelect(index)}
                type="button"
              >
                {isSelected && <CheckIcon className="size-5 text-purple-900" />}
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
                  "flex cursor-pointer items-center gap-2 px-4 py-3 text-left font-normal text-base transition-colors",
                  isSelected ? "bg-purple-100 text-sm" : "hover:bg-gray-100"
                )}
                key={year}
                onClick={() => handleYearSelect(year)}
                type="button"
              >
                {isSelected && <CheckIcon className="size-5 text-purple-900" />}
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

const capitalizeFirst = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

// Dropdown caption: the custom caption draws its own chevrons, so the
// DayPicker nav buttons stay empty.
const CalendarChevron = () => <></>;

// Plain caption: the DayPicker nav buttons carry the chevrons.
const CalendarNavChevron = ({
  orientation,
}: React.ComponentProps<typeof Chevron>) =>
  orientation === "left" ? (
    <ChevronLeftIcon className="size-5 text-gray-600" />
  ) : (
    <ChevronRightIcon className="size-5 text-gray-600" />
  );

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
          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-purple-100"
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
          {capitalizeFirst(format(displayMonth, "MMM", { locale: ptBRLocale }))}
          <ChevronDownIcon className="size-6 text-purple-900" />
        </button>

        <button
          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-purple-100"
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
          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-purple-100"
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
          <ChevronDownIcon className="size-6 text-purple-900" />
        </button>

        <button
          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-purple-100"
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

export type CalendarPreset = {
  label: string;
  range: DateRange;
};

// Figma popover surface (DS-2026.2, node 1279:1607): gray-200 border, 6px
// radius and a soft drop shadow. The Calendar owns it so a standalone Calendar
// matches the design; hosts like the DatePicker popover drop their own.
// Exported for the sibling MonthYearPicker only; not part of the package API.
export const CALENDAR_SURFACE_CLASSNAME =
  "rounded-md border border-gray-200 bg-white shadow-sm";

const PRESET_ITEM_CLASSNAME =
  "w-full rounded-md px-3 py-2 text-left text-[13px] leading-5";
const PRESET_ITEM_ACTIVE_CLASSNAME = "bg-purple-50 font-medium text-purple-800";

function rangeMatchesPreset(
  selected: DateRange | undefined,
  preset: DateRange
): boolean {
  return Boolean(
    selected?.from &&
      selected.to &&
      preset.from &&
      preset.to &&
      isSameDay(selected.from, preset.from) &&
      isSameDay(selected.to, preset.to)
  );
}

// First selected date of any DayPicker mode: single, multiple or range.
function getSelectedMonth(selected: unknown): Date | undefined {
  if (selected instanceof Date) {
    return selected;
  }
  if (Array.isArray(selected)) {
    return selected[0];
  }
  return (selected as DateRange | undefined)?.from;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  formatters,
  components,
  locale = ptBR,
  month: controlledMonth,
  defaultMonth,
  onMonthChange,
  enabledDates,
  presets,
  onPresetSelect,
  customPresetLabel,
  presetsTitle = "Período",
  footer,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  enabledDates?: Date[] | string[];
  /** Opt-in range presets: renders a "Período" sidebar left of the grid. */
  presets?: CalendarPreset[];
  /** Fired when a preset item is clicked. */
  onPresetSelect?: (range: DateRange) => void;
  /** Read-only item shown when the complete selection matches no preset (e.g. "Personalizado"). */
  customPresetLabel?: string;
  /** Sidebar heading, rendered uppercase. Also names the preset group. */
  presetsTitle?: string;
  /** Optional row under the grid (e.g. Cancelar/Aplicar), drawn inside the same surface. */
  footer?: React.ReactNode;
}) {
  const defaultClassNames = getDefaultClassNames();
  // DayPicker always receives `month`, so an uncontrolled consumer's
  // `defaultMonth` has to seed the internal state instead.
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    () =>
      controlledMonth ??
      defaultMonth ??
      getSelectedMonth((props as { selected?: unknown }).selected) ??
      new Date()
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

  // `captionLayout="dropdown*"` keeps the legacy clickable month/year caption
  // (with the months/years picker lists). Any other value renders the plain
  // "Mês de AAAA" label with the nav chevrons at the outer edges.
  const isDropdownCaption = captionLayout.startsWith("dropdown");
  const hasPresets = Boolean(presets?.length);
  // Presets and the footer sit next to the grid, so the surface moves from
  // the DayPicker to a wrapper around all of them.
  const hasWrapper = hasPresets || Boolean(footer);

  const customFormatters = {
    formatCaption: (date: Date) =>
      capitalizeFirst(format(date, "LLLL 'de' yyyy", { locale: ptBRLocale })),
    formatWeekdayName: (date: Date) => WEEKDAYS_PT_BR_SHORT[getDay(date)],
    ...formatters,
  };

  const navButtonClassName = isDropdownCaption
    ? "size-7 select-none p-0 aria-disabled:opacity-50"
    : "absolute top-0 size-(--cell-size) cursor-pointer select-none p-0 hover:bg-gray-100 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

  const dayPicker = (
    <DayPicker
      captionLayout="label"
      className={cn(
        "group/calendar overflow-hidden p-4 [--cell-size:--spacing(8)]",
        // With presets or a footer the wrapper carries the surface instead.
        !hasWrapper &&
          cn(
            CALENDAR_SURFACE_CLASSNAME,
            "[[data-slot=card-content]_&]:bg-transparent"
          ),
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      classNames={{
        // Months are fixed at w-63, so the root hugs them instead of stretching
        // to its container.
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn(
          "flex flex-col gap-3",
          // Plain caption: 7 columns x 36px, the Figma month width, single or
          // side by side. The legacy dropdown caption needs ~308px for its two
          // chevron + pill groups, so it keeps its pre-Figma 336px month.
          isDropdownCaption ? "w-84" : "relative w-63",
          defaultClassNames.month
        ),
        nav: cn(
          "absolute inset-x-0 top-0 flex h-(--cell-size) w-full items-center justify-between",
          pickerMode !== "days" && "hidden",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "inline-flex items-center justify-center rounded-full transition-colors",
          isDropdownCaption ? "hover:bg-purple-100" : "left-0",
          navButtonClassName,
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "inline-flex items-center justify-center rounded-full transition-colors",
          isDropdownCaption ? "hover:bg-purple-100" : "right-0",
          navButtonClassName,
          defaultClassNames.button_next
        ),
        month_caption: cn(
          isDropdownCaption
            ? "relative z-10 flex w-full items-center justify-center px-(--cell-size) py-2"
            : "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-6 font-medium text-md",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-full px-2 hover:bg-purple-100",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "font-semibold text-gray-900 text-sm"
            : "flex h-8 items-center gap-1 rounded-md pr-1 pl-2 font-medium text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none pb-2 font-medium text-[11px] text-gray-500 leading-4 tracking-wider",
          defaultClassNames.weekday
        ),
        week: cn("mt-0.5 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "select-none text-[0.8rem] text-muted-foreground",
          defaultClassNames.week_number
        ),
        // The cell (not the button) paints the range band, so it stays square
        // and full-width; the button is the 32px circle centered inside it.
        day: cn(
          "group/day relative flex h-9 flex-1 select-none items-center justify-center p-0 text-center",
          defaultClassNames.day
        ),
        outside: cn(
          "text-gray-300 aria-selected:text-gray-300",
          defaultClassNames.outside
        ),
        selected: cn(defaultClassNames.selected),
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
        Chevron: isDropdownCaption ? CalendarChevron : CalendarNavChevron,
        Day: CalendarDay,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...(isDropdownCaption
          ? {
              CaptionLabel: createCalendarCaptionWrapper(
                displayMonth,
                pickerMode,
                setPickerMode,
                handleMonthChange
              ),
            }
          : {}),
        ...components,
      }}
      disabled={disabledMatcher}
      formatters={customFormatters}
      locale={locale}
      month={displayMonth}
      navLayout={isDropdownCaption ? undefined : "around"}
      onMonthChange={handleMonthChange}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );

  if (!hasWrapper) {
    return dayPicker;
  }

  const footerRow = footer && (
    <div className="flex items-center justify-end gap-2 border-gray-200 border-t px-4 py-3">
      {footer}
    </div>
  );

  if (!presets?.length) {
    return (
      <div className={cn("w-fit", CALENDAR_SURFACE_CLASSNAME)}>
        {dayPicker}
        {footerRow}
      </div>
    );
  }

  // `props.selected` isn't on every DayPicker mode variant (mode-discriminated
  // union), so read it through a narrow cast — presets are a range-mode feature.
  const selectedRange = (props as { selected?: DateRange }).selected;
  const isComplete = Boolean(selectedRange?.from && selectedRange?.to);
  const matchesAnyPreset = presets.some((preset) =>
    rangeMatchesPreset(selectedRange, preset.range)
  );

  const presetsRow = (
    // Without a footer this row is the surface itself (unchanged markup).
    <div
      className={cn(
        "flex",
        !footerRow && cn("w-fit", CALENDAR_SURFACE_CLASSNAME)
      )}
    >
      {/* A fieldset is a native group named by its legend. Floating the legend
          opts it out of the fieldset border slot, so it lays out as a regular
          flex item like the Figma title. */}
      <fieldset className="flex w-41 min-w-0 shrink-0 flex-col gap-0.5 border-gray-200 border-r px-3 py-4">
        <legend className="float-left w-full select-none px-3 pb-2 font-medium text-[11px] text-gray-500 uppercase leading-4 tracking-wider">
          {presetsTitle}
        </legend>
        {presets.map((preset) => {
          const isActive = rangeMatchesPreset(selectedRange, preset.range);
          return (
            <button
              aria-pressed={isActive}
              className={cn(
                PRESET_ITEM_CLASSNAME,
                "cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
                isActive
                  ? PRESET_ITEM_ACTIVE_CLASSNAME
                  : "text-gray-600 hover:bg-gray-100"
              )}
              key={preset.label}
              onClick={() => onPresetSelect?.(preset.range)}
              type="button"
            >
              {preset.label}
            </button>
          );
        })}
        {customPresetLabel && isComplete && !matchesAnyPreset && (
          // Status, not an action: the custom range comes from the grid, so
          // there is nothing to pick. A plain element (not a button) keeps it
          // out of the tab order and away from hover/click affordances.
          <span
            className={cn(PRESET_ITEM_CLASSNAME, PRESET_ITEM_ACTIVE_CLASSNAME)}
          >
            {customPresetLabel}
          </span>
        )}
      </fieldset>
      {dayPicker}
    </div>
  );

  if (!footerRow) {
    return presetsRow;
  }

  return (
    <div className={cn("w-fit", CALENDAR_SURFACE_CLASSNAME)}>
      {presetsRow}
      {footerRow}
    </div>
  );
}

function CalendarDay({
  className,
  day: _day,
  modifiers,
  ...props
}: React.ComponentProps<typeof Day>) {
  // A one-day range is both start and end: it has nothing to connect to.
  const isSingleDayRange = modifiers.range_start && modifiers.range_end;

  return (
    <td
      className={cn(
        className,
        modifiers.range_middle && "bg-purple-50",
        // Endpoints get a half-band on the inner side so the band reaches the
        // circle instead of stopping at the cell edge.
        !isSingleDayRange &&
          modifiers.range_start &&
          "bg-linear-to-r from-50% from-transparent to-50% to-purple-50",
        !isSingleDayRange &&
          modifiers.range_end &&
          "bg-linear-to-l from-50% from-transparent to-50% to-purple-50"
      )}
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

  const isRangeMiddle = Boolean(modifiers.range_middle);
  // Filled circle: single/multiple selection, range endpoints, and the first
  // click of an in-progress range (selected, but no range modifiers yet).
  const isFilled =
    Boolean(modifiers.range_start || modifiers.range_end) ||
    (Boolean(modifiers.selected) && !isRangeMiddle);

  return (
    <button
      className={cn(
        "relative inline-flex size-(--cell-size) items-center justify-center rounded-full border-0 font-normal text-[13px] text-gray-800 leading-none transition-colors",
        // react-day-picker only sets the `disabled` attribute when the day is
        // not focused -- a focused disabled day gets `aria-disabled` instead,
        // which the `disabled:` variant would miss. Drive the cursor off the
        // modifier so both cases are covered.
        modifiers.disabled
          ? "cursor-not-allowed"
          : "cursor-pointer dark:hover:text-accent-foreground",
        !(modifiers.disabled || isFilled || isRangeMiddle) &&
          "hover:bg-gray-100",
        !modifiers.disabled && isRangeMiddle && "hover:bg-purple-100",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-0 group-data-[focused=true]/day:ring-0",
        defaultClassNames.day,
        modifiers.today && !isFilled && "font-bold text-purple-800",
        // Today marker: a dot under the number, white on a filled circle.
        modifiers.today &&
          "after:-translate-x-1/2 after:absolute after:bottom-1 after:left-1/2 after:size-1 after:rounded-full after:bg-purple-800",
        isRangeMiddle && "font-medium text-purple-800",
        // Outside days stay grayed even on the band; only a filled circle
        // (an endpoint) turns them white.
        modifiers.outside && !isFilled && "text-gray-300",
        isFilled && "bg-purple-800 font-medium text-white after:bg-white",
        className
      )}
      data-day={day.date.toLocaleDateString()}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-selected-single={modifiers.selected}
      data-today={modifiers.today}
      ref={ref}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
