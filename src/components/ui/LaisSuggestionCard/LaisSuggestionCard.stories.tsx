import type { Meta, StoryObj } from "@storybook/react-vite";
import { LaisSuggestionCard } from "./LaisSuggestionCard";

const noop = () => {
  // intentional no-op for Storybook controls
};

const meta: Meta<typeof LaisSuggestionCard> = {
  title: "Components/LaisSuggestionCard",
  component: LaisSuggestionCard,
  parameters: {
    jest: "LaisSuggestionCard.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    action: { control: false },
    onDismiss: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[420px] w-[720px] items-center justify-center bg-gray-900">
        <Story />
      </div>
    ),
  ],
  args: {
    category: "Reengajamento",
    description:
      "Vitor está sem responder e a conversa estava em andamento. Posso reengajar?",
    action: { label: "Reengajar", onClick: noop },
    onDismiss: noop,
  },
};

export default meta;
type Story = StoryObj<typeof LaisSuggestionCard>;

export const Default: Story = {};

export const WithoutGlow: Story = {
  args: { glow: false },
};

export const WithoutDismiss: Story = {
  args: { onDismiss: undefined },
};

export const WithoutCategory: Story = {
  args: { category: undefined },
};
