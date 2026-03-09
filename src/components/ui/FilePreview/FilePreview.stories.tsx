import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePreview } from "./FilePreview";

// biome-ignore lint/suspicious/noEmptyBlockStatements: Storybook action placeholder
const noop = () => {};

const meta: Meta<typeof FilePreview> = {
  title: "Components/FilePreview",
  component: FilePreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    fileName: {
      control: "text",
      description: "File name",
    },
    fileSize: {
      control: "number",
      description: "File size in bytes",
    },
    mimeType: {
      control: "text",
      description: "Optional MIME type for better icon detection",
    },
    disabled: {
      control: "boolean",
      description: "Whether the remove button is disabled",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilePreview>;

export const PDF: Story = {
  args: {
    fileName: "documento.pdf",
    fileSize: 1024 * 1024 * 2.5, // 2.5 MB
    mimeType: "application/pdf",
    onRemove: noop,
  },
};

export const Word: Story = {
  args: {
    fileName: "relatorio.docx",
    fileSize: 1024 * 512, // 512 KB
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    onRemove: noop,
  },
};

export const Excel: Story = {
  args: {
    fileName: "planilha.xlsx",
    fileSize: 1024 * 256, // 256 KB
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    onRemove: noop,
  },
};

export const Text: Story = {
  args: {
    fileName: "notas.txt",
    fileSize: 1024 * 10, // 10 KB
    mimeType: "text/plain",
    onRemove: noop,
  },
};

export const WithoutRemove: Story = {
  args: {
    fileName: "arquivo-somente-leitura.pdf",
    fileSize: 1024 * 1024, // 1 MB
    mimeType: "application/pdf",
  },
};

export const Disabled: Story = {
  args: {
    fileName: "enviando.pdf",
    fileSize: 1024 * 1024 * 3, // 3 MB
    mimeType: "application/pdf",
    onRemove: noop,
    disabled: true,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex w-[350px] flex-col gap-3">
      <FilePreview
        fileName="relatorio.pdf"
        fileSize={1024 * 1024 * 2}
        mimeType="application/pdf"
        onRemove={noop}
      />
      <FilePreview
        fileName="documento.docx"
        fileSize={1024 * 512}
        mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onRemove={noop}
      />
      <FilePreview
        fileName="dados.xlsx"
        fileSize={1024 * 256}
        mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onRemove={noop}
      />
      <FilePreview
        fileName="notas.txt"
        fileSize={1024 * 5}
        mimeType="text/plain"
        onRemove={noop}
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
};
