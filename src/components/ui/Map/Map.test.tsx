import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MapClusterLayer,
  Map as MapComponent,
  MapControls,
  MapPopup,
  MarkerLabel,
} from "@/components/ui/Map";
import { MapContext } from "@/components/ui/Map/context";
import type { MapContextValue } from "@/components/ui/Map/types";

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
