import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "./Calendar";

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
