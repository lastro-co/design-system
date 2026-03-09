import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { DynamicPagination } from "./pagination";

const meta: Meta<typeof DynamicPagination> = {
  title: "Components/Pagination",
  component: DynamicPagination,
  parameters: {
    jest: "Pagination.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: "number",
      description: "Current active page (1-indexed)",
    },
    totalPages: {
      control: "number",
      description: "Total number of pages",
    },
    maxVisiblePages: {
      control: "number",
      description: "Maximum number of visible pages (default: 7)",
    },
    showPreviousNext: {
      control: "boolean",
      description: "Show previous/next buttons (default: true)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicPagination>;

export const FirstPage: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);

    return (
      <div className="space-y-4">
        <p className="text-center text-sm">
          Current Page: <strong>{currentPage}</strong> of 10
        </p>
        <DynamicPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={10}
        />
      </div>
    );
  },
};

export const ActiveStates: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(5);

    return (
      <div className="space-y-4">
        <p className="text-center text-sm">
          Current Page: <strong>{currentPage}</strong> of 10
        </p>
        <DynamicPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={10}
        />
      </div>
    );
  },
};

export const DynamicPaginationExample: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);

    return (
      <div className="space-y-4">
        <p className="text-center text-sm">
          Current Page: <strong>{currentPage}</strong> of 10
        </p>
        <DynamicPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={10}
        />
      </div>
    );
  },
};

export const DynamicPaginationManyPages: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(15);

    return (
      <div className="space-y-4">
        <p className="text-center text-sm">
          Current Page: <strong>{currentPage}</strong> of 50
        </p>
        <DynamicPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={50}
        />
      </div>
    );
  },
};

export const DynamicPaginationFewPages: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(2);

    return (
      <div className="space-y-4">
        <p className="text-center text-sm">
          Current Page: <strong>{currentPage}</strong> of 5
        </p>
        <DynamicPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={5}
        />
      </div>
    );
  },
};
