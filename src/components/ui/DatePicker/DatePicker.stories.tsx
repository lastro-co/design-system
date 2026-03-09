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
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    placeholder: "Selecione uma data",
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
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    return (
      <div className="flex flex-col gap-2">
        <DatePicker
          aria-invalid={true}
          onChange={setSelectedDate}
          placeholder="Selecione uma data"
          value={selectedDate}
        />
        <p className="text-red-600 text-sm">Campo obrigatório</p>
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
          <DatePicker
            id="birth"
            onChange={setBirthDate}
            placeholder="dd/mm/aaaa"
            value={birthDate}
          />
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
            placeholder="dd/mm/aaaa"
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
