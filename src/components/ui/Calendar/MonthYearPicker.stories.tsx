import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MonthYearPicker } from "./MonthYearPicker";

const meta: Meta<typeof MonthYearPicker> = {
  title: "Components/Calendar/MonthYearPicker",
  component: MonthYearPicker,
  parameters: {
    jest: "MonthYearPicker.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    month: {
      control: { type: "number", min: 1, max: 12 },
      description: "Selected month (1-12)",
    },
    year: {
      control: { type: "number", min: 2020, max: 2030 },
      description: "Selected year",
    },
    minYear: {
      control: { type: "number", min: 2020, max: 2030 },
      description: "Minimum selectable year",
    },
    maxYear: {
      control: { type: "number", min: 2020, max: 2030 },
      description: "Maximum selectable year",
    },
    maxMonth: {
      control: { type: "number", min: 1, max: 12 },
      description: "Maximum selectable month (for the max year)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MonthYearPicker>;

function MonthYearPickerControlled() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  return (
    <MonthYearPicker
      month={month}
      onChange={(m, y) => {
        setMonth(m);
        setYear(y);
      }}
      year={year}
    />
  );
}

export const Default: Story = {
  render: () => <MonthYearPickerControlled />,
};

export const January2024: Story = {
  args: {
    month: 1,
    year: 2024,
    minYear: 2020,
  },
};

export const WithMaxConstraints: Story = {
  args: {
    month: 3,
    year: 2026,
    maxMonth: 6,
    maxYear: 2026,
    minYear: 2024,
  },
};
