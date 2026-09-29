import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchIcon } from "../../icons.v2";
import { Button } from "../Button";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: {
    jest: "EmptyState.test.tsx",
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    title: "Nenhuma mensagem ainda",
    description:
      "Quando você receber mensagens, elas aparecerão aqui. Inicie uma conversa para começar.",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <Button variant="outline">Recarregar</Button>,
  },
};

export const DescriptionOnly: Story = {
  args: {
    title: undefined,
  },
};

export const CustomIcon: Story = {
  args: {
    icon: <SearchIcon />,
    title: "Nenhum resultado encontrado",
    description: "Ajuste os filtros ou tente buscar por outro termo.",
    action: <Button variant="outline">Limpar filtros</Button>,
  },
};

export const WithoutIcon: Story = {
  args: {
    icon: null,
  },
};

/** The three combinations from the DS 2026.2 Figma section. */
export const FigmaExamples: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10 bg-gray-50 p-15">
      <EmptyState
        {...args}
        action={<Button variant="outline">Recarregar</Button>}
      />
      <EmptyState {...args} />
      <EmptyState {...args} title={undefined} />
    </div>
  ),
};
