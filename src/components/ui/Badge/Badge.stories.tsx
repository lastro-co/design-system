import type { Meta, StoryObj } from "@storybook/react-vite";
import { SendIcon } from "@/components/icons";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    jest: "Badge.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: [
        "blue",
        "gray",
        "green",
        "orange",
        "purple",
        "red",
        "white",
        "yellow",
      ],
      description: "Color variant of the badge",
    },
    size: {
      control: "select",
      options: ["small", "medium"],
      description: "Size of the badge",
    },
    showDot: {
      control: "boolean",
      description: "Show a dot indicator before the badge text",
    },
    dotColor: {
      control: "color",
      description: "Custom color for the dot (defaults to currentColor)",
    },
    isNumber: {
      control: "boolean",
      description: "Apply number badge styling (compact sizing)",
    },
    children: {
      control: "text",
      description: "Content to be rendered inside the badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    color: "gray",
    size: "medium",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <SendIcon />
        Badge
      </>
    ),
    color: "green",
    size: "medium",
  },
};

export const WithDot: Story = {
  args: {
    children: "Status",
    color: "gray",
    size: "small",
    showDot: true,
  },
};

export const WithCustomDotColor: Story = {
  args: {
    children: "Cancelada",
    size: "small",
    showDot: true,
    dotColor: "#B31919",
    style: {
      background: "#FEEFEF",
      border: "1px solid rgba(141, 12, 12, 0.20)",
      color: "#8D0C0C",
    },
  },
};

export const NumberBadge: Story = {
  args: {
    children: "2",
    isNumber: true,
  },
};
