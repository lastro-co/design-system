import type { Meta } from "@storybook/react-vite";
import { Alert, AlertDescription, AlertTitle } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    jest: "Alert.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "select",
      options: ["success", "info", "warning", "error"],
      description: "Alert severity",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;

export const Docs = {
  args: {
    severity: "success",
    children: (
      <>
        <AlertTitle>Informações alteradas com sucesso!</AlertTitle>
        <AlertDescription>
          Para seguir com o pedido de atualização você precisa selecionar, no
          mínimo, 30 imóveis e, no máximo, 300 imóveis (15% do seu plano atual).
        </AlertDescription>
      </>
    ),
  },
};

export const Success = {
  args: {
    severity: "success",
    children: (
      <>
        <AlertTitle>Informações alteradas com sucesso!</AlertTitle>
        <AlertDescription>
          Para seguir com o pedido de atualização você precisa selecionar, no
          mínimo, 30 imóveis e, no máximo, 300 imóveis (15% do seu plano atual).
        </AlertDescription>
      </>
    ),
  },
};

export const Info = {
  args: {
    severity: "info",
    children: (
      <>
        <AlertTitle>Informação importante</AlertTitle>
        <AlertDescription>
          Esta é uma mensagem informativa para o usuário sobre algum processo ou
          situação.
        </AlertDescription>
      </>
    ),
  },
};

export const Warning = {
  args: {
    severity: "warning",
    children: (
      <>
        <AlertTitle>Atenção necessária</AlertTitle>
        <AlertDescription>
          Esta é uma mensagem de aviso que requer atenção do usuário antes de
          prosseguir.
        </AlertDescription>
      </>
    ),
  },
};

export const ErrorVariant = {
  args: {
    severity: "error",
    children: (
      <>
        <AlertTitle>Erro encontrado</AlertTitle>
        <AlertDescription>
          Ocorreu um erro durante o processamento. Verifique os dados e tente
          novamente.
        </AlertDescription>
      </>
    ),
  },
};
