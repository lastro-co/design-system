import type { Meta, StoryObj } from "@storybook/react-vite";
import { LaisLogo } from "./LaisLogo";

const meta: Meta<typeof LaisLogo> = {
  title: "Lais Logo",
  component: LaisLogo,
  parameters: {
    jest: "LaisLogo.test.tsx",
    layout: "centered",
    docs: {
      description: {
        component:
          "Marca da Lais. Duas variantes — wordmark completo e símbolo compacto — com animação opcional de rotação 360° em hover. Use o wordmark nos cabeçalhos expandidos e o símbolo em menus recolhidos ou espaços reduzidos.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    symbolOnly: {
      control: { type: "boolean" },
      description:
        "Renderiza apenas o símbolo (32×32) em vez do wordmark completo (110×32).",
    },
    animateOnHover: {
      control: { type: "boolean" },
      description:
        "Gira o símbolo 360° ao passar o mouse (transição de 1.8s com ease customizado).",
    },
    className: {
      control: { type: "text" },
      description: "Classes Tailwind adicionais (ex: text-purple-900, h-7).",
    },
    "aria-label": {
      control: { type: "text" },
      description: "Rótulo acessível. Default: 'Lais'.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LaisLogo>;

export const Default: Story = {
  name: "Wordmark",
  args: {
    animateOnHover: true,
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-6 p-8">
      <LaisLogo {...args} />
      <span className="text-gray-600 text-xs">
        Passe o mouse para animar o símbolo
      </span>
    </div>
  ),
};

export const Symbol: Story = {
  name: "Símbolo",
  args: {
    symbolOnly: true,
    animateOnHover: true,
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-6 p-8">
      <LaisLogo {...args} />
      <span className="text-gray-600 text-xs">
        Versão compacta — ideal para menus recolhidos
      </span>
    </div>
  ),
};

export const Static: Story = {
  name: "Sem Animação",
  args: {
    animateOnHover: false,
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-8 p-8">
      <LaisLogo {...args} />
      <LaisLogo {...args} symbolOnly />
      <span className="text-gray-600 text-xs">
        <code className="rounded bg-gray-100 px-1.5 py-0.5">
          animateOnHover=&#123;false&#125;
        </code>{" "}
        desativa a rotação
      </span>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Tamanhos",
  render: () => (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex items-center gap-8">
        <LaisLogo className="h-5 w-auto" />
        <LaisLogo className="h-7 w-auto" />
        <LaisLogo className="h-10 w-auto" />
      </div>
      <div className="flex items-center gap-8">
        <LaisLogo className="size-5" symbolOnly />
        <LaisLogo className="size-8" symbolOnly />
        <LaisLogo className="size-12" symbolOnly />
      </div>
      <span className="text-gray-600 text-xs">
        Escale via{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5">className</code>{" "}
        (ex:{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5">h-7 w-auto</code>)
      </span>
    </div>
  ),
};

export const Colors: Story = {
  name: "Cores",
  render: () => (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex items-center gap-8">
        <LaisLogo className="text-purple-900" />
        <LaisLogo className="text-purple-800" />
        <LaisLogo className="text-gray-900" />
        <LaisLogo className="text-black" />
      </div>
      <span className="text-gray-600 text-xs">
        A marca herda a cor via{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5">currentColor</code>
      </span>
    </div>
  ),
};
