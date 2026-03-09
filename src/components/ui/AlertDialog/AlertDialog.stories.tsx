import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/Button";
import { AlertDialog } from "./AlertDialog";

const meta: Meta<typeof AlertDialog> = {
  title: "Components/AlertDialog",
  component: AlertDialog,
  parameters: {
    jest: "AlertDialog.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Título do dialog",
    },
    description: {
      control: "text",
      description: "Descrição do dialog",
    },
    cancelText: {
      control: "text",
      description: "Texto do botão cancelar",
    },
    actionText: {
      control: "text",
      description: "Texto do botão de ação",
    },
    cancelColor: {
      control: "select",
      options: ["purple", "error", "black"],
      description: "Cor do botão cancelar",
    },
    actionColor: {
      control: "select",
      options: ["purple", "error", "black"],
      description: "Cor do botão de ação",
    },
    cancelVariant: {
      control: "select",
      options: ["contained", "outlined"],
      description: "Variante do botão cancelar",
    },
    actionVariant: {
      control: "select",
      options: ["contained", "outlined"],
      description: "Variante do botão de ação",
    },
    cancelSize: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Tamanho do botão cancelar",
    },
    actionSize: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Tamanho do botão de ação",
    },
    open: {
      control: "boolean",
      description: "Controla se o dialog está aberto",
    },
    defaultOpen: {
      control: "boolean",
      description: "Estado inicial de abertura do dialog",
    },
    onOpenChange: {
      action: "onOpenChange",
      description: "Callback chamado quando o estado de abertura muda",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Confirmar ação",
    description:
      "Esta ação não pode ser desfeita. Tem certeza que deseja continuar?",
    cancelText: "Cancelar",
    actionText: "Confirmar",
  },
  render: (args) => (
    <AlertDialog {...args}>
      <Button>Abrir Dialog</Button>
    </AlertDialog>
  ),
};
