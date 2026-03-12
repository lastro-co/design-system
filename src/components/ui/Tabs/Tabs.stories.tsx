import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    jest: "Tabs.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Array of tab items with value and label",
    },
    value: {
      control: "text",
      description: "Currently selected tab value",
    },
    onValueChange: {
      action: "value changed",
      description: "Callback when tab selection changes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const TabsWithState = (args: React.ComponentProps<typeof Tabs>) => {
  const [value, setValue] = useState(args.value || "tab1");
  return <Tabs {...args} onValueChange={setValue} value={value} />;
};

export const Default: Story = {
  render: TabsWithState,
  args: {
    items: [
      { value: "tab1", label: "Tab 1" },
      { value: "tab2", label: "Tab 2" },
      { value: "tab3", label: "Tab 3" },
    ],
    value: "tab1",
  },
};

export const TwoTabs: Story = {
  render: TabsWithState,
  args: {
    items: [
      { value: "compra", label: "Compra" },
      { value: "aluguel", label: "Aluguel" },
    ],
    value: "aluguel",
  },
};

export const ManyTabs: Story = {
  render: TabsWithState,
  args: {
    items: [
      { value: "home", label: "Home" },
      { value: "about", label: "About" },
      { value: "services", label: "Services" },
      { value: "portfolio", label: "Portfolio" },
      { value: "contact", label: "Contact" },
    ],
    value: "home",
  },
};
