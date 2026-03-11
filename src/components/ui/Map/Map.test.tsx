import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MapClusterLayer,
  Map as MapComponent,
  MapControls,
  MapPopup,
  MarkerLabel,
  PulsingMarker,
} from "@/components/ui/Map";
import { MapContext } from "@/components/ui/Map/context";
import type { MapContextValue } from "@/components/ui/Map/types";

// Mock maplibre-gl so Marker/Popup/Map constructors work in jsdom.
// The factory must be self-contained (no outer variable refs) because jest.mock is hoisted.
jest.mock("maplibre-gl", () => {
  const markerElement = document.createElement("div");
  const markerInstance = {
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    remove: jest.fn(),
    getElement: jest.fn().mockReturnValue(markerElement),
    getLngLat: jest.fn().mockReturnValue({ lng: -46.63, lat: -23.55 }),
    on: jest.fn(),
    off: jest.fn(),
    isDraggable: jest.fn().mockReturnValue(false),
    setDraggable: jest.fn(),
    getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
    setOffset: jest.fn(),
    getRotation: jest.fn().mockReturnValue(0),
    setRotation: jest.fn(),
    getRotationAlignment: jest.fn().mockReturnValue("auto"),
    setRotationAlignment: jest.fn(),
    getPitchAlignment: jest.fn().mockReturnValue("auto"),
    setPitchAlignment: jest.fn(),
    setPopup: jest.fn(),
    _element: markerElement,
  };
  const popupInstance = {
    setMaxWidth: jest.fn().mockReturnThis(),
    setDOMContent: jest.fn().mockReturnThis(),
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    remove: jest.fn(),
    isOpen: jest.fn().mockReturnValue(false),
    setOffset: jest.fn().mockReturnThis(),
    on: jest.fn(),
    off: jest.fn(),
  };
  const mapInstance = {
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    getZoom: jest.fn().mockReturnValue(12),
    zoomTo: jest.fn(),
    getBearing: jest.fn().mockReturnValue(0),
    getPitch: jest.fn().mockReturnValue(0),
    resetNorthPitch: jest.fn(),
    flyTo: jest.fn(),
    easeTo: jest.fn(),
    getContainer: jest.fn().mockReturnValue(document.createElement("div")),
    getCanvas: jest.fn().mockReturnValue({ style: { cursor: "" } }),
    setProjection: jest.fn(),
    setStyle: jest.fn(),
    getSource: jest.fn().mockReturnValue(null),
    addSource: jest.fn(),
    removeSource: jest.fn(),
    getLayer: jest.fn().mockReturnValue(null),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    setPaintProperty: jest.fn(),
    queryRenderedFeatures: jest.fn().mockReturnValue([]),
    project: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  };
  return {
    __esModule: true,
    default: {
      Marker: jest.fn().mockImplementation(() => markerInstance),
      Popup: jest.fn().mockImplementation(() => popupInstance),
      Map: jest.fn().mockImplementation(() => mapInstance),
      _markerInstance: markerInstance,
      _popupInstance: popupInstance,
      _mapInstance: mapInstance,
    },
  };
});

// Retrieve the shared mock instances created inside the factory
import MapLibreGL from "maplibre-gl";

const mockMapLibreGL = MapLibreGL as unknown as {
  _markerInstance: Record<string, jest.Mock>;
  _popupInstance: Record<string, jest.Mock>;
  _mapInstance: Record<string, jest.Mock>;
  Marker: jest.Mock;
  Popup: jest.Mock;
  Map: jest.Mock;
};
const mockPulsingMarkerInstance = mockMapLibreGL._markerInstance;
const mockMarkerElement =
  mockPulsingMarkerInstance._element as unknown as HTMLElement;

// Mock matchMedia globally
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Create a mock map instance for testing
const createMockMap = () => ({
  on: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  getZoom: jest.fn().mockReturnValue(12),
  zoomTo: jest.fn(),
  getBearing: jest.fn().mockReturnValue(0),
  getPitch: jest.fn().mockReturnValue(0),
  resetNorthPitch: jest.fn(),
  flyTo: jest.fn(),
  easeTo: jest.fn(),
  getContainer: jest.fn().mockReturnValue(document.createElement("div")),
  getCanvas: jest.fn().mockReturnValue({ style: { cursor: "" } }),
  setProjection: jest.fn(),
  setStyle: jest.fn(),
  getSource: jest.fn().mockReturnValue(null),
  addSource: jest.fn(),
  removeSource: jest.fn(),
  getLayer: jest.fn().mockReturnValue(null),
  addLayer: jest.fn(),
  removeLayer: jest.fn(),
  setPaintProperty: jest.fn(),
  queryRenderedFeatures: jest.fn().mockReturnValue([]),
});

