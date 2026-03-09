import type { Meta } from "@storybook/react-vite";

import { GearIcon, SearchIcon } from "@/components/icons";
import { FilterButton } from "./FilterButton";

const meta: Meta<typeof FilterButton> = {
  title: "Components/FilterButton",
  component: FilterButton,
  parameters: {
    jest: "FilterButton.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Text label for the button",
    },
    labelPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Position of the label relative to icon/counter",
    },
    count: {
      control: "number",
      description: "Number of active filters (shows counter badge when > 0)",
    },
    showIconWithCount: {
      control: "boolean",
      description:
        "Whether to show the icon when count > 0 (default: false, shows counter instead)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    icon: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

export const Default = {
  args: {
    label: "Filtros",
    count: 0,
  },
};

export const WithActiveFilters = {
  args: {
    label: "Filtros",
    count: 3,
  },
};

export const IconOnly = {
  args: {
    label: "",
    count: 0,
  },
};

export const CounterOnly = {
  args: {
    label: "",
    count: 5,
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Default States</h3>
        <div className="flex flex-wrap gap-4">
          <FilterButton count={0} label="Filtros" />
          <FilterButton count={3} label="Filtros" />
          <FilterButton count={12} label="Filtros" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Icon Only / Counter Only</h3>
        <div className="flex flex-wrap gap-4">
          <FilterButton count={0} label="" />
          <FilterButton count={5} label="" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Label Position</h3>
        <div className="flex flex-wrap gap-4">
          <FilterButton count={2} label="Left label" labelPosition="left" />
          <FilterButton count={2} label="Right label" labelPosition="right" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Custom Icons</h3>
        <div className="flex flex-wrap gap-4">
          <FilterButton
            count={0}
            icon={<SearchIcon className="text-purple-800" />}
            label="Buscar"
          />
          <FilterButton
            count={1}
            icon={<GearIcon className="text-purple-800" />}
            label="Config"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Show Icon With Count</h3>
        <div className="flex flex-wrap gap-4">
          <FilterButton count={3} label="Default" showIconWithCount={false} />
          <FilterButton count={3} label="With Icon" showIconWithCount={true} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Disabled States</h3>
        <div className="flex flex-wrap gap-4">
          <FilterButton count={0} disabled label="Disabled" />
          <FilterButton count={3} disabled label="Disabled" />
        </div>
      </div>
    </div>
  ),
};
