import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChatBubbleIcon,
  CloseIcon,
  GearIcon,
  SearchIcon,
  WhatsAppIcon,
} from "@/components/icons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./ContextMenu";

const meta: Meta<typeof ContextMenuItem> = {
  title: "Components/ContextMenu",
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
- **ContextMenuSeparator**: Separador visual entre itens
- **ContextMenuLabel**: Label/título para grupos de itens

## Props do ContextMenuItem

- \`leftIcon\`: Ícone exibido à esquerda do texto
- \`rightIcon\`: Ícone exibido à direita do texto
- \`color\`: Cor customizada do texto (padrão: #323232)
- \`inset\`: Adiciona padding à esquerda
- \`destructive\`: Estilo para ações destrutivas
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
    leftIcon: {
      control: false,
      description: "Ícone exibido à esquerda do texto",
    },
    rightIcon: {
      control: false,
      description: "Ícone exibido à direita do texto",
    },
    color: {
      control: "color",
      description: "Cor customizada do texto",
    },
    inset: {
      control: "boolean",
      description: "Adiciona padding à esquerda",
    },
    destructive: {
      control: "boolean",
      description: "Estilo para ações destrutivas",
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
        <ContextMenuSeparator />
        <ContextMenuItem>Chamar no WhatsApp</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Copiar telefone</ContextMenuItem>
        <ContextMenuSeparator />
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
        <ContextMenuItem leftIcon={<ChatBubbleIcon size="sm" />}>
          Ver conversa
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem leftIcon={<WhatsAppIcon size="sm" />}>
          Chamar no WhatsApp
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem leftIcon={<SearchIcon size="sm" />}>
          Buscar
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem leftIcon={<GearIcon size="sm" />}>
          Configurações
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithRightIcons: Story = {
  name: "Com Ícones à Direita",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 text-gray-500 text-sm">
        Clique com botão direito aqui
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          leftIcon={<ChatBubbleIcon size="sm" />}
          rightIcon={<span className="text-gray-400 text-xs">⌘K</span>}
        >
          Ver conversa
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          leftIcon={<GearIcon size="sm" />}
          rightIcon={<span className="text-gray-400 text-xs">⌘,</span>}
        >
          Configurações
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithCustomColors: Story = {
  name: "Com Cores Customizadas",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 text-gray-500 text-sm">
        Clique com botão direito aqui
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem color="#49317A">Ação Primária</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem color="#2563EB">Ação Azul</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem color="#16A34A">Ação Verde</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem color="#DC2626">Ação Vermelha</ContextMenuItem>
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
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Ação desabilitada</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Outra ação disponível</ContextMenuItem>
        <ContextMenuSeparator />
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
        <ContextMenuSeparator />
        <ContextMenuItem>Editar</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Duplicar</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem color="#DC2626" leftIcon={<CloseIcon size="sm" />}>
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
        <ContextMenuItem leftIcon={<ChatBubbleIcon size="sm" />}>
          Ver conversa
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem leftIcon={<WhatsAppIcon size="sm" />}>
          Chamar no WhatsApp
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Copiar telefone</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Copiar CPF</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem color="#DC2626" leftIcon={<CloseIcon size="sm" />}>
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
        <ContextMenuItem leftIcon={<ChatBubbleIcon size="sm" />}>
          Ver conversa
        </ContextMenuItem>
        <ContextMenuItem leftIcon={<WhatsAppIcon size="sm" />}>
          Chamar no WhatsApp
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Ações</ContextMenuLabel>
        <ContextMenuItem leftIcon={<SearchIcon size="sm" />}>
          Buscar
        </ContextMenuItem>
        <ContextMenuItem leftIcon={<GearIcon size="sm" />}>
          Configurações
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Zona de Perigo</ContextMenuLabel>
        <ContextMenuItem destructive leftIcon={<CloseIcon size="sm" />}>
          Excluir
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
