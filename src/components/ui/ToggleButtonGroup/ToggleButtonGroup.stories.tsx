import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ToggleButtonGroup } from "./ToggleButtonGroup";

const meta: Meta<typeof ToggleButtonGroup> = {
  title: "Components/ToggleButtonGroup",
  component: ToggleButtonGroup,
  parameters: {
    jest: "ToggleButtonGroup.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Currently selected value",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the container",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButtonGroup>;

const ViewToggle = () => {
  const [value, setValue] = useState<"month" | "week" | "day">("month");
  return (
    <ToggleButtonGroup
      onValueChange={setValue}
      options={[
        { value: "month", label: "Mês" },
        { value: "week", label: "Semana" },
        { value: "day", label: "Dia" },
      ]}
      value={value}
    />
  );
};

export const Default: Story = {
  render: () => <ViewToggle />,
};

const TransactionTypeToggle = () => {
  const [value, setValue] = useState<"buy" | "rent">("buy");
  return (
    <ToggleButtonGroup
      onValueChange={setValue}
      options={[
        { value: "buy", label: "Compra" },
        { value: "rent", label: "Aluguel" },
      ]}
      value={value}
    />
  );
};

export const TwoOptions: Story = {
  render: () => <TransactionTypeToggle />,
};

const StatusToggle = () => {
  const [value, setValue] = useState<
    "pending" | "confirmed" | "canceled" | "completed"
  >("pending");
  return (
    <ToggleButtonGroup
      onValueChange={setValue}
      options={[
        { value: "pending", label: "Pendente" },
        { value: "confirmed", label: "Agendada" },
        { value: "completed", label: "Concluída" },
        { value: "canceled", label: "Cancelada" },
      ]}
      value={value}
    />
  );
};

export const ManyOptions: Story = {
  render: () => <StatusToggle />,
};

const NoSelectionToggle = () => {
  const [value, setValue] = useState<"opt1" | "opt2" | undefined>(undefined);
  return (
    <ToggleButtonGroup
      onValueChange={setValue}
      options={[
        { value: "opt1", label: "Option 1" },
        { value: "opt2", label: "Option 2" },
      ]}
      value={value}
    />
  );
};

export const NoInitialSelection: Story = {
  render: () => <NoSelectionToggle />,
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 font-medium text-lg">Calendar View</h3>
        <ViewToggle />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-lg">Transaction Type</h3>
        <TransactionTypeToggle />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-lg">Status Filter</h3>
        <StatusToggle />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-lg">No Initial Selection</h3>
        <NoSelectionToggle />
      </div>
    </div>
  ),
};