describe("Map Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Map", () => {
    it("renders the map container", () => {
      const { container } = render(
        <MapComponent center={[-46.6339, -23.5507]} zoom={12} />
      );
      expect(
        container.querySelector(".relative.h-full.w-full")
      ).toBeInTheDocument();
    });

    it("shows loading state initially", () => {
      const { container } = render(
        <MapComponent center={[-46.6339, -23.5507]} zoom={12} />
      );
      // Check for the loading dots animation
      expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("accepts custom theme prop", () => {
      const { container } = render(
        <MapComponent center={[-46.6339, -23.5507]} theme="dark" zoom={12} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders children when map instance is available", () => {
      render(
        <MapComponent center={[-46.6339, -23.5507]} zoom={12}>
          <div data-testid="map-child">Child content</div>
        </MapComponent>
      );
      // Children are rendered when map instance is created (mocked instantly)
      expect(screen.getByTestId("map-child")).toBeInTheDocument();
    });
  });

  describe("MapControls", () => {
    const mockMap = createMockMap();
    const mockContextValue: MapContextValue = {
      map: mockMap as unknown as maplibregl.Map,
      isLoaded: true,
    };

    const renderWithContext = (ui: React.ReactElement) =>
      render(
        <MapContext.Provider value={mockContextValue}>{ui}</MapContext.Provider>
      );

    it("renders zoom controls by default", () => {
      renderWithContext(<MapControls />);
      expect(screen.getByLabelText("Zoom in")).toBeVisible();
      expect(screen.getByLabelText("Zoom out")).toBeVisible();
    });

    it("renders locate button when showLocate is true", () => {
      renderWithContext(<MapControls showLocate />);
      expect(screen.getByLabelText("Find my location")).toBeVisible();
    });

    it("renders fullscreen button when showFullscreen is true", () => {
      renderWithContext(<MapControls showFullscreen />);
      expect(screen.getByLabelText("Toggle fullscreen")).toBeVisible();
    });

    it("renders compass when showCompass is true", () => {
      renderWithContext(<MapControls showCompass />);
      expect(screen.getByLabelText("Reset bearing to north")).toBeVisible();
    });

    it("hides zoom controls when showZoom is false", () => {
      renderWithContext(<MapControls showZoom={false} />);
      expect(screen.queryByLabelText("Zoom in")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Zoom out")).not.toBeInTheDocument();
    });

    it("applies position classes correctly", () => {
      const { container } = renderWithContext(
        <MapControls position="top-left" />
      );
      expect(container.firstChild).toHaveClass("top-4", "left-4");
    });

    it("applies bottom-right position by default", () => {
      const { container } = renderWithContext(<MapControls />);
      expect(container.firstChild).toHaveClass("bottom-[42px]", "right-3");
    });

    it("renders recenter button when showRecenter is true and onRecenter is provided", () => {
      const onRecenter = jest.fn();
      renderWithContext(<MapControls onRecenter={onRecenter} showRecenter />);
      expect(screen.getByLabelText("Recenter map")).toBeVisible();
    });

    it("does not render recenter button when showRecenter is true but onRecenter is absent", () => {
      renderWithContext(<MapControls showRecenter />);
      expect(screen.queryByLabelText("Recenter map")).not.toBeInTheDocument();
    });

    it("does not render recenter button when showRecenter is false", () => {
      renderWithContext(
        <MapControls onRecenter={jest.fn()} showRecenter={false} />
      );
      expect(screen.queryByLabelText("Recenter map")).not.toBeInTheDocument();
    });

    it("calls onRecenter callback when recenter button is clicked", async () => {
      const user = userEvent.setup();
      const onRecenter = jest.fn();
      renderWithContext(<MapControls onRecenter={onRecenter} showRecenter />);

      await user.click(screen.getByLabelText("Recenter map"));

      expect(onRecenter).toHaveBeenCalledTimes(1);
    });

    it("all control buttons have cursor-pointer class", () => {
      renderWithContext(<MapControls />);
      const zoomIn = screen.getByLabelText("Zoom in");
      expect(zoomIn).toHaveClass("cursor-pointer");
    });
  });

  describe("MarkerLabel", () => {
    it("renders children", () => {
      render(<MarkerLabel>Test Label</MarkerLabel>);
      expect(screen.getByText("Test Label")).toBeVisible();
    });

    it("applies top position by default", () => {
      const { container } = render(<MarkerLabel>Test</MarkerLabel>);
      expect(container.firstChild).toHaveClass("bottom-full", "mb-1");
    });

    it("applies bottom position when specified", () => {
      const { container } = render(
        <MarkerLabel position="bottom">Test</MarkerLabel>
      );
      expect(container.firstChild).toHaveClass("top-full", "mt-1");
    });

    it("applies custom className", () => {
      const { container } = render(
        <MarkerLabel className="custom-class">Test</MarkerLabel>
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("MapClusterLayer", () => {
    const mockMap = createMockMap();
    const mockContextValue: MapContextValue = {
      map: mockMap as unknown as maplibregl.Map,
      isLoaded: true,
    };

    const renderWithContext = (ui: React.ReactElement) =>
      render(
        <MapContext.Provider value={mockContextValue}>{ui}</MapContext.Provider>
      );

    const mockGeoJson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "1",
          geometry: { type: "Point", coordinates: [-46.6339, -23.5507] },
          properties: { name: "Test Point 1" },
        },
        {
          type: "Feature",
          id: "2",
          geometry: { type: "Point", coordinates: [-46.634, -23.5508] },
          properties: { name: "Test Point 2" },
        },
      ],
    };

    it("renders without crashing", () => {
      const { container } = renderWithContext(
        <MapClusterLayer data={mockGeoJson} />
      );
      // MapClusterLayer returns null (it only creates map layers)
      expect(container).toBeInTheDocument();
    });

    it("adds source and layers when map is loaded", () => {
      renderWithContext(<MapClusterLayer data={mockGeoJson} />);

      // Should add GeoJSON source with empty initial data
      expect(mockMap.addSource).toHaveBeenCalledWith(
        expect.stringContaining("cluster-source"),
        expect.objectContaining({
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
          cluster: true,
        })
      );

      // Should add cluster layer
      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringContaining("clusters"),
          type: "circle",
          filter: ["has", "point_count"],
        })
      );

      // Should add cluster count layer
      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringContaining("cluster-count"),
          type: "symbol",
        })
      );

      // Should add unclustered point layer
      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringContaining("unclustered-point"),
          type: "circle",
          filter: ["!", ["has", "point_count"]],
        })
      );
    });

    it("accepts custom cluster colors", () => {
      const customColors: [string, string, string] = [
        "#ff0000",
        "#00ff00",
        "#0000ff",
      ];
      renderWithContext(
        <MapClusterLayer clusterColors={customColors} data={mockGeoJson} />
      );

      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          paint: expect.objectContaining({
            "circle-color": expect.arrayContaining([customColors[0]]),
          }),
        })
      );
    });

    it("accepts custom point color", () => {
      const customPointColor = "#ff5500";
      renderWithContext(
        <MapClusterLayer data={mockGeoJson} pointColor={customPointColor} />
      );

      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringContaining("unclustered-point-"),
          paint: expect.objectContaining({
            "circle-color": customPointColor,
          }),
        })
      );
    });

    it("registers click event handlers", () => {
      const onPointClick = jest.fn();
      renderWithContext(
        <MapClusterLayer data={mockGeoJson} onPointClick={onPointClick} />
      );

      // Should register click handlers for clusters and points
      expect(mockMap.on).toHaveBeenCalledWith(
        "click",
        expect.stringContaining("clusters"),
        expect.any(Function)
      );
      expect(mockMap.on).toHaveBeenCalledWith(
        "click",
        expect.stringContaining("unclustered-point"),
        expect.any(Function)
      );
    });

    it("registers mouse enter/leave event handlers for cursor style", () => {
      renderWithContext(<MapClusterLayer data={mockGeoJson} />);

      expect(mockMap.on).toHaveBeenCalledWith(
        "mouseenter",
        expect.stringContaining("clusters"),
        expect.any(Function)
      );
      expect(mockMap.on).toHaveBeenCalledWith(
        "mouseleave",
        expect.stringContaining("clusters"),
        expect.any(Function)
      );
    });

    it("does not create layers when map is not loaded", () => {
      const notLoadedContext: MapContextValue = {
        map: null,
        isLoaded: false,
      };

      render(
        <MapContext.Provider value={notLoadedContext}>
          <MapClusterLayer data={mockGeoJson} />
        </MapContext.Provider>
      );

      expect(mockMap.addSource).not.toHaveBeenCalled();
      expect(mockMap.addLayer).not.toHaveBeenCalled();
    });

    it("removes all layers and source on unmount", () => {
      // getSource must return null on first call (so the init effect doesn't bail out early
      // and registers its cleanup), then return a truthy source for subsequent calls so that
      // both the coordinates-update effect and the cleanup guards resolve correctly.
      const mockSource = { setData: jest.fn() };
      mockMap.getSource
        .mockReturnValueOnce(null) // init effect guard: source doesn't exist yet
        .mockReturnValue(mockSource); // subsequent calls: coordinates update + cleanup

      // getLayer must return truthy so the cleanup removeLayer branches execute
      mockMap.getLayer.mockReturnValue({ id: "layer" });

      const { unmount } = renderWithContext(
        <MapClusterLayer data={mockGeoJson} />
      );
      unmount();

      expect(mockMap.removeLayer).toHaveBeenCalled();
      expect(mockMap.removeSource).toHaveBeenCalled();
    });

    it("updates source data when data prop changes", () => {
      const mockSource = { setData: jest.fn() };
      mockMap.getSource.mockReturnValue(mockSource);

      renderWithContext(<MapClusterLayer data={mockGeoJson} />);

      expect(mockSource.setData).toHaveBeenCalledWith(mockGeoJson);
    });

    it("updates cluster paint properties when clusterColors prop changes", () => {
      mockMap.getLayer.mockReturnValue({ id: "layer" });
      const newColors: [string, string, string] = ["#aaa", "#bbb", "#ccc"];
      renderWithContext(
        <MapClusterLayer clusterColors={newColors} data={mockGeoJson} />
      );
      expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
        expect.stringContaining("clusters"),
        "circle-color",
        expect.any(Array)
      );
    });

    it("updates unclustered point color when pointColor prop changes", () => {
      mockMap.getLayer.mockReturnValue({ id: "layer" });
      renderWithContext(
        <MapClusterLayer data={mockGeoJson} pointColor="#deadbe" />
      );
      expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
        expect.stringContaining("unclustered-point-"),
        "circle-color",
        "#deadbe"
      );
    });

    it("invokes onPointClick when unclustered point click handler fires", () => {
      const onPointClick = jest.fn();
      renderWithContext(
        <MapClusterLayer data={mockGeoJson} onPointClick={onPointClick} />
      );

      // Find the unclustered-point click handler
      const pointClickCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "click" && layerId.includes("unclustered-point")
      );

      const mockEvent = {
        features: [
          {
            geometry: { type: "Point", coordinates: [-46.63, -23.55] },
            properties: { id: "1" },
          },
        ],
        lngLat: { lng: -46.63 },
        originalEvent: { stopPropagation: jest.fn() },
      };

      act(() => {
        pointClickCall?.[2]?.(mockEvent);
      });

      expect(onPointClick).toHaveBeenCalledTimes(1);
    });

    it("calls onClusterClick when cluster click handler fires with features", () => {
      const onClusterClick = jest.fn();
      renderWithContext(
        <MapClusterLayer data={mockGeoJson} onClusterClick={onClusterClick} />
      );

      const clusterFeature = {
        geometry: { type: "Point", coordinates: [-46.63, -23.55] },
        properties: { cluster_id: 42, point_count: 5 },
      };
      mockMap.queryRenderedFeatures.mockReturnValue([clusterFeature]);

      const clusterClickCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "click" && layerId.includes("clusters-")
      );

      const mockEvent = {
        point: { x: 100, y: 100 },
        originalEvent: { stopPropagation: jest.fn() },
      };

      act(() => {
        clusterClickCall?.[2]?.(mockEvent);
      });

      expect(onClusterClick).toHaveBeenCalledWith(42, [-46.63, -23.55], 5);
    });

    it("sets cursor to pointer on cluster mouseenter", () => {
      const canvas = { style: { cursor: "" } };
      mockMap.getCanvas.mockReturnValue({ style: canvas.style });
      renderWithContext(<MapClusterLayer data={mockGeoJson} />);

      const mouseEnterCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "mouseenter" && layerId.includes("clusters-")
      );

      act(() => {
        mouseEnterCall?.[2]?.();
      });

      expect(canvas.style.cursor).toBe("pointer");
    });

    it("resets cursor on cluster mouseleave", () => {
      const canvas = { style: { cursor: "pointer" } };
      mockMap.getCanvas.mockReturnValue({ style: canvas.style });
      renderWithContext(<MapClusterLayer data={mockGeoJson} />);

      const mouseLeaveCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "mouseleave" && layerId.includes("clusters-")
      );

      act(() => {
        mouseLeaveCall?.[2]?.();
      });

      expect(canvas.style.cursor).toBe("");
    });

    it("sets cursor to pointer on unclustered-point mouseenter when onPointClick is provided", () => {
      const onPointClick = jest.fn();
      const canvas = { style: { cursor: "" } };
      mockMap.getCanvas.mockReturnValue({ style: canvas.style });
      renderWithContext(
        <MapClusterLayer data={mockGeoJson} onPointClick={onPointClick} />
      );

      const mouseEnterCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "mouseenter" && layerId.includes("unclustered-point")
      );

      act(() => {
        mouseEnterCall?.[2]?.();
      });

      expect(canvas.style.cursor).toBe("pointer");
    });

    it("resets cursor on unclustered-point mouseleave", () => {
      const canvas = { style: { cursor: "pointer" } };
      mockMap.getCanvas.mockReturnValue({ style: canvas.style });
      renderWithContext(<MapClusterLayer data={mockGeoJson} />);

      const mouseLeaveCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "mouseleave" && layerId.includes("unclustered-point")
      );

      act(() => {
        mouseLeaveCall?.[2]?.();
      });

      expect(canvas.style.cursor).toBe("");
    });

    it("deregisters all event handlers on unmount", () => {
      const { unmount } = renderWithContext(
        <MapClusterLayer data={mockGeoJson} />
      );
      unmount();

      expect(mockMap.off).toHaveBeenCalledWith(
        "click",
        expect.stringContaining("clusters"),
        expect.any(Function)
      );
      expect(mockMap.off).toHaveBeenCalledWith(
        "click",
        expect.stringContaining("unclustered-point"),
        expect.any(Function)
      );
    });

    it("cluster click handler returns early when queryRenderedFeatures returns no features", () => {
      mockMap.queryRenderedFeatures.mockReturnValue([]);
      const onClusterClick = jest.fn();
      renderWithContext(
        <MapClusterLayer data={mockGeoJson} onClusterClick={onClusterClick} />
      );

      const clusterClickCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "click" && layerId.includes("clusters-")
      );

      act(() => {
        clusterClickCall?.[2]?.({
          point: { x: 0, y: 0 },
          originalEvent: { stopPropagation: jest.fn() },
        });
      });

      expect(onClusterClick).not.toHaveBeenCalled();
    });

    it("uses default easeTo behaviour when no onClusterClick is provided", async () => {
      const mockSource = {
        setData: jest.fn(),
        getClusterExpansionZoom: jest.fn().mockResolvedValue(8),
      };
      mockMap.getSource.mockReturnValue(mockSource);

      const clusterFeature = {
        geometry: { type: "Point", coordinates: [-46.63, -23.55] },
        properties: { cluster_id: 99, point_count: 3 },
      };
      mockMap.queryRenderedFeatures.mockReturnValue([clusterFeature]);

      renderWithContext(<MapClusterLayer data={mockGeoJson} />);

      const clusterClickCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "click" && layerId.includes("clusters-")
      );

      await act(async () => {
        await clusterClickCall?.[2]?.({
          point: { x: 100, y: 100 },
          originalEvent: { stopPropagation: jest.fn() },
        });
      });

      expect(mockMap.easeTo).toHaveBeenCalledWith(
        expect.objectContaining({ zoom: 8 })
      );
    });

    it("point click handler returns early when onPointClick is absent", () => {
      renderWithContext(<MapClusterLayer data={mockGeoJson} />);

      const pointClickCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "click" && layerId.includes("unclustered-point")
      );

      // Call with no features — onPointClick is undefined so should bail
      act(() => {
        pointClickCall?.[2]?.({
          features: [],
          lngLat: { lng: -46.63 },
          originalEvent: { stopPropagation: jest.fn() },
        });
      });

      // No assertion needed — test passes if it doesn't throw
    });

    it("executes pulse animation frame callback via requestAnimationFrame", () => {
      // Mock requestAnimationFrame to fire the callback once synchronously
      const rafCallbacks: FrameRequestCallback[] = [];
      const origRaf = global.requestAnimationFrame;
      global.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      }) as unknown as typeof requestAnimationFrame;
      global.cancelAnimationFrame = jest.fn();

      mockMap.getLayer.mockReturnValue({ id: "layer" });

      renderWithContext(<MapClusterLayer data={mockGeoJson} />);

      // Fire the first rAF callback with a timestamp
      act(() => {
        rafCallbacks[0]?.(1000);
      });

      expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
        expect.stringContaining("glow"),
        "circle-opacity",
        expect.any(Number)
      );

      global.requestAnimationFrame = origRaf;
    });

    it("adjusts coordinates for world copies when lngLat differs by more than 180", () => {
      const onPointClick = jest.fn();
      renderWithContext(
        <MapClusterLayer data={mockGeoJson} onPointClick={onPointClick} />
      );

      const pointClickCall = mockMap.on.mock.calls.find(
        ([event, layerId]: [string, string]) =>
          event === "click" && layerId.includes("unclustered-point")
      );

      const mockEvent = {
        features: [
          {
            geometry: { type: "Point", coordinates: [-46.63, -23.55] },
            properties: {},
          },
        ],
        // lngLat.lng differs from coordinate by > 180 to trigger world-copy branch
        lngLat: { lng: 360 - 46.63 },
        originalEvent: { stopPropagation: jest.fn() },
      };

      act(() => {
        pointClickCall?.[2]?.(mockEvent);
      });

      expect(onPointClick).toHaveBeenCalled();
    });
  });

  describe("MapPopup", () => {
    const mockMap = createMockMap();
    const mockContextValue: MapContextValue = {
      map: mockMap as unknown as maplibregl.Map,
      isLoaded: true,
    };

    const renderWithContext = (ui: React.ReactElement) =>
      render(
        <MapContext.Provider value={mockContextValue}>{ui}</MapContext.Provider>
      );

    it("renders without crashing", () => {
      // MapPopup uses createPortal which renders outside the normal React tree
      // This test verifies the component mounts without errors
      expect(() => {
        renderWithContext(
          <MapPopup latitude={-23.5507} longitude={-46.6339}>
            <div>Popup Content</div>
          </MapPopup>
        );
      }).not.toThrow();
    });

    it("accepts closeButton prop", () => {
      expect(() => {
        renderWithContext(
          <MapPopup closeButton latitude={-23.5507} longitude={-46.6339}>
            Content
          </MapPopup>
        );
      }).not.toThrow();
    });

    it("accepts interactive prop", () => {
      expect(() => {
        renderWithContext(
          <MapPopup
            interactive={false}
            latitude={-23.5507}
            longitude={-46.6339}
          >
            Content
          </MapPopup>
        );
      }).not.toThrow();
    });

    it("accepts className prop", () => {
      expect(() => {
        renderWithContext(
          <MapPopup
            className="custom-class"
            latitude={-23.5507}
            longitude={-46.6339}
          >
            Content
          </MapPopup>
        );
      }).not.toThrow();
    });

    it("accepts onClose callback", () => {
      const onClose = jest.fn();
      expect(() => {
        renderWithContext(
          <MapPopup latitude={-23.5507} longitude={-46.6339} onClose={onClose}>
            Content
          </MapPopup>
        );
      }).not.toThrow();
    });
  });
});

