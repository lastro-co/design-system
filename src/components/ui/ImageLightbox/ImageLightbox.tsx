"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon } from "../../icons";
import { IconButton } from "../IconButton";

const MIN_ZOOM = 1;
const CLICK_ZOOM = 2.5;
const WHEEL_ZOOM_INTENSITY = 0.002;

export interface ImageLightboxProps {
  /** Image source URL */
  src: string;
  /** Alt text for the image (also used as the accessible dialog title) */
  alt: string;
  /** Whether the lightbox is open (controlled) */
  open: boolean;
  /** Called when the lightbox requests to open or close */
  onOpenChange: (open: boolean) => void;
  /** Maximum zoom level (default: 4) */
  maxZoom?: number;
  /** Additional CSS classes for the image */
  className?: string;
}

interface Transform {
  scale: number;
  x: number;
  y: number;
}

const INITIAL_TRANSFORM: Transform = { scale: 1, x: 0, y: 0 };

/**
 * Zooms to `nextScale` keeping the point under the cursor stationary.
 * `point` is measured from the center of the lightbox container.
 */
function zoomTo(
  prev: Transform,
  point: { x: number; y: number },
  nextScale: number,
  maxZoom: number
): Transform {
  const scale = Math.min(Math.max(nextScale, MIN_ZOOM), maxZoom);
  if (scale === MIN_ZOOM) {
    return INITIAL_TRANSFORM;
  }
  const ratio = scale / prev.scale;
  return {
    scale,
    x: point.x - (point.x - prev.x) * ratio,
    y: point.y - (point.y - prev.y) * ratio,
  };
}

function getPointFromCenter(
  container: HTMLElement,
  clientX: number,
  clientY: number
) {
  const rect = container.getBoundingClientRect();
  return {
    x: clientX - rect.left - rect.width / 2,
    y: clientY - rect.top - rect.height / 2,
  };
}

/**
 * Fullscreen image viewer: the image opens at full screen height and can be
 * zoomed by clicking it or with the mouse wheel (cursor-anchored zoom).
 */
export function ImageLightbox({
  src,
  alt,
  open,
  onOpenChange,
  maxZoom = 4,
  className,
}: ImageLightboxProps) {
  // Callback-ref state: the Radix portal mounts the content a commit after
  // this component mounts, so a plain ref would be null in the effect below.
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<Transform>(INITIAL_TRANSFORM);
  const isZoomed = transform.scale > MIN_ZOOM;

  useEffect(() => {
    if (!open) {
      setTransform(INITIAL_TRANSFORM);
    }
  }, [open]);

  useEffect(() => {
    if (!container) {
      return;
    }

    // Native listener: React wheel handlers can be passive, which would
    // ignore preventDefault and scroll the page behind the lightbox.
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const point = getPointFromCenter(container, event.clientX, event.clientY);
      setTransform((prev) =>
        zoomTo(
          prev,
          point,
          prev.scale * Math.exp(-event.deltaY * WHEEL_ZOOM_INTENSITY),
          maxZoom
        )
      );
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [container, maxZoom]);

  const handleImageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!container) {
      return;
    }
    if (isZoomed) {
      setTransform(INITIAL_TRANSFORM);
      return;
    }
    const point = getPointFromCenter(container, event.clientX, event.clientY);
    setTransform((prev) => zoomTo(prev, point, CLICK_ZOOM, maxZoom));
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      <DialogPrimitive.Portal data-slot="image-lightbox-portal">
        <DialogPrimitive.Overlay
          className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in"
          data-slot="image-lightbox-overlay"
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed inset-0 z-50 flex items-center justify-center overflow-hidden duration-200 focus-visible:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in"
          data-slot="image-lightbox-content"
          onClick={handleBackdropClick}
          ref={setContainer}
        >
          <DialogPrimitive.Title className="sr-only">
            {alt}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close asChild>
            <IconButton
              aria-label="Fechar"
              className="absolute top-4 right-4 z-10 bg-black/40 text-white hover:bg-black/60"
              shape="circular"
              size="medium"
              variant="ghost"
            >
              <CloseIcon className="size-5" />
            </IconButton>
          </DialogPrimitive.Close>
          <button
            aria-label={isZoomed ? "Reduzir imagem" : "Ampliar imagem"}
            className={cn(
              "flex h-full max-w-full items-center justify-center transition-transform duration-200 ease-out will-change-transform focus-visible:outline-none",
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            )}
            onClick={handleImageClick}
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            }}
            type="button"
          >
            <img
              alt={alt}
              className={cn(
                "pointer-events-none h-full max-w-full select-none object-contain",
                className
              )}
              draggable={false}
              src={src}
            />
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
