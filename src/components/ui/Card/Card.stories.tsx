import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    jest: "Card.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * Card no estado de repouso: raio 8px, borda `gray-200`, sombra `shadow-card` e
 * padding de 24px em todos os lados. Sem subtítulo, o conteúdo começa 24px
 * abaixo do título. Passe o mouse para ver a borda escurecer para `gray-300`.
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]" title="Atividades">
      <p className="text-gray-600 text-sm">
        A Lais registrou 3 novas atividades hoje.
      </p>
    </Card>
  ),
};

/**
 * Com `subtitle`, o ritmo vertical é: título → **8px** → subtítulo → **24px** →
 * conteúdo.
 */
export const WithSubtitle: Story = {
  render: () => (
    <Card
      className="w-[350px]"
      subtitle="Resumo do que a Lais fez nas últimas 24 horas."
      title="Atividades"
    >
      <p className="text-gray-600 text-sm">3 novas atividades registradas.</p>
    </Card>
  ),
};

/**
 * Sem a prop `title` o Card é só a superfície — o conteúdo já nasce dentro dos
 * 24px de padding.
 */
export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <p className="text-gray-600 text-sm">Card simples com conteúdo direto.</p>
    </Card>
  ),
};

/**
 * `titleTooltip` adiciona o ícone de informação ao lado do título.
 */
export const WithTitleTooltip: Story = {
  render: () => (
    <Card
      className="w-[350px]"
      title="Cobranças de atendimento"
      titleTooltip="Atendimentos que ultrapassaram a franquia do plano são cobrados à parte."
    >
      <p className="text-gray-600 text-sm">Nenhuma cobrança neste ciclo.</p>
    </Card>
  ),
};

/**
 * Composição com os sub-componentes. O padding de 24px é do `Card` — o
 * `CardHeader` e o `CardFooter` só cuidam do ritmo vertical.
 */
export const Composed: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Reengajamento em minutos</CardTitle>
        <CardDescription>
          A Lais envia uma mensagem 15 minutos depois que o lead parar de
          responder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm">Ativo desde 12 de março.</p>
      </CardContent>
      <CardFooter>
        <p className="text-gray-600 text-sm">Última execução há 2 horas.</p>
      </CardFooter>
    </Card>
  ),
};

/**
 * O espaçamento entre cards é de 16px (`gap-4`) e fica a cargo de quem compõe a
 * tela — o Card não opina sobre o layout ao redor.
 */
export const CardGrid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid w-[740px] grid-cols-2 gap-4">
      <Card title="Consumo do plano">
        <p className="text-gray-600 text-sm">10 / 150 atendimentos</p>
      </Card>
      <Card title="Cobranças de atendimento">
        <p className="text-gray-600 text-sm">Nenhuma neste ciclo</p>
      </Card>
      <Card title="Pré-agendamento de visitas">
        <p className="text-gray-600 text-sm">1 visita aguardando</p>
      </Card>
      <Card title="Leads por canal">
        <p className="text-gray-600 text-sm">WhatsApp lidera com 62%</p>
      </Card>
    </div>
  ),
};

/**
 * Card com imagem à direita, composto a partir do próprio `Card` — o padding de
 * 24px e a borda vêm do componente, não de markup solto.
 */
export const WithImage: Story = {
  render: () => (
    <Card className="flex w-[420px] flex-row items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-1">
          <CardTitle>Configurar negócio</CardTitle>
          <ChevronRightIcon className="size-6 text-gray-800" />
        </div>
        <CardDescription>
          Ajuste as informações que a Lais usa para atender seus leads.
        </CardDescription>
      </div>
      <img
        alt="Ilustração de configuração do negócio"
        className="shrink-0 object-contain"
        height={84}
        src="/img/config-business.png"
        width={112}
      />
    </Card>
  ),
};
