import type { Meta } from "@storybook/react-vite";
import { ScrollArea, ScrollBar } from "./ScrollArea";

// Generate unique IDs for demo items
const generateItems = (count: number, prefix = "item") =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    index: i,
  }));

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  parameters: {
    jest: "ScrollArea.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the scroll area root",
    },
    children: {
      control: false,
      description: "Content to be rendered inside the scrollable area",
    },
  },
};

export default meta;

export const Default = {
  render: () => (
    <ScrollArea className="h-72 w-96 rounded-md border border-gray-300 p-4">
      <div className="space-y-4">
        <h3 className="font-display font-medium text-lg text-purple-800">
          Scrollable Content
        </h3>
        <p className="text-gray-900">
          This is a simple scroll area component. It provides a custom styled
          scrollbar that appears on hover, maintaining a clean interface when
          not in use.
        </p>
        {generateItems(20, "default").map((item) => (
          <p className="text-gray-600" key={item.id}>
            Item {item.index + 1}: Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const VerticalScrollOnly = {
  render: () => (
    <ScrollArea className="h-60 w-80 rounded-md border border-gray-300 bg-gray-50 p-4">
      <div className="space-y-3">
        <h4 className="font-display font-medium text-purple-800">
          Vertical Scroll
        </h4>
        {generateItems(15, "vertical").map((item) => (
          <div
            className="rounded-lg border border-gray-300 bg-white p-3"
            key={item.id}
          >
            <p className="font-medium text-gray-900">Card {item.index + 1}</p>
            <p className="text-gray-600 text-sm">
              This card demonstrates vertical scrolling behavior
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HorizontalScroll = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border border-gray-300 p-4">
      <div className="flex gap-4">
        {generateItems(10, "horizontal").map((item) => (
          <div
            className="inline-flex h-32 w-32 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-purple-50"
            key={item.id}
          >
            <span className="font-display font-medium text-purple-800">
              {item.index + 1}
            </span>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const BothDirections = {
  render: () => (
    <ScrollArea className="h-72 w-96 rounded-md border border-gray-300">
      <div className="w-[800px] p-4">
        <h3 className="mb-4 font-display font-medium text-lg text-purple-800">
          Wide Content with Vertical Scroll
        </h3>
        {generateItems(15, "both").map((item) => (
          <p className="mb-3 text-gray-600" key={item.id}>
            Row {item.index + 1}: This content is wider than the container,
            demonstrating both horizontal and vertical scrolling capabilities of
            the ScrollArea component.
          </p>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const ChatList = {
  render: () => (
    <ScrollArea className="h-96 w-80 rounded-md border border-gray-300">
      <div className="divide-y divide-gray-300">
        {generateItems(20, "chat").map((item) => (
          <div
            className="flex gap-3 p-4 transition-colors hover:bg-gray-50"
            key={item.id}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-300">
              <span className="font-medium text-purple-900 text-sm">
                {String.fromCharCode(65 + (item.index % 26))}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">
                Contact {item.index + 1}
              </p>
              <p className="truncate text-gray-600 text-sm">
                Last message preview...
              </p>
            </div>
            <span className="shrink-0 text-gray-600 text-xs">
              {item.index}h ago
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const CompactList = {
  render: () => (
    <ScrollArea className="h-52 w-64 rounded-md border border-gray-300 bg-white">
      <div className="p-2">
        <h4 className="mb-2 px-2 font-display font-medium text-purple-800 text-sm">
          Menu Items
        </h4>
        {generateItems(20, "menu").map((item) => (
          <div
            className="cursor-pointer rounded px-2 py-1.5 text-gray-900 text-sm transition-colors hover:bg-purple-50"
            key={item.id}
          >
            Option {item.index + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
