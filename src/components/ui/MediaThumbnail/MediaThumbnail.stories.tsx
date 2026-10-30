import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaThumbnail } from "./MediaThumbnail";

// biome-ignore lint/suspicious/noEmptyBlockStatements: Storybook action placeholder
const noop = () => {};

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=320";

const meta: Meta<typeof MediaThumbnail> = {
  title: "Exibição de Dados/MediaThumbnail",
  component: MediaThumbnail,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    kind: {
      control: "select",
      options: ["image", "video", "file"],
      description: "Media kind",
    },
    src: {
      control: "text",
      description: "Image URL, or the poster URL for a video",
    },
    fileName: { control: "text", description: "File name" },
    mimeType: { control: "text", description: "Optional MIME type" },
    index: {
      control: "number",
      description: "0-based position, rendered as index + 1",
    },
    selected: { control: "boolean" },
    invalid: { control: "boolean" },
    invalidMessage: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    onRemove: noop,
    onSelect: noop,
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MediaThumbnail>;

export const Image: Story = {
  args: {
    kind: "image",
    src: SAMPLE_IMAGE,
    fileName: "fachada.jpg",
    index: 0,
  },
};

export const VideoWithPoster: Story = {
  args: {
    kind: "video",
    src: SAMPLE_IMAGE,
    fileName: "tour.mp4",
    index: 1,
  },
};

export const VideoWithoutPoster: Story = {
  args: {
    kind: "video",
    fileName: "tour.mp4",
    index: 1,
  },
};

export const File: Story = {
  args: {
    kind: "file",
    fileName: "contrato.pdf",
    mimeType: "application/pdf",
    index: 2,
  },
};

export const Selected: Story = {
  args: {
    ...Image.args,
    selected: true,
  },
};

export const Invalid: Story = {
  args: {
    ...Image.args,
    invalid: true,
    invalidMessage: "Arquivo acima do tamanho permitido",
  },
};

export const Disabled: Story = {
  args: {
    ...Image.args,
    disabled: true,
  },
};

export const StaticPreview: Story = {
  args: {
    ...Image.args,
    onRemove: undefined,
    onSelect: undefined,
  },
};
