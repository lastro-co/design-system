import type { Meta } from "@storybook/react-vite";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

const meta = {
  title: "Components/Popover",
  component: PopoverContent,
  parameters: {
    jest: "Popover.test.tsx",
    layout: "centered",
    docs: {
      description: {
        component: `
Componente de popover baseado no Radix UI que exibe conteúdo contextual em sobreposição.

## Componentes

- **Popover**: Container principal do popover
- **PopoverTrigger**: Elemento que dispara a abertura do popover
- **PopoverContent**: Conteúdo e aparência do popover
- **PopoverAnchor**: Elemento de referência para posicionamento

## Props Principais

### Popover
- \`open\`: Controla se o popover está aberto
- \`defaultOpen\`: Estado inicial aberto/fechado
- \`onOpenChange\`: Callback quando o estado muda
- \`modal\`: Define se o popover é modal (padrão: true)

### PopoverContent
- \`side\`: Posição do popover (top, right, bottom, left)
- \`align\`: Alinhamento (start, center, end)
- \`sideOffset\`: Distância do elemento trigger (padrão: 4px)
- \`alignOffset\`: Offset do alinhamento
- \`avoidCollisions\`: Evita colisões com bordas (padrão: true)
- \`collisionPadding\`: Padding para detecção de colisão
- \`sticky\`: Comportamento sticky no eixo de alinhamento
- \`hideWhenDetached\`: Oculta quando trigger fica ocluído

## Casos de Uso

Ideal para menus de contexto, formulários em overlay, tooltips complexos e interfaces que precisam exibir conteúdo adicional sem navegar para outra página.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // PopoverContent props
    side: {
      control: { type: "select" },
      options: ["top", "right", "bottom", "left"],
      description: "Posição do popover em relação ao trigger",
      defaultValue: "bottom",
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Alinhamento do popover",
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
    avoidCollisions: {
      control: { type: "boolean" },
      description: "Evita colisões com bordas da tela",
      defaultValue: true,
    },
    collisionPadding: {
      control: { type: "number", min: 0, max: 50, step: 1 },
      description: "Padding para detecção de colisão",
      defaultValue: 0,
    },
    sticky: {
      control: { type: "select" },
      options: ["partial", "always"],
      description: "Comportamento sticky no eixo de alinhamento",
      defaultValue: "partial",
    },
    hideWhenDetached: {
      control: { type: "boolean" },
      description: "Oculta quando trigger fica totalmente ocluído",
      defaultValue: false,
    },
    className: {
      control: { type: "text" },
      description: "Classes CSS customizadas",
    },
  },
} satisfies Meta<typeof PopoverContent>;

export default meta;

export const Default = {
  name: "Padrão",
  render: (args: {
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
    avoidCollisions?: boolean;
    collisionPadding?: number;
    sticky?: "partial" | "always";
    hideWhenDetached?: boolean;
    className?: string;
  }) => (
    <Popover>
      <PopoverTrigger className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
        Abrir Popover
      </PopoverTrigger>
      <PopoverContent
        align={args.align}
        alignOffset={args.alignOffset}
        avoidCollisions={args.avoidCollisions}
        className={args.className}
        collisionPadding={args.collisionPadding}
        hideWhenDetached={args.hideWhenDetached}
        side={args.side}
        sideOffset={args.sideOffset}
        sticky={args.sticky}
      >
        <div className="space-y-2">
          <h3 className="font-medium">Título do Popover</h3>
          <p className="text-muted-foreground text-sm">
            Este é o conteúdo do popover
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
  args: {
    side: "bottom",
    align: "center",
    sideOffset: 4,
    alignOffset: 0,
    avoidCollisions: true,
    collisionPadding: 0,
    sticky: "partial",
    hideWhenDetached: false,
    className: "",
  },
};
