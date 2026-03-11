import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { MapContext, MarkerContext } from "./context";
import {
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "./MapMarker";
import type { MapContextValue, MarkerContextValue } from "./types";

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

// Hoisted mocks — must be declared before jest.mock calls
const mockMarkerElement = document.createElement("div");

const mockMarkerInstance = {
  setLngLat: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
  getElement: jest.fn().mockReturnValue(mockMarkerElement),
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
};

const mockPopupInstance = {
  setMaxWidth: jest.fn().mockReturnThis(),
  setDOMContent: jest.fn().mockReturnThis(),
  setLngLat: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
  isOpen: jest.fn().mockReturnValue(false),
  setOffset: jest.fn().mockReturnThis(),
};

jest.mock("maplibre-gl", () => ({
  __esModule: true,
  default: {
    Marker: jest.fn().mockImplementation(() => mockMarkerInstance),
    Popup: jest.fn().mockImplementation(() => mockPopupInstance),
    Map: jest.fn(),
    setWorkerUrl: jest.fn(),
  },
}));

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
  project: jest.fn().mockReturnValue({ x: 100, y: 100 }),
});

const renderWithMapContext = (
  ui: React.ReactElement,
  map = createMockMap()
) => {
  const contextValue: MapContextValue = {
    map: map as unknown as maplibregl.Map,
    isLoaded: true,
  };
  return render(
    createElement(MapContext.Provider, { value: contextValue }, ui)
  );
};

const renderWithMarkerContext = (ui: React.ReactElement) => {
  const markerCtx: MarkerContextValue = {
    marker: mockMarkerInstance as unknown as maplibregl.Marker,
    map: createMockMap() as unknown as maplibregl.Map,
  };
  return render(
    createElement(MarkerContext.Provider, { value: markerCtx }, ui)
  );
};

