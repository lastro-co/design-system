import type { Meta } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { fn } from "storybook/test";
import { Button } from "../Button/Button";
import { Toaster, toast } from ".";

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
    closeButton: {
      control: "boolean",
      description:
        "Show a close button on toasts. Off by default: the DS 2026.2 toast has none.",
      defaultValue: false,
    },
    duration: {
      control: "number",
      description: "Default duration in milliseconds",
      defaultValue: 4000,
    },
  },
};

export default meta;

const EVENT = "Evento criado";
const EVENT_DATE = "Segunda-feira, 3 de Janeiro às 18:00";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-display font-semibold text-gray-900 text-lg">
          {title}
        </h3>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

function Demo({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-180 max-w-full flex-col gap-8">
      <Toaster />
      {children}
    </div>
  );
}

/** Title only, title + description and a long description that wraps. */
export const Default = {
  name: "Padrão",
  render: () => (
    <Demo>
      <Section title="Padrão">
        <Button onClick={() => toast("Evento foi criado.")} variant="outline">
          Só título
        </Button>
        <Button
          onClick={() => toast(EVENT, { description: EVENT_DATE })}
          variant="outline"
        >
          Título + descrição
        </Button>
        <Button
          onClick={() =>
            toast(EVENT, {
              description: `${EVENT_DATE}, na sala de reuniões do 4º andar, com os corretores do time comercial.`,
            })
          }
          variant="outline"
        >
          Descrição longa
        </Button>
      </Section>
    </Demo>
  ),
};

export const AllToastTypes = {
  name: "Tipos",
  render: () => (
    <Demo>
      <Section title="Com descrição">
        <Button
          onClick={() =>
            toast.success("Sucesso!", {
              description: "Suas alterações foram salvas.",
            })
          }
          variant="outline"
        >
          Sucesso
        </Button>
        <Button
          onClick={() =>
            toast.error("Erro!", {
              description: "Algo deu errado. Por favor, tente novamente.",
            })
          }
          variant="outline"
        >
          Erro
        </Button>
        <Button
          onClick={() =>
            toast.warning("Aviso", {
              description: "Esta ação pode ter efeitos colaterais.",
            })
          }
          variant="outline"
        >
          Aviso
        </Button>
        <Button
          onClick={() =>
            toast.info("Informação", {
              description: "Aqui estão algumas informações úteis.",
            })
          }
          variant="outline"
        >
          Info
        </Button>
      </Section>
      <Section title="Só título">
        <Button onClick={() => toast.success("Sucesso!")} variant="outline">
          Sucesso
        </Button>
        <Button onClick={() => toast.error("Erro!")} variant="outline">
          Erro
        </Button>
        <Button onClick={() => toast.warning("Aviso")} variant="outline">
          Aviso
        </Button>
        <Button onClick={() => toast.info("Informação")} variant="outline">
          Info
        </Button>
      </Section>
    </Demo>
  ),
};

/**
 * `action` renders the white button and `cancel` the gray one. Both close
 * the toast after their `onClick`.
 */
export const WithButtons = {
  name: "Com botões",
  render: () => (
    <Demo>
      <Section title="Com botões">
        <Button
          onClick={() =>
            toast(EVENT, {
              description: EVENT_DATE,
              action: { label: "Desfazer", onClick: fn() },
            })
          }
          variant="outline"
        >
          Ação — título + descrição
        </Button>
        <Button
          onClick={() =>
            toast(EVENT, {
              action: { label: "Desfazer", onClick: fn() },
            })
          }
          variant="outline"
        >
          Ação — só título
        </Button>
        <Button
          onClick={() =>
            toast.success("Sucesso!", {
              description: "Suas alterações foram salvas.",
              action: { label: "Ver", onClick: fn() },
            })
          }
          variant="outline"
        >
          Ação em toast tipado
        </Button>
        <Button
          onClick={() =>
            toast(EVENT, {
              description: EVENT_DATE,
              cancel: { label: "Cancelar", onClick: fn() },
              action: { label: "Desfazer", onClick: fn() },
            })
          }
          variant="outline"
        >
          Cancelar + ação
        </Button>
        <Button
          onClick={() =>
            toast(EVENT, {
              description: EVENT_DATE,
              cancel: { label: "Cancelar", onClick: fn() },
            })
          }
          variant="outline"
        >
          Só cancelar
        </Button>
      </Section>
    </Demo>
  ),
};

