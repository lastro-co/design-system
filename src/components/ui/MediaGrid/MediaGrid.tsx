"use client";

import type { ReactNode } from "react";
import { PlayIcon } from "@/components/icons.v2";
import { cn } from "@/lib/utils";
import type { MediaKind } from "../MediaThumbnail";

type GridSpan = 1 | 2 | 3 | 4;

const GRID_COLUMNS_CLASS: Record<GridSpan, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

const COLUMN_SPAN_CLASS: Record<GridSpan, string> = {
  1: "aspect-square",
  2: "col-span-2 aspect-[2/1]",
  3: "col-span-3 aspect-[3/1]",
  4: "col-span-4 aspect-[4/1]",
};

export interface MediaGridItem {
  id: string;
  kind: Exclude<MediaKind, "file">;
  /** Image URL, or the video URL (its first frame is shown) */
  src: string;
  alt: string;
}

export interface MediaGridProps {
  items: MediaGridItem[];
  columns?: 2 | 4;
  /** Defaults to `columns * 2` */
  maxVisible?: number;
  onItemClick?: (index: number) => void;
  /** Rendered over the bottom-right corner of each visible item */
  renderItemOverlay?: (item: MediaGridItem, index: number) => ReactNode;
  className?: string;
}

const getOverflowLabel = (count: number) =>
  `Ver mais ${count} ${count === 1 ? "mídia" : "mídias"}`;

interface MediaGridCellContentProps {
  item: MediaGridItem;
  hiddenCount: number;
}

function MediaGridCellContent({
  item,
  hiddenCount,
}: MediaGridCellContentProps) {
  const isOverflow = hiddenCount > 0;
  const alt = isOverflow ? "" : item.alt;

  return (
    <>
      {item.kind === "video" ? (
        <video
          aria-label={alt || undefined}
          className="size-full bg-gray-800 object-cover"
          muted
          playsInline
          preload="metadata"
          src={item.src}
        />
      ) : (
        <img
          alt={alt}
          className="size-full object-cover"
          draggable={false}
          src={item.src}
        />
      )}
      {item.kind === "video" && !isOverflow && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white">
            <PlayIcon aria-hidden="true" className="size-4" />
          </span>
        </span>
      )}
      {isOverflow && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black/50 font-display font-semibold text-white text-xl"
        >
          +{hiddenCount}
        </span>
      )}
    </>
  );
}

export function MediaGrid({
  items,
  columns = 2,
  maxVisible = columns * 2,
  onItemClick,
  renderItemOverlay,
  className,
}: MediaGridProps) {
  const visibleItems = items.slice(0, Math.max(maxVisible, 1));
  const visibleCount = visibleItems.length;
  if (visibleCount === 0) {
    return null;
  }

  const hiddenCount = items.length - visibleCount;
  const gridColumns = Math.min(columns, visibleCount) as GridSpan;
  const remainder = visibleCount % gridColumns;
  const lastSpan = (
    remainder === 0 ? 1 : gridColumns - remainder + 1
  ) as GridSpan;

  return (
    <ul
      className={cn(
        "grid w-full gap-1",
        GRID_COLUMNS_CLASS[gridColumns],
        className
      )}
      data-slot="media-grid"
    >
      {visibleItems.map((item, index) => {
        const isLast = index === visibleCount - 1;
        const cellHiddenCount = isLast ? hiddenCount : 0;
        const overflowLabel =
          cellHiddenCount > 0 ? getOverflowLabel(cellHiddenCount) : undefined;
        const content = (
          <MediaGridCellContent hiddenCount={cellHiddenCount} item={item} />
        );

        return (
          <li
            className={cn(
              "relative overflow-hidden rounded-lg bg-gray-100",
              COLUMN_SPAN_CLASS[isLast ? lastSpan : 1]
            )}
            key={item.id}
          >
            {onItemClick ? (
              <button
                aria-label={overflowLabel}
                className="relative block size-full cursor-pointer p-0 outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-inset"
                onClick={() => onItemClick(index)}
                type="button"
              >
                {content}
              </button>
            ) : (
              <div className="relative size-full">
                {content}
                {overflowLabel && (
                  <span className="sr-only">{overflowLabel}</span>
                )}
              </div>
            )}
            {renderItemOverlay && (
              <div className="pointer-events-none absolute right-1 bottom-1">
                {renderItemOverlay(item, index)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default MediaGrid;
