"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  LoaderIcon,
  LocateIcon,
  MaximizeIcon,
  MinusIcon,
  PlusIcon,
} from "../../icons";

import { useMap } from "./hooks";
import type { MapControlsProps } from "./types";

const positionClasses = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-3",
  "bottom-left": "bottom-[42px] left-4",
  "bottom-right": "bottom-[42px] right-3",
};

function ControlGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white [&>button:not(:last-child)]:border-gray-200 [&>button:not(:last-child)]:border-b">
      {children}
    </div>
  );
}

function ControlButton({
  onClick,
  label,
  children,
  disabled = false,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        "flex size-8 cursor-pointer items-center justify-center transition-colors hover:bg-gray-100 active:bg-gray-200",
        disabled && "pointer-events-none cursor-not-allowed opacity-50"
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function CompassButton({ onClick }: { onClick: () => void }) {
  const { map } = useMap();
  const compassRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!map || !compassRef.current) {
      return;
    }

    const compass = compassRef.current;

    const updateRotation = () => {
      const bearing = map.getBearing();
      const pitch = map.getPitch();
      compass.style.transform = `rotateX(${pitch}deg) rotateZ(${-bearing}deg)`;
    };

    map.on("rotate", updateRotation);
    map.on("pitch", updateRotation);
    updateRotation();

    return () => {
      map.off("rotate", updateRotation);
      map.off("pitch", updateRotation);
    };
  }, [map]);

  return (
    <ControlButton label="Reset bearing to north" onClick={onClick}>
      <svg
        aria-hidden="true"
        className="size-5 transition-transform duration-200"
        ref={compassRef}
        style={{ transformStyle: "preserve-3d" }}
        viewBox="0 0 24 24"
      >
        <title>Compass</title>
        <path className="fill-red-500" d="M12 2L16 12H12V2Z" />
        <path className="fill-red-300" d="M12 2L8 12H12V2Z" />
        <path className="fill-gray-400" d="M12 22L16 12H12V22Z" />
        <path className="fill-gray-300" d="M12 22L8 12H12V22Z" />
      </svg>
    </ControlButton>
  );
}

export function MapControls({
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showRecenter = false,
  showFullscreen = false,
  className,
  onLocate,
  onRecenter,
}: MapControlsProps) {
  const { map } = useMap();
  const [waitingForLocation, setWaitingForLocation] = useState(false);

  const handleZoomIn = useCallback(() => {
    map?.zoomTo(map.getZoom() + 1, { duration: 300 });
  }, [map]);

  const handleZoomOut = useCallback(() => {
    map?.zoomTo(map.getZoom() - 1, { duration: 300 });
  }, [map]);

  const handleResetBearing = useCallback(() => {
    map?.resetNorthPitch({ duration: 300 });
  }, [map]);

  const handleLocate = useCallback(() => {
    setWaitingForLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          };
          map?.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 14,
            duration: 1500,
          });
          onLocate?.(coords);
          setWaitingForLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setWaitingForLocation(false);
        }
      );
    }
  }, [map, onLocate]);

  const handleFullscreen = useCallback(() => {
    const container = map?.getContainer();
    if (!container) {
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, [map]);

  return (
    <div
      className={cn(
        "absolute z-10 flex flex-col gap-1.5",
        positionClasses[position],
        className
      )}
    >
      {showZoom && (
        <ControlGroup>
          <ControlButton label="Zoom in" onClick={handleZoomIn}>
            <PlusIcon className="text-purple-800" size="sm" />
          </ControlButton>
          <ControlButton label="Zoom out" onClick={handleZoomOut}>
            <MinusIcon className="text-purple-800" size="sm" />
          </ControlButton>
        </ControlGroup>
      )}
      {showRecenter && onRecenter && (
        <ControlGroup>
          <ControlButton label="Recenter map" onClick={onRecenter}>
            <LocateIcon className="text-purple-800" size="sm" />
          </ControlButton>
        </ControlGroup>
      )}
      {showCompass && (
        <ControlGroup>
          <CompassButton onClick={handleResetBearing} />
        </ControlGroup>
      )}
      {showLocate && (
        <ControlGroup>
          <ControlButton
            disabled={waitingForLocation}
            label="Find my location"
            onClick={handleLocate}
          >
            {waitingForLocation ? (
              <LoaderIcon className="animate-spin text-purple-800" size="sm" />
            ) : (
              <LocateIcon className="text-purple-800" size="sm" />
            )}
          </ControlButton>
        </ControlGroup>
      )}
      {showFullscreen && (
        <ControlGroup>
          <ControlButton label="Toggle fullscreen" onClick={handleFullscreen}>
            <MaximizeIcon className="text-purple-800" size="sm" />
          </ControlButton>
        </ControlGroup>
      )}
    </div>
  );
}
