import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { createElement } from "react";
import { MapContext, MarkerContext } from "./context";
import { useMap, useMarkerContext, useResolvedTheme } from "./hooks";
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
  });
});
