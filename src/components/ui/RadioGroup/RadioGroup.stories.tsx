import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: {
    jest: "RadioGroup.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "text",
      description: "The default selected value",
    },
    disabled: {
      control: "boolean",
      description: "Disables all radio items",
    },
    "aria-invalid": {
      control: "boolean",
      description: "Whether the radio group is in an invalid state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    defaultValue: "option-1",
  },
  render: (args) => (
    <RadioGroup defaultValue={args.defaultValue}>
      <div className="flex items-center gap-2">
        <RadioGroupItem
          aria-invalid={args["aria-invalid"]}
          disabled={args.disabled}
          id="option-1"
          value="option-1"
        />
        <label
          className="font-normal text-gray-800 text-sm peer-disabled:text-gray-600 peer-aria-invalid:text-red-600"
          htmlFor="option-1"
        >
          Option 1
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem
          aria-invalid={args["aria-invalid"]}
          disabled={args.disabled}
          id="option-2"
          value="option-2"
        />
        <label
          className="font-normal text-gray-800 text-sm peer-disabled:text-gray-600 peer-aria-invalid:text-red-600"
          htmlFor="option-2"
        >
          Option 2
        </label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem
          aria-invalid={args["aria-invalid"]}
          disabled={args.disabled}
          id="option-3"
          value="option-3"
        />
        <label
          className="font-normal text-gray-800 text-sm peer-disabled:text-gray-600 peer-aria-invalid:text-red-600"
          htmlFor="option-3"
        >
          Option 3
        </label>
      </div>
    </RadioGroup>
  ),
};
