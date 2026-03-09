import type { Meta, StoryObj } from "@storybook/react-vite";
import { WaveformPlayer } from "./WaveformPlayer";

const meta: Meta<typeof WaveformPlayer> = {
  title: "Components/WaveformPlayer",
  component: WaveformPlayer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Audio source URL",
    },
    showControls: {
      control: "boolean",
      description: "Show play/pause button",
    },
    showDuration: {
      control: "boolean",
      description: "Show duration display",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WaveformPlayer>;

// Sample audio URL for demos
const SAMPLE_AUDIO_URL =
  "https://lastro-sandbox.nyc3.cdn.digitaloceanspaces.com/chat/757f35cc-d710-497c-ba68-26570ae4ca8a/audio/2689e3a5-1431-48e4-b3fc-91f717a0c6f1_test.ogg";

export const Default: Story = {
  args: {
    src: SAMPLE_AUDIO_URL,
    showControls: true,
    showDuration: true,
  },
};

export const WithoutControls: Story = {
  args: {
    src: SAMPLE_AUDIO_URL,
    showControls: false,
    showDuration: true,
  },
};

export const WithoutDuration: Story = {
  args: {
    src: SAMPLE_AUDIO_URL,
    showControls: true,
    showDuration: false,
  },
};

export const MinimalPlayer: Story = {
  args: {
    src: SAMPLE_AUDIO_URL,
    showControls: false,
    showDuration: false,
  },
};

export const CustomColors: Story = {
  args: {
    src: SAMPLE_AUDIO_URL,
    showControls: true,
    showDuration: true,
    config: {
      waveColor: "#e5e7eb",
      progressColor: "#10b981",
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[400px] flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Default Player</h3>
        <p className="text-gray-500 text-sm">
          With play/pause controls and duration
        </p>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <WaveformPlayer showControls showDuration src={SAMPLE_AUDIO_URL} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Without Controls</h3>
        <p className="text-gray-500 text-sm">
          Waveform only with click-to-seek
        </p>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <WaveformPlayer
            showControls={false}
            showDuration
            src={SAMPLE_AUDIO_URL}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Custom Colors</h3>
        <p className="text-gray-500 text-sm">Green progress indicator</p>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <WaveformPlayer
            config={{
              waveColor: "#e5e7eb",
              progressColor: "#10b981",
            }}
            showControls
            showDuration
            src={SAMPLE_AUDIO_URL}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Compact Style</h3>
        <p className="text-gray-500 text-sm">Smaller height</p>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <WaveformPlayer
            config={{
              height: 24,
              barWidth: 2,
              barGap: 1,
            }}
            showControls
            showDuration
            src={SAMPLE_AUDIO_URL}
          />
        </div>
      </div>
    </div>
  ),
};
