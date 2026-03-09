import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    jest: "Spinner.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      description: "Size of the spinner",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "md" },
      },
    },
    color: {
      control: { type: "select" },
      options: [
        undefined,
        "blue-600",
        "gray-600",
        "gray-900",
        "green-600",
        "purple-800",
        "purple-900",
        "red-600",
        "white",
        "yellow-600",
      ],
      description: "Color of the spinner",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
      table: {
        type: { summary: "string" },
      },
    },
  },
  args: {
    size: "md",
    color: "purple-800",
    className: "",
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};
