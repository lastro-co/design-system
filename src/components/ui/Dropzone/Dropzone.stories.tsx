import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { DocumentUpIcon, ImageUpIcon } from "@/components/icons/colored";
import { FilePreview, ImagePreview } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./Dropzone";

const meta: Meta<typeof Dropzone> = {
  title: "Components/Dropzone",
  component: Dropzone,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[464px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

// Image Upload Component (matches FileUploadModal)
function ImageUploadDropzone() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) {
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };

  if (file && preview) {
    return (
      <ImagePreview
        alt={file.name}
        fileName={file.name}
        fileSize={file.size}
        onRemove={handleRemove}
        src={preview}
      />
    );
  }

  return (
    <Dropzone
      accept={{
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
      }}
      className={cn(
        "!rounded-lg !border !border-dashed !border-purple-800 min-h-[200px] hover:bg-purple-50/50"
      )}
      maxFiles={1}
      maxSize={5 * 1024 * 1024}
      onDrop={handleDrop}
    >
      <DropzoneEmptyState>
        <div className="flex max-w-[364px] flex-col items-center justify-center text-gray-900">
          <ImageUpIcon />
          <p className="mt-4 w-full text-wrap text-center font-text text-sm">
            Arraste e solte aqui a imagem no formato .png, .jpg ou .jpeg ou
            selecione o arquivo do seu dispositivo.
          </p>
          <span className="mt-4 cursor-pointer font-text text-base text-purple-800 underline hover:text-purple-600">
            Selecionar arquivo
          </span>
        </div>
      </DropzoneEmptyState>
      <DropzoneContent />
    </Dropzone>
  );
}

// File Upload Component (matches FileUploadModal)
function FileUploadDropzone() {
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  const handleRemove = useCallback(() => {
    setFile(null);
  }, []);

  if (file) {
    return (
      <FilePreview
        fileName={file.name}
        fileSize={file.size}
        mimeType={file.type}
        onRemove={handleRemove}
      />
    );
  }

  return (
    <Dropzone
      accept={{
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
        "text/plain": [".txt"],
      }}
      className={cn(
        "!rounded-lg !border !border-dashed !border-purple-800 min-h-[200px] hover:bg-purple-50/50"
      )}
      maxFiles={1}
      maxSize={5 * 1024 * 1024}
      onDrop={handleDrop}
    >
      <DropzoneEmptyState>
        <div className="flex max-w-[364px] flex-col items-center justify-center text-gray-900">
          <DocumentUpIcon />
          <p className="mt-4 w-full text-wrap text-center font-text text-sm">
            Arraste e solte aqui o arquivo no formato .pdf, .doc ou .xls ou
            selecione o arquivo do seu dispositivo.
          </p>
          <span className="mt-4 cursor-pointer font-text text-base text-purple-800 underline hover:text-purple-600">
            Selecionar arquivo
          </span>
        </div>
      </DropzoneEmptyState>
      <DropzoneContent />
    </Dropzone>
  );
}

export const ImageUpload: Story = {
  render: () => <ImageUploadDropzone />,
};

export const FileUpload: Story = {
  render: () => <FileUploadDropzone />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[450px] flex-col gap-8">
      <div className="space-y-3">
        <h3 className="font-medium text-lg">Upload de Imagem</h3>
        <p className="text-gray-500 text-sm">
          Arraste uma imagem ou clique para selecionar
        </p>
        <ImageUploadDropzone />
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-lg">Upload de Arquivo</h3>
        <p className="text-gray-500 text-sm">
          Arraste um documento ou clique para selecionar
        </p>
        <FileUploadDropzone />
      </div>
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
