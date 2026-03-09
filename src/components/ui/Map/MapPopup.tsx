"use client";

import MapLibreGL from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/utils";
import { CloseIcon } from "../../icons";

import { useMap } from "./hooks";
import type { MapPopupProps } from "./types";

export function MapPopup({
  longitude,
  latitude,
  onClose,
  children,
  className,
  closeButton = false,
  interactive = true,
  ...popupOptions
}: MapPopupProps) {
  const { map } = useMap();
  const popupRef = useRef<MapLibreGL.Popup | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // Create container element on client-side only
  useEffect(() => {
    const el = document.createElement("div");
    setContainer(el);
    return () => {
      setContainer(null);
    };
  }, []);

  // Create popup instance once container is available
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only create popup once when container is ready; coordinate/option syncing is handled in separate effects
  useEffect(() => {
    if (!container) {
      return;
    }

    popupRef.current = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setLngLat([longitude, latitude]);

    return () => {
      if (popupRef.current?.isOpen()) {
        popupRef.current.remove();
      }
      popupRef.current = null;
    };
  }, [container]);

  // Add popup to map and handle close events
  useEffect(() => {
    const popup = popupRef.current;
    if (!map || !popup || !container) {
      return;
    }

    const handleCloseEvent = () => onClose?.();
    popup.on("close", handleCloseEvent);

    popup.setDOMContent(container);
    popup.addTo(map);

    return () => {
      popup.off("close", handleCloseEvent);
      if (popup.isOpen()) {
        popup.remove();
      }
    };
  }, [map, container, onClose]);

  // Sync coordinates
  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) {
      return;
    }
    const currentLngLat = popup.getLngLat();
    if (currentLngLat.lng !== longitude || currentLngLat.lat !== latitude) {
      popup.setLngLat([longitude, latitude]);
    }
  }, [longitude, latitude]);

  // Sync popup options
  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) {
      return;
    }
    popup.setOffset(popupOptions.offset ?? 16);
    if (popupOptions.maxWidth) {
      popup.setMaxWidth(popupOptions.maxWidth);
    }
  }, [popupOptions.offset, popupOptions.maxWidth]);

  const handleClose = useCallback(() => {
    popupRef.current?.remove();
    onClose?.();
  }, [onClose]);

  // Don't render portal until container is created (client-side)
  if (!container) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fade-in-0 zoom-in-95 relative animate-in rounded-md border bg-popover p-3 text-popover-foreground shadow-md",
        !interactive && "pointer-events-none",
        className
      )}
    >
      {closeButton && (
        <button
          aria-label="Close popup"
          className="absolute top-1 right-1 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={handleClose}
          type="button"
        >
          <CloseIcon size="sm" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>,
    container
  );
}
