import type { Meta } from "@storybook/react-vite";

import { TooltipProvider } from "../Tooltip";
import { InfoTooltip } from "./InfoTooltip";

const meta: Meta<typeof InfoTooltip> = {
  title: "Components/InfoTooltip",
  component: InfoTooltip,
  parameters: {
    jest: "InfoTooltip.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  argTypes: {
    "aria-label": {
      control: "text",
      description: "Accessible name for the trigger button",
    },
  },
};

export default meta;

export const Default = {
  render: () => (
    <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
      Leads qualificados
      <InfoTooltip aria-label="Informação sobre leads qualificados">
        Apenas leads qualificados automaticamente são considerados nos valores
        de conversão.
      </InfoTooltip>
    </span>
  ),
};

export const LongText = {
  render: () => (
    <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
      Qualificado pela Lais
      <InfoTooltip aria-label="Informação sobre leads qualificados pela Lais">
        Apenas leads que tenham sido qualificados automaticamente pela Lais e
        seus processos são considerados nos valores de conversão.
      </InfoTooltip>
    </span>
  ),
};
