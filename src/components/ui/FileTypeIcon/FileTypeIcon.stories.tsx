import type { Meta, StoryObj } from "@storybook/react-vite";
import FileTypeIcon from "./FileTypeIcon";

const meta: Meta<typeof FileTypeIcon> = {
  title: "Components/FileTypeIcon",
  component: FileTypeIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    fileName: {
      control: "text",
      description: "File name to detect type from",
    },
    mimeType: {
      control: "text",
      description: "Optional MIME type for better detection",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the icon",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileTypeIcon>;

export const Default: Story = {
  args: {
    fileName: "document.pdf",
    size: "md",
  },
};

export const PDF: Story = {
  args: {
    fileName: "report.pdf",
    size: "md",
  },
};

export const Word: Story = {
  args: {
    fileName: "document.docx",
    size: "md",
  },
};

export const Excel: Story = {
  args: {
    fileName: "spreadsheet.xlsx",
    size: "md",
  },
};

export const Text: Story = {
  args: {
    fileName: "notes.txt",
    size: "md",
  },
};

export const Image: Story = {
  args: {
    fileName: "photo.png",
    size: "md",
  },
};

export const Unknown: Story = {
  args: {
    fileName: "unknown.xyz",
    size: "md",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <FileTypeIcon fileName="document.pdf" size="sm" />
        <span className="text-gray-500 text-xs">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FileTypeIcon fileName="document.pdf" size="md" />
        <span className="text-gray-500 text-xs">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FileTypeIcon fileName="document.pdf" size="lg" />
        <span className="text-gray-500 text-xs">Large</span>
      </div>
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">File Types</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center gap-2">
            <FileTypeIcon fileName="report.pdf" size="lg" />
            <span className="text-gray-500 text-xs">PDF</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileTypeIcon fileName="document.docx" size="lg" />
            <span className="text-gray-500 text-xs">DOC</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileTypeIcon fileName="data.xlsx" size="lg" />
            <span className="text-gray-500 text-xs">XLS</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileTypeIcon fileName="notes.txt" size="lg" />
            <span className="text-gray-500 text-xs">TXT</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileTypeIcon fileName="photo.jpg" size="lg" />
            <span className="text-gray-500 text-xs">Image</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileTypeIcon fileName="unknown.bin" size="lg" />
            <span className="text-gray-500 text-xs">Unknown</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Detection by MIME Type</h3>
        <p className="text-gray-500 text-sm">
          When file extension is ambiguous, MIME type helps
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center gap-2">
            <FileTypeIcon
              fileName="file"
              mimeType="application/pdf"
              size="lg"
            />
            <span className="text-gray-500 text-xs">application/pdf</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileTypeIcon fileName="file" mimeType="image/png" size="lg" />
            <span className="text-gray-500 text-xs">image/png</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
