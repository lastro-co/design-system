import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    jest: "Breadcrumb.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Product Detail" },
    ],
  },
};

export const TwoItems: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Current Page" },
    ],
  },
};

export const WithOnClick: Story = {
  args: {
    items: [
      { label: "Home", onClick: () => alert("Home clicked") },
      { label: "Settings", onClick: () => alert("Settings clicked") },
      { label: "Profile" },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: "Home" }],
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Category", href: "/category" },
      { label: "Subcategory", href: "/category/sub" },
      { label: "Product", href: "/category/sub/product" },
      { label: "Details" },
    ],
  },
};
