import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

import {
  MapClusterLayer,
  Map as MapComponent,
  MapControls,
  MapMarker,
  MapPopup,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
} from "./index";

const meta: Meta<typeof MapComponent> = {
  title: "Components/Map",
  component: MapComponent,
  parameters: {
    jest: "Map.test.tsx",
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "500px", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

// São Paulo coordinates
const SAO_PAULO = { lng: -46.6339, lat: -23.5507 };

export const Default = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 12,
  },
  render: (args: typeof MapComponent.arguments) => (
    <MapComponent {...args}>
      <MapControls />
    </MapComponent>
  ),
};

export const WithMarker = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 14,
  },
  render: (args: typeof MapComponent.arguments) => (
    <MapComponent {...args}>
      <MapControls />
      <MapMarker latitude={SAO_PAULO.lat} longitude={SAO_PAULO.lng}>
        <MarkerContent />
      </MapMarker>
    </MapComponent>
  ),
};

export const WithMarkerAndTooltip = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 14,
  },
  render: (args: typeof MapComponent.arguments) => (
    <MapComponent {...args}>
      <MapControls />
      <MapMarker latitude={SAO_PAULO.lat} longitude={SAO_PAULO.lng}>
        <MarkerContent />
        <MarkerTooltip>São Paulo, Brazil</MarkerTooltip>
      </MapMarker>
    </MapComponent>
  ),
};

export const WithMarkerAndPopup = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 14,
  },
  render: (args: typeof MapComponent.arguments) => (
    <MapComponent {...args}>
      <MapControls />
      <MapMarker latitude={SAO_PAULO.lat} longitude={SAO_PAULO.lng}>
        <MarkerContent />
        <MarkerPopup closeButton>
          <div className="space-y-2">
            <h3 className="font-semibold">São Paulo</h3>
            <p className="text-gray-600 text-sm">
              The largest city in the Americas
            </p>
          </div>
        </MarkerPopup>
      </MapMarker>
    </MapComponent>
  ),
};

export const WithMarkerLabel = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 14,
  },
  render: (args: typeof MapComponent.arguments) => (
    <MapComponent {...args}>
      <MapControls />
      <MapMarker latitude={SAO_PAULO.lat} longitude={SAO_PAULO.lng}>
        <MarkerContent>
          <div className="relative h-6 w-6 rounded-full border-2 border-white bg-purple-600 shadow-lg" />
          <MarkerLabel>São Paulo</MarkerLabel>
        </MarkerContent>
      </MapMarker>
    </MapComponent>
  ),
};

export const WithRoute = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 12,
  },
  render: (args: typeof MapComponent.arguments) => {
    const routeCoordinates: [number, number][] = [
      [-46.6339, -23.5507],
      [-46.6539, -23.5607],
      [-46.6639, -23.5507],
      [-46.6539, -23.5407],
    ];

    return (
      <MapComponent {...args}>
        <MapControls />
        <MapRoute color="#7C3AED" coordinates={routeCoordinates} width={4} />
        <MapMarker
          latitude={routeCoordinates[0][1]}
          longitude={routeCoordinates[0][0]}
        >
          <MarkerContent>
            <div className="h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-lg" />
          </MarkerContent>
        </MapMarker>
        <MapMarker
          latitude={routeCoordinates.at(-1)?.[1] ?? 0}
          longitude={routeCoordinates.at(-1)?.[0] ?? 0}
        >
          <MarkerContent>
            <div className="h-4 w-4 rounded-full border-2 border-white bg-red-500 shadow-lg" />
          </MarkerContent>
        </MapMarker>
      </MapComponent>
    );
  },
};

