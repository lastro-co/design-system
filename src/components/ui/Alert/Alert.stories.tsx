import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Button } from "../Button";
import { Alert, AlertDescription, AlertTitle } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    jest: "Alert.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-208 max-w-full">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    severity: {
      control: "select",
      options: ["success", "info", "warning", "error", "neutral", "brand"],
      description: "Alert severity",
    },
    icon: {
      control: false,
      description: "Replaces the severity icon (20px, severity color).",
    },
    action: {
      control: false,
      description:
        'Optional action at the right — usually `<Button variant="outline" size="small">`.',
    },
    onDismiss: {
      control: false,
      description:
        "Renders the close (X) button. The caller owns the alert's visibility.",
    },
    dismissLabel: {
      control: "text",
      description: "Accessible label of the close button.",
    },
    iconPlacement: {
      table: { disable: true },
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Docs: Story = {
  args: {
    severity: "info",
    children: (
      <>
        <AlertTitle>
          A Meta pode demorar até 24 horas para aprovar o disparo
        </AlertTitle>
        <AlertDescription>
          Por isso, disparos em massa só podem ser enviados depois de 24 horas
          do horário atual.
        </AlertDescription>
      </>
    ),
  },
};

export const Success: Story = {
  args: {
    severity: "success",
    children: (
      <>
        <AlertTitle>Deploy concluído</AlertTitle>
        <AlertDescription>
          Suas alterações foram implantadas em produção.
        </AlertDescription>
      </>
    ),
  },
};

export const Info: Story = {
  args: {
    severity: "info",
    children: (
      <>
        <AlertTitle>Atualização do sistema</AlertTitle>
        <AlertDescription>
          Uma nova versão está disponível. Por favor, atualize a página.
        </AlertDescription>
      </>
    ),
  },
};

export const Warning: Story = {
  args: {
    severity: "warning",
    children: (
      <>
        <AlertTitle>
          A tentativa 3 não será criada devido ao tamanho dos intervalos
          escolhidos
        </AlertTitle>
        <AlertDescription>
          Ao avançar, você vai direto para a revisão da régua. Caso queira
          manter 3 tentativas, reduza o tempo acima de forma que a duração total
          da régua não passe de 25 dias.
        </AlertDescription>
      </>
    ),
  },
};

export const ErrorVariant: Story = {
  name: "Error",
  args: {
    severity: "error",
    children: (
      <>
        <AlertTitle>Erro de autenticação</AlertTitle>
        <AlertDescription>
          Acesso negado. Você não tem permissão para entrar.
        </AlertDescription>
      </>
    ),
  },
};

export const Neutral: Story = {
  args: {
    severity: "neutral",
    children: (
      <>
        <AlertTitle>Informação importante</AlertTitle>
        <AlertDescription>
          A Casa da Lais mudou. Agora você encontra vídeos informativos.
        </AlertDescription>
      </>
    ),
  },
};

/** Brand announcement with an action and the close button. */
export const Brand: Story = {
  args: {
    severity: "brand",
    action: (
      <Button size="small" variant="outline">
        Começar
      </Button>
    ),
    onDismiss: fn(),
    children: (
      <>
        <AlertTitle>Bem-vindo à Lais!</AlertTitle>
        <AlertDescription>
          Comece configurando sua primeira regra de automação.
        </AlertDescription>
      </>
    ),
  },
};

/** Title only — the compact row from the Figma section. */
export const TitleOnly: Story = {
  args: {
    severity: "info",
    children: <AlertTitle>Atualização do sistema</AlertTitle>,
  },
};

/**
 * `onDismiss` renders the close button. The alert does not hide itself —
 * this story keeps the visibility in state to show the intended wiring.
 */
export const Dismissible: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);

    if (!open) {
      return (
        <Button onClick={() => setOpen(true)} size="small" variant="outline">
          Mostrar alerta de novo
        </Button>
      );
    }

    return (
      <Alert {...args} onDismiss={() => setOpen(false)}>
        <AlertTitle>Limite de uso se aproximando</AlertTitle>
        <AlertDescription>
          Você utilizou 90% da sua cota mensal.
        </AlertDescription>
      </Alert>
    );
  },
  args: {
    severity: "warning",
  },
};

const GALLERY = [
  {
    severity: "brand",
    title: "Bem-vindo à Lais!",
    description: "Comece configurando sua primeira regra de automação.",
    action: true,
    dismiss: true,
  },
  {
    severity: "neutral",
    title: "Informação importante",
    description:
      "A Casa da Lais mudou. Agora você encontra vídeos informativos.",
    dismiss: true,
  },
  {
    severity: "info",
    title: "Atualização do sistema",
    description:
      "Uma nova versão está disponível. Por favor, atualize a página.",
  },
  {
    severity: "success",
    title: "Deploy concluído",
    description: "Suas alterações foram implantadas em produção.",
  },
  {
    severity: "warning",
    title: "Limite de uso se aproximando",
    description: "Você utilizou 90% da sua cota mensal.",
    dismiss: true,
  },
  {
    severity: "error",
    title: "Erro ao processar",
    description: "Não foi possível concluir a operação. Tente novamente.",
    dismiss: true,
  },
] as const;

/** Every severity, with and without description, as laid out in Figma. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {[true, false].map((withDescription) => (
        <div className="flex flex-col gap-4" key={String(withDescription)}>
          {GALLERY.map((item) => (
            <Alert
              action={
                "action" in item ? (
                  <Button size="small" variant="outline">
                    Começar
                  </Button>
                ) : undefined
              }
              key={item.severity}
              onDismiss={"dismiss" in item ? fn() : undefined}
              severity={item.severity}
            >
              <AlertTitle>{item.title}</AlertTitle>
              {withDescription && (
                <AlertDescription>{item.description}</AlertDescription>
              )}
            </Alert>
          ))}
        </div>
      ))}
    </div>
  ),
};

/**
 * Every surface is opaque, so the alert stays legible on screens whose
 * background is not white (drawers, gray page shells, colored sections).
 */
export const OnColoredBackground: Story = {
  decorators: [
    (Story) => (
      <div className="rounded-lg bg-gray-100 p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    severity: "neutral",
    children: (
      <>
        <AlertTitle>Fundo próprio</AlertTitle>
        <AlertDescription>
          Mesmo sobre uma superfície cinza, o alerta mantém o fundo opaco.
        </AlertDescription>
      </>
    ),
  },
};
