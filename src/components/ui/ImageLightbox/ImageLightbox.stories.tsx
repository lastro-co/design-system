import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../Button";
import { ImageLightbox } from "./ImageLightbox";

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=1200&fit=crop";

const PORTRAIT_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&h=1600&fit=crop";

const meta: Meta<typeof ImageLightbox> = {
  title: "Components/ImageLightbox",
  component: ImageLightbox,
  parameters: {
    jest: "ImageLightbox.test.tsx",
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
    maxZoom: {
      control: "number",
      description: "Maximum zoom level",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageLightbox>;

function LightboxDemo({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir imagem</Button>
      <ImageLightbox alt={alt} onOpenChange={setOpen} open={open} src={src} />
    </>
  );
}

export const Default: Story = {
  render: () => <LightboxDemo alt="Casa com jardim" src={SAMPLE_IMAGE} />,
};

export const PortraitImage: Story = {
  render: () => <LightboxDemo alt="Sala de estar" src={PORTRAIT_IMAGE} />,
};
