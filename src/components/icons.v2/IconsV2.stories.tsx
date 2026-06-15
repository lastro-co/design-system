import type { Meta } from "@storybook/react-vite";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import * as IconsV2 from "@/components/icons.v2";

type LucideIconComponent = ComponentType<LucideProps>;

const iconEntries = (
  Object.entries(IconsV2) as [string, LucideIconComponent][]
).sort(([a], [b]) => a.localeCompare(b));

const LUCIDE_URL = "https://lucide.dev/icons/";

const meta: Meta = {
  title: "Icons V2",
  parameters: {
    jest: "IconsV2.test.tsx",
    layout: "centered",
    docs: {
      description: {
        component: `Conjunto curado de ícones baseado em **lucide-react**, mais o componente \`LaisLogo\` (marca). Importe de \`@lastro-co/design-system/icons.v2\`. Coexiste com o conjunto legado em \`@lastro-co/design-system/icons\`.

Precisa de um ícone que ainda não está listado? Consulte o catálogo completo do lucide-react em [lucide.dev/icons](${LUCIDE_URL}) e peça para o time adicionar o alias aqui.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "number" },
      description: "Tamanho em pixels (default lucide: 24)",
    },
    strokeWidth: {
      control: { type: "number" },
      description: "Espessura do traço (default: 2)",
    },
    className: {
      control: { type: "text" },
      description: "Classes Tailwind adicionais (ex: text-purple-800)",
    },
  },
};

export default meta;

type IconsArgs = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

function LucideLink() {
  return (
    <a
      className="inline-flex items-center gap-1 font-medium text-purple-800 text-sm hover:text-purple-900 hover:underline"
      href={LUCIDE_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      Ver catálogo completo no lucide.dev
      <IconsV2.ExternalLinkIcon
        aria-hidden
        className="shrink-0"
        size={14}
        strokeWidth={2}
      />
    </a>
  );
}

export const AllIcons = {
  name: "Ícones Disponíveis",
  render: (args: IconsArgs) => (
    <div className="w-full max-w-[960px]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-gray-600 text-sm">
          {iconEntries.length} ícones curados prontos para uso. Precisa de
          outro? Solicite ao time.
        </p>
        <LucideLink />
      </div>
      <div className="grid grid-cols-5 gap-3">
        {iconEntries.map(([name, Icon]) => (
          <div
            className="flex flex-col items-center gap-2 rounded border p-4 hover:bg-gray-50"
            key={name}
          >
            <Icon
              className={args.className}
              size={args.size ?? 24}
              strokeWidth={args.strokeWidth ?? 2}
            />
            <span className="break-all text-center text-[11px] text-gray-600">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
  args: {
    size: 24,
    strokeWidth: 2,
    className: "text-gray-900",
  },
};

type AnimatedIconComponent = ComponentType<{
  size?: number;
  className?: string;
}>;

const animatedIconEntries = (
  Object.entries(IconsV2).filter(([name]) => name.startsWith("Animated")) as [
    string,
    AnimatedIconComponent,
  ][]
).sort(([a], [b]) => a.localeCompare(b));

export const AnimatedIcons = {
  name: "Ícones Animados",
  render: () => (
    <div className="w-full max-w-[960px]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="max-w-[640px] text-gray-600 text-sm">
          {animatedIconEntries.length} variantes animadas (Motion) de{" "}
          <a
            className="font-medium text-purple-800 hover:underline"
            href="https://lucide-animated.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            lucide-animated
          </a>
          . A animação dispara no hover e retorna ao estado inicial ao sair.
          Passe o mouse sobre cada ícone para ver.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {animatedIconEntries.map(([name, Icon]) => (
          <div
            className="flex cursor-pointer flex-col items-center gap-2 rounded border p-4 text-gray-900 hover:bg-gray-50"
            key={name}
          >
            <Icon size={24} />
            <span className="break-all text-center text-[11px] text-gray-600">
              {name}
            </span>
          </div>
        ))}
      </div>
      <pre className="mt-6 max-w-[720px] overflow-x-auto rounded-lg bg-gray-900 px-4 py-3 text-gray-100 text-xs">
        {`import { AnimatedHomeIcon } from "@lastro-co/design-system/icons.v2";

// Hover-triggered out of the box:
<AnimatedHomeIcon size={24} className="text-purple-800" />

// Or feed it to a MenuItem's animatedIcon slot:
<MenuItem animatedIcon={<AnimatedHomeIcon />} label="Início" />`}
      </pre>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Variantes animadas dos ícones curados, importadas de [lucide-animated.com](https://lucide-animated.com) (animações via Motion). Exportadas com prefixo `Animated` (ex: `AnimatedHomeIcon`), coexistindo com as versões estáticas. O hover é tratado internamente pelo componente — basta renderizar. Nem todos os ícones curados possuem variante animada; os que possuem aparecem acima.",
      },
    },
  },
};

export const Sizes = {
  name: "Tamanhos",
  render: (args: IconsArgs) => (
    <div className="flex items-end space-x-4">
      {[16, 18, 20, 24, 32, 40].map((px) => (
        <div className="flex flex-col items-center space-y-2" key={px}>
          <IconsV2.HomeIcon
            className={args.className}
            size={px}
            strokeWidth={args.strokeWidth ?? 2}
          />
          <div className="text-center">
            <div className="font-medium text-xs">{px}px</div>
          </div>
        </div>
      ))}
    </div>
  ),
  args: {
    strokeWidth: 2,
    className: "text-gray-900",
  },
};

export const StrokeWidths = {
  name: "Espessuras",
  render: (args: IconsArgs) => (
    <div className="flex items-center space-x-6">
      {[1, 1.5, 2, 2.5, 3].map((sw) => (
        <div className="flex flex-col items-center space-y-2" key={sw}>
          <IconsV2.SettingsIcon
            className={args.className}
            size={args.size ?? 32}
            strokeWidth={sw}
          />
          <span className="text-xs">{sw}</span>
        </div>
      ))}
    </div>
  ),
  args: {
    size: 32,
    className: "text-gray-900",
  },
};

export const Colors = {
  name: "Cores",
  render: (args: IconsArgs) => {
    const palette = [
      { className: "text-purple-800", label: "Purple 800" },
      { className: "text-purple-900", label: "Purple 900" },
      { className: "text-gray-900", label: "Gray 900" },
      { className: "text-gray-600", label: "Gray 600" },
      { className: "text-blue-600", label: "Blue 600" },
      { className: "text-green-600", label: "Green 600" },
      { className: "text-yellow-600", label: "Yellow 600" },
      { className: "text-red-600", label: "Red 600" },
    ];

    return (
      <div className="flex flex-wrap gap-6">
        {palette.map(({ className, label }) => (
          <div className="flex flex-col items-center space-y-2" key={label}>
            <IconsV2.MessageSquareIcon
              className={className}
              size={args.size ?? 32}
              strokeWidth={args.strokeWidth ?? 2}
            />
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </div>
    );
  },
  args: {
    size: 32,
    strokeWidth: 2,
  },
};
