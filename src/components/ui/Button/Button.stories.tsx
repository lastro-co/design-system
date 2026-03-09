import type { Meta } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    jest: "Button.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["contained", "outlined"],
      description: "Button visual style variant",
    },
    color: {
      control: "select",
      options: ["purple", "error", "black"],
      description: "Button color variant",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Button size variant",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    children: {
      control: "text",
      description: "Content to be rendered inside the component",
    },
  },
};

export default meta;

export const Default = {
  args: {
    children: "Button",
  },
};

export const WithIcon = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Icon Positions</h3>
        <div className="flex flex-wrap gap-4">
          <Button>
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16m8-8H4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Icon Left
          </Button>
          <Button>
            Icon Right
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </Button>
          <Button>
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16m8-8H4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Both Icons
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">purple Color</h3>
        <div className="flex flex-wrap gap-4">
          <Button color="purple" variant="contained">
            Contained
          </Button>
          <Button color="purple" variant="outlined">
            Outlined
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Error Color</h3>
        <div className="flex flex-wrap gap-4">
          <Button color="error" variant="contained">
            Contained
          </Button>
          <Button color="error" variant="outlined">
            Outlined
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Black Color</h3>
        <div className="flex flex-wrap gap-4">
          <Button color="black" variant="contained">
            Contained
          </Button>
          <Button color="black" variant="outlined">
            Outlined
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-lg">States</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),
};
