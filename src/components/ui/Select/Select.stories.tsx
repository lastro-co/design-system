import type { Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";
import {
  ArrowRightLeftIcon,
  Building2Icon,
  HomeIcon,
  SendIcon,
} from "@/components/icons.v2";
import { FormItem } from "../Form";
import { Label } from "../Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./Select";

type SelectStoryArgs = React.ComponentProps<typeof Select> & {
  "aria-invalid"?: boolean;
  variant?: "bordered" | "borderless";
  state?: "default" | "error" | "success";
};

const meta: Meta<SelectStoryArgs> = {
  title: "Components/Select",
  component: Select,
  parameters: {
    jest: "Select.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the select is disabled",
    },
    "aria-invalid": {
      control: "boolean",
      description: "Whether the select has an error",
    },
    variant: {
      control: "select",
      options: ["bordered", "borderless"],
      description: "Visual variant of the select trigger",
    },
    state: {
      control: "select",
      options: ["default", "error", "success"],
      description: "Visual validation state of the select trigger",
    },
  },
};

export default meta;

type Story = StoryObj<SelectStoryArgs>;

export const Default: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} variant={variant}>
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Opção 1</SelectItem>
          <SelectItem value="option2">Opção 2</SelectItem>
          <SelectItem value="option3">Opção 3</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const WithGroups: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} variant={variant}>
          <SelectValue placeholder="Selecione uma fruta" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frutas</SelectLabel>
            <SelectItem value="apple">Maçã</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetais</SelectLabel>
            <SelectItem value="carrot">Cenoura</SelectItem>
            <SelectItem value="potato">Batata</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};

export const WithPlaceholder: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} variant={variant}>
          <SelectValue placeholder="Escolha uma categoria..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cat1">Categoria 1</SelectItem>
          <SelectItem value="cat2">Categoria 2</SelectItem>
          <SelectItem value="cat3">Categoria 3</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const Searchable: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} variant={variant}>
          <SelectValue placeholder="Selecione uma cidade..." />
        </SelectTrigger>
        <SelectContent searchable searchPlaceholder="Buscar cidade...">
          <SelectItem value="sp">São Paulo</SelectItem>
          <SelectItem value="rj">Rio de Janeiro</SelectItem>
          <SelectItem value="bh">Belo Horizonte</SelectItem>
          <SelectItem value="ctb">Curitiba</SelectItem>
          <SelectItem value="poa">Porto Alegre</SelectItem>
          <SelectItem value="sal">Salvador</SelectItem>
          <SelectItem value="for">Fortaleza</SelectItem>
          <SelectItem value="rec">Recife</SelectItem>
          <SelectItem value="bsb">Brasília</SelectItem>
          <SelectItem value="man">Manaus</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const WithIcons: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, variant, ...selectArgs } = args;
    return (
      <Select defaultValue="aluguel" {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} variant={variant}>
          <SelectValue placeholder="Selecione uma operação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem icon={<HomeIcon />} value="aluguel">
            Aluguel
          </SelectItem>
          <SelectItem icon={<Building2Icon />} value="compra">
            Compra
          </SelectItem>
          <SelectItem icon={<SendIcon />} value="venda">
            Venda
          </SelectItem>
          <SelectItem icon={<ArrowRightLeftIcon />} value="permuta">
            Permuta
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const Borderless: Story = {
  args: {
    variant: "borderless",
  },
  render: (args) => {
    const { "aria-invalid": ariaInvalid, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} variant={variant}>
          <SelectValue placeholder="Sem borda" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Opção 1</SelectItem>
          <SelectItem value="option2">Opção 2</SelectItem>
          <SelectItem value="option3">Opção 3</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <FormItem>
        <Label>Default</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Opção 1</SelectItem>
            <SelectItem value="option2">Opção 2</SelectItem>
            <SelectItem value="option3">Opção 3</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>

      <FormItem>
        <Label>With Icon</Label>
        <Select defaultValue="aluguel">
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma operação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem icon={<HomeIcon />} value="aluguel">
              Aluguel
            </SelectItem>
            <SelectItem icon={<Building2Icon />} value="compra">
              Compra
            </SelectItem>
          </SelectContent>
        </Select>
      </FormItem>

      <FormItem>
        <Label>Focus</Label>
        <p className="text-gray-600 text-sm">
          Click the trigger to see the focus ring — it is not controlled via
          props.
        </p>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Click to focus..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Opção 1</SelectItem>
            <SelectItem value="option2">Opção 2</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>

      <FormItem>
        <Label required>Error</Label>
        <Select>
          <SelectTrigger state="error">
            <SelectValue placeholder="Campo com erro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Opção 1</SelectItem>
            <SelectItem value="option2">Opção 2</SelectItem>
          </SelectContent>
        </Select>
        <p className="-mt-1 text-red-600 text-xs">Este campo é obrigatório.</p>
      </FormItem>

      <FormItem>
        <Label required>Success</Label>
        <Select defaultValue="option1">
          <SelectTrigger state="success">
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Opção 1</SelectItem>
            <SelectItem value="option2">Opção 2</SelectItem>
          </SelectContent>
        </Select>
        <p className="-mt-1 text-green-600 text-xs">Opção válida.</p>
      </FormItem>

      <FormItem className="pb-6">
        <Label>Disabled</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção (desabilitado)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Opção 1</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
    </div>
  ),
};
