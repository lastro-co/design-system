import type { Meta } from "@storybook/react-vite";
import { PersonIcon } from "@/components/icons";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    jest: "Input.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "file"],
      description: "Input type",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Disable the input",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    "aria-invalid": {
      control: "boolean",
      description: "Indicates if the input has an error",
    },
    icon: {
      control: false,
      description: "Icon to display at the beginning of the input",
    },
  },
};

export default meta;

export const Default = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithIcon = {
  args: {
    icon: <PersonIcon />,
    placeholder: "Digitando...",
  },
};