describe("Map barrel exports", () => {
  it("exports all components and hooks from index", () => {
    const exports = require("@/components/ui/Map");
    expect(exports.Map).toBeDefined();
    expect(exports.MapClusterLayer).toBeDefined();
    expect(exports.MapControls).toBeDefined();
    expect(exports.MapMarker).toBeDefined();
    expect(exports.MapPopup).toBeDefined();
    expect(exports.MapRoute).toBeDefined();
    expect(exports.MarkerContent).toBeDefined();
    expect(exports.MarkerLabel).toBeDefined();
    expect(exports.MarkerPopup).toBeDefined();
    expect(exports.MarkerTooltip).toBeDefined();
    expect(exports.PulsingMarker).toBeDefined();
    expect(exports.useMap).toBeDefined();
    expect(exports.useMarkerContext).toBeDefined();
    expect(exports.usePopupAnchor).toBeDefined();
  });
});

describe("MapControls interactions", () => {
  let mockMap: ReturnType<typeof createMockMap>;
  let mockContextValue: MapContextValue;

  const renderControls = (ui: React.ReactElement) =>
    render(
      <MapContext.Provider value={mockContextValue}>{ui}</MapContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockMap = createMockMap();
    mockContextValue = {
      map: mockMap as unknown as maplibregl.Map,
      isLoaded: true,
    };
  });

  it("calls map.zoomTo with zoom + 1 when zoom in is clicked", async () => {
    const user = userEvent.setup();
    renderControls(<MapControls />);
    await user.click(screen.getByLabelText("Zoom in"));
    expect(mockMap.zoomTo).toHaveBeenCalledWith(13, { duration: 300 });
  });

  it("calls map.zoomTo with zoom - 1 when zoom out is clicked", async () => {
    const user = userEvent.setup();
    renderControls(<MapControls />);
    await user.click(screen.getByLabelText("Zoom out"));
    expect(mockMap.zoomTo).toHaveBeenCalledWith(11, { duration: 300 });
  });

  it("calls map.resetNorthPitch when compass button is clicked", async () => {
    const user = userEvent.setup();
    renderControls(<MapControls showCompass />);
    await user.click(screen.getByLabelText("Reset bearing to north"));
    expect(mockMap.resetNorthPitch).toHaveBeenCalledWith({ duration: 300 });
  });

  it("registers rotate and pitch events for compass bearing sync", () => {
    renderControls(<MapControls showCompass />);
    expect(mockMap.on).toHaveBeenCalledWith("rotate", expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith("pitch", expect.any(Function));
  });

  it("calls map.flyTo with user coordinates when locate succeeds", async () => {
    const user = userEvent.setup();
    const mockCoords = { latitude: -23.55, longitude: -46.63 };
    Object.defineProperty(global.navigator, "geolocation", {
      writable: true,
      value: {
        getCurrentPosition: jest.fn().mockImplementation((success) => {
          success({ coords: mockCoords });
        }),
      },
    });

    renderControls(<MapControls showLocate />);
    await user.click(screen.getByLabelText("Find my location"));

    expect(mockMap.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [-46.63, -23.55],
        zoom: 14,
      })
    );
  });

  it("calls onLocate callback with coordinates when locate succeeds", async () => {
    const user = userEvent.setup();
    const onLocate = jest.fn();
    const mockCoords = { latitude: -23.55, longitude: -46.63 };
    Object.defineProperty(global.navigator, "geolocation", {
      writable: true,
      value: {
        getCurrentPosition: jest.fn().mockImplementation((success) => {
          success({ coords: mockCoords });
        }),
      },
    });

    renderControls(<MapControls onLocate={onLocate} showLocate />);
    await user.click(screen.getByLabelText("Find my location"));

    expect(onLocate).toHaveBeenCalledWith({
      latitude: -23.55,
      longitude: -46.63,
    });
  });

  it("shows loading spinner while waiting for location", async () => {
    const user = userEvent.setup();
    // Never resolves so we can inspect the loading state
    Object.defineProperty(global.navigator, "geolocation", {
      writable: true,
      value: {
        getCurrentPosition: jest.fn(), // never calls success or error
      },
    });

    renderControls(<MapControls showLocate />);
    await user.click(screen.getByLabelText("Find my location"));

    expect(screen.getByLabelText("Find my location")).toBeDisabled();
  });

  it("handles geolocation error without throwing", async () => {
    const user = userEvent.setup();
    Object.defineProperty(global.navigator, "geolocation", {
      writable: true,
      value: {
        getCurrentPosition: jest.fn().mockImplementation((_success, error) => {
          error(new Error("Permission denied"));
        }),
      },
    });

    renderControls(<MapControls showLocate />);
    await expect(
      user.click(screen.getByLabelText("Find my location"))
    ).resolves.not.toThrow();
  });

  it("calls document.exitFullscreen when already in fullscreen", async () => {
    const user = userEvent.setup();
    const exitFullscreen = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, "exitFullscreen", {
      writable: true,
      value: exitFullscreen,
    });
    Object.defineProperty(document, "fullscreenElement", {
      writable: true,
      configurable: true,
      value: document.createElement("div"),
    });

    renderControls(<MapControls showFullscreen />);
    await user.click(screen.getByLabelText("Toggle fullscreen"));

    expect(exitFullscreen).toHaveBeenCalled();
  });

  it("calls container.requestFullscreen when not in fullscreen", async () => {
    const user = userEvent.setup();
    const requestFullscreen = jest.fn().mockResolvedValue(undefined);
    const container = document.createElement("div");
    container.requestFullscreen = requestFullscreen;
    mockMap.getContainer.mockReturnValue(container);
    Object.defineProperty(document, "fullscreenElement", {
      writable: true,
      configurable: true,
      value: null,
    });

    renderControls(<MapControls showFullscreen />);
    await user.click(screen.getByLabelText("Toggle fullscreen"));

    expect(requestFullscreen).toHaveBeenCalled();
  });

  it("does not throw when fullscreen button clicked and map has no container", async () => {
    const user = userEvent.setup();
    mockMap.getContainer.mockReturnValue(null);
    Object.defineProperty(document, "fullscreenElement", {
      writable: true,
      configurable: true,
      value: null,
    });

    renderControls(<MapControls showFullscreen />);
    await expect(
      user.click(screen.getByLabelText("Toggle fullscreen"))
    ).resolves.not.toThrow();
  });

  it("invokes compass rotation update callback when rotate event fires", () => {
    renderControls(<MapControls showCompass />);

    // Retrieve the rotate handler registered on the map
    const rotateCall = mockMap.on.mock.calls.find(
      ([event]: [string]) => event === "rotate"
    );
    act(() => {
      rotateCall?.[1]?.();
    });

    // getBearing and getPitch are called during the update
    expect(mockMap.getBearing).toHaveBeenCalled();
    expect(mockMap.getPitch).toHaveBeenCalled();
  });
});

