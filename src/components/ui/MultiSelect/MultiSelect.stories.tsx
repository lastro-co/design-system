import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  ArrowRightLeftIcon,
  Building2Icon,
  HomeIcon,
  SendIcon,
} from "@/components/icons.v2";
import { FormItem } from "../Form";
import { Label } from "../Label";
import { MultiSelect, type MultiSelectOption } from "./MultiSelect";

const OPERATION_OPTIONS: MultiSelectOption[] = [
  { value: "aluguel", label: "Aluguel", icon: <HomeIcon /> },
  { value: "compra", label: "Compra", icon: <Building2Icon /> },
  { value: "venda", label: "Venda", icon: <SendIcon /> },
  { value: "permuta", label: "Permuta", icon: <ArrowRightLeftIcon /> },
];

const CITY_OPTIONS: MultiSelectOption[] = [
  { value: "sp", label: "São Paulo" },
  { value: "rj", label: "Rio de Janeiro" },
  { value: "bh", label: "Belo Horizonte" },
  { value: "ctb", label: "Curitiba" },
  { value: "poa", label: "Porto Alegre" },
  { value: "sal", label: "Salvador" },
  { value: "for", label: "Fortaleza" },
  { value: "rec", label: "Recife" },
  { value: "bsb", label: "Brasília" },
  { value: "man", label: "Manaus" },
];

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  parameters: {
    jest: "MultiSelect.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the multi-select is disabled",
    },
    searchable: {
      control: "boolean",
      description: "Whether to show a search input inside the popover",
    },
    state: {
      control: "select",
      options: ["default", "error", "success"],
      description: "Visual validation state of the trigger",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="w-96">
        <MultiSelect
          {...args}
          onValueChange={setValue}
          options={OPERATION_OPTIONS}
          placeholder="Selecione uma ou mais operações"
          value={value}
        />
      </div>
    );
  },
};

export const WithSelectedValues: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(["aluguel", "compra"]);
    return (
      <div className="w-96">
        <MultiSelect
          {...args}
          onValueChange={setValue}
          options={OPERATION_OPTIONS}
          placeholder="Selecione uma ou mais operações"
          value={value}
        />
      </div>
    );
  },
};

export const Searchable: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(["sp", "rj"]);
    return (
      <div className="w-96">
        <MultiSelect
          {...args}
          onValueChange={setValue}
          options={CITY_OPTIONS}
          placeholder="Selecione cidades"
          searchable
          searchPlaceholder="Buscar operação"
          value={value}
        />
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => {
    function Example({
      label,
      initialValue = [],
      ...props
    }: {
      label: string;
      initialValue?: string[];
    } & Partial<React.ComponentProps<typeof MultiSelect>>) {
      const [value, setValue] = useState<string[]>(initialValue);
      return (
        <FormItem>
          <Label>{label}</Label>
          <MultiSelect
            onValueChange={setValue}
            options={OPERATION_OPTIONS}
            placeholder="Selecione uma ou mais operações"
            value={value}
            {...props}
          />
        </FormItem>
      );
    }

    return (
      <div className="flex w-96 flex-col gap-6">
        <Example label="Default" />
        <Example initialValue={["aluguel", "compra"]} label="Com seleção" />
        <Example
          initialValue={["aluguel", "compra"]}
          label="Com busca"
          searchable
        />
        <Example label="Erro" state="error" />
        <Example initialValue={["aluguel"]} label="Sucesso" state="success" />
        <Example disabled initialValue={["aluguel"]} label="Desabilitado" />
      </div>
    );
  },
};
