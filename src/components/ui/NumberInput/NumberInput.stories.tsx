import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { NumberInput } from "./NumberInput";

const meta: Meta<typeof NumberInput> = {
  title: "Components/NumberInput",
  component: NumberInput,
  parameters: {
    jest: "NumberInput.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number", description: "Minimum value" },
    max: { control: "number", description: "Maximum value" },
    step: { control: "number", description: "Increment / decrement step" },
    disabled: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
};

export default meta;

const ControlledExample = (args: React.ComponentProps<typeof NumberInput>) => {
  const [value, setValue] = useState<string>(String(args.value ?? "1"));
  return (
    <div style={{ width: 220 }}>
      <NumberInput {...args} onValueChange={setValue} value={value} />
    </div>
  );
};

export const Default = {
  render: ControlledExample,
  args: { min: 1, max: 99, step: 1, value: "1" },
};

export const WithBounds = {
  render: ControlledExample,
  args: { min: 1, max: 5, step: 1, value: "3" },
  parameters: {
    docs: {
      description: {
        story:
          "Increment/decrement buttons disable when the current value reaches `min` or `max`.",
      },
    },
  },
};

export const StepGreaterThanOne = {
  render: ControlledExample,
  args: { min: 0, max: 100, step: 5, value: "10" },
};

export const Disabled = {
  render: ControlledExample,
  args: { disabled: true, value: "3" },
};

export const ErrorState = {
  render: ControlledExample,
  args: { "aria-invalid": true, value: "42" },
  parameters: {
    docs: {
      description: {
        story:
          "Inherits the `Input`'s `aria-invalid` styling — red border, red focus ring.",
      },
    },
  },
};

export const LocalizedAriaLabels = {
  render: ControlledExample,
  args: {
    value: "1",
    incrementAriaLabel: "Aumentar valor",
    decrementAriaLabel: "Diminuir valor",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Aria-labels are overridable for locales other than English (component default).",
      },
    },
  },
};
