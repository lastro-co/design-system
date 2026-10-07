import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment } from "react";
import { CheckIcon, ZapIcon } from "@/components/icons.v2";
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
        "default",
        "secondary",
        "destructive",
        "outline",
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

const COLORS = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "green",
  "yellow",
  "orange",
  "red",
  "blue",
  "purple",
  "gray",
  "white",
] as const;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Colors × Sizes</h3>
        <p className="text-gray-600 text-sm">
          The icon has no fixed color — it inherits each variant's text color
          via <code>currentColor</code>, exactly like the Figma spec.
        </p>
        <div className="grid grid-cols-[max-content_repeat(3,max-content)] items-center gap-x-8 gap-y-4">
          <span />
          <span className="font-medium text-gray-600 text-xs uppercase">
            Small
          </span>
          <span className="font-medium text-gray-600 text-xs uppercase">
            Medium
          </span>
          <span className="font-medium text-gray-600 text-xs uppercase">
            Medium + Icon
          </span>
          {COLORS.map((color) => (
            <Fragment key={color}>
              <span className="font-medium text-gray-900 text-sm capitalize">
                {color}
              </span>
              <Badge color={color} size="small">
                Badge
              </Badge>
              <Badge color={color} size="medium">
                Badge
              </Badge>
              <Badge color={color} size="medium">
                <ZapIcon />
                Badge
              </Badge>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Compositions</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge color="purple">Text only</Badge>
          <Badge color="purple" showDot>
            Text + dot
          </Badge>
          <Badge color="purple">
            <CheckIcon />
            Text + icon
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Forced icon color</h3>
        <p className="text-gray-600 text-sm">
          To override the inherited color, style the icon itself — the Badge has
          no dedicated prop for this, the same way a custom icon color works
          anywhere else in the design system.
        </p>
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-4">
            <span className="w-40 font-medium text-gray-900 text-sm">
              Green, forced red icon
            </span>
            <Badge color="green">
              <ZapIcon className="text-red-600" />
              Forced red icon
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-40 font-medium text-gray-900 text-sm">
              Outline, default icon
            </span>
            <Badge color="outline">
              <ZapIcon />
              Outline default
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-40 font-medium text-gray-900 text-sm">
              Outline, forced red icon
            </span>
            <Badge color="outline">
              <ZapIcon className="text-red-600" />
              Outline forced red icon
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <CheckIcon />
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
    color: "red",
    size: "small",
    showDot: true,
    dotColor: "#B31919",
  },
};

export const NumberBadge: Story = {
  args: {
    children: "2",
    isNumber: true,
  },
};
