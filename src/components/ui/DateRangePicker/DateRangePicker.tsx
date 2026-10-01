"use client";

import { format, isBefore } from "date-fns";
import * as React from "react";
import type { DateRange, Matcher } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  Button,
  Calendar,
  getDefaultCalendarPresets,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "..";
import type { CalendarPreset } from "../Calendar";
import type { PickerTriggerState } from "../DatePicker/PickerTrigger";
import { PickerTrigger } from "../DatePicker/PickerTrigger";

const DATE_FORMAT = "dd/MM/yy";
const RANGE_SEPARATOR = " – ";
const DEFAULT_NUMBER_OF_MONTHS = 2;

export interface DateRangePickerProps
  extends Omit<
    React.ComponentProps<"button">,
    "value" | "onChange" | "children"
  > {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  /** Sidebar shortcuts. Defaults to `getDefaultCalendarPresets()`, recomputed on every open; `false` hides the sidebar. */
  presets?: CalendarPreset[] | false;
  presetsTitle?: string;
  /** Read-only sidebar item for a complete range that matches no preset (e.g. "Personalizado"). */
  customPresetLabel?: string;
  numberOfMonths?: number;
  disabledDates?: Matcher | Matcher[];
  startMonth?: Date;
  endMonth?: Date;
  state?: PickerTriggerState;
  /** Draft mode: selections only apply through the Cancelar/Aplicar footer. */
  showActions?: boolean;
  cancelLabel?: string;
  applyLabel?: string;
  /** Overrides "today" for the marker, the default presets and the initial month. */
  today?: Date;
}

function isCompleteRange(range: DateRange | undefined): range is DateRange {
  return Boolean(range?.from && range.to);
}

function formatRangeLabel(range: DateRange | undefined): string | undefined {
  if (!range?.from) {
    return;
  }
  const from = format(range.from, DATE_FORMAT);
  return range.to
    ? `${from}${RANGE_SEPARATOR}${format(range.to, DATE_FORMAT)}`
    : from;
}

// Two-click selection: the first click starts a range, the second closes it
// (in either order). A click on a complete range starts over, so reopening a
// picker with a value never commits on the first click.
function nextDraft(draft: DateRange | undefined, day: Date): DateRange {
  if (!draft?.from || draft.to) {
    return { from: day, to: undefined };
  }
  return isBefore(day, draft.from)
    ? { from: day, to: draft.from }
    : { from: draft.from, to: day };
}

interface DateRangePickerPanelProps
  extends Pick<
    DateRangePickerProps,
    | "value"
    | "presets"
    | "presetsTitle"
    | "customPresetLabel"
    | "disabledDates"
    | "startMonth"
    | "endMonth"
    | "today"
    | "cancelLabel"
    | "applyLabel"
  > {
  numberOfMonths: number;
  showActions: boolean;
  onCommit: (range: DateRange) => void;
  onCancel: () => void;
}

// Mounted only while the popover is open (Radix unmounts closed content), so
// the draft, the visible month and the default presets are re-seeded from
// `value` and today on every open, and an unfinished draft dies on close.
function DateRangePickerPanel({
  value,
  presets,
  presetsTitle,
  customPresetLabel,
  disabledDates,
  startMonth,
  endMonth,
  today,
  cancelLabel,
  applyLabel,
  numberOfMonths,
  showActions,
  onCommit,
  onCancel,
}: DateRangePickerPanelProps) {
  const [draft, setDraft] = React.useState<DateRange | undefined>(value);
  const [month, setMonth] = React.useState<Date>(
    () => value?.from ?? today ?? new Date()
  );
  const [defaultPresets] = React.useState(() =>
    getDefaultCalendarPresets(today)
  );
  const resolvedPresets =
    presets === false ? undefined : (presets ?? defaultPresets);

  const handleSelect = (_range: DateRange | undefined, day: Date) => {
    const next = nextDraft(draft, day);
    if (!showActions && isCompleteRange(next)) {
      onCommit(next);
      return;
    }
    setDraft(next);
  };

  const handlePresetSelect = (range: DateRange) => {
    if (!showActions) {
      onCommit(range);
      return;
    }
    setDraft(range);
    if (range.from) {
      setMonth(range.from);
    }
  };

  const footer = showActions && (
    <>
      <Button onClick={onCancel} size="small" variant="outline">
        {cancelLabel}
      </Button>
      <Button
        disabled={!isCompleteRange(draft)}
        // Only clickable while enabled, i.e. with a complete draft.
        onClick={() => onCommit(draft as DateRange)}
        size="small"
      >
        {applyLabel}
      </Button>
    </>
  );

  return (
    <Calendar
      customPresetLabel={customPresetLabel}
      disabled={disabledDates}
      endMonth={endMonth}
      footer={footer}
      mode="range"
      month={month}
      numberOfMonths={numberOfMonths}
      onMonthChange={setMonth}
      onPresetSelect={handlePresetSelect}
      onSelect={handleSelect}
      presets={resolvedPresets}
      presetsTitle={presetsTitle}
      selected={draft}
      startMonth={startMonth}
      today={today}
    />
  );
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Selecione o período",
  presets,
  presetsTitle,
  customPresetLabel,
  numberOfMonths = DEFAULT_NUMBER_OF_MONTHS,
  disabledDates,
  startMonth,
  endMonth,
  state = "default",
  showActions = false,
  cancelLabel = "Cancelar",
  applyLabel = "Aplicar",
  today,
  className,
  disabled,
  ...props
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const label = formatRangeLabel(value);

  const handleCommit = (range: DateRange) => {
    onChange?.(range);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <PickerTrigger
          {...props}
          // Figma 1279:2150 / 1279:2166: the trigger hugs its label.
          className={cn("w-fit gap-2", className)}
          disabled={disabled}
          hasValue={Boolean(label)}
          label={label ?? placeholder}
          state={state}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        // The Calendar draws the only surface (sidebar, grid and footer). The
        // popover is capped to the available height, so it scrolls when the
        // viewport is short (e.g. a low iframe) instead of hiding the actions.
        // The scroll box would clip the Calendar's own shadow, so the popover
        // carries the shadow and radius instead.
        className="w-auto overflow-y-auto rounded-md border-0 bg-transparent p-0 shadow-sm"
      >
        <DateRangePickerPanel
          applyLabel={applyLabel}
          cancelLabel={cancelLabel}
          customPresetLabel={customPresetLabel}
          disabledDates={disabledDates}
          endMonth={endMonth}
          numberOfMonths={numberOfMonths}
          onCancel={() => setOpen(false)}
          onCommit={handleCommit}
          presets={presets}
          presetsTitle={presetsTitle}
          showActions={showActions}
          startMonth={startMonth}
          today={today}
          value={value}
        />
      </PopoverContent>
    </Popover>
  );
}
