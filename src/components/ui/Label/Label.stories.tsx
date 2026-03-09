import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  parameters: {
    jest: "Label.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["input", "section"],
      description: "The visual style variant of the label",
      table: {
        defaultValue: { summary: "input" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    children: {
      control: "text",
      description: "Content to be rendered inside the component",
    },
    htmlFor: {
      control: "text",
      description: "The id of the form element the label is associated with",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default label style for form inputs (14px, gray-800)
 */
export const Default: Story = {
  args: {
    children: "Label text",
  },
};

/**
 * Input variant - used for form field labels (default)
 */
export const Input: Story = {
  args: {
    variant: "input",
    children: "Email address",
  },
};

/**
 * Section variant - used for section headers in modals/forms (16px, #1A1A1A)
 */
export const Section: Story = {
  args: {
    variant: "section",
    children: "Cliente",
  },
};

/**
 * All variants side by side for comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label variant="input">Input variant (default)</Label>
        <p className="text-gray-500 text-xs">
          Used for form field labels - 14px, gray-800
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label variant="section">Section variant</Label>
        <p className="text-gray-500 text-xs">
          Used for section headers - 16px, #1A1A1A
        </p>
      </div>
    </div>
  ),
};
