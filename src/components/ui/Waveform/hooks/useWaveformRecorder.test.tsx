import { act, render, renderHook, waitFor } from "@testing-library/react";
import { useWaveformRecorder } from "./useWaveformRecorder";

// ---------------------------------------------------------------------------
// WaveSurfer + RecordPlugin mocks
// ---------------------------------------------------------------------------

type RecordEventCallback = (...args: unknown[]) => void;

const mockRecordInstance = {
  startRecording: jest.fn().mockResolvedValue(undefined),
  stopRecording: jest.fn(),
  pauseRecording: jest.fn(),
  resumeRecording: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  _listeners: {} as Record<string, RecordEventCallback>,
  _emit(event: string, ...args: unknown[]) {
    this._listeners[event]?.(...args);
  },
};

const mockWavesurferInstance = {
  registerPlugin: jest.fn(() => mockRecordInstance),
  destroy: jest.fn(),
};

const mockWaveSurferCreate = jest.fn(() => mockWavesurferInstance);
const mockRecordPluginCreate = jest.fn(() => ({}));

jest.mock("wavesurfer.js", () => ({
  __esModule: true,
  default: {
    create: (...args: unknown[]) => mockWaveSurferCreate(...(args as [])),
  },
}));

jest.mock("wavesurfer.js/dist/plugins/record.esm.js", () => ({
  __esModule: true,
  default: {
    create: (...args: unknown[]) => mockRecordPluginCreate(...(args as [])),
  },
}));

// ---------------------------------------------------------------------------
// Helper component: renders the hook with a real DOM container
// ---------------------------------------------------------------------------

interface ConsumerProps {
  autoStart?: boolean;
  config?: Record<string, unknown>;
  onRecordEnd?: (blob: Blob) => void;
  onError?: (e: Error) => void;
  onResult?: (r: ReturnType<typeof useWaveformRecorder>) => void;
}

function RecorderConsumer({
  autoStart = false,
  config,
  onRecordEnd,
  onError,
  onResult,
}: ConsumerProps) {
  const result = useWaveformRecorder({
    autoStart,
    config,
    onRecordEnd,
    onError,
  });
  onResult?.(result);
  return <div data-testid="container" ref={result.containerRef} />;
}

