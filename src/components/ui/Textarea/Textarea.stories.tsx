import type { Meta } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    jest: "Textarea.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Disable the textarea",
    },
    resizable: {
      control: "boolean",
      description: "Allow textarea to be resized",
    },
    maxRows: {
      control: "number",
      description: "Maximum number of rows before scrolling",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    "aria-invalid": {
      control: "boolean",
      description: "Indicates if the textarea has an error",
    },
  },
};

export default meta;

export const Default = {
  args: {
    placeholder: "Enter text...",
  },
};
