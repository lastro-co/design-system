import type { Meta } from "@storybook/react-vite";
import { FormItem } from "../Form";
import { Label } from "../Label";
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
    state: {
      control: "select",
      options: ["default", "error", "success"],
      description: "Visual validation state of the textarea",
    },
  },
};

export default meta;

export const Default = {
  args: {
    placeholder: "Enter text...",
  },
};

export const AllVariants = {
  render() {
    return (
      <div className="flex w-80 flex-col gap-6">
        <FormItem>
          <Label>Default</Label>
          <Textarea placeholder="Enter text..." />
        </FormItem>

        <FormItem>
          <Label>Resizable</Label>
          <Textarea placeholder="You can resize me..." resizable />
        </FormItem>

        <FormItem>
          <Label>Max Rows (auto-grow)</Label>
          <Textarea maxRows={4} placeholder="Grows up to 4 rows..." />
        </FormItem>

        <FormItem>
          <Label>Focus</Label>
          <Textarea placeholder="Click to focus..." />
        </FormItem>

        <FormItem>
          <Label required>Error</Label>
          <Textarea defaultValue="Descrição muito curta" state="error" />
          <p className="-mt-1 text-red-600 text-xs">
            Descrição deve ter pelo menos 20 caracteres.
          </p>
        </FormItem>

        <FormItem>
          <Label required>Success</Label>
          <Textarea
            defaultValue="Apartamento reformado, 2 quartos, próximo ao metrô."
            state="success"
          />
          <p className="-mt-1 text-green-600 text-xs">Descrição válida.</p>
        </FormItem>

        <FormItem className="pb-6">
          <Label>Disabled</Label>
          <Textarea disabled placeholder="Disabled textarea" />
        </FormItem>
      </div>
    );
  },
};
