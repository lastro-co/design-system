import type { Meta } from "@storybook/react-vite";
import { Snackbar } from "./Snackbar";

const meta: Meta<typeof Snackbar> = {
  title: "Components/Snackbar",
  component: Snackbar,
  parameters: {
    jest: "Snackbar.test.tsx",
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "select",
      options: ["success", "info", "warning", "error"],
      description: "Snackbar severity (background color)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for positioning (e.g. sticky top-0)",
    },
  },
};

export default meta;

const longMessage =
  "Você tem boletos atrasados. A Lais continua atendendo seus leads, mas a regularização é necessária para manter o serviço ativo.";

export const Docs = {
  args: {
    severity: "error",
    children: longMessage,
    action: (
      <a className="whitespace-nowrap underline" href="/finance">
        Ver boletos →
      </a>
    ),
    onDismiss: () => alert("Dismissed"),
  },
};

export const Success = {
  args: {
    severity: "success",
    children: "Configurações salvas com sucesso!",
  },
};

export const Info = {
  args: {
    severity: "info",
    children: "Uma nova versão da plataforma está disponível.",
  },
};

export const Warning = {
  args: {
    severity: "warning",
    children: "Atenção: seu plano expira em 3 dias.",
  },
};

export const ErrorVariant = {
  args: {
    severity: "error",
    children: "Não foi possível conectar com o servidor.",
  },
};

export const WithAction = {
  args: {
    severity: "error",
    children: longMessage,
    action: (
      <a className="whitespace-nowrap underline" href="/finance">
        Ver boletos →
      </a>
    ),
  },
};

export const Dismissable = {
  args: {
    severity: "error",
    children: longMessage,
    onDismiss: () => alert("Dismissed"),
  },
};

export const ActionAndDismiss = {
  args: {
    severity: "error",
    children: longMessage,
    action: (
      <a className="whitespace-nowrap underline" href="/finance">
        Ver boletos →
      </a>
    ),
    onDismiss: () => alert("Dismissed"),
  },
};