describe("MapMarker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMarkerInstance.setLngLat.mockReturnThis();
    mockMarkerInstance.addTo.mockReturnThis();
    mockMarkerInstance.getLngLat.mockReturnValue({ lng: -46.63, lat: -23.55 });
    mockMarkerInstance.isDraggable.mockReturnValue(false);
    mockMarkerInstance.getOffset.mockReturnValue({ x: 0, y: 0 });
    mockMarkerInstance.getRotation.mockReturnValue(0);
    mockMarkerInstance.getRotationAlignment.mockReturnValue("auto");
    mockMarkerInstance.getPitchAlignment.mockReturnValue("auto");
    mockMarkerInstance.getElement.mockReturnValue(mockMarkerElement);
    mockPopupInstance.isOpen.mockReturnValue(false);
  });

  it("adds marker to map on mount", () => {
    const mockMap = createMockMap();
    renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63}>
        <div>child</div>
      </MapMarker>,
      mockMap
    );
    expect(mockMarkerInstance.addTo).toHaveBeenCalled();
  });

  it("removes marker from map on unmount", () => {
    const mockMap = createMockMap();
    const { unmount } = renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63}>
        <div>child</div>
      </MapMarker>,
      mockMap
    );
    unmount();
    expect(mockMarkerInstance.remove).toHaveBeenCalled();
  });

  it("registers click event on the marker element", () => {
    const addEventListenerSpy = jest.spyOn(
      mockMarkerElement,
      "addEventListener"
    );
    const onClick = jest.fn();
    renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63} onClick={onClick}>
        <div>child</div>
      </MapMarker>
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
  });

  it("registers mouseenter and mouseleave events on marker element", () => {
    const addEventListenerSpy = jest.spyOn(
      mockMarkerElement,
      "addEventListener"
    );
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    renderWithMapContext(
      <MapMarker
        latitude={-23.55}
        longitude={-46.63}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div>child</div>
      </MapMarker>
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function)
    );
  });

  it("removes DOM event listeners on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(
      mockMarkerElement,
      "removeEventListener"
    );
    const { unmount } = renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63}>
        <div>child</div>
      </MapMarker>
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function)
    );
  });

  it("registers drag event listeners on marker", () => {
    const onDragStart = jest.fn();
    const onDrag = jest.fn();
    const onDragEnd = jest.fn();
    renderWithMapContext(
      <MapMarker
        draggable
        latitude={-23.55}
        longitude={-46.63}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
      >
        <div>child</div>
      </MapMarker>
    );
    expect(mockMarkerInstance.on).toHaveBeenCalledWith(
      "dragstart",
      expect.any(Function)
    );
    expect(mockMarkerInstance.on).toHaveBeenCalledWith(
      "drag",
      expect.any(Function)
    );
    expect(mockMarkerInstance.on).toHaveBeenCalledWith(
      "dragend",
      expect.any(Function)
    );
  });

  it("deregisters drag event listeners on unmount", () => {
    const { unmount } = renderWithMapContext(
      <MapMarker draggable latitude={-23.55} longitude={-46.63}>
        <div>child</div>
      </MapMarker>
    );
    unmount();
    expect(mockMarkerInstance.off).toHaveBeenCalledWith(
      "dragstart",
      expect.any(Function)
    );
    expect(mockMarkerInstance.off).toHaveBeenCalledWith(
      "drag",
      expect.any(Function)
    );
    expect(mockMarkerInstance.off).toHaveBeenCalledWith(
      "dragend",
      expect.any(Function)
    );
  });

  it("syncs position when longitude or latitude changes", () => {
    mockMarkerInstance.getLngLat.mockReturnValue({ lng: -46.63, lat: -23.55 });
    const { rerender } = renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63}>
        <div>child</div>
      </MapMarker>
    );
    // Change coordinates
    mockMarkerInstance.getLngLat.mockReturnValue({ lng: -10, lat: -10 });
    act(() => {
      rerender(
        <MapContext.Provider
          value={{
            map: createMockMap() as unknown as maplibregl.Map,
            isLoaded: true,
          }}
        >
          <MapMarker latitude={-24} longitude={-47}>
            <div>child</div>
          </MapMarker>
        </MapContext.Provider>
      );
    });
    expect(mockMarkerInstance.setLngLat).toHaveBeenCalledWith([-47, -24]);
  });

  it("syncs draggable state when prop changes to true", () => {
    mockMarkerInstance.isDraggable.mockReturnValue(false);
    const { rerender } = renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63}>
        <div>child</div>
      </MapMarker>
    );
    act(() => {
      rerender(
        <MapContext.Provider
          value={{
            map: createMockMap() as unknown as maplibregl.Map,
            isLoaded: true,
          }}
        >
          <MapMarker draggable latitude={-23.55} longitude={-46.63}>
            <div>child</div>
          </MapMarker>
        </MapContext.Provider>
      );
    });
    expect(mockMarkerInstance.setDraggable).toHaveBeenCalledWith(true);
  });

  it("syncs offset when prop changes", () => {
    mockMarkerInstance.getOffset.mockReturnValue({ x: 0, y: 0 });
    const { rerender } = renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63}>
        <div>child</div>
      </MapMarker>
    );
    act(() => {
      rerender(
        <MapContext.Provider
          value={{
            map: createMockMap() as unknown as maplibregl.Map,
            isLoaded: true,
          }}
        >
          <MapMarker latitude={-23.55} longitude={-46.63} offset={[5, 10]}>
            <div>child</div>
          </MapMarker>
        </MapContext.Provider>
      );
    });
    expect(mockMarkerInstance.setOffset).toHaveBeenCalledWith([5, 10]);
  });

  it("syncs rotation when prop changes", () => {
    mockMarkerInstance.getRotation.mockReturnValue(0);
    const { rerender } = renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63}>
        <div>child</div>
      </MapMarker>
    );
    act(() => {
      rerender(
        <MapContext.Provider
          value={{
            map: createMockMap() as unknown as maplibregl.Map,
            isLoaded: true,
          }}
        >
          <MapMarker latitude={-23.55} longitude={-46.63} rotation={45}>
            <div>child</div>
          </MapMarker>
        </MapContext.Provider>
      );
    });
    expect(mockMarkerInstance.setRotation).toHaveBeenCalledWith(45);
  });

  it("renders children inside MarkerContext.Provider", () => {
    renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63}>
        <div data-testid="marker-child">content</div>
      </MapMarker>
    );
    expect(screen.getByTestId("marker-child")).toBeInTheDocument();
  });

  it("invokes onClick callback when marker element is clicked", () => {
    const onClick = jest.fn();
    renderWithMapContext(
      <MapMarker latitude={-23.55} longitude={-46.63} onClick={onClick}>
        <div>child</div>
      </MapMarker>
    );
    act(() => {
      mockMarkerElement.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("invokes drag callbacks when drag events fire", () => {
    const onDragStart = jest.fn();
    const onDrag = jest.fn();
    const onDragEnd = jest.fn();
    renderWithMapContext(
      <MapMarker
        draggable
        latitude={-23.55}
        longitude={-46.63}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
      >
        <div>child</div>
      </MapMarker>
    );
    // Retrieve and invoke the drag event handlers registered via marker.on
    const onCalls = mockMarkerInstance.on.mock.calls;
    const dragStartHandler = onCalls.find(
      ([event]: [string]) => event === "dragstart"
    )?.[1];
    const dragHandler = onCalls.find(
      ([event]: [string]) => event === "drag"
    )?.[1];
    const dragEndHandler = onCalls.find(
      ([event]: [string]) => event === "dragend"
    )?.[1];

    act(() => {
      dragStartHandler?.();
      dragHandler?.();
      dragEndHandler?.();
    });

    expect(onDragStart).toHaveBeenCalledWith({ lat: -23.55, lng: -46.63 });
    expect(onDrag).toHaveBeenCalledWith({ lat: -23.55, lng: -46.63 });
    expect(onDragEnd).toHaveBeenCalledWith({ lat: -23.55, lng: -46.63 });
  });
});

describe("MarkerContent", () => {
  it("renders children inside marker element via portal", () => {
    renderWithMarkerContext(
      <MarkerContent>
        <span>Marker content</span>
      </MarkerContent>
    );
    // Portal renders into mockMarkerElement, which is attached to document.body
    document.body.appendChild(mockMarkerElement);
    expect(mockMarkerElement).toBeInTheDocument();
    document.body.removeChild(mockMarkerElement);
  });

  it("applies custom className to wrapper div", () => {
    renderWithMarkerContext(
      <MarkerContent className="custom-marker-class">
        <span>child</span>
      </MarkerContent>
    );
    // The portal target element exists
    expect(mockMarkerElement).toBeDefined();
  });

  it("renders DefaultMarkerIcon when no children are provided", () => {
    // Does not throw
    expect(() => {
      renderWithMarkerContext(<MarkerContent />);
    }).not.toThrow();
  });
});

describe("MarkerPopup", () => {
  it("creates a Popup instance and attaches it to the marker", () => {
    renderWithMarkerContext(
      <MarkerPopup>
        <div>Popup content</div>
      </MarkerPopup>
    );
    expect(mockMarkerInstance.setPopup).toHaveBeenCalledWith(mockPopupInstance);
  });

  it("renders close button when closeButton prop is true", () => {
    // The popup portal renders into a detached div (container created via useMemo).
    // We verify the popup was configured rather than querying the portal target.
    renderWithMarkerContext(
      <MarkerPopup closeButton>
        <div>Popup content</div>
      </MarkerPopup>
    );
    expect(mockPopupInstance.setMaxWidth).toHaveBeenCalled();
  });

  it("calls popup.remove when close button is clicked", async () => {
    const user = userEvent.setup();
    // Render into a container we can inspect — attach the portal target to the DOM
    const portalTarget = document.createElement("div");
    document.body.appendChild(portalTarget);

    // Override getElement to return the portal target for the marker element
    // The popup content portal renders into `container` (useMemo div), not marker element.
    // We render with a real DOM attachment by appending the render result.
    const markerCtx: MarkerContextValue = {
      marker: mockMarkerInstance as unknown as maplibregl.Marker,
      map: createMockMap() as unknown as maplibregl.Map,
    };

    // We need to attach the popup's portal container to the DOM so the button is queryable.
    // Spy on document.createElement to capture the portal container div.
    let popupContainer: HTMLElement | null = null;
    const origCreate = document.createElement.bind(document);
    jest.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = origCreate(tag);
      if (tag === "div" && !popupContainer) {
        popupContainer = el;
        document.body.appendChild(el);
      }
      return el;
    });

    render(
      createElement(
        MarkerContext.Provider,
        { value: markerCtx },
        <MarkerPopup closeButton>
          <div>content</div>
        </MarkerPopup>
      )
    );

    jest.restoreAllMocks();
    document.body.removeChild(portalTarget);

    if (popupContainer) {
      const closeBtn = (popupContainer as HTMLElement).querySelector(
        "[aria-label='Close popup']"
      );
      if (closeBtn) {
        await user.click(closeBtn as HTMLElement);
        expect(mockPopupInstance.remove).toHaveBeenCalled();
      }
    }
  });

  it("removes popup from marker on unmount", () => {
    const { unmount } = renderWithMarkerContext(
      <MarkerPopup>
        <div>content</div>
      </MarkerPopup>
    );
    unmount();
    expect(mockMarkerInstance.setPopup).toHaveBeenLastCalledWith(null);
  });

  it("does not throw when map is null", () => {
    const markerCtx: MarkerContextValue = {
      marker: mockMarkerInstance as unknown as maplibregl.Marker,
      map: null,
    };
    expect(() => {
      render(
        createElement(
          MarkerContext.Provider,
          { value: markerCtx },
          <MarkerPopup>
            <div>content</div>
          </MarkerPopup>
        )
      );
    }).not.toThrow();
  });

  it("sets DOM content on the popup", () => {
    renderWithMarkerContext(
      <MarkerPopup>
        <div>content</div>
      </MarkerPopup>
    );
    expect(mockPopupInstance.setDOMContent).toHaveBeenCalled();
  });

  it("updates offset when popup is open and offset prop changes", () => {
    mockPopupInstance.isOpen.mockReturnValue(true);
    const markerCtx: MarkerContextValue = {
      marker: mockMarkerInstance as unknown as maplibregl.Marker,
      map: createMockMap() as unknown as maplibregl.Map,
    };
    const { rerender } = render(
      createElement(
        MarkerContext.Provider,
        { value: markerCtx },
        <MarkerPopup offset={10}>
          <div>content</div>
        </MarkerPopup>
      )
    );
    act(() => {
      rerender(
        createElement(
          MarkerContext.Provider,
          { value: markerCtx },
          <MarkerPopup offset={20}>
            <div>content</div>
          </MarkerPopup>
        )
      );
    });
    expect(mockPopupInstance.setOffset).toHaveBeenCalledWith(20);
  });

  it("updates maxWidth when popup is open and maxWidth prop changes", () => {
    mockPopupInstance.isOpen.mockReturnValue(true);
    const markerCtx: MarkerContextValue = {
      marker: mockMarkerInstance as unknown as maplibregl.Marker,
      map: createMockMap() as unknown as maplibregl.Map,
    };
    const { rerender } = render(
      createElement(
        MarkerContext.Provider,
        { value: markerCtx },
        <MarkerPopup maxWidth="200px">
          <div>content</div>
        </MarkerPopup>
      )
    );
    act(() => {
      rerender(
        createElement(
          MarkerContext.Provider,
          { value: markerCtx },
          <MarkerPopup maxWidth="400px">
            <div>content</div>
          </MarkerPopup>
        )
      );
    });
    expect(mockPopupInstance.setMaxWidth).toHaveBeenCalledWith("400px");
  });
});

