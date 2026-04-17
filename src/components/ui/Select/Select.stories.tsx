import type { Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";
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
  size?: "sm" | "md" | "lg";
  variant?: "bordered" | "borderless";
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
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the select trigger and items",
    },
    variant: {
      control: "select",
      options: ["bordered", "borderless"],
      description: "Visual variant of the select trigger",
    },
  },
};

export default meta;

type Story = StoryObj<SelectStoryArgs>;

export const Default: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem size={size} value="option1">
            Opção 1
          </SelectItem>
          <SelectItem size={size} value="option2">
            Opção 2
          </SelectItem>
          <SelectItem size={size} value="option3">
            Opção 3
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const WithGroups: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Selecione uma fruta" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frutas</SelectLabel>
            <SelectItem size={size} value="apple">
              Maçã
            </SelectItem>
            <SelectItem size={size} value="banana">
              Banana
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetais</SelectLabel>
            <SelectItem size={size} value="carrot">
              Cenoura
            </SelectItem>
            <SelectItem size={size} value="potato">
              Batata
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => {
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Selecione uma opção (desabilitado)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem size={size} value="option1">
            Opção 1
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const WithPlaceholder: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Escolha uma categoria..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem size={size} value="cat1">
            Categoria 1
          </SelectItem>
          <SelectItem size={size} value="cat2">
            Categoria 2
          </SelectItem>
          <SelectItem size={size} value="cat3">
            Categoria 3
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const Searchable: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Selecione uma cidade..." />
        </SelectTrigger>
        <SelectContent searchable searchPlaceholder="Buscar cidade...">
          <SelectItem size={size} value="sp">
            São Paulo
          </SelectItem>
          <SelectItem size={size} value="rj">
            Rio de Janeiro
          </SelectItem>
          <SelectItem size={size} value="bh">
            Belo Horizonte
          </SelectItem>
          <SelectItem size={size} value="ctb">
            Curitiba
          </SelectItem>
          <SelectItem size={size} value="poa">
            Porto Alegre
          </SelectItem>
          <SelectItem size={size} value="sal">
            Salvador
          </SelectItem>
          <SelectItem size={size} value="for">
            Fortaleza
          </SelectItem>
          <SelectItem size={size} value="rec">
            Recife
          </SelectItem>
          <SelectItem size={size} value="bsb">
            Brasília
          </SelectItem>
          <SelectItem size={size} value="man">
            Manaus
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const SizeSmall: Story = {
  args: {
    size: "sm",
  },
  render: (args) => {
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Small select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem size={size} value="option1">
            Opção 1
          </SelectItem>
          <SelectItem size={size} value="option2">
            Opção 2
          </SelectItem>
          <SelectItem size={size} value="option3">
            Opção 3
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const SizeMedium: Story = {
  args: {
    size: "md",
  },
  render: (args) => {
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Medium select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem size={size} value="option1">
            Opção 1
          </SelectItem>
          <SelectItem size={size} value="option2">
            Opção 2
          </SelectItem>
          <SelectItem size={size} value="option3">
            Opção 3
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const SizeLarge: Story = {
  args: {
    size: "lg",
  },
  render: (args) => {
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Large select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem size={size} value="option1">
            Opção 1
          </SelectItem>
          <SelectItem size={size} value="option2">
            Opção 2
          </SelectItem>
          <SelectItem size={size} value="option3">
            Opção 3
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
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Sem borda" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem size={size} value="option1">
            Opção 1
          </SelectItem>
          <SelectItem size={size} value="option2">
            Opção 2
          </SelectItem>
          <SelectItem size={size} value="option3">
            Opção 3
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
  },
  render: (args) => {
    const { "aria-invalid": ariaInvalid, size, variant, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid} size={size} variant={variant}>
          <SelectValue placeholder="Campo com erro" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem size={size} value="option1">
            Opção 1
          </SelectItem>
          <SelectItem size={size} value="option2">
            Opção 2
          </SelectItem>
          <SelectItem size={size} value="option3">
            Opção 3
          </SelectItem>
        </SelectContent>
      </Select>
    );
  },
};