export const WithStandalonePopup = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 14,
  },
  render(args: typeof MapComponent.arguments) {
    const [showPopup, setShowPopup] = useState(true);

    return (
      <MapComponent {...args}>
        <MapControls />
        {showPopup && (
          <MapPopup
            closeButton
            latitude={SAO_PAULO.lat}
            longitude={SAO_PAULO.lng}
            onClose={() => setShowPopup(false)}
          >
            <div className="space-y-2">
              <h3 className="font-semibold">Standalone Popup</h3>
              <p className="text-gray-600 text-sm">
                This popup is not attached to a marker
              </p>
            </div>
          </MapPopup>
        )}
      </MapComponent>
    );
  },
};

export const MultipleMarkers = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 11,
  },
  render: (args: typeof MapComponent.arguments) => {
    const locations = [
      { lng: -46.6339, lat: -23.5507, name: "Paulista" },
      { lng: -46.6558, lat: -23.5613, name: "Pinheiros" },
      { lng: -46.6018, lat: -23.5476, name: "Mooca" },
      { lng: -46.6762, lat: -23.5352, name: "Vila Madalena" },
    ];

    return (
      <MapComponent {...args}>
        <MapControls />
        {locations.map((loc) => (
          <MapMarker key={loc.name} latitude={loc.lat} longitude={loc.lng}>
            <MarkerContent />
            <MarkerTooltip>{loc.name}</MarkerTooltip>
          </MapMarker>
        ))}
      </MapComponent>
    );
  },
};

export const WithClusters = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 10,
  },
  render: (args: typeof MapComponent.arguments) => {
    // Generate random points around São Paulo
    const generatePoints = (): GeoJSON.FeatureCollection<GeoJSON.Point> => {
      const features: GeoJSON.Feature<GeoJSON.Point>[] = [];
      for (let i = 0; i < 100; i++) {
        features.push({
          type: "Feature",
          properties: { id: i, name: `Point ${i}` },
          geometry: {
            type: "Point",
            coordinates: [
              SAO_PAULO.lng + (Math.random() - 0.5) * 0.5,
              SAO_PAULO.lat + (Math.random() - 0.5) * 0.5,
            ],
          },
        });
      }
      return { type: "FeatureCollection", features };
    };

    return (
      <MapComponent {...args}>
        <MapControls />
        <MapClusterLayer
          clusterColors={["#7C3AED", "#A855F7", "#C084FC"]}
          clusterThresholds={[10, 50]}
          data={generatePoints()}
          pointColor="#7C3AED"
        />
      </MapComponent>
    );
  },
};

export const WithAllControls = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 12,
  },
  render: (args: typeof MapComponent.arguments) => (
    <MapComponent {...args}>
      <MapControls showCompass showFullscreen showLocate showZoom />
    </MapComponent>
  ),
};

export const DraggableMarker = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 14,
  },
  render(args: typeof MapComponent.arguments) {
    const [position, setPosition] = useState({
      lng: SAO_PAULO.lng,
      lat: SAO_PAULO.lat,
    });

    return (
      <MapComponent {...args}>
        <MapControls />
        <MapMarker
          draggable
          latitude={position.lat}
          longitude={position.lng}
          onDragEnd={(lngLat) => {
            setPosition(lngLat);
          }}
        >
          <MarkerContent>
            <div className="h-6 w-6 cursor-move rounded-full border-2 border-white bg-orange-500 shadow-lg" />
          </MarkerContent>
          <MarkerTooltip>Drag me!</MarkerTooltip>
        </MapMarker>
        <div className="absolute bottom-4 left-4 z-10 rounded bg-white p-2 text-xs shadow">
          Position: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </div>
      </MapComponent>
    );
  },
};

export const DarkTheme = {
  args: {
    center: [SAO_PAULO.lng, SAO_PAULO.lat],
    zoom: 12,
    theme: "dark",
  },
  render: (args: typeof MapComponent.arguments) => (
    <MapComponent {...args}>
      <MapControls />
      <MapMarker latitude={SAO_PAULO.lat} longitude={SAO_PAULO.lng}>
        <MarkerContent />
        <MarkerTooltip>São Paulo</MarkerTooltip>
      </MapMarker>
    </MapComponent>
  ),
};
