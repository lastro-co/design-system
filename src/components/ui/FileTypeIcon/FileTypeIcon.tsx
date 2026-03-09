"use client";

import { cn } from "../../../lib/utils";
import { FileIcon } from "../../icons";

type FileType = "pdf" | "doc" | "xls" | "txt" | "image" | "default";

interface FileTypeConfig {
  bgColor: string;
  textColor: string;
  label: string;
}

const FILE_TYPE_CONFIG: Record<FileType, FileTypeConfig> = {
  pdf: {
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    label: "PDF",
  },
  doc: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    label: "DOC",
  },
  xls: {
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    label: "XLS",
  },
  txt: {
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    label: "TXT",
  },
  image: {
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    label: "IMG",
  },
  default: {
    bgColor: "bg-gray-200",
    textColor: "text-gray-600",
    label: "",
  },
};

/**
 * Get file type from file name or MIME type
 */
export function getFileType(fileName: string, mimeType?: string): FileType {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  // Check by extension first
  if (extension === "pdf") {
    return "pdf";
  }
  if (extension === "doc" || extension === "docx") {
    return "doc";
  }
  if (extension === "xls" || extension === "xlsx") {
    return "xls";
  }
  if (extension === "txt") {
    return "txt";
  }
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
    return "image";
  }

  // Fallback to MIME type
  if (mimeType) {
    if (mimeType === "application/pdf") {
      return "pdf";
    }
    if (mimeType.includes("word") || mimeType.includes("document")) {
      return "doc";
    }
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
      return "xls";
    }
    if (mimeType === "text/plain") {
      return "txt";
    }
    if (mimeType.startsWith("image/")) {
      return "image";
    }
  }

  return "default";
}

type FileTypeIconSize = "sm" | "md" | "lg";

const SIZE_CONFIG: Record<
  FileTypeIconSize,
  { container: string; text: string }
> = {
  sm: {
    container: "h-8 w-8",
    text: "text-[10px]",
  },
  md: {
    container: "h-10 w-10",
    text: "text-xs",
  },
  lg: {
    container: "h-12 w-12",
    text: "text-sm",
  },
};

export interface FileTypeIconProps {
  /** File name to detect type from */
  fileName: string;
  /** Optional MIME type for better detection */
  mimeType?: string;
  /** Size of the icon */
  size?: FileTypeIconSize;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays a styled icon badge based on file type.
 * Shows file extension label (PDF, DOC, XLS, etc.) with appropriate colors.
 *
 * @example
 * <FileTypeIcon fileName="document.pdf" />
 * <FileTypeIcon fileName="image.png" size="lg" />
 * <FileTypeIcon fileName="file" mimeType="application/pdf" />
 */
export default function FileTypeIcon({
  fileName,
  mimeType,
  size = "md",
  className,
}: FileTypeIconProps) {
  const fileType = getFileType(fileName, mimeType);
  const config = FILE_TYPE_CONFIG[fileType];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg",
        sizeConfig.container,
        config.bgColor,
        className
      )}
    >
      {config.label ? (
        <span className={cn("font-bold", sizeConfig.text, config.textColor)}>
          {config.label}
        </span>
      ) : (
        <FileIcon className={config.textColor} size={size} />
      )}
    </div>
  );
}
