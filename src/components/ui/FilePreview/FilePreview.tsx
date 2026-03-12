"use client";

import { cn, formatFileSize } from "@/lib/utils";
import { TrashIcon } from "../../icons";
import { FileTypeIcon } from "../FileTypeIcon";

export interface FilePreviewProps {
  /** File name */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
  /** Optional MIME type for better icon detection */
  mimeType?: string;
  /** Called when remove button is clicked */
  onRemove?: () => void;
  /** Whether the remove button is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays a file preview with icon, name, size and optional remove button.
 * Used for document uploads (PDF, DOC, XLS, etc.)
 */
export function FilePreview({
  fileName,
  fileSize,
  mimeType,
  onRemove,
  disabled = false,
  className,
}: FilePreviewProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-[22px] py-[25px]",
        className
      )}
    >
      <FileTypeIcon fileName={fileName} mimeType={mimeType} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900 text-sm">{fileName}</p>
        <p className="text-gray-500 text-xs">{formatFileSize(fileSize)}</p>
      </div>
      {onRemove && (
        <button
          aria-label="Remover arquivo"
          className={cn(
            "flex shrink-0 cursor-pointer items-center gap-1 font-text text-base text-purple-800 underline transition-opacity hover:opacity-70",
            disabled && "cursor-not-allowed opacity-50 hover:opacity-50"
          )}
          disabled={disabled}
          onClick={onRemove}
          type="button"
        >
          <TrashIcon size="md" />
          Excluir
        </button>
      )}
    </div>
  );
}

export default FilePreview;
