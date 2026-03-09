"use client";

import type MapLibreGL from "maplibre-gl";
import { useEffect, useId, useRef } from "react";

import { useMap } from "./hooks";
import type { MapClusterLayerProps } from "./types";

export function MapClusterLayer<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({
  data,
  clusterMaxZoom = 14,
  clusterRadius = 50,
  clusterColors = ["#51bbd6", "#f1f075", "#f28cb1"],
  clusterThresholds = [100, 750],
  pointColor = "#3b82f6",
  onPointClick,
  onClusterClick,
}: MapClusterLayerProps<P>) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `cluster-source-${id}`;
  const clusterLayerId = `clusters-${id}`;
  const clusterCountLayerId = `cluster-count-${id}`;
  const unclusteredLayerId = `unclustered-point-${id}`;

  const sourceCreatedRef = useRef(false);
  const pulseAnimationRef = useRef<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: source and layers are created once; data updates flow through setData effect
  useEffect(() => {
    if (!isLoaded || !map) {
      return;
    }

    // Guard against re-creating source/layers
    if (map.getSource(sourceId)) {
      sourceCreatedRef.current = true;
      return;
    }

    // Add clustered GeoJSON source
    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      } as GeoJSON.FeatureCollection,
      cluster: true,
      clusterMaxZoom,
      clusterRadius,
      promoteId: "id",
    });

    // Add cluster circles layer
    if (!map.getLayer(clusterLayerId)) {
      map.addLayer({
        id: clusterLayerId,
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            clusterColors[0],
            clusterThresholds[0],
            clusterColors[1],
            clusterThresholds[1],
            clusterColors[2],
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            clusterThresholds[0],
            30,
            clusterThresholds[1],
            40,
          ],
          "circle-opacity": 0.8,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    // Add cluster count text layer
    if (!map.getLayer(clusterCountLayerId)) {
      map.addLayer({
        id: clusterCountLayerId,
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
        paint: {
          "text-color": "#fff",
        },
      });
    }

    // Add unclustered point outer glow layer (pulsing halo)
    const outerGlowLayerId = `${unclusteredLayerId}-glow`;
    if (!map.getLayer(outerGlowLayerId)) {
      map.addLayer({
        id: outerGlowLayerId,
        type: "circle",
        source: sourceId,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": pointColor,
          "circle-radius": 15,
          "circle-opacity": 0.3,
        },
      });
    }

    // Add unclustered point layer (main marker with white border)
    if (!map.getLayer(unclusteredLayerId)) {
      map.addLayer({
        id: unclusteredLayerId,
        type: "circle",
        source: sourceId,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": pointColor,
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    sourceCreatedRef.current = true;

    return () => {
      try {
        if (map.getLayer(clusterCountLayerId)) {
          map.removeLayer(clusterCountLayerId);
        }
        if (map.getLayer(unclusteredLayerId)) {
          map.removeLayer(unclusteredLayerId);
        }
        const outerGlowLayerId = `${unclusteredLayerId}-glow`;
        if (map.getLayer(outerGlowLayerId)) {
          map.removeLayer(outerGlowLayerId);
        }
        if (map.getLayer(clusterLayerId)) {
          map.removeLayer(clusterLayerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
        sourceCreatedRef.current = false;
      } catch {
        // ignore cleanup errors
      }
    };
  }, [
    isLoaded,
    map,
    sourceId,
    clusterLayerId,
    clusterCountLayerId,
    unclusteredLayerId,
  ]);

  // Update source data when data prop changes (only for non-URL data)
  useEffect(() => {
    if (
      !isLoaded ||
      !map ||
      typeof data === "string" ||
      !sourceCreatedRef.current
    ) {
      return;
    }

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
    if (source) {
      source.setData(data);
    }
  }, [isLoaded, map, data, sourceId]);

  // Update layer styles when props change
  useEffect(() => {
    if (!isLoaded || !map || !sourceCreatedRef.current) {
      return;
    }

    // Update cluster layer colors and sizes
    if (map.getLayer(clusterLayerId)) {
      map.setPaintProperty(clusterLayerId, "circle-color", [
        "step",
        ["get", "point_count"],
        clusterColors[0],
        clusterThresholds[0],
        clusterColors[1],
        clusterThresholds[1],
        clusterColors[2],
      ]);
      map.setPaintProperty(clusterLayerId, "circle-radius", [
        "step",
        ["get", "point_count"],
        20,
        clusterThresholds[0],
        30,
        clusterThresholds[1],
        40,
      ]);
    }

    // Update unclustered point layer color
    if (map.getLayer(unclusteredLayerId)) {
      map.setPaintProperty(unclusteredLayerId, "circle-color", pointColor);
    }

    // Update outer glow layer color
    const outerGlowLayerId = `${unclusteredLayerId}-glow`;
    if (map.getLayer(outerGlowLayerId)) {
      map.setPaintProperty(outerGlowLayerId, "circle-color", pointColor);
    }
  }, [
    isLoaded,
    map,
    clusterLayerId,
    unclusteredLayerId,
    clusterColors,
    clusterThresholds,
    pointColor,
  ]);

  // Pulse animation for outer glow layer
  useEffect(() => {
    if (!isLoaded || !map || !sourceCreatedRef.current) {
      return;
    }

    const outerGlowLayerId = `${unclusteredLayerId}-glow`;
    if (!map.getLayer(outerGlowLayerId)) {
      return;
    }

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds per pulse cycle

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;

      // Sine wave for smooth pulse
      const pulse = Math.sin(progress * Math.PI * 2);

      // Opacity: oscillate between 0.15 and 0.4 (clamped for safety)
      const opacity = Math.max(0.15, Math.min(0.4, 0.275 + 0.125 * pulse));

      // Radius: oscillate between 12 and 15 (clamped for safety)
      const radius = Math.max(12, Math.min(15, 13.5 + 1.5 * pulse));

      if (map.getLayer(outerGlowLayerId)) {
        map.setPaintProperty(outerGlowLayerId, "circle-opacity", opacity);
        map.setPaintProperty(outerGlowLayerId, "circle-radius", radius);
      }

      pulseAnimationRef.current = requestAnimationFrame(animate);
    };

    pulseAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (pulseAnimationRef.current !== null) {
        cancelAnimationFrame(pulseAnimationRef.current);
        pulseAnimationRef.current = null;
      }
    };
  }, [isLoaded, map, unclusteredLayerId]);

  // Handle click events
  useEffect(() => {
    if (!isLoaded || !map) {
      return;
    }

    // Cluster click handler - zoom into cluster
    const handleClusterClick = async (
      e: MapLibreGL.MapMouseEvent & {
        features?: MapLibreGL.MapGeoJSONFeature[];
      }
    ) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayerId],
      });
      if (!features.length) {
        return;
      }

      // Stop propagation to prevent map click handlers from firing
      e.originalEvent.stopPropagation();

      const feature = features[0];
      const clusterId = feature.properties?.cluster_id as number;
      const pointCount = feature.properties?.point_count as number;
      const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];

      if (onClusterClick) {
        onClusterClick(clusterId, coordinates, pointCount);
      } else {
        // Default behavior: zoom to cluster expansion zoom
        const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({
          center: coordinates,
          zoom,
        });
      }
    };

    // Unclustered point click handler
    const handlePointClick = (
      e: MapLibreGL.MapMouseEvent & {
        features?: MapLibreGL.MapGeoJSONFeature[];
      }
    ) => {
      if (!onPointClick || !e.features?.length) {
        return;
      }

      // Stop propagation to prevent map click handlers from firing
      e.originalEvent.stopPropagation();

      const feature = e.features[0];
      const coordinates = (
        feature.geometry as GeoJSON.Point
      ).coordinates.slice() as [number, number];

      // Handle world copies
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      onPointClick(
        feature as unknown as GeoJSON.Feature<GeoJSON.Point, P>,
        coordinates
      );
    };

    // Cursor style handlers
    const handleMouseEnterCluster = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeaveCluster = () => {
      map.getCanvas().style.cursor = "";
    };
    const handleMouseEnterPoint = () => {
      if (onPointClick) {
        map.getCanvas().style.cursor = "pointer";
      }
    };
    const handleMouseLeavePoint = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", clusterLayerId, handleClusterClick);
    map.on("click", unclusteredLayerId, handlePointClick);
    map.on("mouseenter", clusterLayerId, handleMouseEnterCluster);
    map.on("mouseleave", clusterLayerId, handleMouseLeaveCluster);
    map.on("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
    map.on("mouseleave", unclusteredLayerId, handleMouseLeavePoint);

    return () => {
      map.off("click", clusterLayerId, handleClusterClick);
      map.off("click", unclusteredLayerId, handlePointClick);
      map.off("mouseenter", clusterLayerId, handleMouseEnterCluster);
      map.off("mouseleave", clusterLayerId, handleMouseLeaveCluster);
      map.off("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
      map.off("mouseleave", unclusteredLayerId, handleMouseLeavePoint);
    };
  }, [
    isLoaded,
    map,
    clusterLayerId,
    unclusteredLayerId,
    sourceId,
    onClusterClick,
    onPointClick,
  ]);

  return null;
}
