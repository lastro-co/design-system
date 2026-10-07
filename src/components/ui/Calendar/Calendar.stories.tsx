import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "./Calendar";
import { getDefaultCalendarPresets } from "./presets";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: {
    jest: "Calendar.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "multiple", "range"],
      description: "Selection mode",
    },
    showOutsideDays: {
      control: "boolean",
      description: "Show days outside the current month",
    },
    captionLayout: {
      control: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
      description: "Caption layout style",
    },
    enabledDates: {
      control: "object",
      description: "List of enabled dates (all other dates will be disabled)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    mode: "single",
    showOutsideDays: true,
  },
};

export const SingleSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date>();
    return (
      <Calendar
        mode="single"
        onSelect={setSelected}
        selected={selected}
        showOutsideDays
      />
    );
  },
};

export const MultipleSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date[] | undefined>();
    return (
      <Calendar
        mode="multiple"
        onSelect={setSelected}
        selected={selected}
        showOutsideDays
      />
    );
  },
};

export const RangeSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<DateRange | undefined>();
    return (
      <Calendar
        mode="range"
        onSelect={setSelected}
        selected={selected}
        showOutsideDays
      />
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date>();
    const disabledDays = [
      { before: new Date() }, // Disable all dates before today
    ];
    return (
      <Calendar
        disabled={disabledDays}
        mode="single"
        onSelect={setSelected}
        selected={selected}
        showOutsideDays
      />
    );
  },
};

export const WithEnabledDates: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date>();

    // Create a list of enabled dates using strings in DD/MM/YYYY format
    // You can also use Date objects: new Date(2026, 0, 5)
    const enabledDates = ["22/01/2026", "23/01/2026", "25/01/2026"];

    return (
      <div className="flex flex-col gap-4">
        <Calendar
          enabledDates={enabledDates}
          mode="single"
          onSelect={setSelected}
          selected={selected}
          showOutsideDays
        />
        {selected && (
          <p className="text-center text-sm">
            Data selecionada: {selected.toLocaleDateString("pt-BR")}
          </p>
        )}
      </div>
    );
  },
};

// Fixed dates keep visual snapshots stable regardless of the run date.
// Calendar always drives DayPicker with `month`, so `defaultMonth` would be
// ignored: the stories own the month state instead.
const SEPTEMBER_2026 = new Date(2026, 8, 1);
const FIXED_TODAY = new Date(2026, 8, 15);
// Matches the Figma "Date range picker — período" frames.
const PRESETS_TODAY = new Date(2026, 8, 23);
const AUGUST_2026 = new Date(2026, 7, 1);
const DEFAULT_PRESETS = getDefaultCalendarPresets(PRESETS_TODAY);
const LAST_30_DAYS = DEFAULT_PRESETS[4].range;

export const RangeWithPresets: Story = {
  render: () => {
    const [selected, setSelected] = useState<DateRange | undefined>();
    const [month, setMonth] = useState(AUGUST_2026);
    return (
      <Calendar
        customPresetLabel="Personalizado"
        mode="range"
        month={month}
        numberOfMonths={2}
        onMonthChange={setMonth}
        onPresetSelect={setSelected}
        onSelect={setSelected}
        presets={DEFAULT_PRESETS}
        selected={selected}
        showOutsideDays
        today={PRESETS_TODAY}
      />
    );
  },
};

export const RangeWithActivePreset: Story = {
  render: () => {
    const [selected, setSelected] = useState<DateRange | undefined>(
      LAST_30_DAYS
    );
    const [month, setMonth] = useState(AUGUST_2026);
    return (
      <Calendar
        customPresetLabel="Personalizado"
        mode="range"
        month={month}
        numberOfMonths={2}
        onMonthChange={setMonth}
        onPresetSelect={setSelected}
        onSelect={setSelected}
        presets={DEFAULT_PRESETS}
        selected={selected}
        showOutsideDays
        today={PRESETS_TODAY}
      />
    );
  },
};

export const TwoMonthsRange: Story = {
  render: () => {
    const [selected, setSelected] = useState<DateRange | undefined>({
      from: new Date(2026, 8, 3),
      to: new Date(2026, 8, 23),
    });
    const [month, setMonth] = useState(SEPTEMBER_2026);
    return (
      <Calendar
        mode="range"
        month={month}
        numberOfMonths={2}
        onMonthChange={setMonth}
        onSelect={setSelected}
        selected={selected}
        showOutsideDays
        today={FIXED_TODAY}
      />
    );
  },
};

export const WithToday: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date>();
    const [month, setMonth] = useState(SEPTEMBER_2026);
    return (
      <Calendar
        mode="single"
        month={month}
        onMonthChange={setMonth}
        onSelect={setSelected}
        selected={selected}
        showOutsideDays
        today={FIXED_TODAY}
      />
    );
  },
};

export const DropdownCaption: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date>();
    const [month, setMonth] = useState(SEPTEMBER_2026);
    return (
      <Calendar
        captionLayout="dropdown"
        mode="single"
        month={month}
        onMonthChange={setMonth}
        onSelect={setSelected}
        selected={selected}
        showOutsideDays
        today={FIXED_TODAY}
      />
    );
  },
};
