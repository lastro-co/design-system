import { act, render } from "@testing-library/react";
import { createElement } from "react";
import { MapContext } from "./context";
import { MapRoute } from "./MapRoute";
import type { MapContextValue } from "./types";

// Mock matchMedia
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

const createMockMap = () => {
  const canvasStyle = { cursor: "" };
  return {
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
    getCanvas: jest.fn().mockReturnValue({ style: canvasStyle }),
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
    _canvasStyle: canvasStyle,
  };
};

type MockMap = ReturnType<typeof createMockMap>;

const renderWithMapContext = (
  ui: React.ReactElement,
  map: MockMap,
  isLoaded = true
) => {
  const contextValue: MapContextValue = {
    map: map as unknown as maplibregl.Map,
    isLoaded,
  };
  return render(
    createElement(MapContext.Provider, { value: contextValue }, ui)
  );
};

const COORDS: [number, number][] = [
  [-46.63, -23.55],
  [-46.64, -23.56],
];

describe("MapRoute", () => {
  let mockMap: MockMap;

  beforeEach(() => {
    mockMap = createMockMap();
    jest.clearAllMocks();
  });

  it("adds source and line layer when map is loaded", () => {
    renderWithMapContext(<MapRoute coordinates={COORDS} />, mockMap);
    expect(mockMap.addSource).toHaveBeenCalledWith(
      expect.stringContaining("route-source-"),
      expect.objectContaining({
        type: "geojson",
        data: expect.objectContaining({ type: "Feature" }),
      })
    );
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "line",
        layout: expect.objectContaining({ "line-join": "round" }),
      })
    );
  });

  it("does not add source or layer when map is not loaded", () => {
    renderWithMapContext(<MapRoute coordinates={COORDS} />, mockMap, false);
    expect(mockMap.addSource).not.toHaveBeenCalled();
    expect(mockMap.addLayer).not.toHaveBeenCalled();
  });

  it("uses provided id for source and layer ids", () => {
    renderWithMapContext(
      <MapRoute coordinates={COORDS} id="my-route" />,
      mockMap
    );
    expect(mockMap.addSource).toHaveBeenCalledWith(
      "route-source-my-route",
      expect.any(Object)
    );
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: "route-layer-my-route" })
    );
  });

  it("applies default color, width and opacity to the layer", () => {
    renderWithMapContext(
      <MapRoute coordinates={COORDS} id="defaults" />,
      mockMap
    );
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        paint: expect.objectContaining({
          "line-color": "#4285F4",
          "line-width": 3,
          "line-opacity": 0.8,
        }),
      })
    );
  });

  it("applies custom color, width and opacity props", () => {
    renderWithMapContext(
      <MapRoute
        color="#ff0000"
        coordinates={COORDS}
        id="custom"
        opacity={0.5}
        width={6}
      />,
      mockMap
    );
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        paint: expect.objectContaining({
          "line-color": "#ff0000",
          "line-width": 6,
          "line-opacity": 0.5,
        }),
      })
    );
  });

  it("includes dashArray in layer paint when provided", () => {
    renderWithMapContext(
      <MapRoute coordinates={COORDS} dashArray={[2, 4]} id="dashed" />,
      mockMap
    );
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        paint: expect.objectContaining({ "line-dasharray": [2, 4] }),
      })
    );
  });

  it("removes layer and source on unmount", () => {
    mockMap.getLayer.mockReturnValue({ id: "layer" });
    mockMap.getSource.mockReturnValue({ type: "geojson", setData: jest.fn() });
    const { unmount } = renderWithMapContext(
      <MapRoute coordinates={COORDS} id="cleanup" />,
      mockMap
    );
    unmount();
    expect(mockMap.removeLayer).toHaveBeenCalledWith("route-layer-cleanup");
    expect(mockMap.removeSource).toHaveBeenCalledWith("route-source-cleanup");
  });

  it("registers click, mouseenter, and mouseleave events when interactive", () => {
    const onClick = jest.fn();
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    renderWithMapContext(
      <MapRoute
        coordinates={COORDS}
        id="interactive"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />,
      mockMap
    );
    expect(mockMap.on).toHaveBeenCalledWith(
      "click",
      "route-layer-interactive",
      expect.any(Function)
    );
    expect(mockMap.on).toHaveBeenCalledWith(
      "mouseenter",
      "route-layer-interactive",
      expect.any(Function)
    );
    expect(mockMap.on).toHaveBeenCalledWith(
      "mouseleave",
      "route-layer-interactive",
      expect.any(Function)
    );
  });

  it("does not register events when interactive is false", () => {
    renderWithMapContext(
      <MapRoute
        coordinates={COORDS}
        id="non-interactive"
        interactive={false}
      />,
      mockMap
    );
    expect(mockMap.on).not.toHaveBeenCalledWith(
      "click",
      expect.any(String),
      expect.any(Function)
    );
  });

  it("deregisters event handlers on unmount", () => {
    const onClick = jest.fn();
    const { unmount } = renderWithMapContext(
      <MapRoute coordinates={COORDS} id="deregister" onClick={onClick} />,
      mockMap
    );
    unmount();
    expect(mockMap.off).toHaveBeenCalledWith(
      "click",
      "route-layer-deregister",
      expect.any(Function)
    );
    expect(mockMap.off).toHaveBeenCalledWith(
      "mouseenter",
      "route-layer-deregister",
      expect.any(Function)
    );
    expect(mockMap.off).toHaveBeenCalledWith(
      "mouseleave",
      "route-layer-deregister",
      expect.any(Function)
    );
  });

  it("calls onClick callback when click event fires", () => {
    const onClick = jest.fn();
    renderWithMapContext(
      <MapRoute coordinates={COORDS} id="clickable" onClick={onClick} />,
      mockMap
    );
    const clickCall = mockMap.on.mock.calls.find(
      ([event, layerId]) =>
        event === "click" && layerId === "route-layer-clickable"
    );
    act(() => {
      clickCall?.[2]?.();
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets cursor to pointer on mouseenter and restores on mouseleave", () => {
    const canvas = { style: { cursor: "" } };
    mockMap.getCanvas.mockReturnValue({ style: canvas.style });
    renderWithMapContext(
      <MapRoute coordinates={COORDS} id="cursor-test" />,
      mockMap
    );
    const mouseenterCall = mockMap.on.mock.calls.find(
      ([event, layerId]) =>
        event === "mouseenter" && layerId === "route-layer-cursor-test"
    );
    const mouseleaveCall = mockMap.on.mock.calls.find(
      ([event, layerId]) =>
        event === "mouseleave" && layerId === "route-layer-cursor-test"
    );
    act(() => {
      mouseenterCall?.[2]?.();
    });
    expect(canvas.style.cursor).toBe("pointer");
    act(() => {
      mouseleaveCall?.[2]?.();
    });
    expect(canvas.style.cursor).toBe("");
  });

  it("calls onMouseEnter and onMouseLeave callbacks", () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    renderWithMapContext(
      <MapRoute
        coordinates={COORDS}
        id="hover-test"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />,
      mockMap
    );
    const mouseenterCall = mockMap.on.mock.calls.find(
      ([event, layerId]) =>
        event === "mouseenter" && layerId === "route-layer-hover-test"
    );
    const mouseleaveCall = mockMap.on.mock.calls.find(
      ([event, layerId]) =>
        event === "mouseleave" && layerId === "route-layer-hover-test"
    );
    act(() => {
      mouseenterCall?.[2]?.();
    });
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    act(() => {
      mouseleaveCall?.[2]?.();
    });
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("updates source data when coordinates have at least 2 points", () => {
    const mockSource = { setData: jest.fn() };
    mockMap.getSource.mockReturnValue(mockSource);
    renderWithMapContext(
      <MapRoute coordinates={COORDS} id="data-update" />,
      mockMap
    );
    expect(mockSource.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "Feature",
        geometry: expect.objectContaining({
          type: "LineString",
          coordinates: COORDS,
        }),
      })
    );
  });

  it("does not update source data when coordinates has fewer than 2 points", () => {
    const mockSource = { setData: jest.fn() };
    mockMap.getSource.mockReturnValue(mockSource);
    renderWithMapContext(
      <MapRoute coordinates={[[-46.63, -23.55]]} id="single-point" />,
      mockMap
    );
    expect(mockSource.setData).not.toHaveBeenCalled();
  });

  it("updates paint properties when color/width/opacity change", () => {
    mockMap.getLayer.mockReturnValue({ id: "layer" });
    const { rerender } = renderWithMapContext(
      <MapRoute color="#0000ff" coordinates={COORDS} id="repaint" />,
      mockMap
    );
    act(() => {
      rerender(
        createElement(
          MapContext.Provider,
          {
            value: {
              map: mockMap as unknown as maplibregl.Map,
              isLoaded: true,
            },
          },
          <MapRoute
            color="#ff0000"
            coordinates={COORDS}
            id="repaint"
            width={8}
          />
        )
      );
    });
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      "route-layer-repaint",
      "line-color",
      "#ff0000"
    );
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      "route-layer-repaint",
      "line-width",
      8
    );
  });

  it("renders nothing (returns null)", () => {
    const { container } = renderWithMapContext(
      <MapRoute coordinates={COORDS} />,
      mockMap
    );
    expect(container.firstChild).toBeNull();
  });

  it("sets dashArray paint property when layer exists and dashArray is provided", () => {
    mockMap.getLayer.mockReturnValue({ id: "layer" });
    renderWithMapContext(
      <MapRoute coordinates={COORDS} dashArray={[4, 8]} id="dash-paint" />,
      mockMap
    );
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      "route-layer-dash-paint",
      "line-dasharray",
      [4, 8]
    );
  });
});
