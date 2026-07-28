import type { Meta } from "@storybook/react-vite";

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
    color: {
      control: "select",
      options: ["purple", "error", "black"],
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

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">black Color</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton
            aria-label="Black Contained"
            color="black"
            variant="contained"
          >
            <PlusIcon color="white" />
          </IconButton>
          <IconButton
            aria-label="Black Outlined"
            color="black"
            variant="outlined"
          >
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Black Ghost" color="black" variant="ghost">
            <PlusIcon />
          </IconButton>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">purple Color</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton
            aria-label="purple Contained"
            color="purple"
            variant="contained"
          >
            <PlusIcon color="white" />
          </IconButton>
          <IconButton
            aria-label="purple Outlined"
            color="purple"
            variant="outlined"
          >
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="purple Ghost" color="purple" variant="ghost">
            <PlusIcon />
          </IconButton>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">error Color</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton
            aria-label="Error Outlined"
            color="error"
            variant="outlined"
          >
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Error Ghost" color="error" variant="ghost">
            <PlusIcon />
          </IconButton>
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
      <div className="space-y-2">
        <h3 className="font-medium text-lg">States</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton aria-label="Normal">
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Loading" loading>
            <PlusIcon />
          </IconButton>
          <IconButton aria-label="Disabled" disabled>
            <PlusIcon />
          </IconButton>
        </div>
      </div>
    </div>
  ),
};
