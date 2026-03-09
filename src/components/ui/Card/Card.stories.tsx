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

export const Default: Story = {
  render: () => (
    <Card className="w-[350px] border-gray-300 bg-white">
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
        <CardDescription>Descrição do card aqui.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Conteúdo do card.</p>
      </CardContent>
      <CardFooter>
        <p className="text-gray-500 text-sm">Footer do card</p>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px] border-gray-300 bg-white p-6">
      <p>Card simples com conteúdo direto.</p>
    </Card>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div className="flex flex-row items-center justify-between gap-4 rounded-xl border border-gray-300 bg-white p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-gray-900 text-lg">
            Título do card
          </span>
          <ChevronRightIcon className="size-6 text-gray-900" />
        </div>
        <span className="text-gray-600 text-sm leading-relaxed">
          Descrição do card com informações adicionais
        </span>
      </div>
      <div className="relative shrink-0">
        <img
          alt="Imagem do card"
          className="h-[84px] w-[112px] object-contain"
          src="https://placehold.co/112x84/e5e5e5/999?text=Image"
        />
      </div>
    </div>
  ),
};