const report = (ok: boolean) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => (ok ? resolve() : reject(new Error("fail"))), 2500);
  });

export const PromiseToast = {
  name: "Promise / loading",
  render: () => (
    <Demo>
      <Section
        description="`toast.loading` mostra o spinner; `toast.promise` troca para sucesso ou erro quando a promise termina."
        title="Promise / loading"
      >
        <Button
          onClick={() => toast.loading("Gerando relatório...")}
          variant="outline"
        >
          Loading — só título
        </Button>
        <Button
          onClick={() =>
            toast.loading("Gerando relatório...", {
              description: "Isso pode levar alguns segundos.",
            })
          }
          variant="outline"
        >
          Loading — título + descrição
        </Button>
        <Button
          onClick={() =>
            toast.promise(report(true), {
              loading: "Gerando relatório...",
              success: "Report gerado com sucesso!",
              error: "Falha ao gerar relatório.",
            })
          }
          variant="outline"
        >
          Promise resolvida
        </Button>
        <Button
          onClick={() =>
            toast.promise(report(false), {
              loading: "Gerando relatório...",
              success: "Report gerado com sucesso!",
              error: "Falha ao gerar relatório.",
            })
          }
          variant="outline"
        >
          Promise rejeitada
        </Button>
      </Section>
    </Demo>
  ),
};

/**
 * At rest only the front toast shows; the ones behind lift 14px and scale to
 * 0.95 / 0.90 with their content hidden. Hover opens the stack. At most 3 are
 * visible (`visibleToasts`).
 */
export const Stacking = {
  name: "Empilhamento",
  render: () => (
    <Demo>
      <Section
        description="Passe o mouse sobre a pilha para abrir."
        title="Empilhamento"
      >
        <Button
          onClick={() => {
            toast.error("Erro!", {
              description: "Algo deu errado. Por favor, tente novamente.",
            });
            toast.success("Sucesso!", {
              description: "Suas alterações foram salvas.",
            });
            toast("Evento foi criado.");
          }}
          variant="outline"
        >
          Disparar 3 toasts
        </Button>
      </Section>
    </Demo>
  ),
};

export const CustomDuration = {
  name: "Duração customizada",
  render: () => (
    <Demo>
      <Section
        description="Controle quanto tempo cada toast permanece visível."
        title="Duração customizada"
      >
        <Button
          onClick={() => toast.success("Toast rápido (1s)", { duration: 1000 })}
          variant="outline"
        >
          1 segundo
        </Button>
        <Button
          onClick={() => toast.success("Toast padrão (4s)", { duration: 4000 })}
          variant="outline"
        >
          4 segundos (padrão)
        </Button>
        <Button
          onClick={() =>
            toast.success("Toast longo (10s)", { duration: 10_000 })
          }
          variant="outline"
        >
          10 segundos
        </Button>
        <Button
          onClick={() =>
            toast.success("Toast infinito", {
              duration: Number.POSITIVE_INFINITY,
              // Without a timeout the toast needs its own way out.
              closeButton: true,
            })
          }
          variant="outline"
        >
          Infinito
        </Button>
      </Section>
    </Demo>
  ),
};

export const Positions = {
  name: "Posições",
  render: () => (
    <Demo>
      <Section
        description="O toast pode aparecer em diferentes posições na tela."
        title="Posições"
      >
        {(
          [
            "top-left",
            "top-center",
            "top-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ] as const
        ).map((position) => (
          <Button
            key={position}
            onClick={() => toast.success(position, { position })}
            variant="outline"
          >
            {position}
          </Button>
        ))}
      </Section>
    </Demo>
  ),
};
