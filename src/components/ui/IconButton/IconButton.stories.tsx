import type { Meta } from "@storybook/react-vite";
import { Fragment } from "react";

import { InfoIcon } from "@/components/icons";
import { PlusIcon } from "@/components/icons.v2";
import { IconButton } from "./IconButton";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    jest: "IconButton.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "IconButton size variant",
    },
    shape: {
      control: "select",
      options: ["circular", "square"],
      description: "IconButton shape variant",
    },
    variant: {
      control: "select",
      options: ["default", "outline", "ghost", "destructive"],
      description: "IconButton visual style variant",
    },
    loading: {
      control: "boolean",
      description: "Whether the IconButton shows loading spinner",
    },
    disabled: {
      control: "boolean",
      description: "Whether the IconButton is disabled",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    "aria-label": {
      control: "text",
      description: "Accessibility label (required)",
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

export const Default = {
  args: {
    "aria-label": "Close",
    children: <PlusIcon />,
  },
};

export const AsChild = {
  render: () => (
    <IconButton aria-label="Link styled as IconButton" asChild>
      <a href="#storybook">
        <PlusIcon />
      </a>
    </IconButton>
  ),
};

const VARIANTS = ["default", "outline", "ghost", "destructive"] as const;

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Variants × Behaviors</h3>
        <p className="text-gray-600 text-sm">
          Hover/active/focus are triggered by interacting with each button —
          they are not separate rows since they are not controlled via props.
        </p>
        <div className="grid grid-cols-[max-content_repeat(3,max-content)] items-center gap-x-8 gap-y-4">
          <span />
          <span className="font-medium text-gray-600 text-xs uppercase">
            Default
          </span>
          <span className="font-medium text-gray-600 text-xs uppercase">
            Disabled
          </span>
          <span className="font-medium text-gray-600 text-xs uppercase">
            Loading
          </span>
          {VARIANTS.map((variant) => (
            <Fragment key={variant}>
              <span className="font-medium text-gray-900 text-sm capitalize">
                {variant}
              </span>
              <IconButton aria-label={`${variant} default`} variant={variant}>
                <PlusIcon color={variant === "default" ? "white" : undefined} />
              </IconButton>
              <IconButton
                aria-label={`${variant} disabled`}
                disabled
                variant={variant}
              >
                <PlusIcon color={variant === "default" ? "white" : undefined} />
              </IconButton>
              <IconButton
                aria-label={`${variant} loading`}
                loading
                variant={variant}
              >
                <PlusIcon color={variant === "default" ? "white" : undefined} />
              </IconButton>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <IconButton aria-label="Small" size="small">
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Medium" size="medium">
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Large" size="large">
            <PlusIcon />
          </IconButton>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Shapes</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton aria-label="Circular" shape="circular">
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Square" shape="square">
            <PlusIcon />
          </IconButton>
        </div>
      </div>
    </div>
  ),
};
