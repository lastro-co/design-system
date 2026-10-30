"use client";

import { useId } from "react";
import { CircleAlertIcon, PlayIcon, XIcon } from "@/components/icons.v2";
import { cn } from "@/lib/utils";
import { Badge } from "../Badge";
import { FileTypeIcon } from "../FileTypeIcon";
import { IconButton } from "../IconButton";

export type MediaKind = "image" | "video" | "file";

export interface MediaThumbnailProps {
  kind: MediaKind;
  /** Image URL, or the poster URL for a video */
  src?: string;
  fileName: string;
  mimeType?: string;
  /** 0-based position; rendered as `index + 1` */
  index?: number;
  selected?: boolean;
  invalid?: boolean;
  invalidMessage?: string;
  onSelect?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

interface MediaPreviewProps {
  kind: MediaKind;
  src?: string;
  fileName: string;
  mimeType?: string;
}

function MediaPreview({ kind, src, fileName, mimeType }: MediaPreviewProps) {
  if (kind === "video") {
    return (
      <span className="relative flex size-full items-center justify-center bg-gray-800">
        {src && (
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            draggable={false}
            src={src}
          />
        )}
        <span className="relative flex size-5 items-center justify-center rounded-full bg-black/50 text-white">
          <PlayIcon aria-hidden="true" className="size-3" />
        </span>
      </span>
    );
  }

  if (kind === "image" && src) {
    return (
      <img
        alt=""
        className="size-full object-cover"
        draggable={false}
        src={src}
      />
    );
  }

  return (
    <span className="flex size-full items-center justify-center bg-gray-100">
      <FileTypeIcon fileName={fileName} mimeType={mimeType} size="sm" />
    </span>
  );
}

export function MediaThumbnail({
  kind,
  src,
  fileName,
  mimeType,
  index,
  selected = false,
  invalid = false,
  invalidMessage,
  onSelect,
  onRemove,
  disabled = false,
  className,
}: MediaThumbnailProps) {
  const messageId = useId();
  const hasMessage = invalid && Boolean(invalidMessage);

  const frameClassName = cn(
    "relative block size-full overflow-hidden rounded-lg border border-gray-200 bg-white p-0",
    selected && "border-purple-800 ring-1 ring-purple-800",
    invalid && "border-red-600 ring-1 ring-red-600"
  );

  const preview = (
    <MediaPreview
      fileName={fileName}
      kind={kind}
      mimeType={mimeType}
      src={src}
    />
  );

  return (
    <div
      className={cn("relative h-11 w-21 shrink-0", className)}
      data-slot="media-thumbnail"
      title={hasMessage ? invalidMessage : undefined}
    >
      {onSelect ? (
        <button
          aria-describedby={hasMessage ? messageId : undefined}
          aria-invalid={invalid || undefined}
          aria-label={fileName}
          aria-pressed={selected}
          className={cn(
            frameClassName,
            "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
          )}
          data-slot="media-thumbnail-select"
          disabled={disabled}
          onClick={onSelect}
          type="button"
        >
          {preview}
        </button>
      ) : (
        <div
          aria-describedby={hasMessage ? messageId : undefined}
          aria-invalid={invalid || undefined}
          aria-label={fileName}
          className={frameClassName}
          role="img"
        >
          {preview}
        </div>
      )}

      {index !== undefined && (
        <Badge
          className="pointer-events-none absolute top-1 left-1"
          color="purple"
          isNumber
        >
          {index + 1}
        </Badge>
      )}

      {invalid && (
        <span className="pointer-events-none absolute bottom-1 left-1 flex rounded-full bg-white text-red-600">
          <CircleAlertIcon aria-hidden="true" className="size-4" />
        </span>
      )}

      {hasMessage && (
        <span className="sr-only" id={messageId}>
          {invalidMessage}
        </span>
      )}

      {onRemove && (
        <IconButton
          aria-label={`Remover ${fileName}`}
          className="-top-2 -right-2 absolute size-5"
          data-slot="media-thumbnail-remove"
          disabled={disabled}
          onClick={onRemove}
          shape="circular"
          size="small"
          variant="outline"
        >
          <XIcon className="size-3" />
        </IconButton>
      )}
    </div>
  );
}

export default MediaThumbnail;