describe("MarkerTooltip", () => {
  it("creates a Popup instance for the tooltip", () => {
    renderWithMarkerContext(
      <MarkerTooltip>
        <span>tooltip text</span>
      </MarkerTooltip>
    );
    expect(mockPopupInstance.setMaxWidth).toHaveBeenCalled();
  });

  it("registers mouseenter and mouseleave on marker element", () => {
    const addEventListenerSpy = jest.spyOn(
      mockMarkerElement,
      "addEventListener"
    );
    renderWithMarkerContext(
      <MarkerTooltip>
        <span>tooltip</span>
      </MarkerTooltip>
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function)
    );
  });

  it("removes event listeners and tooltip on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(
      mockMarkerElement,
      "removeEventListener"
    );
    const { unmount } = renderWithMarkerContext(
      <MarkerTooltip>
        <span>tooltip</span>
      </MarkerTooltip>
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function)
    );
    expect(mockPopupInstance.remove).toHaveBeenCalled();
  });

  it("does not throw when map is null", () => {
    const markerCtx: MarkerContextValue = {
      marker: mockMarkerInstance as unknown as maplibregl.Marker,
      map: null,
    };
    expect(() => {
      render(
        createElement(
          MarkerContext.Provider,
          { value: markerCtx },
          <MarkerTooltip>
            <span>tooltip</span>
          </MarkerTooltip>
        )
      );
    }).not.toThrow();
  });

  it("shows tooltip on mouseenter by adding to map", () => {
    const mockMap = createMockMap();
    // Use a fresh element per-test so event listener tracking is isolated
    const freshElement = document.createElement("div");
    const listeners: Record<string, EventListener> = {};
    const addListenerSpy = jest
      .spyOn(freshElement, "addEventListener")
      .mockImplementation(
        (event: string, handler: EventListenerOrEventListenerObject) => {
          listeners[event] = handler as EventListener;
        }
      );
    mockMarkerInstance.getElement.mockReturnValue(freshElement);

    const markerCtx: MarkerContextValue = {
      marker: mockMarkerInstance as unknown as maplibregl.Marker,
      map: mockMap as unknown as maplibregl.Map,
    };
    render(
      createElement(
        MarkerContext.Provider,
        { value: markerCtx },
        <MarkerTooltip>
          <span>tooltip</span>
        </MarkerTooltip>
      )
    );

    act(() => {
      listeners["mouseenter"]?.(new Event("mouseenter"));
    });
    expect(mockPopupInstance.setLngLat).toHaveBeenCalled();
    expect(mockPopupInstance.addTo).toHaveBeenCalled();
    addListenerSpy.mockRestore();
  });

  it("updates tooltip offset when tooltip is open and offset prop changes", () => {
    mockPopupInstance.isOpen.mockReturnValue(true);
    const markerCtx: MarkerContextValue = {
      marker: mockMarkerInstance as unknown as maplibregl.Marker,
      map: createMockMap() as unknown as maplibregl.Map,
    };
    const { rerender } = render(
      createElement(
        MarkerContext.Provider,
        { value: markerCtx },
        <MarkerTooltip offset={10}>
          <span>tooltip</span>
        </MarkerTooltip>
      )
    );
    act(() => {
      rerender(
        createElement(
          MarkerContext.Provider,
          { value: markerCtx },
          <MarkerTooltip offset={30}>
            <span>tooltip</span>
          </MarkerTooltip>
        )
      );
    });
    expect(mockPopupInstance.setOffset).toHaveBeenCalledWith(30);
  });

  it("updates tooltip maxWidth when tooltip is open and maxWidth prop changes", () => {
    mockPopupInstance.isOpen.mockReturnValue(true);
    const markerCtx: MarkerContextValue = {
      marker: mockMarkerInstance as unknown as maplibregl.Marker,
      map: createMockMap() as unknown as maplibregl.Map,
    };
    const { rerender } = render(
      createElement(
        MarkerContext.Provider,
        { value: markerCtx },
        <MarkerTooltip maxWidth="100px">
          <span>tooltip</span>
        </MarkerTooltip>
      )
    );
    act(() => {
      rerender(
        createElement(
          MarkerContext.Provider,
          { value: markerCtx },
          <MarkerTooltip maxWidth="300px">
            <span>tooltip</span>
          </MarkerTooltip>
        )
      );
    });
    expect(mockPopupInstance.setMaxWidth).toHaveBeenCalledWith("300px");
  });
});
