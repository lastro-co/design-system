import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImagePreview } from "./ImagePreview";

// biome-ignore lint/suspicious/noEmptyBlockStatements: Storybook action placeholder
const noop = () => {};

const meta: Meta<typeof ImagePreview> = {
  title: "Components/ImagePreview",
  component: ImagePreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image source URL",
    },
    alt: {
      control: "text",
      description: "Alt text for the image",
    },
    fileName: {
      control: "text",
      description: "File name to display",
    },
    fileSize: {
      control: "number",
      description: "File size in bytes",
    },
    disabled: {
      control: "boolean",
      description: "Whether the remove button is disabled",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ImagePreview>;

// Sample image URL
const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";

export const Default: Story = {
  args: {
    src: SAMPLE_IMAGE,
    alt: "Paisagem montanhosa",
    fileName: "paisagem.jpg",
    fileSize: 1024 * 1024 * 1.5, // 1.5 MB
    onRemove: noop,
  },
};

export const WithoutFileInfo: Story = {
  args: {
    src: SAMPLE_IMAGE,
    alt: "Paisagem montanhosa",
    onRemove: noop,
  },
};

export const WithoutRemove: Story = {
  args: {
    src: SAMPLE_IMAGE,
    alt: "Paisagem montanhosa",
    fileName: "imagem-somente-leitura.jpg",
    fileSize: 1024 * 512,
  },
};

export const Disabled: Story = {
  args: {
    src: SAMPLE_IMAGE,
    alt: "Enviando imagem",
    fileName: "enviando.jpg",
    fileSize: 1024 * 1024 * 2,
    onRemove: noop,
    disabled: true,
  },
};

export const SmallImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&h=150&fit=crop",
    alt: "Gato",
    fileName: "gato.png",
    fileSize: 1024 * 256,
    onRemove: noop,
  },
};
