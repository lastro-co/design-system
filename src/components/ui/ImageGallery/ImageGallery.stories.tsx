import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../Badge";
import { ImageGallery } from "./ImageGallery";

const meta: Meta<typeof ImageGallery> = {
  title: "Components/ImageGallery",
  component: ImageGallery,
  parameters: {
    jest: "ImageGallery.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    images: {
      control: "object",
      description: "Array of image URLs to display",
    },
    alt: {
      control: "text",
      description: "Alt text for the main image",
    },
    emptyMessage: {
      control: "text",
      description: "Custom empty state message",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ImageGallery>;

// Sample images from Unsplash
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
];

export const Default: Story = {
  args: {
    images: SAMPLE_IMAGES,
    alt: "Casa moderna",
  },
};

export const SingleImage: Story = {
  args: {
    images: [SAMPLE_IMAGES[0]],
    alt: "Casa moderna",
  },
};

export const WithOverlays: Story = {
  args: {
    images: SAMPLE_IMAGES,
    alt: "Apartamento de luxo",
    topLeftOverlay: (
      <div className="flex gap-1">
        <div className="rounded-full border border-gray-400/20 bg-gray-50 px-2 py-0.5 font-medium text-gray-800 text-sm">
          Venda
        </div>
        <div className="rounded-full border border-gray-400/20 bg-gray-50 px-2 py-0.5 font-medium text-gray-800 text-sm">
          Aluguel
        </div>
      </div>
    ),
    topRightOverlay: (
      <Badge color="green" showDot size="medium">
        Ativo
      </Badge>
    ),
  },
};

export const WithInactiveStatus: Story = {
  args: {
    images: SAMPLE_IMAGES.slice(0, 3),
    alt: "Propriedade inativa",
    topRightOverlay: (
      <Badge color="red" showDot size="medium">
        Inativo
      </Badge>
    ),
  },
};

export const Empty: Story = {
  args: {
    images: [],
    alt: "Sem imagens",
  },
};

export const CustomEmptyMessage: Story = {
  args: {
    images: [],
    alt: "Sem imagens",
    emptyMessage: "Nenhuma foto cadastrada para este imóvel",
  },
};

export const TwoImages: Story = {
  args: {
    images: SAMPLE_IMAGES.slice(0, 2),
    alt: "Propriedade com duas fotos",
  },
};