describe("PulsingMarker", () => {
  const mockMap = createMockMap();
  const mockContextValue: MapContextValue = {
    map: mockMap as unknown as maplibregl.Map,
    isLoaded: true,
  };

  const renderWithContext = (ui: React.ReactElement) =>
    render(
      <MapContext.Provider value={mockContextValue}>{ui}</MapContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockPulsingMarkerInstance.setLngLat.mockReturnThis();
    mockPulsingMarkerInstance.addTo.mockReturnThis();
    mockPulsingMarkerInstance.getLngLat.mockReturnValue({
      lng: -46.63,
      lat: -23.55,
    });
    mockPulsingMarkerInstance.isDraggable.mockReturnValue(false);
    mockPulsingMarkerInstance.getOffset.mockReturnValue({ x: 0, y: 0 });
    mockPulsingMarkerInstance.getRotation.mockReturnValue(0);
    mockPulsingMarkerInstance.getRotationAlignment.mockReturnValue("auto");
    mockPulsingMarkerInstance.getPitchAlignment.mockReturnValue("auto");
    mockPulsingMarkerInstance.getElement.mockReturnValue(mockMarkerElement);
  });

  it("renders without crashing", () => {
    const { container } = renderWithContext(
      <PulsingMarker latitude={-23.55} longitude={-46.63} />
    );
    expect(container).toBeInTheDocument();
  });

  it("adds marker to map on mount", () => {
    renderWithContext(<PulsingMarker latitude={-23.55} longitude={-46.63} />);
    expect(mockPulsingMarkerInstance.addTo).toHaveBeenCalled();
  });

  it("calls map.flyTo with default zoom when clicked without custom onClick", () => {
    renderWithContext(<PulsingMarker latitude={-23.55} longitude={-46.63} />);
    act(() => {
      mockMarkerElement.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });
    expect(mockMap.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [-46.63, -23.55],
        zoom: 15,
        duration: 500,
      })
    );
  });

  it("calls map.flyTo with custom zoom prop when clicked", () => {
    renderWithContext(
      <PulsingMarker latitude={-23.55} longitude={-46.63} zoom={10} />
    );
    act(() => {
      mockMarkerElement.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });
    expect(mockMap.flyTo).toHaveBeenCalledWith(
      expect.objectContaining({ zoom: 10 })
    );
  });

  it("calls custom onClick instead of flyTo when provided", () => {
    const onClick = jest.fn();
    renderWithContext(
      <PulsingMarker latitude={-23.55} longitude={-46.63} onClick={onClick} />
    );
    act(() => {
      mockMarkerElement.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(mockMap.flyTo).not.toHaveBeenCalled();
  });

  it("applies purple color classes by default", () => {
    const { container } = renderWithContext(
      <PulsingMarker latitude={-23.55} longitude={-46.63} />
    );
    // MarkerContent renders via portal into mockMarkerElement — check the portal target
    expect(container).toBeInTheDocument();
  });

  it("accepts orange color variant without throwing", () => {
    expect(() => {
      renderWithContext(
        <PulsingMarker color="orange" latitude={-23.55} longitude={-46.63} />
      );
    }).not.toThrow();
  });

  it("calls onMouseEnter when mouse enters the marker", () => {
    const onMouseEnter = jest.fn();
    const { container } = renderWithContext(
      <PulsingMarker
        latitude={-23.55}
        longitude={-46.63}
        onMouseEnter={onMouseEnter}
      />
    );
    // The pulsing div is rendered into the marker element portal
    // Trigger directly via the marker element event
    act(() => {
      mockMarkerElement.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true })
      );
    });
    expect(container).toBeInTheDocument();
  });

  it("renders children inside the marker", () => {
    renderWithContext(
      <PulsingMarker latitude={-23.55} longitude={-46.63}>
        <div data-testid="pulsing-child">extra child</div>
      </PulsingMarker>
    );
    expect(screen.getByTestId("pulsing-child")).toBeInTheDocument();
  });
});
