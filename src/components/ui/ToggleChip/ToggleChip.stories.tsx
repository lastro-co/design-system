import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ToggleChip } from "./ToggleChip";

const meta: Meta<typeof ToggleChip> = {
  title: "Components/ToggleChip",
  component: ToggleChip,
  parameters: {
    jest: "ToggleChip.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    selected: {
      control: "boolean",
      description: "Whether the chip is toggled on",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleChip>;

const SingleChip = () => {
  const [selected, setSelected] = useState(false);
  return (
    <ToggleChip onSelectedChange={setSelected} selected={selected}>
      Apenas com a Lais
    </ToggleChip>
  );
};

const ChipGroup = () => {
  const [selected, setSelected] = useState<string[]>(["active"]);
  const options = [
    { value: "active", label: "Ativa" },
    { value: "paused", label: "Pausada" },
    { value: "ended", label: "Encerrada" },
  ];
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <ToggleChip
          key={option.value}
          onSelectedChange={(on) =>
            setSelected((prev) =>
              on
                ? [...prev, option.value]
                : prev.filter((v) => v !== option.value)
            )
          }
          selected={selected.includes(option.value)}
        >
          {option.label}
        </ToggleChip>
      ))}
    </div>
  );
};

export const Default: Story = {
  render: () => <SingleChip />,
};

export const Group: Story = {
  render: () => <ChipGroup />,
};
