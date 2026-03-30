import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "./ColorPicker";

const meta: Meta<typeof ColorPicker> = {
  title: "Components/ColorPicker",
  component: ColorPicker,
  parameters: {
    jest: "ColorPicker.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "color",
      description: "Current hex color value",
    },
    onChange: {
      action: "color changed",
      description: "Callback when color is confirmed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  render: () => {
    const [color, setColor] = useState("#7C3AED");
    return (
      <div className="flex items-center gap-4">
        <ColorPicker onChange={setColor} value={color} />
        <span className="font-mono text-gray-700 text-sm">{color}</span>
      </div>
    );
  },
};

export const WithDifferentColors: Story = {
  render: () => {
    const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];
    return (
      <div className="flex items-center gap-3">
        {colors.map((initialColor) => {
          const Picker = () => {
            const [color, setColor] = useState(initialColor);
            return <ColorPicker onChange={setColor} value={color} />;
          };
          return <Picker key={initialColor} />;
        })}
      </div>
    );
  },
};

export const InForm: Story = {
  render: () => {
    const [color, setColor] = useState("#7C3AED");
    return (
      <div className="flex w-[300px] flex-col gap-3">
        <label className="font-medium text-gray-900 text-sm" htmlFor="tag-name">
          Nome da etiqueta
        </label>
        <div className="flex items-center gap-3">
          <ColorPicker onChange={setColor} value={color} />
          <input
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-300"
            id="tag-name"
            placeholder="Ex: Urgente"
          />
        </div>
        <span className="font-mono text-gray-500 text-xs">
          Cor selecionada: {color}
        </span>
      </div>
    );
  },
};
