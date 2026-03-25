import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  parameters: {
    jest: "Progress.test.tsx",
    layout: "centered",
    docs: {
      description: {
        component:
          "A progress bar component built on Radix UI Progress primitive.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "The progress value (0-100)",
    },
    size: {
      control: "select",
      options: ["xs", "md", "lg"],
      description: "Height of the progress bar",
    },
    showPercentage: {
      control: "boolean",
      description: "Show percentage text next to the bar",
    },
    rounded: {
      control: "boolean",
      description: "Apply rounded borders to the bar",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the track",
    },
    color: {
      control: "select",
      options: ["purple", "blue", "green", "red", "yellow", "gray"],
      description: "Color of the progress bar",
    },
    animate: {
      control: "boolean",
      description: "Animate from 0 to the target value on mount",
    },
    animationDuration: {
      control: { type: "number", min: 200, max: 5000, step: 100 },
      description: "Animation duration in milliseconds",
    },
    indicatorClassName: {
      control: "text",
      description: "Additional CSS classes for the indicator",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
    size: "md",
    showPercentage: false,
    rounded: true,
    color: "purple",
  },
  render: (args) => <Progress className="w-64" {...args} />,
};

export const Empty: Story = {
  render: () => <Progress className="w-64" value={0} />,
};

export const Half: Story = {
  render: () => <Progress className="w-64" value={50} />,
};

export const Complete: Story = {
  render: () => <Progress className="w-64" value={100} />,
};

export const WithPercentage: Story = {
  render: () => <Progress className="w-64" showPercentage value={75} />,
};

export const SizeXs: Story = {
  render: () => <Progress className="w-64" size="xs" value={60} />,
};

export const SizeLg: Story = {
  render: () => <Progress className="w-64" size="lg" value={60} />,
};

export const NotRounded: Story = {
  render: () => <Progress className="w-64" rounded={false} value={60} />,
};

export const Animated: Story = {
  render: () => <Progress animate className="w-64" showPercentage value={75} />,
};

export const AnimatedSlow: Story = {
  render: () => (
    <Progress
      animate
      animationDuration={3000}
      className="w-64"
      showPercentage
      value={90}
    />
  ),
};

export const ColorBlue: Story = {
  render: () => <Progress className="w-64" color="blue" value={75} />,
};

export const ColorGreen: Story = {
  render: () => <Progress className="w-64" color="green" value={75} />,
};

export const ColorRed: Story = {
  render: () => <Progress className="w-64" color="red" value={75} />,
};

export const AllColors: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Progress color="purple" value={75} />
      <Progress color="blue" value={60} />
      <Progress color="green" value={90} />
      <Progress color="red" value={40} />
      <Progress color="yellow" value={55} />
      <Progress color="gray" value={70} />
    </div>
  ),
};
