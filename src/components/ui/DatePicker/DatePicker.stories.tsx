import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    jest: "DatePicker.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Texto do placeholder",
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o componente",
    },
    state: {
      control: "select",
      options: ["default", "error", "success"],
      description: "Estado visual de validação do campo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// Figma's closed trigger frame is 240px wide; the picker itself is w-full.
const figmaWidth: Story["decorators"] = [
  (Story) => (
    <div className="w-60">
      <Story />
    </div>
  ),
];

export const Default: Story = {
  decorators: figmaWidth,
  args: {
    placeholder: "Selecione uma data",
  },
};

export const WithValue: Story = {
  decorators: figmaWidth,
  args: {
    value: new Date(2026, 8, 12),
  },
};

export const Open: Story = {
  decorators: figmaWidth,
  args: {
    value: new Date(2026, 11, 10),
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"));
  },
};

export const WithDisabledDates: Story = {
  decorators: figmaWidth,
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const isWeekend = (date: Date) =>
      date.getDay() === 0 || date.getDay() === 6;

    return (
      <DatePicker
        disabledDates={isWeekend}
        onChange={setSelectedDate}
        placeholder="Selecione um dia útil"
        value={selectedDate}
      />
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
    );

    return (
      <div className="flex flex-col gap-4">
        <DatePicker
          onChange={setSelectedDate}
          placeholder="Selecione uma data"
          value={selectedDate}
        />
        <p className="text-gray-600 text-sm">
          Data selecionada:{" "}
          {selectedDate ? selectedDate.toLocaleDateString("pt-BR") : "Nenhuma"}
        </p>
      </div>
    );
  },
};

export const WithCustomPlaceholder: Story = {
  decorators: figmaWidth,
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    return (
      <DatePicker
        onChange={setSelectedDate}
        placeholder="Data de nascimento"
        value={selectedDate}
      />
    );
  },
};

export const Disabled: Story = {
  decorators: figmaWidth,
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
    );

    return (
      <DatePicker
        disabled
        onChange={setSelectedDate}
        placeholder="Selecione uma data"
        value={selectedDate}
      />
    );
  },
};

export const WithError: Story = {
  decorators: figmaWidth,
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    return (
      <div className="flex flex-col gap-2">
        <DatePicker
          onChange={setSelectedDate}
          placeholder="Selecione uma data"
          state="error"
          value={selectedDate}
        />
        <p className="-mt-1 text-red-600 text-xs">Campo obrigatório</p>
      </div>
    );
  },
};

export const WithSuccess: Story = {
  decorators: figmaWidth,
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
    );

    return (
      <div className="flex flex-col gap-2">
        <DatePicker
          onChange={setSelectedDate}
          placeholder="Selecione uma data"
          state="success"
          value={selectedDate}
        />
        <p className="-mt-1 text-green-600 text-xs">Data válida.</p>
      </div>
    );
  },
};

export const InForm: Story = {
  render: () => {
    const [birthDate, setBirthDate] = useState<Date | undefined>();
    const [subscriptionDate, setSubscriptionDate] = useState<
      Date | undefined
    >();

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(
        `Dados enviados:\nData de Nascimento: ${birthDate?.toLocaleDateString("pt-BR") || "Não informada"}\nData de Assinatura: ${subscriptionDate?.toLocaleDateString("pt-BR") || "Não informada"}`
      );
    };

    return (
      <form className="flex w-80 flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-900 text-sm" htmlFor="birth">
            Data de Nascimento
          </label>
          <DatePicker id="birth" onChange={setBirthDate} value={birthDate} />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-medium text-gray-900 text-sm"
            htmlFor="subscription"
          >
            Data de Assinatura
          </label>
          <DatePicker
            id="subscription"
            onChange={setSubscriptionDate}
            value={subscriptionDate}
          />
        </div>

        <button
          className="h-10 rounded-md bg-purple-800 px-4 text-white hover:bg-purple-900"
          type="submit"
        >
          Enviar
        </button>
      </form>
    );
  },
};
