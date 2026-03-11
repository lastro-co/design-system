import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { createElement } from "react";
import { MapContext, MarkerContext } from "./context";
import {
  useMap,
  useMarkerContext,
  usePopupAnchor,
  useResolvedTheme,
} from "./hooks";
import type { MapContextValue, MarkerContextValue } from "./types";

// Mock matchMedia globally
const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
  matches: query === "(prefers-color-scheme: dark)" ? false : false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: mockMatchMedia,
});

describe("Map Hooks", () => {
  describe("useMap", () => {
    it("throws error when used outside Map component", () => {
      expect(() => {
        renderHook(() => useMap());
      }).toThrow("useMap must be used within a Map component");
    });

    it("returns context value when used within Map component", () => {
      const mockContextValue: MapContextValue = {
        map: {} as maplibregl.Map,
        isLoaded: true,
      };

      const wrapper = ({ children }: { children: ReactNode }) =>
        createElement(
          MapContext.Provider,
          { value: mockContextValue },
          children
        );

      const { result } = renderHook(() => useMap(), { wrapper });

      expect(result.current).toBe(mockContextValue);
      expect(result.current.isLoaded).toBe(true);
    });
  });

  describe("useMarkerContext", () => {
    it("throws error when used outside MapMarker component", () => {
      expect(() => {
        renderHook(() => useMarkerContext());
      }).toThrow("Marker components must be used within MapMarker");
    });

    it("returns context value when used within MapMarker component", () => {
      const mockContextValue: MarkerContextValue = {
        marker: {} as maplibregl.Marker,
        map: {} as maplibregl.Map,
      };

      const wrapper = ({ children }: { children: ReactNode }) =>
        createElement(
          MarkerContext.Provider,
          { value: mockContextValue },
          children
        );

      const { result } = renderHook(() => useMarkerContext(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });
  });

  describe("useResolvedTheme", () => {
    beforeEach(() => {
      // Reset document classes
      document.documentElement.classList.remove("dark", "light");
      // Reset matchMedia mock
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    it("returns theme prop when provided", () => {
      const { result } = renderHook(() => useResolvedTheme("dark"));
      expect(result.current).toBe("dark");
    });

    it("returns light theme prop when provided", () => {
      const { result } = renderHook(() => useResolvedTheme("light"));
      expect(result.current).toBe("light");
    });

    it("detects dark class on document", () => {
      document.documentElement.classList.add("dark");
      const { result } = renderHook(() => useResolvedTheme());
      expect(result.current).toBe("dark");
    });

    it("detects light class on document", () => {
      document.documentElement.classList.add("light");
      const { result } = renderHook(() => useResolvedTheme());
      expect(result.current).toBe("light");
    });

    it("falls back to system preference when no class is set", () => {
      // Mock matchMedia to return dark preference
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useResolvedTheme());
      // Default is based on system preference (dark in this case)
      expect(result.current).toBe("dark");
    });

    it("updates theme when MutationObserver fires with a new document class", () => {
      // Capture the MutationObserver callback by mocking the constructor
      let observerCallback: MutationCallback | null = null;
      const disconnectMock = jest.fn();
      const observeMock = jest.fn();
      const OriginalMutationObserver = global.MutationObserver;
      global.MutationObserver = jest
        .fn()
        .mockImplementation((callback: MutationCallback) => {
          observerCallback = callback;
          return { observe: observeMock, disconnect: disconnectMock };
        }) as unknown as typeof MutationObserver;

      // Start with no class (light)
      const { result } = renderHook(() => useResolvedTheme());
      expect(result.current).toBe("light");

      // Simulate next-themes toggling the dark class and the observer firing
      act(() => {
        document.documentElement.classList.add("dark");
        observerCallback?.([], {} as MutationObserver);
      });

      expect(result.current).toBe("dark");

      global.MutationObserver = OriginalMutationObserver;
    });

    it("updates theme when system preference changes and no document class is set", () => {
      let systemChangeHandler: ((e: MediaQueryListEvent) => void) | null = null;

      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest
          .fn()
          .mockImplementation(
            (_event: string, handler: (e: MediaQueryListEvent) => void) => {
              if (query === "(prefers-color-scheme: dark)") {
                systemChangeHandler = handler;
              }
            }
          ),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useResolvedTheme());
      expect(result.current).toBe("light");

      act(() => {
        systemChangeHandler?.({ matches: true } as MediaQueryListEvent);
      });

      expect(result.current).toBe("dark");
    });

    it("does not update theme via system change when a document class is set", () => {
      document.documentElement.classList.add("light");
      let systemChangeHandler: ((e: MediaQueryListEvent) => void) | null = null;

      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest
          .fn()
          .mockImplementation(
            (_event: string, handler: (e: MediaQueryListEvent) => void) => {
              if (query === "(prefers-color-scheme: dark)") {
                systemChangeHandler = handler;
              }
            }
          ),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useResolvedTheme());
      expect(result.current).toBe("light");

      act(() => {
        // Fire system change to dark, but document class "light" should override
        systemChangeHandler?.({ matches: true } as MediaQueryListEvent);
      });

      // Theme should remain "light" because the document class takes precedence
      expect(result.current).toBe("light");
    });
  });

  describe("usePopupAnchor", () => {
    const createMockMap = (projectX: number, containerWidth: number) => ({
      project: jest.fn().mockReturnValue({ x: projectX, y: 100 }),
      getContainer: jest.fn().mockReturnValue({ clientWidth: containerWidth }),
    });

    const makeWrapper =
      (map: ReturnType<typeof createMockMap>) =>
      ({ children }: { children: ReactNode }) =>
        createElement(
          MapContext.Provider,
          { value: { map: map as unknown as maplibregl.Map, isLoaded: true } },
          children
        );

    it("returns left when point is in the left half of the map", () => {
      const mockMap = createMockMap(100, 800); // x=100, width=800, so x < 400
      const { result } = renderHook(() => usePopupAnchor(), {
        wrapper: makeWrapper(mockMap),
      });
      expect(result.current(-46.63, -23.55)).toBe("left");
    });

    it("returns right when point is in the right half of the map", () => {
      const mockMap = createMockMap(600, 800); // x=600, width=800, so x > 400
      const { result } = renderHook(() => usePopupAnchor(), {
        wrapper: makeWrapper(mockMap),
      });
      expect(result.current(-46.63, -23.55)).toBe("right");
    });

    it("returns left when map is null", () => {
      const wrapper = ({ children }: { children: ReactNode }) =>
        createElement(
          MapContext.Provider,
          { value: { map: null, isLoaded: false } },
          children
        );
      const { result } = renderHook(() => usePopupAnchor(), { wrapper });
      expect(result.current(-46.63, -23.55)).toBe("left");
    });

    it("passes longitude and latitude to map.project", () => {
      const mockMap = createMockMap(100, 800);
      const { result } = renderHook(() => usePopupAnchor(), {
        wrapper: makeWrapper(mockMap),
      });
      result.current(-46.63, -23.55);
      expect(mockMap.project).toHaveBeenCalledWith([-46.63, -23.55]);
    });
  });
});
