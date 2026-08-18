import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    jest: "Dialog.test.tsx",
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
    cancelVariant: {
      control: "select",
      options: [
        "default",
        "outline",
        "ghost",
        "link",
        "destructive",
        "ghost-destructive",
        "dark",
      ],
      description: "Variante do botão cancelar",
    },
    actionVariant: {
      control: "select",
      options: [
        "default",
        "outline",
        "ghost",
        "link",
        "destructive",
        "ghost-destructive",
        "dark",
      ],
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
    showCloseButton: {
      control: "boolean",
      description: "Exibir botão de fechar (X) no canto superior direito",
    },
    open: {
      control: "boolean",
      description: "Controla se o dialog está aberto (modo controlado)",
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
    title: "Título do Dialog",
    description: "Esta é a descrição do dialog com informações importantes.",
    cancelText: "Cancelar",
    actionText: "Confirmar",
    trigger: <Button>Abrir Dialog</Button>,
  },
  render: (args) => (
    <Dialog {...args}>
      <p>Conteúdo customizado do dialog pode ser inserido aqui.</p>
    </Dialog>
  ),
};

export const Docs: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 font-semibold text-lg">
            1. Uso via Props (Recomendado)
          </h3>
          <Dialog
            actionText="Confirmar"
            cancelText="Cancelar"
            className="sm:max-w-4xl"
            description="Descrição do dialog com informações importantes."
            onAction={() => console.log("Confirmado")}
            onCancel={() => console.log("Cancelado")}
            title="Título do Dialog"
            trigger={<Button>Com botões via props</Button>}
          >
            <p>Conteúdo customizado do dialog.</p>
          </Dialog>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">2. Footer Customizado</h3>
          <Dialog
            description="Este dialog possui um footer totalmente customizado."
            footer={
              <>
                <Button size="medium" variant="outline">
                  Opção 1
                </Button>
                <Button size="medium" variant="outline">
                  Opção 2
                </Button>
                <Button size="medium" variant="default">
                  Opção 3
                </Button>
              </>
            }
            title="Dialog com Footer Customizado"
            trigger={<Button variant="outline">Footer customizado</Button>}
          >
            <p>Dialog com múltiplos botões customizados no footer.</p>
          </Dialog>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">3. Sem Botões</h3>
          <Dialog
            description="Dialog sem botões no footer."
            title="Dialog Simples"
            trigger={<Button variant="outline">Sem botões</Button>}
          >
            <p>Este dialog não possui botões de ação no footer.</p>
          </Dialog>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">
            4. Uso Manual (Componentes Individuais)
          </h3>
          <DialogRoot>
            <DialogTrigger asChild>
              <Button>Uso manual</Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Dialog Manual</DialogTitle>
                <DialogDescription>
                  Este dialog foi construído manualmente usando os componentes
                  individuais.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Conteúdo customizado aqui.</p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Fechar</Button>
                </DialogClose>
                <Button variant="default">Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">5. Ação de Perigo</h3>
          <Dialog
            actionText="Excluir"
            actionVariant="destructive"
            cancelText="Cancelar"
            description="Esta ação é permanente e não pode ser desfeita."
            onAction={() => console.log("Item excluído")}
            title="Excluir item"
            trigger={<Button variant="destructive">Excluir</Button>}
          >
            <p>Tem certeza que deseja excluir este item?</p>
          </Dialog>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">
            6. Controlado via Estado
          </h3>
          <Button onClick={() => setOpen(true)}>Abrir Dialog Controlado</Button>
          <Dialog
            actionText="Confirmar"
            cancelText="Fechar"
            description="Este dialog é aberto via prop open."
            onAction={() => {
              console.log("Confirmado");
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
            onOpenChange={setOpen}
            open={open}
            title="Dialog Controlado"
          >
            <p>Dialog controlado via estado open e onOpenChange.</p>
          </Dialog>
        </div>
      </div>
    );
  },
};
