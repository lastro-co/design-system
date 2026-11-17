import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SparkleIcon, UserRoundIcon } from "@/components/icons.v2";
import { TooltipProvider } from "@/components/ui/Tooltip/Tooltip";
import { SegmentedControl } from "./SegmentedControl";

const meta: Meta<typeof SegmentedControl> = {
  title: "Navegação/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    jest: "SegmentedControl.test.tsx",
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
      description: "Additional CSS classes for the track",
    },
    "aria-label": {
      control: "text",
      description:
        "Names the group for assistive tech. Required — three unlabelled options say nothing about what the control switches.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

const ChartSeries = () => {
  const [value, setValue] = useState("conversations");
  return (
    <SegmentedControl
      aria-label="Série exibida no gráfico"
      onValueChange={setValue}
      options={[
        { value: "conversations", label: "Conversas" },
        { value: "bankslips", label: "Boletos" },
        { value: "occurrences", label: "Ocorrências" },
      ]}
      value={value}
    />
  );
};

export const Default: Story = {
  render: () => <ChartSeries />,
};

const TwoOptions = () => {
  const [value, setValue] = useState("rent");
  return (
    <SegmentedControl
      aria-label="Tipo de transação"
      onValueChange={setValue}
      options={[
        { value: "rent", label: "Aluguel" },
        { value: "buy", label: "Venda" },
      ]}
      value={value}
    />
  );
};

export const TwoSegments: Story = {
  render: () => <TwoOptions />,
};

const WithDisabled = () => {
  const [value, setValue] = useState("all");
  return (
    <SegmentedControl
      aria-label="Período"
      onValueChange={setValue}
      options={[
        { value: "all", label: "Tudo" },
        { value: "month", label: "Mês" },
        { value: "year", label: "Ano", disabled: true },
      ]}
      value={value}
    />
  );
};

export const DisabledSegment: Story = {
  render: () => <WithDisabled />,
};

const Attendance = () => {
  const [value, setValue] = useState("lais");
  return (
    <TooltipProvider>
      <SegmentedControl
        aria-label="Quem atende a conversa"
        onValueChange={setValue}
        options={[
          {
            value: "lais",
            label: "Atendimento da Lais",
            icon: <SparkleIcon />,
          },
          {
            value: "human",
            label: "Atendimento humano",
            icon: <UserRoundIcon />,
          },
        ]}
        value={value}
        variant="icon"
      />
    </TooltipProvider>
  );
};

export const IconOnly: Story = {
  render: () => <Attendance />,
};
