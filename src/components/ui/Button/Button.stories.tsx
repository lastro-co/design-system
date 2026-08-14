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
      options: [
        "default",
        "outline",
        "ghost",
        "link",
        "destructive",
        "ghost-destructive",
        "dark",
      ],
      description: "Button visual style variant",
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
    loading: {
      control: "boolean",
      description: "Whether the button shows a loading spinner",
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
        <div className="flex flex-wrap items-center gap-4">
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

export const AsChild = {
  render: () => (
    <Button asChild>
      <a href="#storybook">Link styled as Button</a>
    </Button>
  ),
};

export const Loading = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button loading size="small">
        Small
      </Button>
      <Button loading size="medium">
        Medium
      </Button>
      <Button loading size="large">
        Large
      </Button>
    </div>
  ),
};

const VARIANTS = [
  "default",
  "outline",
  "ghost",
  "link",
  "destructive",
  "ghost-destructive",
  "dark",
] as const;

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
            <>
              <span
                className="font-medium text-gray-900 text-sm capitalize"
                key={`${variant}-label`}
              >
                {variant}
              </span>
              <Button key={`${variant}-default`} variant={variant}>
                Button
              </Button>
              <Button disabled key={`${variant}-disabled`} variant={variant}>
                Button
              </Button>
              <Button key={`${variant}-loading`} loading variant={variant}>
                Button
              </Button>
            </>
          ))}
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
    </div>
  ),
};
