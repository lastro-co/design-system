import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCheckIcon } from "@/components/icons.v2";
import { MediaGrid, type MediaGridItem } from "./MediaGrid";

// biome-ignore lint/suspicious/noEmptyBlockStatements: Storybook action placeholder
const noop = (_index: number) => {};

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=320",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=320",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=320",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=320",
];

const buildItems = (count: number): MediaGridItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: String(index),
    kind: "image",
    src: SAMPLE_IMAGES[index % SAMPLE_IMAGES.length],
    alt: `Foto ${index + 1}`,
  }));

const meta: Meta<typeof MediaGrid> = {
  title: "Exibição de Dados/MediaGrid",
  component: MediaGrid,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Cluster of a sent media batch. The consumer picks `columns` (2 on mobile, 4 on desktop); there is no container query. When the visible count does not fill the last row, the last item stretches to the end of the row. Items beyond `maxVisible` collapse into a `+N` overlay on the last cell.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    columns: { control: "select", options: [2, 4] },
    maxVisible: { control: "number" },
  },
  args: {
    onItemClick: noop,
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MediaGrid>;

export const SingleItem: Story = {
  args: { items: buildItems(1), columns: 4 },
};

export const ThreeItemsTwoColumns: Story = {
  args: { items: buildItems(3), columns: 2 },
};

export const SixItemsFourColumns: Story = {
  args: { items: buildItems(6), columns: 4 },
};

export const OverflowFourColumns: Story = {
  args: { items: buildItems(10), columns: 4 },
};

export const OverflowTwoColumns: Story = {
  args: { items: buildItems(7), columns: 2 },
};

export const WithVideoAndOverlay: Story = {
  args: {
    columns: 2,
    items: [
      ...buildItems(1),
      {
        id: "video",
        kind: "video",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        alt: "Vídeo do imóvel",
      },
    ],
    renderItemOverlay: () => (
      <span className="flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 text-white text-xs">
        10:42
        <CheckCheckIcon aria-hidden="true" className="size-3" />
      </span>
    ),
  },
};
