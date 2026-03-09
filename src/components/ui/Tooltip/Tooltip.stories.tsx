import type { Meta } from "@storybook/react-vite";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

const meta = {
  title: "Components/Tooltip",
  component: TooltipContent,
  parameters: {
    jest: "Tooltip.test.tsx",
    layout: "centered",
    docs: {
      description: {
        component: `
Componente de tooltip baseado no Radix UI que exibe informações contextuais ao passar o mouse ou focar em um elemento.

## Componentes

- **TooltipProvider**: Contexto global para configurar comportamento dos tooltips
- **Tooltip**: Container principal do tooltip
- **TooltipTrigger**: Elemento que dispara o tooltip
- **TooltipContent**: Conteúdo e aparência do tooltip

## Props Principais

### TooltipProvider
- \`delayDuration\`: Delay antes de mostrar o tooltip (padrão: 0ms)
- \`skipDelayDuration\`: Tempo para pular delay entre tooltips (padrão: 300ms)
- \`disableHoverableContent\`: Desabilita hover no conteúdo do tooltip

### Tooltip
- \`open\`: Controla se o tooltip está aberto
- \`defaultOpen\`: Estado inicial aberto/fechado
- \`onOpenChange\`: Callback quando o estado muda

### TooltipContent
- \`side\`: Posição do tooltip (top, right, bottom, left)
- \`align\`: Alinhamento (start, center, end)
- \`sideOffset\`: Distância do elemento trigger (padrão: 4px)
- \`alignOffset\`: Offset do alinhamento
- \`hideArrow\`: Oculta a seta do tooltip
- \`className\`: Classes CSS customizadas
      `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // TooltipContent props
    side: {
      control: { type: "select" },
      options: ["top", "right", "bottom", "left"],
      description: "Posição do tooltip em relação ao trigger",
      defaultValue: "top",
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Alinhamento do tooltip",
      defaultValue: "center",
    },
    sideOffset: {
      control: { type: "number", min: 0, max: 50, step: 1 },
      description: "Distância em pixels do elemento trigger",
      defaultValue: 4,
    },
    alignOffset: {
      control: { type: "number", min: -50, max: 50, step: 1 },
      description: "Offset do alinhamento em pixels",
      defaultValue: 0,
    },
    hideArrow: {
      control: { type: "boolean" },
      description: "Oculta a seta do tooltip",
      defaultValue: false,
    },
    className: {
      control: { type: "text" },
      description: "Classes CSS customizadas",
    },
  },
} satisfies Meta<typeof TooltipContent>;

export default meta;

export const Default = {
  name: "Padrão",
  render: (args: {
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
    hideArrow?: boolean;
    className?: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            type="button"
          >
            Passe o mouse aqui
          </button>
        </TooltipTrigger>
        <TooltipContent
          align={args.align}
          alignOffset={args.alignOffset}
          className={args.className}
          hideArrow={args.hideArrow}
          side={args.side}
          sideOffset={args.sideOffset}
        >
          <p>Este é um tooltip padrão</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  args: {
    side: "top",
    align: "center",
    sideOffset: 4,
    alignOffset: 0,
    hideArrow: false,
    className: "",
  },
};

export const WithDelay = {
  name: "Com Delay",
  render: () => (
    <TooltipProvider delayDuration={700}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            type="button"
          >
            Hover com delay
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip com delay de 700ms</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const WithoutArrow = {
  name: "Sem Seta",
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            type="button"
          >
            Sem seta
          </button>
        </TooltipTrigger>
        <TooltipContent align="start" hideArrow side="top">
          <p>Tooltip sem seta</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Positions = {
  name: "Posições",
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
              type="button"
            >
              Top
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Tooltip no topo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
              type="button"
            >
              Right
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Tooltip à direita</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
              type="button"
            >
              Bottom
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Tooltip embaixo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
              type="button"
            >
              Left
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Tooltip à esquerda</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};

export const LongContent = {
  name: "Conteúdo Longo",
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            type="button"
          >
            Conteúdo longo
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <h4 className="font-medium">Título do Tooltip</h4>
            <p className="mt-1 text-gray-600 text-sm">
              Este é um exemplo de tooltip com conteúdo mais longo que pode
              incluir múltiplas linhas de texto e até mesmo outros elementos.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const OffsetExamples = {
  name: "Exemplos de Offset",
  render: () => (
    <div className="flex justify-center space-x-8">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
              type="button"
            >
              SideOffset 20px
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={20}>
            <p>Tooltip com sideOffset de 20px</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
              type="button"
            >
              AlignOffset 30px
            </button>
          </TooltipTrigger>
          <TooltipContent alignOffset={30}>
            <p>Tooltip com alignOffset de 30px</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};
