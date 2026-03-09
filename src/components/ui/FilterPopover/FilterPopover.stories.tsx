import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

import { Checkbox } from "../Checkbox";
import { Label } from "../Label";
import { RadioGroup, RadioGroupItem } from "../RadioGroup";
import { FilterPopover } from "./FilterPopover";

// Noop function for story callbacks
// biome-ignore lint/suspicious/noEmptyBlockStatements: intentional noop
const noop = () => {};

const meta: Meta<typeof FilterPopover> = {
  title: "Components/FilterPopover",
  component: FilterPopover,
  parameters: {
    jest: "FilterPopover.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed in the popover header",
    },
    count: {
      control: "number",
      description: "Number of active filters",
    },
    disabled: {
      control: "boolean",
      description: "Whether the filter is disabled",
    },
    submitLabel: {
      control: "text",
      description: "Text for the submit button",
    },
    clearLabel: {
      control: "text",
      description: "Text for the clear button",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Alignment of the popover",
    },
  },
};

export default meta;

export const Default = {
  args: {
    title: "Filtros",
    count: 0,
    children: (
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label className="font-medium text-sm">Status</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="active" />
              <Label htmlFor="active">Ativo</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="inactive" />
              <Label htmlFor="inactive">Inativo</Label>
            </div>
          </div>
        </div>
      </div>
    ),
    onClear: noop,
    onSubmit: noop,
  },
};

export const WithActiveFilters = {
  args: {
    title: "Filtro de visitas",
    count: 3,
    children: (
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label className="font-medium text-sm">Operação</Label>
          <RadioGroup defaultValue="all">
            <div className="flex items-center gap-2">
              <RadioGroupItem id="all" value="all" />
              <Label htmlFor="all">Todas</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="rent" value="rent" />
              <Label htmlFor="rent">Aluguel</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="buy" value="buy" />
              <Label htmlFor="buy">Venda</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    ),
    onClear: noop,
    onSubmit: noop,
  },
};

export const Interactive = {
  render() {
    const [filters, setFilters] = useState({
      status: [] as string[],
      type: "",
    });

    const count = filters.status.length + (filters.type ? 1 : 0);

    const handleClear = () => {
      setFilters({ status: [], type: "" });
    };

    const handleSubmit = () => {
      noop();
    };

    const toggleStatus = (value: string) => {
      setFilters((prev) => ({
        ...prev,
        status: prev.status.includes(value)
          ? prev.status.filter((s) => s !== value)
          : [...prev.status, value],
      }));
    };

    return (
      <FilterPopover
        count={count}
        onClear={handleClear}
        onSubmit={handleSubmit}
        title="Filtros interativos"
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="font-medium text-sm">Status</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.status.includes("pending")}
                  id="pending"
                  onCheckedChange={() => toggleStatus("pending")}
                />
                <Label htmlFor="pending">Pendente</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.status.includes("confirmed")}
                  id="confirmed"
                  onCheckedChange={() => toggleStatus("confirmed")}
                />
                <Label htmlFor="confirmed">Agendado</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.status.includes("canceled")}
                  id="canceled"
                  onCheckedChange={() => toggleStatus("canceled")}
                />
                <Label htmlFor="canceled">Cancelado</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Tipo</Label>
            <RadioGroup
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
              value={filters.type}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="type-rent" value="rent" />
                <Label htmlFor="type-rent">Aluguel</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="type-buy" value="buy" />
                <Label htmlFor="type-buy">Venda</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </FilterPopover>
    );
  },
};

export const CustomLabels = {
  args: {
    title: "Custom Filter",
    count: 2,
    submitLabel: "Apply",
    clearLabel: "Reset",
    children: (
      <div className="py-4">
        <p className="text-gray-500 text-sm">Filter content goes here...</p>
      </div>
    ),
    onClear: noop,
    onSubmit: noop,
  },
};

export const WithoutSubmit = {
  args: {
    title: "Instant Filters",
    count: 1,
    children: (
      <div className="space-y-2 py-4">
        <div className="flex items-center gap-2">
          <Checkbox defaultChecked id="instant-1" />
          <Label htmlFor="instant-1">Option 1</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="instant-2" />
          <Label htmlFor="instant-2">Option 2</Label>
        </div>
      </div>
    ),
    onClear: noop,
    // No onSubmit - button won't render
  },
};
