import type { Meta } from "@storybook/react-vite";

import { CloseIcon, InfoIcon } from "@/components/icons";
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
    color: {
      control: "select",
      options: ["default", "purple"],
      description: "IconButton color variant",
    },
    variant: {
      control: "select",
      options: ["outlined", "contained", "ghost"],
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
    children: <CloseIcon size="sm" />,
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Variants</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton
            aria-label="Default Contained"
            color="default"
            variant="contained"
          >
            <InfoIcon size="sm" />
          </IconButton>
          <IconButton
            aria-label="Default Outlined"
            color="default"
            variant="outlined"
          >
            <InfoIcon size="sm" />
          </IconButton>
          <IconButton
            aria-label="Default Ghost"
            color="default"
            variant="ghost"
          >
            <InfoIcon size="sm" />
          </IconButton>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Colors</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton
            aria-label="purple Contained"
            color="purple"
            variant="contained"
          >
            <InfoIcon className="text-white" size="sm" />
          </IconButton>
          <IconButton
            aria-label="purple Outlined"
            color="purple"
            variant="outlined"
          >
            <InfoIcon size="sm" />
          </IconButton>
          <IconButton aria-label="purple Ghost" color="purple" variant="ghost">
            <InfoIcon size="sm" />
          </IconButton>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <IconButton aria-label="Small" size="small">
            <InfoIcon size="sm" />
          </IconButton>
          <IconButton aria-label="Medium" size="medium">
            <InfoIcon size="sm" />
          </IconButton>
          <IconButton aria-label="Large" size="large">
            <InfoIcon size="sm" />
          </IconButton>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Shapes</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton aria-label="Circular" shape="circular">
            <InfoIcon size="sm" />
          </IconButton>
          <IconButton aria-label="Square" shape="square">
            <InfoIcon size="sm" />
          </IconButton>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">States</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton aria-label="Normal">
            <InfoIcon size="sm" />
          </IconButton>
          <IconButton aria-label="Loading" loading>
            <InfoIcon size="sm" />
          </IconButton>
          <IconButton aria-label="Disabled" disabled>
            <InfoIcon size="sm" />
          </IconButton>
        </div>
      </div>
    </div>
  ),
};
