import type { Meta } from "@storybook/react-vite";
import type { LucideProps } from "lucide-react";
import { motion, type TargetAndTransition } from "motion/react";
import type { ComponentType } from "react";
import { useState } from "react";
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

type AnimationName = "bounce" | "rotate" | "spin" | "pulse";

const ANIMATION_VARIANTS: Record<AnimationName, TargetAndTransition> = {
  bounce: { y: [0, -4, 0], transition: { duration: 0.4 } },
  rotate: { rotate: [0, 15, -15, 0], transition: { duration: 0.5 } },
  spin: { rotate: [0, 180], transition: { duration: 0.5, ease: "easeInOut" } },
  pulse: { scale: [1, 1.18, 1], transition: { duration: 0.4 } },
};

const ANIMATION_DOCS: Record<AnimationName, string> = {
  bounce: "Sobe 4px e volta. Ideal para chamar atenção sem ser intrusivo.",
  rotate: "Balanço leve (15° para cada lado). Bom para ações de ajuste.",
  spin: "Meia volta e mantém. Usado em Configurações no menu principal.",
  pulse: "Cresce 18% e volta. Reforça notificações e chamadas ativas.",
};

function AnimatedDemo({
  animation,
  Icon,
  label,
}: {
  animation: AnimationName;
  Icon: LucideIconComponent;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  const idle: TargetAndTransition =
    animation === "spin" ? {} : { rotate: 0, y: 0, scale: 1 };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        className="flex size-20 cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white text-purple-800 transition-colors hover:bg-gray-50"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        type="button"
      >
        <motion.div animate={hovered ? ANIMATION_VARIANTS[animation] : idle}>
          <Icon size={28} strokeWidth={2} />
        </motion.div>
      </button>
      <div className="flex flex-col items-center text-center">
        <span className="font-medium text-gray-900 text-sm">{label}</span>
        <span className="mt-0.5 max-w-[180px] text-gray-600 text-xs">
          {ANIMATION_DOCS[animation]}
        </span>
      </div>
    </div>
  );
}

export const AnimatedIcons = {
  name: "Ícones Animados",
  render: () => (
    <div className="flex flex-col items-center gap-6 p-4">
      <p className="max-w-[720px] text-center text-gray-600 text-sm">
        Quatro variantes de animação em hover, disponibilizadas pelo componente
        <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-[12px]">
          Menu
        </code>
        através da prop{" "}
        <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-[12px]">
          animation
        </code>
        . Passe o mouse para ver.
      </p>
      <div className="flex flex-wrap items-start justify-center gap-10">
        <AnimatedDemo
          animation="bounce"
          Icon={IconsV2.HomeIcon}
          label="bounce"
        />
        <AnimatedDemo
          animation="rotate"
          Icon={IconsV2.UsersIcon}
          label="rotate"
        />
        <AnimatedDemo
          animation="spin"
          Icon={IconsV2.SettingsIcon}
          label="spin"
        />
        <AnimatedDemo animation="pulse" Icon={IconsV2.BellIcon} label="pulse" />
      </div>
      <pre className="mt-4 max-w-[720px] overflow-x-auto rounded-lg bg-gray-900 px-4 py-3 text-gray-100 text-xs">
        {`<MenuItem
  icon={<HomeIcon />}
  animation="bounce"   // 'bounce' | 'rotate' | 'spin' | 'pulse' | 'none'
  label="Início"
/>`}
      </pre>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstração das 4 variantes de animação suportadas pelo `MenuItem`. A animação é disparada no hover e retorna ao estado idle ao sair — exceto `spin`, que permanece em 180° (comportamento idêntico ao protótipo).",
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
