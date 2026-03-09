import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch, type SwitchProps } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    jest: "Switch.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      description: "Size of the switch",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "md" },
      },
    },
    checked: {
      control: "boolean",
      description: "Whether the switch is on",
    },
    disabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
    },
    className: {
      control: "text",
      description:
        "Additional CSS classes. Use text-* to change the active color via currentColor.",
      table: {
        type: { summary: "string" },
      },
    },
    onCheckedChange: {
      action: "checked changed",
      description: "Callback fired when the checked state changes",
    },
  },
  args: {
    size: "md",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: SwitchProps) => (
    <div className="flex items-center gap-2 text-purple-800">
      <Switch id="default" {...args} />
      <label className="font-normal text-gray-800 text-sm" htmlFor="default">
        Ativar notificações
      </label>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: SwitchProps) => (
    <div className="flex flex-col gap-4 text-purple-800">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
        <div className="flex items-center gap-3" key={size}>
          <Switch {...args} defaultChecked size={size} />
          <span className="text-gray-600 text-sm">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args: SwitchProps) => (
    <div className="flex flex-col gap-4">
      {[
        { color: "text-purple-800", label: "purple-800" },
        { color: "text-blue-600", label: "blue-600" },
        { color: "text-green-600", label: "green-600" },
        { color: "text-red-600", label: "red-600" },
        { color: "text-gray-900", label: "gray-900" },
      ].map(({ color, label }) => (
        <div className={`flex items-center gap-3 ${color}`} key={color}>
          <Switch {...args} defaultChecked />
          <span className="text-gray-600 text-sm">{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: (args: SwitchProps) => (
    <div className="flex flex-col gap-4 text-purple-800">
      <div className="flex items-center gap-3">
        <Switch {...args} disabled />
        <span className="text-gray-400 text-sm">Desativado (off)</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch {...args} defaultChecked disabled />
        <span className="text-gray-400 text-sm">Desativado (on)</span>
      </div>
    </div>
  ),
};
