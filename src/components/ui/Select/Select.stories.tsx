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
  },
};

export default meta;

type Story = StoryObj<SelectStoryArgs>;

export const Default: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid}>
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
    const { "aria-invalid": ariaInvalid, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid}>
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

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => {
    const { "aria-invalid": ariaInvalid, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid}>
          <SelectValue placeholder="Selecione uma opção (desabilitado)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Opção 1</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const WithPlaceholder: Story = {
  render: (args) => {
    const { "aria-invalid": ariaInvalid, ...selectArgs } = args;
    return (
      <Select {...selectArgs}>
        <SelectTrigger aria-invalid={ariaInvalid}>
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