// Renders a RecorderConsumer with autoStart=true and waits for all async
// state updates (WaveSurfer init + startRecording promise) to settle.
// Returns a ref-box whose `.current` always points to the latest hook result.
async function renderAutoStart(props: Omit<ConsumerProps, "autoStart"> = {}) {
  const box = {
    current: null as ReturnType<typeof useWaveformRecorder> | null,
  };
  await act(async () => {
    render(
      <RecorderConsumer
        autoStart={true}
        onResult={(r) => {
          box.current = r;
        }}
        {...props}
      />
    );
  });
  return box;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useWaveformRecorder", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockWaveSurferCreate.mockReturnValue(mockWavesurferInstance);
    mockWavesurferInstance.registerPlugin.mockReturnValue(mockRecordInstance);
    mockRecordInstance.startRecording.mockResolvedValue(undefined);
    mockRecordInstance._listeners = {};

    mockRecordInstance.on.mockImplementation(
      (event: string, cb: RecordEventCallback) => {
        mockRecordInstance._listeners[event] = cb;
      }
    );
  });

  describe("initial state", () => {
    it("returns expected shape without a DOM container", () => {
      const { result } = renderHook(() => useWaveformRecorder());
      expect(result.current.recordingState).toBe("idle");
      expect(result.current.duration).toBe(0);
      expect(typeof result.current.startRecording).toBe("function");
      expect(typeof result.current.pauseRecording).toBe("function");
      expect(typeof result.current.resumeRecording).toBe("function");
      expect(typeof result.current.stopRecording).toBe("function");
      expect(typeof result.current.destroy).toBe("function");
    });
  });

  describe("initialisation with real DOM container", () => {
    it("creates WaveSurfer and RecordPlugin when container is present", async () => {
      render(<RecorderConsumer autoStart={false} />);

      await waitFor(() => {
        expect(mockWaveSurferCreate).toHaveBeenCalled();
        expect(mockWavesurferInstance.registerPlugin).toHaveBeenCalled();
      });
    });

    it("auto-starts recording when autoStart=true", async () => {
      await act(async () => {
        render(<RecorderConsumer autoStart={true} />);
      });

      expect(mockRecordInstance.startRecording).toHaveBeenCalled();
    });

    it("does not auto-start when autoStart=false", async () => {
      render(<RecorderConsumer autoStart={false} />);

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());
      expect(mockRecordInstance.startRecording).not.toHaveBeenCalled();
    });

    it("sets recordingState to 'recording' after autoStart", async () => {
      const box = await renderAutoStart();
      expect(box.current?.recordingState).toBe("recording");
    });

    it("calls onError when WaveSurfer.create throws", async () => {
      const onError = jest.fn();
      const error = new Error("WaveSurfer init failed");
      mockWaveSurferCreate.mockImplementation(() => {
        throw error;
      });

      await act(async () => {
        render(<RecorderConsumer onError={onError} />);
      });

      expect(onError).toHaveBeenCalledWith(error);
    });

    it("calls onError when startRecording throws during autoStart", async () => {
      const onError = jest.fn();
      const error = new Error("Mic permission denied");
      mockRecordInstance.startRecording.mockRejectedValueOnce(error);

      await act(async () => {
        render(<RecorderConsumer autoStart={true} onError={onError} />);
      });

      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe("startRecording", () => {
    it("sets recordingState to 'recording' when startRecording is called", async () => {
      const ref: { current: ReturnType<typeof useWaveformRecorder> | null } = {
        current: null,
      };

      render(
        <RecorderConsumer
          autoStart={false}
          onResult={(r) => {
            ref.current = r;
          }}
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      await act(async () => {
        await ref.current?.startRecording();
      });

      if (!ref.current) {
        throw new Error("expected hook result");
      }
      expect(ref.current.recordingState).toBe("recording");
    });

    it("calls record.startRecording() when startRecording is invoked", async () => {
      const ref: { current: ReturnType<typeof useWaveformRecorder> | null } = {
        current: null,
      };

      render(
        <RecorderConsumer
          autoStart={false}
          onResult={(r) => {
            ref.current = r;
          }}
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      await act(async () => {
        await ref.current?.startRecording();
      });

      expect(mockRecordInstance.startRecording).toHaveBeenCalled();
      if (!ref.current) {
        throw new Error("expected hook result");
      }
      expect(ref.current.recordingState).toBe("recording");
    });

    it("does nothing when recordRef is null (no container)", async () => {
      const { result } = renderHook(() => useWaveformRecorder());

      await act(async () => {
        await result.current.startRecording();
      });

      expect(result.current.recordingState).toBe("idle");
    });
  });

  describe("pauseRecording", () => {
    it("sets recordingState to 'paused' when pausing from 'recording'", async () => {
      const box = await renderAutoStart();

      act(() => {
        box.current?.pauseRecording();
      });

      await waitFor(() => {
        expect(box.current?.recordingState).toBe("paused");
      });
    });

    it("calls record.pauseRecording() when pausing", async () => {
      const box = await renderAutoStart();

      act(() => {
        box.current?.pauseRecording();
      });

      await waitFor(() => {
        expect(box.current?.recordingState).toBe("paused");
      });

      expect(mockRecordInstance.pauseRecording).toHaveBeenCalled();
    });

    it("does nothing when not in 'recording' state", async () => {
      const ref: { current: ReturnType<typeof useWaveformRecorder> | null } = {
        current: null,
      };

      render(
        <RecorderConsumer
          autoStart={false}
          onResult={(r) => {
            ref.current = r;
          }}
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      act(() => {
        ref.current?.pauseRecording();
      });

      if (!ref.current) {
        throw new Error("expected hook result");
      }
      expect(ref.current.recordingState).toBe("idle");
    });
  });

  describe("resumeRecording", () => {
    it("sets recordingState back to 'recording' from 'paused'", async () => {
      const box = await renderAutoStart();

      act(() => {
        box.current?.pauseRecording();
      });

      await waitFor(() => {
        expect(box.current?.recordingState).toBe("paused");
      });

      act(() => {
        box.current?.resumeRecording();
      });

      await waitFor(() => {
        expect(box.current?.recordingState).toBe("recording");
      });
    });

    it("calls record.resumeRecording() after being paused", async () => {
      let hookResult: ReturnType<typeof useWaveformRecorder> | null = null;

      await act(async () => {
        render(
          <RecorderConsumer
            autoStart={true}
            onResult={(r) => {
              hookResult = r;
            }}
          />
        );
      });

      await waitFor(() => {
        expect(hookResult?.recordingState).toBe("recording");
      });

      act(() => {
        hookResult?.pauseRecording();
      });

      await waitFor(() => {
        expect(hookResult?.recordingState).toBe("paused");
      });

      mockRecordInstance.resumeRecording.mockClear();

      act(() => {
        hookResult?.resumeRecording();
      });

      await waitFor(() => {
        expect(mockRecordInstance.resumeRecording).toHaveBeenCalled();
      });
    });

    it("does nothing when not in 'paused' state", async () => {
      const ref: { current: ReturnType<typeof useWaveformRecorder> | null } = {
        current: null,
      };

      render(
        <RecorderConsumer
          autoStart={false}
          onResult={(r) => {
            ref.current = r;
          }}
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      act(() => {
        ref.current?.resumeRecording();
      });

      if (!ref.current) {
        throw new Error("expected hook result");
      }
      expect(ref.current.recordingState).toBe("idle");
    });
  });

  describe("stopRecording", () => {
    it("sets recordingState to 'idle' and stops the timer", async () => {
      const box = await renderAutoStart();

      act(() => {
        box.current?.stopRecording();
      });

      await waitFor(() => {
        expect(box.current?.recordingState).toBe("idle");
      });
    });

    it("calls record.stopRecording()", async () => {
      const box = await renderAutoStart();

      act(() => {
        box.current?.stopRecording();
      });

      expect(mockRecordInstance.stopRecording).toHaveBeenCalled();
    });

    it("does nothing when recordRef is null", async () => {
      const { result } = renderHook(() => useWaveformRecorder());

      act(() => {
        result.current.stopRecording();
      });

      expect(result.current.recordingState).toBe("idle");
    });
  });

  describe("record-end event", () => {
    it("calls onRecordEnd with the blob when record-end fires", async () => {
      const onRecordEnd = jest.fn();

      await act(async () => {
        render(<RecorderConsumer autoStart={true} onRecordEnd={onRecordEnd} />);
      });

      await waitFor(() =>
        expect(mockRecordInstance._listeners["record-end"]).toBeDefined()
      );

      const blob = new Blob(["audio-data"], { type: "audio/webm" });
      act(() => {
        mockRecordInstance._emit("record-end", blob);
      });

      expect(onRecordEnd).toHaveBeenCalledWith(blob);
    });
  });

  describe("destroy", () => {
    it("destroy() tears down both record and wavesurfer instances", async () => {
      let hookResult: ReturnType<typeof useWaveformRecorder> | null = null;

      render(
        <RecorderConsumer
          autoStart={false}
          onResult={(r) => {
            hookResult = r;
          }}
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      mockRecordInstance.destroy.mockClear();
      mockWavesurferInstance.destroy.mockClear();

      act(() => {
        hookResult?.destroy();
      });

      expect(mockRecordInstance.destroy).toHaveBeenCalledTimes(1);
      expect(mockWavesurferInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("calling destroy() a second time is a no-op", async () => {
      let hookResult: ReturnType<typeof useWaveformRecorder> | null = null;

      render(
        <RecorderConsumer
          autoStart={false}
          onResult={(r) => {
            hookResult = r;
          }}
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      mockRecordInstance.destroy.mockClear();
      mockWavesurferInstance.destroy.mockClear();

      act(() => {
        hookResult?.destroy();
      });
      act(() => {
        hookResult?.destroy();
      });

      // Second call is guarded by isDestroyedRef
      expect(mockRecordInstance.destroy).toHaveBeenCalledTimes(1);
      expect(mockWavesurferInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("ignores errors from record.destroy()", async () => {
      mockRecordInstance.destroy.mockImplementation(() => {
        throw new Error("record destroy failed");
      });

      let hookResult: ReturnType<typeof useWaveformRecorder> | null = null;

      render(
        <RecorderConsumer
          autoStart={false}
          onResult={(r) => {
            hookResult = r;
          }}
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      expect(() => {
        act(() => {
          hookResult?.destroy();
        });
      }).not.toThrow();
    });
  });

  describe("cleanup on unmount", () => {
    it("cleans up record and wavesurfer on unmount", async () => {
      let hookResult: ReturnType<typeof useWaveformRecorder> | null = null;
      const { unmount } = render(
        <RecorderConsumer
          autoStart={false}
          onResult={(r) => {
            hookResult = r;
          }}
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());
      expect(hookResult).not.toBeNull();

      mockRecordInstance.destroy.mockClear();
      mockWavesurferInstance.destroy.mockClear();

      unmount();

      expect(mockRecordInstance.destroy).toHaveBeenCalled();
      expect(mockWavesurferInstance.destroy).toHaveBeenCalled();
    });
  });

  describe("WaveSurfer.create config", () => {
    it("merges custom config into WaveSurfer.create options", async () => {
      render(
        <RecorderConsumer
          autoStart={false}
          config={{ height: 48, waveColor: "#00ff00" }}
        />
      );

      await waitFor(() => {
        expect(mockWaveSurferCreate).toHaveBeenCalledWith(
          expect.objectContaining({ height: 48, waveColor: "#00ff00" })
        );
      });
    });
  });
});
