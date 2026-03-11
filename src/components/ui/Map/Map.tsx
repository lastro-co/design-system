"use client";

import MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Set the CSP worker URL before any Map instance is created.
// The consumer app must serve this file at /maplibre-gl-csp-worker.js (via postinstall).
// The Turbopack alias (maplibre-gl → maplibre-gl-csp.js) in the app's next.config.ts
// activates the CSP build which uses this static worker instead of an inline blob.
if (typeof window !== "undefined") {
  MapLibreGL.setWorkerUrl("/maplibre-gl-csp-worker.js");
}

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { DefaultLoader } from "./components";
import { MapContext } from "./context";
import { useResolvedTheme } from "./hooks";
import type { MapProps, MapRef, MapStyleOption } from "./types";

const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

export const Map = forwardRef<MapRef, MapProps>(function MapComponent(
  { children, theme: themeProp, styles, projection, ...props },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<MapLibreGL.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const currentStyleRef = useRef<MapStyleOption | null>(null);
  const styleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);
  const initialPropsRef = useRef(props);
  const resolvedTheme = useResolvedTheme(themeProp);

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles]
  );

  useImperativeHandle(ref, () => mapInstance as MapLibreGL.Map, [mapInstance]);

  const clearStyleTimeout = useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current);
      styleTimeoutRef.current = null;
    }
  }, []);

  // Initialize map instance once
  useEffect(() => {
    if (!containerRef.current || initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    const initialStyle =
      resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
    currentStyleRef.current = initialStyle;

    const map = new MapLibreGL.Map({
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: {
        compact: true,
      },
      ...initialPropsRef.current,
    });

    const loadHandler = () => setIsLoaded(true);
    map.on("load", loadHandler);
    setMapInstance(map);

    return () => {
      clearStyleTimeout();
      map.off("load", loadHandler);
      map.remove();
      setIsLoaded(false);
      setIsStyleLoaded(false);
      setMapInstance(null);
      initializedRef.current = false;
    };
  }, [resolvedTheme, mapStyles, clearStyleTimeout]);

  // Handle style data events separately to avoid stale closures
  useEffect(() => {
    if (!mapInstance) {
      return;
    }

    const styleDataHandler = () => {
      clearStyleTimeout();
      // Delay to ensure style is fully processed before allowing layer operations
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true);
      }, 100);
    };

    mapInstance.on("styledata", styleDataHandler);

    return () => {
      mapInstance.off("styledata", styleDataHandler);
    };
  }, [mapInstance, clearStyleTimeout]);

  // Handle projection changes
  useEffect(() => {
    if (!mapInstance || !isStyleLoaded || !projection) {
      return;
    }
    mapInstance.setProjection(projection);
  }, [mapInstance, isStyleLoaded, projection]);

  // Handle theme/style changes
  useEffect(() => {
    if (!mapInstance || !resolvedTheme) {
      return;
    }

    const newStyle =
      resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;

    if (currentStyleRef.current === newStyle) {
      return;
    }

    clearStyleTimeout();
    currentStyleRef.current = newStyle;
    setIsStyleLoaded(false);

    mapInstance.setStyle(newStyle, { diff: true });
  }, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout]);

  const contextValue = useMemo(
    () => ({
      map: mapInstance,
      isLoaded: isLoaded && isStyleLoaded,
    }),
    [mapInstance, isLoaded, isStyleLoaded]
  );

  return (
    <MapContext.Provider value={contextValue}>
      <div className="relative h-full w-full" ref={containerRef}>
        {!isLoaded && <DefaultLoader />}
        {/* SSR-safe: children render only when map is loaded on client */}
        {mapInstance && children}
      </div>
    </MapContext.Provider>
  );
});
