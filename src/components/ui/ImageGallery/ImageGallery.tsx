"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../../icons";
import { IconButton } from "../IconButton";
import { Spinner } from "../Spinner";

export interface ImageGalleryProps {
  /** Array of image URLs to display */
  images: string[];
  /** Alt text for the main image */
  alt: string;
  /** Optional content to render in the top-left corner */
  topLeftOverlay?: ReactNode;
  /** Optional content to render in the top-right corner */
  topRightOverlay?: ReactNode;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Additional class name for the container */
  className?: string;
  /** Optional fixed height for the main image (replaces aspect-video) */
  mainImageHeight?: number;
  /** Whether to show the image count overlay (e.g. "1 / 5"). Defaults to true */
  showCount?: boolean;
}

export function ImageGallery({
  images,
  alt,
  topLeftOverlay,
  topRightOverlay,
  emptyMessage = "Sem imagens disponíveis",
  className,
  mainImageHeight,
  showCount = true,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);
  const [loadedThumbnails, setLoadedThumbnails] = useState<Set<number>>(
    new Set()
  );
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex((current) =>
      images.length > 0 ? Math.min(current, images.length - 1) : 0
    );
    setIsMainImageLoading(true);
    setLoadedThumbnails(new Set());
  }, [images]);

  useEffect(() => {
    const container = thumbnailsRef.current;
    if (!container) {
      return;
    }

    const activeThumb = container.children[selectedIndex] as
      | HTMLElement
      | undefined;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [selectedIndex]);

  const handleImageChange = useCallback((index: number) => {
    setIsMainImageLoading(true);
    setSelectedIndex(index);
  }, []);

  const handleThumbnailLoad = useCallback((index: number) => {
    setLoadedThumbnails((prev) => new Set(prev).add(index));
  }, []);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-gray-100",
          !mainImageHeight && "aspect-video",
          className
        )}
        style={mainImageHeight ? { height: mainImageHeight } : undefined}
      >
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const handlePrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
    handleImageChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
    handleImageChange(newIndex);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main image */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-gray-100",
          !mainImageHeight && "aspect-video"
        )}
        style={mainImageHeight ? { height: mainImageHeight } : undefined}
      >
        {isMainImageLoading && (
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <Spinner className="text-gray-400" size="lg" />
          </div>
        )}
        <img
          alt={`${alt} - ${selectedIndex + 1} de ${images.length}`}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-200",
            isMainImageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsMainImageLoading(false)}
          src={images[selectedIndex]}
        />

        {topLeftOverlay && (
          <div className="absolute top-2 left-2 z-10">{topLeftOverlay}</div>
        )}

        {topRightOverlay && (
          <div className="absolute top-2 right-2 z-10">{topRightOverlay}</div>
        )}

        {images.length > 1 && (
          <>
            <IconButton
              aria-label="Imagem anterior"
              className="-translate-y-1/2 absolute top-1/2 left-2 bg-white hover:bg-gray-100"
              color="purple"
              onClick={handlePrevious}
              shape="circular"
              size="small"
              variant="ghost"
            >
              <ChevronLeftIcon className="size-5" />
            </IconButton>
            <IconButton
              aria-label="Próxima imagem"
              className="-translate-y-1/2 absolute top-1/2 right-2 bg-white hover:bg-gray-100"
              color="purple"
              onClick={handleNext}
              shape="circular"
              size="small"
              variant="ghost"
            >
              <ChevronRightIcon className="size-5" />
            </IconButton>
          </>
        )}

        {showCount && images.length > 1 && (
          <div className="absolute right-2 bottom-2 rounded-full bg-black/60 px-2 py-1 text-white text-xs">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto" ref={thumbnailsRef}>
          {images.map((image, idx) => (
            <button
              aria-label={`Selecionar imagem ${idx + 1} de ${images.length}`}
              className={cn(
                "relative h-16 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-100",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset",
                idx === selectedIndex
                  ? "ring-2 ring-purple-600 ring-inset"
                  : "opacity-50 hover:opacity-100"
              )}
              key={`${idx}-${image}`}
              onClick={() => handleImageChange(idx)}
              type="button"
            >
              {!loadedThumbnails.has(idx) && (
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                  <Spinner className="text-gray-400" size="sm" />
                </div>
              )}
              <img
                alt=""
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-200",
                  loadedThumbnails.has(idx) ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => handleThumbnailLoad(idx)}
                src={image}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
