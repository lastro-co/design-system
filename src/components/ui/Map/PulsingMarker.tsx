"use client";

import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { useMap } from "./hooks";
import { MapMarker, MarkerContent } from "./MapMarker";

const DEFAULT_ZOOM = 15;

const MARKER_COLORS = {
  purple: { pulse: "bg-purple-500", dot: "bg-purple-500" },
  orange: { pulse: "bg-orange-500", dot: "bg-orange-500" },
} as const;

export type PulsingMarkerColor = keyof typeof MARKER_COLORS;

export interface PulsingMarkerProps {
  latitude: number;
  longitude: number;
  /** Marker color theme (default: 'purple') */
  color?: PulsingMarkerColor;
  /** Zoom level for flyTo on click (default: 15) */
  zoom?: number;
  /** Custom click handler. If provided, replaces the default flyTo behavior. */
  onClick?: () => void;
  /** Mouse enter handler for hover interactions */
  onMouseEnter?: () => void;
  /** Mouse leave handler for hover interactions */
  onMouseLeave?: () => void;
  /** Additional children inside MapMarker (e.g. MarkerZIndex) */
  children?: ReactNode;
}

export function PulsingMarker({
  latitude,
  longitude,
  color = "purple",
  zoom = DEFAULT_ZOOM,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
}: PulsingMarkerProps) {
  const { map } = useMap();
  const colors = MARKER_COLORS[color];

  const handleClick =
    onClick ??
    (() => {
      map?.flyTo({
        center: [longitude, latitude],
        zoom,
        duration: 500,
      });
    });

  return (
    <MapMarker latitude={latitude} longitude={longitude} onClick={handleClick}>
      {children}
      <MarkerContent className="cursor-pointer">
        <div
          className="relative flex items-center justify-center"
          onBlur={onMouseLeave}
          onFocus={onMouseEnter}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div
            className={cn("absolute size-[30px] rounded-full", colors.pulse)}
            style={{ animation: "marker-pulse 2s ease-in-out infinite" }}
          />
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2 border-white shadow-lg",
              colors.dot
            )}
          />
        </div>
      </MarkerContent>
    </MapMarker>
  );
}
