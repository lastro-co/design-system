import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MessageSquareTextIcon,
  SearchIcon,
  SettingsIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons.v2";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "./ContextMenu";

const meta: Meta<typeof ContextMenuItem> = {
  title: "Sobreposição/ContextMenu",
  component: ContextMenuItem,
  parameters: {
    jest: "ContextMenu.test.tsx",
    layout: "centered",
    docs: {
      description: {
        component: `
Componente de menu contextual baseado no Radix UI que exibe opções ao clicar com botão direito.

## Componentes

- **ContextMenu**: Container principal do menu contextual
- **ContextMenuTrigger**: Elemento que dispara a abertura do menu (clique direito)
- **ContextMenuContent**: Container do conteúdo do menu
- **ContextMenuItem**: Item individual do menu
- **ContextMenuLabel**: Label/título para grupos de itens

## Props do ContextMenuItem

- \`icon\`: Ícone exibido à esquerda do texto
- \`variant\`: Estilo visual do item (\`"default"\` ou \`"destructive"\`)
- \`disabled\`: Desabilita o item
- \`onSelect\`: Callback quando o item é selecionado

## Uso

Clique com o botão direito no elemento trigger para abrir o menu.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
      description: "Ícone exibido à esquerda do texto",
    },
    variant: {
      control: "select",
      options: ["default", "destructive"],
      description: "Estilo visual do item",
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o item",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Padrão",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 text-gray-500 text-sm">
        Clique com botão direito aqui
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Ver conversa</ContextMenuItem>
        <ContextMenuItem>Chamar no WhatsApp</ContextMenuItem>
        <ContextMenuItem>Copiar telefone</ContextMenuItem>
        <ContextMenuItem>Cancelar solicitação</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithIcons: Story = {
  name: "Com Ícones",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 text-gray-500 text-sm">
        Clique com botão direito aqui
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<MessageSquareTextIcon />}>
          Ver conversa
        </ContextMenuItem>
        <ContextMenuItem icon={<WhatsAppIcon />}>
          Chamar no WhatsApp
        </ContextMenuItem>
        <ContextMenuItem icon={<SearchIcon />}>Buscar</ContextMenuItem>
        <ContextMenuItem icon={<SettingsIcon />}>Configurações</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithDisabledItems: Story = {
  name: "Com Itens Desabilitados",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 text-gray-500 text-sm">
        Clique com botão direito aqui
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Ação disponível</ContextMenuItem>
        <ContextMenuItem disabled>Ação desabilitada</ContextMenuItem>
        <ContextMenuItem>Outra ação disponível</ContextMenuItem>
        <ContextMenuItem disabled>Outra ação desabilitada</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const DestructiveAction: Story = {
  name: "Com Ação Destrutiva",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 text-gray-500 text-sm">
        Clique com botão direito aqui
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Ver detalhes</ContextMenuItem>
        <ContextMenuItem>Editar</ContextMenuItem>
        <ContextMenuItem>Duplicar</ContextMenuItem>
        <ContextMenuItem icon={<XIcon />} variant="destructive">
          Excluir
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const CompleteExample: Story = {
  name: "Exemplo Completo",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 text-gray-500 text-sm">
        Clique com botão direito aqui
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<MessageSquareTextIcon />}>
          Ver conversa
        </ContextMenuItem>
        <ContextMenuItem icon={<WhatsAppIcon />}>
          Chamar no WhatsApp
        </ContextMenuItem>
        <ContextMenuItem>Copiar telefone</ContextMenuItem>
        <ContextMenuItem>Copiar CPF</ContextMenuItem>
        <ContextMenuItem icon={<XIcon />} variant="destructive">
          Cancelar solicitação
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithLabels: Story = {
  name: "Com Labels",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 text-gray-500 text-sm">
        Clique com botão direito aqui
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Comunicação</ContextMenuLabel>
        <ContextMenuItem icon={<MessageSquareTextIcon />}>
          Ver conversa
        </ContextMenuItem>
        <ContextMenuItem icon={<WhatsAppIcon />}>
          Chamar no WhatsApp
        </ContextMenuItem>
        <ContextMenuLabel>Ações</ContextMenuLabel>
        <ContextMenuItem icon={<SearchIcon />}>Buscar</ContextMenuItem>
        <ContextMenuItem icon={<SettingsIcon />}>Configurações</ContextMenuItem>
        <ContextMenuLabel>Zona de Perigo</ContextMenuLabel>
        <ContextMenuItem icon={<XIcon />} variant="destructive">
          Excluir
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
