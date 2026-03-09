import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  parameters: {
    jest: "Stepper.test.tsx",
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full min-w-[536px]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    currentStep: {
      control: { type: "number", min: 1, max: 5, step: 1 },
      description: "Current step (1-based)",
    },
    totalSteps: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "Total number of steps",
    },
    disabled: {
      control: "boolean",
      description: "When true, the stepper is visually disabled",
    },
    label: {
      control: "text",
      description: 'Custom label (leave empty for default "Passo X de Y")',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
  },
};

export const StepTwoOfThree: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
  },
};

export const StepThreeOfThree: Story = {
  args: {
    currentStep: 3,
    totalSteps: 3,
  },
};

export const FiveSteps: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
  },
};

export const Disabled: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    disabled: true,
  },
};

export const CustomLabel: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
    label: "Etapa 2 de 4",
  },
};

export const CustomLabelFunction: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
    label: (current, total) => `Step ${current} of ${total}`,
  },
};

function InteractiveStepper() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  return (
    <div className="flex w-full min-w-[536px] flex-col gap-6">
      <Stepper currentStep={step} totalSteps={totalSteps} />
      <div className="flex gap-2">
        <Button
          disabled={step <= 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          variant="outlined"
        >
          Anterior
        </Button>
        <Button
          disabled={step >= totalSteps}
          onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}

export const WithNavigation: Story = {
  render: () => <InteractiveStepper />,
};
