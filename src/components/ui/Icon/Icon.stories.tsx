import type { Meta } from "@storybook/react-vite";
import type React from "react";
import * as Icons from "@/components/icons";
import { Icon } from "@/components/ui/Icon";

// Function to check if a component is a valid icon
const isValidIconComponent = (
  component: any
): component is React.ComponentType<any> =>
  typeof component === "function" ||
  (typeof component === "object" &&
    component !== null &&
    typeof component.render === "function");

// Filter only valid icon components
const getValidIcons = () =>
  Object.entries(Icons).filter(([, component]) =>
    isValidIconComponent(component)
  );

// Use CircleSlashIcon as default so variant control has visible effect (supports outline/filled)
const DefaultIcon = Icons.CircleSlashIcon;

const meta = {
  title: "Icons",
  component: DefaultIcon,
  parameters: {
    jest: "Icon.test.tsx",
    layout: "centered",
    docs: {
      description: {
        component:
          "Sistema de ícones SVG com suporte a diferentes tamanhos, variantes (outline/filled) e integração com Tailwind CSS. Ícones com suporte a variant podem passar props `outline` e `filled` com blocos SVG distintos.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      description: "Tamanho do ícone",
      defaultValue: "md",
    },
    color: {
      control: { type: "select" },
      options: [
        "blue-600",
        "gray-600",
        "gray-900",
        "green-600",
        "white",
        "purple-800",
        "purple-900",
        "red-600",
        "yellow-600",
      ],
      description: "Cor do ícone",
    },
    className: {
      control: { type: "text" },
      description: "Classes CSS adicionais (ex: cores do Tailwind)",
    },
    variant: {
      control: { type: "select" },
      options: ["outline", "filled"],
      description:
        "Variante visual do ícone. Use com props outline e filled para alternar entre contorno e preenchido.",
    },
  },
} satisfies Meta<typeof DefaultIcon>;

export default meta;

export const AllIcons = {
  name: "Todos os Ícones",
  render: (args: {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    color?:
      | "blue-600"
      | "gray-600"
      | "gray-900"
      | "green-600"
      | "white"
      | "purple-800"
      | "purple-900"
      | "red-600"
      | "yellow-600";
    className?: string;
    variant?: "outline" | "filled";
  }) => {
    const validIcons = getValidIcons();

    if (validIcons.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          Nenhum ícone disponível no momento
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-6 p-4">
        {validIcons.map(([iconName, IconComponent]) => {
          const Component = IconComponent as React.ComponentType<any>;
          return (
            <div
              className="flex flex-col items-center space-y-2 rounded border p-4 hover:bg-gray-50"
              key={iconName}
            >
              <Component
                className={args.className}
                color={args.color}
                size={args.size || "lg"}
                variant={args.variant}
              />
              <span className="break-words text-center text-xs">
                {iconName}
              </span>
            </div>
          );
        })}
      </div>
    );
  },
  args: {
    size: "lg",
    variant: "outline",
  },
};

export const SingleIcon = {
  name: "Ícone Individual",
  render: (args: {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    color?:
      | "blue-600"
      | "gray-600"
      | "gray-900"
      | "green-600"
      | "white"
      | "purple-800"
      | "purple-900"
      | "red-600"
      | "yellow-600";
    className?: string;
    variant?: "outline" | "filled";
  }) => <DefaultIcon {...args} />,
  args: {
    size: "md",
    variant: "outline",
  },
};

export const Sizes = {
  name: "Tamanhos",
  render: (args: { className?: string; variant?: "outline" | "filled" }) => {
    const sizeInfo = {
      xs: "12px",
      sm: "16px",
      md: "20px",
      lg: "24px",
      xl: "32px",
      "2xl": "40px",
    } as const;

    return (
      <div className="flex items-end space-x-4">
        {(Object.keys(sizeInfo) as Array<keyof typeof sizeInfo>).map((size) => (
          <div className="flex flex-col items-center space-y-2" key={size}>
            <DefaultIcon
              className={args.className}
              size={size}
              variant={args.variant}
            />
            <div className="text-center">
              <div className="font-medium text-xs">{size}</div>
              <div className="text-gray-500 text-xs">{sizeInfo[size]}</div>
            </div>
          </div>
        ))}
      </div>
    );
  },
  args: {
    variant: "outline",
  },
};

export const Colors = {
  name: "Cores",
  render: (args: {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    variant?: "outline" | "filled";
  }) => (
    <div className="flex flex-wrap gap-6">
      {[
        { color: "red-600" as const, label: "Red" },
        { color: "green-600" as const, label: "Green" },
        { color: "blue-600" as const, label: "Blue" },
        { color: "yellow-600" as const, label: "Yellow" },
        { color: "purple-900" as const, label: "purple 900" },
        { color: "purple-800" as const, label: "purple 800" },
        { color: "gray-900" as const, label: "Gray 900" },
        { color: "gray-600" as const, label: "Gray 600" },
        { color: "white" as const, label: "White" },
      ].map(({ color, label }) => (
        <div className="flex flex-col items-center space-y-2" key={color}>
          <DefaultIcon color={color} size={args.size} variant={args.variant} />
          <span className="text-xs">{label}</span>
        </div>
      ))}
    </div>
  ),
  args: {
    size: "lg",
    variant: "outline",
  },
};

const chatBubbleOutline = (
  <>
    <path
      d="M7.93975 20.9999C8.33333 20.9999 8.60642 20.7869 9.09638 20.3444L11.8674 17.8292H17.0241C19.4176 17.8292 20.7028 16.4774 20.7028 14.0768V7.80097C20.7028 5.40043 19.4176 4.04858 17.0241 4.04858H6.67871C4.28514 4.04858 3 5.39223 3 7.80097V14.0768C3 16.4855 4.28514 17.8292 6.67871 17.8292H7.06425V19.9593C7.06425 20.5902 7.37751 20.9999 7.93975 20.9999ZM8.26907 19.5006V17.1246C8.26907 16.6822 8.10039 16.5101 7.66666 16.5101H6.67871C5.05622 16.5101 4.29317 15.6663 4.29317 14.0686V7.80097C4.29317 6.20334 5.05622 5.36766 6.67871 5.36766H17.0241C18.6386 5.36766 19.4096 6.20334 19.4096 7.80097V14.0686C19.4096 15.6663 18.6386 16.5101 17.0241 16.5101H11.8193C11.3695 16.5101 11.1446 16.5756 10.8393 16.8952L8.26907 19.5006Z"
      fill="currentColor"
    />
    <path
      d="M7.71488 8.67779H15.8916C16.1486 8.67779 16.3494 8.47297 16.3494 8.2026C16.3494 7.94862 16.1486 7.7356 15.8916 7.7356H7.71488C7.45785 7.7356 7.24902 7.94862 7.24902 8.2026C7.24902 8.47297 7.45785 8.67779 7.71488 8.67779ZM7.71488 11.3487H15.8916C16.1486 11.3487 16.3494 11.1357 16.3494 10.8653C16.3494 10.6113 16.1486 10.3983 15.8916 10.3983H7.71488C7.45785 10.3983 7.24902 10.6113 7.24902 10.8653C7.24902 11.1357 7.45785 11.3487 7.71488 11.3487ZM7.71488 14.0114H13.0322C13.2892 14.0114 13.49 13.8066 13.49 13.5445C13.49 13.2741 13.2892 13.061 13.0322 13.061H7.71488C7.45785 13.061 7.24902 13.2741 7.24902 13.5445C7.24902 13.8066 7.45785 14.0114 7.71488 14.0114Z"
      fill="currentColor"
    />
  </>
);

const chatBubbleFilled = (
  <path
    d="M20.9206 7.8238V14.0655C20.9206 16.453 19.6169 17.7894 17.1887 17.7894H11.6803L8.73869 20.4784C8.35571 20.8369 8.11941 20.9999 7.80162 20.9999C7.33715 20.9999 7.0764 20.6658 7.0764 20.1606V17.7894H6.69343C4.26518 17.7894 2.96143 16.4612 2.96143 14.0655V7.8238C2.96143 5.42815 4.26518 4.0918 6.69343 4.0918H17.1887C19.6169 4.0918 20.9206 5.4363 20.9206 7.8238ZM7.6142 13.1121C7.34531 13.1121 7.12529 13.3322 7.12529 13.6092C7.12529 13.8781 7.34531 14.09 7.6142 14.09H13.1796C13.4485 14.09 13.6604 13.8781 13.6604 13.6092C13.6604 13.3322 13.4485 13.1121 13.1796 13.1121H7.6142ZM7.6142 10.3824C7.34531 10.3824 7.12529 10.6024 7.12529 10.8632C7.12529 11.1402 7.34531 11.3602 7.6142 11.3602H16.1701C16.439 11.3602 16.6508 11.1402 16.6508 10.8632C16.6508 10.6024 16.439 10.3824 16.1701 10.3824H7.6142ZM7.6142 7.65268C7.34531 7.65268 7.12529 7.87269 7.12529 8.13344C7.12529 8.41049 7.34531 8.62235 7.6142 8.62235H16.1701C16.439 8.62235 16.6508 8.41049 16.6508 8.13344C16.6508 7.87269 16.439 7.65268 16.1701 7.65268H7.6142Z"
    fill="currentColor"
  />
);

export const Variant = {
  name: "Variante (Outline / Filled)",
  args: {
    variant: "outline",
  },
  render: (args: { variant?: "outline" | "filled" }) => (
    <div className="flex flex-col items-center gap-2">
      <Icon
        aria-label="Chat Bubble"
        filled={chatBubbleFilled}
        outline={chatBubbleOutline}
        size="lg"
        variant={args.variant ?? "outline"}
      />
      <span className="text-xs">{args.variant ?? "outline"}</span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Ícones podem passar props `outline` e `filled` com blocos SVG distintos. O `variant` determina qual bloco é renderizado. Use o control para alternar entre outline e filled.",
      },
    },
  },
};
