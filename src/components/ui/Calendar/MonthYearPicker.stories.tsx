import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MonthYearPicker } from "./MonthYearPicker";

// Figma DS-2026.2 frames are drawn on 23/09/2026; fixing "today" keeps the
// current-month marker stable across runs.
const FIGMA_TODAY = new Date(2026, 8, 23);
const FIGMA_MONTH = 9;
const FIGMA_YEAR = 2026;
// The Figma open frames show every month enabled, so the open stories lift
// the default "no future months" cap.
const FIGMA_MAX_YEAR = 2030;

const meta: Meta<typeof MonthYearPicker> = {
  title: "Components/Calendar/MonthYearPicker",
  component: MonthYearPicker,
  parameters: {
    jest: "MonthYearPicker.test.tsx",
    // Room for the open popover under a top-left trigger.
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    today: FIGMA_TODAY,
  },
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
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    size: { control: "select", options: ["small", "medium", "large"] },
    state: { control: "select", options: ["default", "error", "success"] },
  },
  render: (args) => {
    const [value, setValue] = useState({ month: args.month, year: args.year });
    return (
      <MonthYearPicker
        {...args}
        month={value.month}
        onChange={(month, year) => setValue({ month, year })}
        year={value.year}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof MonthYearPicker>;

const openOnMount: Story["play"] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button"));
};

export const Default: Story = {
  args: { month: FIGMA_MONTH, year: FIGMA_YEAR },
};

export const Empty: Story = {};

export const Open: Story = {
  args: { maxYear: FIGMA_MAX_YEAR },
  play: openOnMount,
};

export const OpenWithValue: Story = {
  args: { maxYear: FIGMA_MAX_YEAR, month: FIGMA_MONTH, year: FIGMA_YEAR },
  play: openOnMount,
};

export const Small: Story = {
  args: { month: FIGMA_MONTH, size: "small", year: FIGMA_YEAR },
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
  play: openOnMount,
};
