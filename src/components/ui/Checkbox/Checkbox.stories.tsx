import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    jest: "Checkbox.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    "aria-invalid": {
      control: "boolean",
      description: "Whether the checkbox is in an invalid state",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
    onCheckedChange: {
      action: "checked changed",
      description: "Callback fired when the checked state changes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="default" {...args} />
      <label
        className="font-normal text-gray-800 text-sm peer-disabled:text-gray-600 peer-aria-invalid:text-red-600"
        htmlFor="default"
      >
        Checkbox
      </label>
    </div>
  ),
};
