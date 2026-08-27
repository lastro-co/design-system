import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ColorPickerPanel } from "./ColorPickerPanel";

const meta: Meta<typeof ColorPickerPanel> = {
  title: "Components/ColorPicker/ColorPickerPanel",
  component: ColorPickerPanel,
  parameters: {
    jest: "ColorPickerPanel.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "color",
      description: "Current hex color value",
    },
    onConfirm: {
      action: "color confirmed",
      description: "Called when Confirmar is clicked — never on swatch click",
    },
    swatches: {
      control: "object",
      description: "Predefined colors rendered as a grid above the custom area",
    },
    showCustom: {
      control: "boolean",
      description: "Shows the saturation/hue/hex area. Defaults to true",
    },
    title: {
      control: "text",
      description: "Optional title rendered at the top of the panel",
    },
    description: {
      control: "text",
      description: "Optional supporting text rendered below the title",
    },
    footerAlign: {
      control: "inline-radio",
      options: ["stretch", "end"],
      description: "Confirm button alignment. Defaults to stretch",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPickerPanel>;

/**
 * The palette is supplied by the consumer through the `swatches` prop — the DS
 * ships no default set of colors.
 */
const PRESET_COLORS = [
  "#9664FA",
  "#4CC9F0",
  "#FF7A45",
  "#C7C7CE",
  "#4361EE",
  "#D4A200",
  "#F4457B",
  "#28E4A8",
];

/** Frame matching the popover `ColorPicker` renders the panel in. */
function PanelFrame({
  children,
  width = "w-[200px]",
}: {
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-md border border-gray-300 shadow-xl ${width}`}
    >
      {children}
    </div>
  );
}

/** The panel as `ColorPicker` renders it: no header, no swatches. */
export const Default: Story = {
  render: () => {
    const [color, setColor] = useState("#7C3AED");
    return (
      <div className="flex flex-col gap-3">
        <PanelFrame>
          <ColorPickerPanel onConfirm={setColor} value={color} />
        </PanelFrame>
        <span className="font-mono text-gray-800 text-xs">
          Cor confirmada: {color}
        </span>
      </div>
    );
  },
};

export const WithSwatches: Story = {
  render: () => {
    const [color, setColor] = useState("#28E4A8");
    return (
      <div className="flex flex-col gap-3">
        <PanelFrame>
          <ColorPickerPanel
            onConfirm={setColor}
            swatches={PRESET_COLORS}
            value={color}
          />
        </PanelFrame>
        <span className="font-mono text-gray-800 text-xs">
          Cor confirmada: {color}
        </span>
      </div>
    );
  },
};

/** Grid only — the free-form picker is hidden. */
export const SwatchesOnly: Story = {
  render: () => {
    const [color, setColor] = useState("#4361EE");
    return (
      <div className="flex flex-col gap-3">
        <PanelFrame>
          <ColorPickerPanel
            onConfirm={setColor}
            showCustom={false}
            swatches={PRESET_COLORS}
            value={color}
          />
        </PanelFrame>
        <span className="font-mono text-gray-800 text-xs">
          Cor confirmada: {color}
        </span>
      </div>
    );
  },
};

/**
 * Inline usage — no popover, no trigger. The panel goes straight into a drawer
 * section or a card, with a header and the confirm button right-aligned.
 */
export const Inline: Story = {
  render: () => {
    const [color, setColor] = useState("#28E4A8");
    return (
      <div className="flex flex-col gap-3">
        <PanelFrame width="w-[420px]">
          <ColorPickerPanel
            description="Selecione uma cor pré-definida ou da seleção livre abaixo."
            footerAlign="end"
            onConfirm={setColor}
            swatches={PRESET_COLORS}
            title="Cor da etiqueta"
            value={color}
          />
        </PanelFrame>
        <span className="font-mono text-gray-800 text-xs">
          Cor confirmada: {color}
        </span>
      </div>
    );
  },
};
