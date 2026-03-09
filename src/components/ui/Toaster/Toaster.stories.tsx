import type { Meta } from "@storybook/react-vite";
import { toast } from "sonner";
import { Button } from "../Button/Button";
import { Toaster } from "./Toaster";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toaster (Sonner)",
  component: Toaster,
  parameters: {
    jest: "Toaster.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      description: "Toast position on the screen",
      defaultValue: "top-center",
    },
    expand: {
      control: "boolean",
      description: "Toasts will be expanded by default",
      defaultValue: false,
    },
    richColors: {
      control: "boolean",
      description: "Makes error and success toasts more colorful",
      defaultValue: false,
    },
    closeButton: {
      control: "boolean",
      description: "Show close button on toasts",
      defaultValue: true,
    },
    duration: {
      control: "number",
      description: "Default duration in milliseconds",
      defaultValue: 4000,
    },
  },
};

export default meta;

export const AllToastTypes = {
  name: "Tipos de Toast",
  render: () => (
    <div className="flex flex-col gap-4">
      <Toaster />
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Tipos de Toast</h3>
        <p className="text-gray-600 text-sm">
          Demonstração de todos os tipos de toast disponíveis com ícones
          personalizados
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              toast.success("Operação realizada com sucesso!", {
                description: "Suas alterações foram salvas.",
              })
            }
          >
            Success
          </Button>
          <Button
            onClick={() =>
              toast.info("Informação importante", {
                description: "Verifique os detalhes antes de continuar.",
              })
            }
          >
            Info
          </Button>
          <Button
            onClick={() =>
              toast.warning("Atenção necessária", {
                description: "Esta ação requer sua confirmação.",
              })
            }
          >
            Warning
          </Button>
          <Button
            onClick={() =>
              toast.error("Erro ao processar", {
                description: "Tente novamente mais tarde.",
              })
            }
          >
            Error
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const PromiseToast = {
  name: "Promise Toast",
  render: () => (
    <div className="flex flex-col gap-4">
      <Toaster />
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Promise Toast</h3>
        <p className="text-gray-600 text-sm">
          Toast com estado de loading que se transforma em success ou error
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => {
              const myPromise = new Promise<{ name: string }>(
                (resolve, reject) => {
                  setTimeout(() => {
                    if (Math.random() > 0.5) {
                      resolve({ name: "Tarefa" });
                    } else {
                      reject("Erro ao processar");
                    }
                  }, 3000);
                }
              );

              toast.promise(myPromise, {
                loading: "Processando tarefa...",
                success: (data) => `${data.name} concluída com sucesso!`,
                error: "Erro ao processar tarefa",
              });
            }}
          >
            Executar Promise
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const CustomDuration = {
  name: "Duração Customizada",
  render: () => (
    <div className="flex flex-col gap-4">
      <Toaster />
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Duração Customizada</h3>
        <p className="text-gray-600 text-sm">
          Controle quanto tempo cada toast permanece visível
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              toast.success("Toast rápido (1s)", {
                duration: 1000,
              })
            }
          >
            1 Segundo
          </Button>
          <Button
            onClick={() =>
              toast.success("Toast padrão (4s)", {
                duration: 4000,
              })
            }
          >
            4 Segundos (Padrão)
          </Button>
          <Button
            onClick={() =>
              toast.success("Toast longo (10s)", {
                duration: 10_000,
              })
            }
          >
            10 Segundos
          </Button>
          <Button
            onClick={() =>
              toast.success("Toast infinito", {
                duration: Number.POSITIVE_INFINITY,
              })
            }
          >
            Infinito
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const Positions = {
  name: "Posições",
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Posições</h3>
        <p className="text-gray-600 text-sm">
          Toast pode aparecer em diferentes posições na tela
        </p>
        <div className="grid grid-cols-3 gap-4">
          <Button
            onClick={() => {
              toast.success("Top Left", { position: "top-left" });
            }}
          >
            Top Left
          </Button>
          <Button
            onClick={() => {
              toast.success("Top Center", { position: "top-center" });
            }}
          >
            Top Center
          </Button>
          <Button
            onClick={() => {
              toast.success("Top Right", { position: "top-right" });
            }}
          >
            Top Right
          </Button>
          <Button
            onClick={() => {
              toast.success("Bottom Left", { position: "bottom-left" });
            }}
          >
            Bottom Left
          </Button>
          <Button
            onClick={() => {
              toast.success("Bottom Center", { position: "bottom-center" });
            }}
          >
            Bottom Center
          </Button>
          <Button
            onClick={() => {
              toast.success("Bottom Right", { position: "bottom-right" });
            }}
          >
            Bottom Right
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  ),
};
