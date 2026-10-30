import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  MediaTray,
  type MediaTrayItem,
  type MediaTrayProps,
} from "./MediaTray";

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=320";
const SAMPLE_IMAGE_2 =
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=320";

const SAMPLE_ITEMS: MediaTrayItem[] = [
  { id: "1", kind: "image", src: SAMPLE_IMAGE, fileName: "fachada.jpg" },
  { id: "2", kind: "video", src: SAMPLE_IMAGE_2, fileName: "tour.mp4" },
  {
    id: "3",
    kind: "file",
    fileName: "contrato.pdf",
    mimeType: "application/pdf",
  },
  {
    id: "4",
    kind: "file",
    fileName: "planilha.xlsx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    id: "5",
    kind: "image",
    src: SAMPLE_IMAGE_2,
    fileName: "sala.jpg",
    invalid: true,
    invalidMessage: "Arquivo acima do tamanho permitido",
  },
];

function InteractiveTray(props: MediaTrayProps) {
  const [items, setItems] = useState(props.items);
  const [selectedId, setSelectedId] = useState(props.items[0]?.id);

  return (
    <MediaTray
      {...props}
      items={items}
      onAdd={() =>
        setItems((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            kind: "image",
            src: SAMPLE_IMAGE,
            fileName: `foto-${current.length + 1}.jpg`,
          },
        ])
      }
      onRemove={(id) =>
        setItems((current) => current.filter((item) => item.id !== id))
      }
      onReorder={setItems}
      onSelect={setSelectedId}
      selectedId={selectedId}
    />
  );
}

const meta: Meta<typeof MediaTray> = {
  title: "Exibição de Dados/MediaTray",
  component: MediaTray,
  render: (args) => <InteractiveTray {...args} />,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Horizontal, controlled tray of numbered thumbnails. Reorder by dragging (mouse or touch) or with Alt+ArrowLeft / Alt+ArrowRight on a focused tile. The add button is disabled once `items.length` reaches `maxItems`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    maxItems: { control: "number" },
    addLabel: { control: "text" },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MediaTray>;

export const Default: Story = {
  args: {
    items: SAMPLE_ITEMS,
  },
};

export const LimitReached: Story = {
  args: {
    items: SAMPLE_ITEMS.slice(0, 3),
    maxItems: 3,
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const Disabled: Story = {
  args: {
    items: SAMPLE_ITEMS.slice(0, 3),
    disabled: true,
  },
};

export const Overflowing: Story = {
  args: {
    items: [
      ...SAMPLE_ITEMS,
      ...SAMPLE_ITEMS.map((item) => ({ ...item, id: `${item.id}-copy` })),
    ],
  },
};
