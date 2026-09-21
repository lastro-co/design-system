import type { Meta, StoryObj } from "@storybook/react-vite";
import { LaisGlowOrb } from "./LaisGlowOrb";

const meta: Meta<typeof LaisGlowOrb> = {
  title: "Components/LaisGlowOrb",
  component: LaisGlowOrb,
  parameters: {
    jest: "LaisGlowOrb.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="relative size-[360px] rounded-xl bg-gray-900">
        <Story />
      </div>
    ),
  ],
  args: {
    className: "-translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2",
  },
};

export default meta;
type Story = StoryObj<typeof LaisGlowOrb>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const BothOrbs: Story = {
  render: () => (
    <>
      <LaisGlowOrb
        className="-mt-[101.71px] -ml-[46.71px] top-1/2 left-1/2"
        variant="primary"
      />
      <LaisGlowOrb
        className="-mt-[29.71px] -ml-[124.71px] top-1/2 left-1/2"
        variant="secondary"
      />
    </>
  ),
};
