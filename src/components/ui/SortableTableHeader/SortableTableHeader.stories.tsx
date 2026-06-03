import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SortableTableHeader } from "./SortableTableHeader";

const meta: Meta<typeof SortableTableHeader> = {
  title: "Components/SortableTableHeader",
  component: SortableTableHeader,
  parameters: {
    jest: "SortableTableHeader.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SortableTableHeader>;

type Key = "spend" | "leads" | "cpl";

const COLUMNS: { key: Key; label: string }[] = [
  { key: "spend", label: "Investimento" },
  { key: "leads", label: "Leads" },
  { key: "cpl", label: "CPL" },
];

const SortableHeaderRow = () => {
  const [activeKey, setActiveKey] = useState<Key | null>("spend");
  const [activeDir, setActiveDir] = useState<"asc" | "desc" | null>("desc");

  const handleSort = (key: Key) => {
    if (activeKey !== key) {
      setActiveKey(key);
      setActiveDir("desc");
      return;
    }
    if (activeDir === "desc") {
      setActiveDir("asc");
    } else if (activeDir === "asc") {
      setActiveKey(null);
      setActiveDir(null);
    } else {
      setActiveDir("desc");
    }
  };

  return (
    <table className="border border-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {COLUMNS.map((col) => (
            <SortableTableHeader<Key>
              activeDir={activeDir}
              activeKey={activeKey}
              key={col.key}
              label={col.label}
              onSortChange={handleSort}
              sortKey={col.key}
            />
          ))}
        </tr>
      </thead>
    </table>
  );
};

export const Default: Story = {
  render: () => <SortableHeaderRow />,
};
