"use client";

import MapLibreGL from "maplibre-gl";
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/utils";
import { CloseIcon } from "../../icons";

import { DefaultMarkerIcon } from "./components";
import { MarkerContext } from "./context";
import { useMap, useMarkerContext } from "./hooks";
import type {
  MapMarkerProps,
  MarkerContentProps,
  MarkerLabelProps,
  MarkerPopupProps,
  MarkerTooltipProps,
} from "./types";

export function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = false,
  ...markerOptions
}: MapMarkerProps) {
  const { map } = useMap();
  const markerRef = useRef<MapLibreGL.Marker | null>(null);

  // Create marker instance once
  if (!markerRef.current) {
    markerRef.current = new MapLibreGL.Marker({
      ...markerOptions,
      element: document.createElement("div"),
      draggable,
    }).setLngLat([longitude, latitude]);
  }

  const marker = markerRef.current;

  // Add marker to map
  useEffect(() => {
    if (!map || !marker) {
      return;
    }

    marker.addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, marker]);

  // Handle DOM event listeners (click, mouseenter, mouseleave)
  useEffect(() => {
    const element = marker.getElement();
    if (!element) {
      return;
    }

    const handleClick = (e: MouseEvent) => onClick?.(e);
    const handleMouseEnter = (e: MouseEvent) => onMouseEnter?.(e);
    const handleMouseLeave = (e: MouseEvent) => onMouseLeave?.(e);

    element.addEventListener("click", handleClick);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("click", handleClick);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [marker, onClick, onMouseEnter, onMouseLeave]);

  // Handle drag event listeners
  useEffect(() => {
    if (!marker) {
      return;
    }

    const handleDragStart = () => {
      const lngLat = marker.getLngLat();
      onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat });
    };
    const handleDrag = () => {
      const lngLat = marker.getLngLat();
      onDrag?.({ lng: lngLat.lng, lat: lngLat.lat });
    };
    const handleDragEnd = () => {
      const lngLat = marker.getLngLat();
      onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat });
    };

    marker.on("dragstart", handleDragStart);
    marker.on("drag", handleDrag);
    marker.on("dragend", handleDragEnd);

    return () => {
      marker.off("dragstart", handleDragStart);
      marker.off("drag", handleDrag);
      marker.off("dragend", handleDragEnd);
    };
  }, [marker, onDragStart, onDrag, onDragEnd]);

  // Sync position
  useEffect(() => {
    if (
      marker.getLngLat().lng !== longitude ||
      marker.getLngLat().lat !== latitude
    ) {
      marker.setLngLat([longitude, latitude]);
    }
  }, [marker, longitude, latitude]);

  // Sync draggable state
  useEffect(() => {
    if (marker.isDraggable() !== draggable) {
      marker.setDraggable(draggable);
    }
  }, [marker, draggable]);

  // Sync marker options
  useEffect(() => {
    const currentOffset = marker.getOffset();
    const newOffset = markerOptions.offset ?? [0, 0];
    const [newOffsetX, newOffsetY] = Array.isArray(newOffset)
      ? newOffset
      : [newOffset.x, newOffset.y];
    if (currentOffset.x !== newOffsetX || currentOffset.y !== newOffsetY) {
      marker.setOffset(newOffset);
    }

    if (marker.getRotation() !== markerOptions.rotation) {
      marker.setRotation(markerOptions.rotation ?? 0);
    }
    if (marker.getRotationAlignment() !== markerOptions.rotationAlignment) {
      marker.setRotationAlignment(markerOptions.rotationAlignment ?? "auto");
    }
    if (marker.getPitchAlignment() !== markerOptions.pitchAlignment) {
      marker.setPitchAlignment(markerOptions.pitchAlignment ?? "auto");
    }
  }, [
    marker,
    markerOptions.offset,
    markerOptions.rotation,
    markerOptions.rotationAlignment,
    markerOptions.pitchAlignment,
  ]);

  return (
    <MarkerContext.Provider value={{ marker, map }}>
      {children}
    </MarkerContext.Provider>
  );
}

export function MarkerContent({ children, className }: MarkerContentProps) {
  const { marker } = useMarkerContext();

  return createPortal(
    <div className={cn("relative cursor-pointer", className)}>
      {children || <DefaultMarkerIcon />}
    </div>,
    marker.getElement()
  );
}

export function MarkerPopup({
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MarkerPopupProps) {
  const { marker, map } = useMarkerContext();
  const container = useMemo(() => document.createElement("div"), []);
  const prevPopupOptions = useRef(popupOptions);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only create popup once
  const popup = useMemo(() => {
    const popupInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setDOMContent(container);

    return popupInstance;
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally minimal dependencies for initialization
  useEffect(() => {
    if (!map) {
      return;
    }

    popup.setDOMContent(container);
    marker.setPopup(popup);

    return () => {
      marker.setPopup(null);
    };
  }, [map]);

  if (popup.isOpen()) {
    const prev = prevPopupOptions.current;

    if (prev.offset !== popupOptions.offset) {
      popup.setOffset(popupOptions.offset ?? 16);
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popup.setMaxWidth(popupOptions.maxWidth ?? "none");
    }

    prevPopupOptions.current = popupOptions;
  }

  const handleClose = () => popup.remove();

  return createPortal(
    <div
      className={cn(
        "fade-in-0 zoom-in-95 relative animate-in rounded-md border bg-popover p-3 text-popover-foreground shadow-md",
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

export function MarkerTooltip({
  children,
  className,
  ...popupOptions
}: MarkerTooltipProps) {
  const { marker, map } = useMarkerContext();
  const container = useMemo(() => document.createElement("div"), []);
  const prevTooltipOptions = useRef(popupOptions);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only create tooltip once
  const tooltip = useMemo(() => {
    const tooltipInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeOnClick: true,
      closeButton: false,
    }).setMaxWidth("none");

    return tooltipInstance;
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally minimal dependencies for initialization
  useEffect(() => {
    if (!map) {
      return;
    }

    tooltip.setDOMContent(container);

    const handleMouseEnter = () => {
      tooltip.setLngLat(marker.getLngLat()).addTo(map);
    };
    const handleMouseLeave = () => tooltip.remove();

    marker.getElement()?.addEventListener("mouseenter", handleMouseEnter);
    marker.getElement()?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      marker.getElement()?.removeEventListener("mouseenter", handleMouseEnter);
      marker.getElement()?.removeEventListener("mouseleave", handleMouseLeave);
      tooltip.remove();
    };
  }, [map]);

  if (tooltip.isOpen()) {
    const prev = prevTooltipOptions.current;

    if (prev.offset !== popupOptions.offset) {
      tooltip.setOffset(popupOptions.offset ?? 16);
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      tooltip.setMaxWidth(popupOptions.maxWidth ?? "none");
    }

    prevTooltipOptions.current = popupOptions;
  }

  return createPortal(
    <div
      className={cn(
        "fade-in-0 zoom-in-95 animate-in rounded-md bg-foreground px-2 py-1 text-background text-xs shadow-md",
        className
      )}
    >
      {children}
    </div>,
    container
  );
}

export function MarkerLabel({
  children,
  className,
  position = "top",
}: MarkerLabelProps) {
  const positionClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
  };

  return (
    <div
      className={cn(
        "-translate-x-1/2 absolute left-1/2 whitespace-nowrap",
        "font-medium text-[10px] text-foreground",
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  );
}
