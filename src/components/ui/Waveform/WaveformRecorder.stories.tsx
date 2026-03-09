import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { WaveformRecorder } from "./WaveformRecorder";

// biome-ignore lint/suspicious/noEmptyBlockStatements: Storybook action placeholder
const noop = () => {};
// biome-ignore lint/suspicious/noEmptyBlockStatements: Storybook action placeholder
const noopBlob = (_blob: Blob) => {};

const meta: Meta<typeof WaveformRecorder> = {
  title: "Components/WaveformRecorder",
  component: WaveformRecorder,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    autoStart: {
      control: "boolean",
      description: "Whether to auto-start recording on mount",
    },
    loading: {
      control: "boolean",
      description: "Whether the audio is being sent/uploaded",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[350px] rounded-lg border border-gray-300 bg-white p-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WaveformRecorder>;

export const Default: Story = {
  args: {
    autoStart: true,
    loading: false,
    onCancel: noop,
    onSend: noopBlob,
  },
};

export const ManualStart: Story = {
  args: {
    autoStart: false,
    loading: false,
    onCancel: noop,
    onSend: noopBlob,
  },
};

export const Loading: Story = {
  args: {
    autoStart: true,
    loading: true,
    onCancel: noop,
    onSend: noopBlob,
  },
};

export const CustomColors: Story = {
  args: {
    autoStart: true,
    loading: false,
    config: {
      waveColor: "#10b981",
      progressColor: "#10b981",
    },
    onCancel: noop,
    onSend: noopBlob,
  },
};

// Interactive example with state management
function InteractiveRecorderExample() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedBlob(null);
  };

  const handleCancel = () => {
    setIsRecording(false);
    setRecordedBlob(null);
  };

  const handleSend = (blob: Blob) => {
    setIsLoading(true);
    // Simulate upload
    setTimeout(() => {
      setIsLoading(false);
      setIsRecording(false);
      setRecordedBlob(blob);
    }, 1500);
  };

  return (
    <div className="flex w-[400px] flex-col gap-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Interactive Recorder</h3>
        <p className="text-gray-500 text-sm">
          Click the button below to start recording. Requires microphone
          permission.
        </p>
      </div>

      {isRecording ? (
        <div className="rounded-lg border border-gray-300 bg-white p-2">
          <WaveformRecorder
            autoStart
            loading={isLoading}
            onCancel={handleCancel}
            onSend={handleSend}
          />
        </div>
      ) : (
        <button
          className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          onClick={handleStartRecording}
          type="button"
        >
          Start Recording
        </button>
      )}

      {recordedBlob && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-green-800 text-sm">
            Recording saved! Size: {(recordedBlob.size / 1024).toFixed(2)} KB
          </p>
          <p className="text-green-600 text-xs">Type: {recordedBlob.type}</p>
        </div>
      )}
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveRecorderExample />,
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[400px] flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Default Recorder</h3>
        <p className="text-gray-500 text-sm">Auto-starts on mount</p>
        <div className="rounded-lg border border-gray-300 bg-white p-2">
          <WaveformRecorder
            autoStart
            loading={false}
            onCancel={noop}
            onSend={noopBlob}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Loading State</h3>
        <p className="text-gray-500 text-sm">Shows spinner during upload</p>
        <div className="rounded-lg border border-gray-300 bg-white p-2">
          <WaveformRecorder
            autoStart
            loading
            onCancel={noop}
            onSend={noopBlob}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Custom Colors</h3>
        <p className="text-gray-500 text-sm">Green waveform</p>
        <div className="rounded-lg border border-gray-300 bg-white p-2">
          <WaveformRecorder
            autoStart
            config={{
              waveColor: "#10b981",
              progressColor: "#10b981",
            }}
            loading={false}
            onCancel={noop}
            onSend={noopBlob}
          />
        </div>
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
};
