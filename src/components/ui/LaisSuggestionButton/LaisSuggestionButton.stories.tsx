import type { Meta, StoryObj } from "@storybook/react-vite";
import { UndoIcon } from "@/components/icons.v2";
import { LaisSuggestionButton } from "./LaisSuggestionButton";

const meta: Meta<typeof LaisSuggestionButton> = {
  title: "Components/LaisSuggestionButton",
  component: LaisSuggestionButton,
  parameters: {
    jest: "LaisSuggestionButton.test.tsx",
    layout: "centered",
    docs: {
      description: {
        component:
          "Botão em pílula para ações sugeridas pela Lais, exibido acima do campo de mensagem (ex: “Corrigir texto”). Traz o símbolo da Lais à esquerda e um brilho roxo suave. Em `loading` o símbolo gira e o botão fica bloqueado sem perder o visual escuro; em `disabled` assume o visual claro, sem brilho. Use `icon` para trocar o símbolo por outro ícone (ex: desfazer).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: { type: "text" },
      description: "Rótulo do botão — também é o nome acessível.",
    },
    loading: {
      control: { type: "boolean" },
      description:
        "Gira o símbolo da Lais, define `aria-busy` e desabilita o botão mantendo o visual escuro. Sem rotação com `prefers-reduced-motion`.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Visual claro (cinza), sem brilho e sem interação.",
    },
    icon: {
      control: false,
      description:
        "Ícone à esquerda que substitui o símbolo da Lais. Sempre decorativo. Ignorado em `loading`.",
    },
    className: {
      control: { type: "text" },
      description: "Classes Tailwind adicionais (ex: mt-2).",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[160px] min-w-[360px] items-center justify-center bg-gray-50 p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    children: "Corrigir texto",
  },
};

export default meta;
type Story = StoryObj<typeof LaisSuggestionButton>;

export const Default: Story = {
  name: "Padrão",
};

export const Loading: Story = {
  name: "Carregando",
  args: {
    children: "Corrigindo…",
    loading: true,
  },
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: {
    disabled: true,
  },
};

export const WithCustomIcon: Story = {
  name: "Com ícone customizado",
  args: {
    children: "Desfazer correção",
    icon: <UndoIcon className="size-4" />,
  },
};

export const States: Story = {
  name: "Estados",
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <LaisSuggestionButton>Corrigir texto</LaisSuggestionButton>
        <LaisSuggestionButton loading>Corrigindo…</LaisSuggestionButton>
        <LaisSuggestionButton icon={<UndoIcon className="size-4" />}>
          Desfazer correção
        </LaisSuggestionButton>
        <LaisSuggestionButton disabled>Corrigir texto</LaisSuggestionButton>
      </div>
      <span className="text-gray-600 text-xs">
        Padrão · Carregando · Ícone customizado · Desabilitado
      </span>
    </div>
  ),
};
