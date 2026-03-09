import type { Meta, StoryObj } from "@storybook/react-vite";
import LoadingOverlay from "./LoadingOverlay";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Components/LoadingOverlay",
  component: LoadingOverlay,
  parameters: {
    jest: "LoadingOverlay.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    visible: {
      control: "boolean",
      description: "Whether the overlay is visible",
    },
    message: {
      control: "text",
      description: "Loading message to display",
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-64 w-96 rounded-xl border border-gray-200 bg-white">
        <div className="p-4">
          <h3 className="font-semibold text-lg">Content Behind Overlay</h3>
          <p className="text-gray-600 text-sm">
            This content will be blurred when loading.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

export const Default: Story = {
  args: {
    visible: true,
  },
};

export const WithCustomMessage: Story = {
  args: {
    visible: true,
    message: "Salvando alterações...",
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
  },
};

export const AllStates = {
  render: () => (
    <div className="flex gap-6">
      <div className="relative h-48 w-64 rounded-xl border border-gray-200 bg-white">
        <div className="p-4">
          <h4 className="font-medium">Visible</h4>
          <p className="text-gray-500 text-sm">Loading state</p>
        </div>
        <LoadingOverlay visible={true} />
      </div>
      <div className="relative h-48 w-64 rounded-xl border border-gray-200 bg-white">
        <div className="p-4">
          <h4 className="font-medium">Hidden</h4>
          <p className="text-gray-500 text-sm">Content visible</p>
        </div>
        <LoadingOverlay visible={false} />
      </div>
      <div className="relative h-48 w-64 rounded-xl border border-gray-200 bg-white">
        <div className="p-4">
          <h4 className="font-medium">Custom Message</h4>
          <p className="text-gray-500 text-sm">Different text</p>
        </div>
        <LoadingOverlay message="Processando..." visible={true} />
      </div>
    </div>
  ),
};
