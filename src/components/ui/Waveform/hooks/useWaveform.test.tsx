import { act, render, renderHook, waitFor } from "@testing-library/react";
import { useWaveform } from "./useWaveform";

// ---------------------------------------------------------------------------
// WaveSurfer mock
// ---------------------------------------------------------------------------

const mockWavesurferInstance = {
  destroy: jest.fn(),
  on: jest.fn(),
};

const mockWaveSurferCreate = jest.fn(() => mockWavesurferInstance);

jest.mock("wavesurfer.js", () => ({
  __esModule: true,
  default: {
    create: (...args: unknown[]) => mockWaveSurferCreate(...(args as [])),
  },
}));

// ---------------------------------------------------------------------------
// Helper component: gives the hook a real DOM container so the effect fires
// ---------------------------------------------------------------------------

interface ConsumerProps {
  config?: Record<string, unknown>;
  onReady?: () => void;
  onError?: (e: Error) => void;
  onResult?: (r: ReturnType<typeof useWaveform>) => void;
}

function WaveformHookConsumer({
  config,
  onReady,
  onError,
  onResult,
}: ConsumerProps) {
  const result = useWaveform({ config, onReady, onError });
  onResult?.(result);
  return <div data-testid="container" ref={result.containerRef} />;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useWaveform", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWaveSurferCreate.mockReturnValue(mockWavesurferInstance);
  });

  describe("initial state", () => {
    it("returns a containerRef object", () => {
      const { result } = renderHook(() => useWaveform());
      expect(result.current.containerRef).toBeDefined();
    });

    it("wavesurfer is null synchronously before init", () => {
      const { result } = renderHook(() => useWaveform());
      expect(result.current.wavesurfer).toBeNull();
    });

    it("isReady is false synchronously before init", () => {
      const { result } = renderHook(() => useWaveform());
      expect(result.current.isReady).toBe(false);
    });
  });

  describe("when rendered with a real DOM container", () => {
    it("becomes ready after WaveSurfer initialises", async () => {
      let hookResult: ReturnType<typeof useWaveform> | null = null;
      render(
        <WaveformHookConsumer
          onResult={(r) => {
            hookResult = r;
          }}
        />
      );

      await waitFor(() => {
        expect(hookResult?.isReady).toBe(true);
      });
    });

    it("calls onReady callback when ready", async () => {
      const onReady = jest.fn();
      render(<WaveformHookConsumer onReady={onReady} />);

      await waitFor(() => {
        expect(onReady).toHaveBeenCalled();
      });
    });

    it("calls WaveSurfer.create with default config when no config provided", async () => {
      render(<WaveformHookConsumer />);

      await waitFor(() => {
        expect(mockWaveSurferCreate).toHaveBeenCalledWith(
          expect.objectContaining({ height: 32 })
        );
      });
    });

    it("calls WaveSurfer.create with merged config values", async () => {
      render(
        <WaveformHookConsumer config={{ height: 64, waveColor: "#ff0000" }} />
      );

      await waitFor(() => {
        expect(mockWaveSurferCreate).toHaveBeenCalledWith(
          expect.objectContaining({ height: 64, waveColor: "#ff0000" })
        );
      });
    });

    it("calls onError callback when WaveSurfer.create throws", async () => {
      const onError = jest.fn();
      const error = new Error("WaveSurfer init failed");
      mockWaveSurferCreate.mockImplementation(() => {
        throw error;
      });

      render(<WaveformHookConsumer onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe("destroy", () => {
    it("calls wavesurfer.destroy() when destroy() is invoked after init", async () => {
      let hookResult: ReturnType<typeof useWaveform> | null = null;
      render(
        <WaveformHookConsumer
          onResult={(r) => {
            hookResult = r;
          }}
        />
      );

      await waitFor(() => expect(hookResult?.isReady).toBe(true));

      // Clear calls that happened during init/StrictMode
      mockWavesurferInstance.destroy.mockClear();

      act(() => {
        hookResult?.destroy();
      });

      expect(mockWavesurferInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("ignores errors thrown during destroy", async () => {
      mockWavesurferInstance.destroy.mockImplementation(() => {
        throw new Error("destroy error");
      });

      let hookResult: ReturnType<typeof useWaveform> | null = null;
      render(
        <WaveformHookConsumer
          onResult={(r) => {
            hookResult = r;
          }}
        />
      );

      await waitFor(() => expect(hookResult?.isReady).toBe(true));

      expect(() => {
        act(() => {
          hookResult?.destroy();
        });
      }).not.toThrow();
    });

    it("does not throw when destroy is called before init completes", () => {
      const { result } = renderHook(() => useWaveform());
      // No DOM container attached — the effect guard returns early
      expect(() => {
        act(() => {
          result.current.destroy();
        });
      }).not.toThrow();
    });
  });

  describe("cleanup on unmount", () => {
    it("destroys WaveSurfer instance on unmount", async () => {
      let hookResult: ReturnType<typeof useWaveform> | null = null;
      const { unmount } = render(
        <WaveformHookConsumer
          onResult={(r) => {
            hookResult = r;
          }}
        />
      );

      await waitFor(() => expect(hookResult?.isReady).toBe(true));

      unmount();

      expect(mockWavesurferInstance.destroy).toHaveBeenCalled();
    });

    it("ignores destroy errors during unmount cleanup", async () => {
      mockWavesurferInstance.destroy.mockImplementation(() => {
        throw new Error("cleanup error");
      });

      let hookResult: ReturnType<typeof useWaveform> | null = null;
      const { unmount } = render(
        <WaveformHookConsumer
          onResult={(r) => {
            hookResult = r;
          }}
        />
      );

      await waitFor(() => expect(hookResult?.isReady).toBe(true));

      expect(() => unmount()).not.toThrow();
    });
  });
});
