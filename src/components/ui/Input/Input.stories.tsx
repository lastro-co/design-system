import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { SearchIcon, UserIcon } from "@/components/icons.v2";
import { FormItem } from "../Form";
import { Label } from "../Label";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    jest: "Input.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "file"],
      description: "Input type",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Disable the input",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    "aria-invalid": {
      control: "boolean",
      description: "Indicates if the input has an error",
    },
    icon: {
      control: false,
      description: "Icon to display at the beginning of the input",
    },
    state: {
      control: "select",
      options: ["default", "error", "success"],
      description: "Visual validation state of the input",
    },
  },
};

export default meta;

export const Default = {
  args: {
    placeholder: "Enter text...",
    type: "search",
  },
};

export const WithIcon = {
  args: {
    icon: <UserIcon />,
    placeholder: "Digitando...",
  },
};

export const AllVariants = {
  render() {
    const [searchValue, setSearchValue] = useState("Resultado da busca");

    return (
      <div className="flex w-80 flex-col gap-6">
        <FormItem>
          <Label>Default</Label>
          <Input placeholder="Enter text..." />
        </FormItem>

        <FormItem>
          <Label>With Icon</Label>
          <Input icon={<UserIcon />} placeholder="Digitando..." />
        </FormItem>

        <FormItem>
          <Label>Search with Clear</Label>
          <Input
            icon={<SearchIcon />}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue("")}
            placeholder="Buscar..."
            type="search"
            value={searchValue}
          />
        </FormItem>

        <FormItem>
          <Label>Focus</Label>
          <Input placeholder="Click to focus..." />
        </FormItem>

        <FormItem>
          <Label required>Error</Label>
          <Input defaultValue="Jo" state="error" />
          <p className="mt-1 text-red-600 text-xs">
            Nome deve ter pelo menos 3 caracteres.
          </p>
        </FormItem>

        <FormItem>
          <Label required>Success</Label>
          <Input defaultValue="maria@email.com" state="success" />
          <p className="mt-1 text-green-600 text-xs">Email válido.</p>
        </FormItem>

        <FormItem>
          <Label>Disabled</Label>
          <Input disabled placeholder="Disabled input" />
        </FormItem>

        <FormItem>
          <Label>Disabled with Icon</Label>
          <Input disabled icon={<UserIcon />} placeholder="Disabled" />
        </FormItem>

        <FormItem className="pb-6">
          <Label>Disabled with Search</Label>
          <Input
            disabled
            icon={<SearchIcon />}
            placeholder="Busca desabilitada"
            type="search"
          />
        </FormItem>
      </div>
    );
  },
};
