import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "./DateRangePicker";

// Figma DS-2026.2 frames are drawn on 23/09/2026; fixing "today" keeps the
// marker and the default presets stable across runs.
const FIGMA_TODAY = new Date(2026, 8, 23);
const FIGMA_RANGE: DateRange = {
  from: new Date(2026, 8, 3),
  to: new Date(2026, 8, 23),
};
const LAST_30_DAYS: DateRange = {
  from: new Date(2026, 7, 25),
  to: FIGMA_TODAY,
};

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    jest: "DateRangePicker.test.tsx",
    // Room for the open popover under a top-left trigger.
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    today: FIGMA_TODAY,
  },
  argTypes: {
    placeholder: { control: "text", description: "Texto do placeholder" },
    disabled: { control: "boolean", description: "Desabilita o componente" },
    state: {
      control: "select",
      options: ["default", "error", "success"],
      description: "Estado visual de validação do campo",
    },
    showActions: {
      control: "boolean",
      description: "Rascunho com rodapé Cancelar/Aplicar",
    },
    numberOfMonths: { control: "number" },
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange | undefined>(args.value);
    return <DateRangePicker {...args} onChange={setRange} value={range} />;
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

const openOnMount: Story["play"] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button"));
};

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: FIGMA_RANGE },
};

export const Open: Story = {
  play: openOnMount,
};

export const OpenWithValue: Story = {
  args: { value: FIGMA_RANGE },
  play: openOnMount,
};

export const OpenWithActivePreset: Story = {
  args: { value: LAST_30_DAYS },
  play: openOnMount,
};

export const WithActions: Story = {
  args: {
    customPresetLabel: "Personalizado",
    showActions: true,
    value: FIGMA_RANGE,
  },
  play: openOnMount,
};

export const WithoutPresets: Story = {
  args: { presets: false },
  play: openOnMount,
};

export const Disabled: Story = {
  args: { disabled: true, value: FIGMA_RANGE },
};

export const WithError: Story = {
  args: { state: "error" },
  render: (args) => {
    const [range, setRange] = useState<DateRange | undefined>();
    return (
      <div className="flex flex-col gap-2">
        <DateRangePicker {...args} onChange={setRange} value={range} />
        <p className="-mt-1 text-red-600 text-xs">Campo obrigatório</p>
      </div>
    );
  },
};

export const WithBounds: Story = {
  args: {
    disabledDates: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    endMonth: new Date(2026, 9, 1),
    startMonth: new Date(2026, 7, 1),
  },
  play: openOnMount,
};
