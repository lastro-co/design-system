"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext, MarkerContext } from "./context";
import type { Theme } from "./types";

// Check document class for theme (works with next-themes, etc.)
function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") {
    return null;
  }
  if (document.documentElement.classList.contains("dark")) {
    return "dark";
  }
  if (document.documentElement.classList.contains("light")) {
    return "light";
  }
  return null;
}

// Get system preference
function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useResolvedTheme(themeProp?: Theme): Theme {
  const [detectedTheme, setDetectedTheme] = useState<Theme>(
    () => getDocumentTheme() ?? getSystemTheme()
  );

  useEffect(() => {
    if (themeProp) {
      return; // Skip detection if theme is provided via prop
    }

    // Watch for document class changes (e.g., next-themes toggling dark class)
    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme();
      if (docTheme) {
        setDetectedTheme(docTheme);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also watch for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Only use system preference if no document class is set
      if (!getDocumentTheme()) {
        setDetectedTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [themeProp]);

  return themeProp ?? detectedTheme;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }
  return context;
}

export function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error("Marker components must be used within MapMarker");
  }
  return context;
}

/**
 * Returns 'left' or 'right' anchor for a popup based on whether the point
 * is closer to the right or left edge of the map container.
 * 'left' anchor = popup extends to the right, 'right' anchor = popup extends to the left.
 */
export function usePopupAnchor() {
  const { map } = useMap();

  const getAnchor = useCallback(
    (longitude: number, latitude: number): "left" | "right" => {
      if (!map) {
        return "left";
      }
      const point = map.project([longitude, latitude]);
      const containerWidth = map.getContainer().clientWidth;
      return point.x > containerWidth / 2 ? "right" : "left";
    },
    [map]
  );

  return getAnchor;
}
