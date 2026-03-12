"use client";

import { cn, formatFileSize } from "@/lib/utils";
import { TrashIcon } from "../../icons";
import { IconButton } from "../IconButton";

export interface ImagePreviewProps {
  /** Image source URL (blob URL or regular URL) */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** File name to display */
  fileName?: string;
  /** File size in bytes */
  fileSize?: number;
  /** Called when remove button is clicked */
  onRemove?: () => void;
  /** Whether the remove button is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Displays an image preview with optional remove button and file info.
 * Used for image uploads.
 */
export function ImagePreview({
  src,
  alt,
  fileName,
  fileSize,
  onRemove,
  disabled = false,
  className,
}: ImagePreviewProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative mx-auto max-h-[300px] w-fit overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        <img
          alt={alt}
          className="max-h-[300px] w-auto object-contain"
          src={src}
        />
        {onRemove && (
          <IconButton
            aria-label="Remover imagem"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            disabled={disabled}
            onClick={onRemove}
            size="small"
            variant="ghost"
          >
            <TrashIcon
              className="cursor-pointer text-gray-500 hover:text-red-500"
              size="md"
            />
          </IconButton>
        )}
      </div>
      {fileName && (
        <p className="truncate text-center text-gray-600 text-sm">
          {fileName}
          {fileSize !== undefined && ` (${formatFileSize(fileSize)})`}
        </p>
      )}
    </div>
  );
}

export default ImagePreview;
