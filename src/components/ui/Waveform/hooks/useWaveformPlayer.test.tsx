import { act, render, renderHook, waitFor } from "@testing-library/react";
import { useWaveformPlayer } from "./useWaveformPlayer";

// ---------------------------------------------------------------------------
// WaveSurfer mock
// ---------------------------------------------------------------------------

type WaveSurferEventCallback = (...args: unknown[]) => void;

const mockWavesurferInstance = {
  destroy: jest.fn(),
  on: jest.fn(),
  seekTo: jest.fn(),
};

const mockWaveSurferCreate = jest.fn(() => mockWavesurferInstance);

jest.mock("wavesurfer.js", () => ({
  __esModule: true,
  default: {
    create: (...args: unknown[]) => mockWaveSurferCreate(...(args as [])),
  },
}));

// ---------------------------------------------------------------------------
// HTMLAudioElement mock helpers
// ---------------------------------------------------------------------------

interface MockAudioElement {
  paused: boolean;
  src: string;
  preload: string;
  duration: number;
  currentTime: number;
  crossOrigin: string | null;
  readyState: number;
  play: jest.Mock;
  pause: jest.Mock;
  removeAttribute: jest.Mock;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  _listeners: Record<string, Array<() => void>>;
  _emit: (event: string) => void;
}

function makeMockAudio(): MockAudioElement {
  const listeners: Record<string, Array<() => void>> = {};
  const audio: MockAudioElement = {
    paused: true,
    src: "",
    preload: "",
    duration: 30,
    currentTime: 0,
    crossOrigin: null,
    readyState: 1, // HAVE_METADATA → loadAudioElement resolves immediately
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    removeAttribute: jest.fn(),
    addEventListener: jest.fn((event: string, cb: () => void) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(cb);
    }),
    removeEventListener: jest.fn(),
    _listeners: listeners,
    _emit(event: string) {
      for (const cb of listeners[event] ?? []) {
        cb();
      }
    },
  };
  return audio;
}

let mockAudioInstances: MockAudioElement[] = [];

beforeEach(() => {
  jest.clearAllMocks();
  mockAudioInstances = [];
  mockWaveSurferCreate.mockReturnValue(mockWavesurferInstance);

  // Replace the global Audio constructor
  global.Audio = jest.fn().mockImplementation(() => {
    const instance = makeMockAudio();
    mockAudioInstances.push(instance);
    return instance;
  }) as unknown as typeof Audio;

  // Default navigator (Chrome-like, non-Firefox)
  Object.defineProperty(global, "navigator", {
    value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
    writable: true,
    configurable: true,
  });
});

// ---------------------------------------------------------------------------
// Helper component: renders the hook with a real DOM container
// ---------------------------------------------------------------------------

interface ConsumerProps {
  src: string;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (e: Error) => void;
  onResult?: (r: ReturnType<typeof useWaveformPlayer>) => void;
}

function PlayerConsumer({
  src,
  onReady,
  onPlay,
  onPause,
  onEnded,
  onError,
  onResult,
}: ConsumerProps) {
  const result = useWaveformPlayer({
    src,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onError,
  });
  onResult?.(result);
  return <div data-testid="container" ref={result.containerRef} />;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useWaveformPlayer", () => {
  describe("initial state", () => {
    it("returns expected shape", () => {
      const { result } = renderHook(() =>
        useWaveformPlayer({ src: "http://example.com/audio.mp3" })
      );
      expect(result.current.isReady).toBe(false);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
      expect(typeof result.current.play).toBe("function");
      expect(typeof result.current.pause).toBe("function");
      expect(typeof result.current.togglePlayPause).toBe("function");
      expect(typeof result.current.seek).toBe("function");
      expect(typeof result.current.destroy).toBe("function");
    });
  });

  describe("initialisation with real DOM container", () => {
    it("initialises WaveSurfer when container and src are present", async () => {
      render(<PlayerConsumer src="http://example.com/audio.mp3" />);

      await waitFor(() => {
        expect(mockWaveSurferCreate).toHaveBeenCalled();
      });
    });

    it("sets duration from audio element after init", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;
      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => {
        expect(hookResult?.duration).toBeGreaterThan(0);
      });
    });

    it("calls onReady callback after WaveSurfer fires the ready event", async () => {
      const onReady = jest.fn();
      // Capture the wavesurfer "on" calls so we can fire "ready" manually
      const eventHandlers: Record<string, WaveSurferEventCallback> = {};
      mockWavesurferInstance.on.mockImplementation(
        (event: string, cb: WaveSurferEventCallback) => {
          eventHandlers[event] = cb;
        }
      );

      render(
        <PlayerConsumer onReady={onReady} src="http://example.com/audio.mp3" />
      );

      // Wait until WaveSurfer.create was called and "ready" handler registered
      await waitFor(() => expect(eventHandlers.ready).toBeDefined());

      act(() => {
        eventHandlers.ready?.();
      });

      expect(onReady).toHaveBeenCalled();
    });

    it("does not initialise when src is empty", async () => {
      render(<PlayerConsumer src="" />);
      // Give async init time to attempt
      await new Promise((r) => setTimeout(r, 50));
      expect(mockWaveSurferCreate).not.toHaveBeenCalled();
    });
  });

  describe("play / pause / togglePlayPause", () => {
    it("play() dispatches the custom audio-play event", async () => {
      const dispatchSpy = jest.spyOn(window, "dispatchEvent");
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      act(() => {
        hookResult?.play();
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "waveform-audio-play" })
      );
      dispatchSpy.mockRestore();
    });

    it("play() calls audio.play()", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      act(() => {
        hookResult?.play();
      });

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }
      expect(audio.play).toHaveBeenCalled();
    });

    it("pause() calls audio.pause()", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      act(() => {
        hookResult?.pause();
      });

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }
      expect(audio.pause).toHaveBeenCalled();
    });

    it("togglePlayPause plays when audio is paused", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }
      // paused = true by default
      act(() => {
        hookResult?.togglePlayPause();
      });

      expect(audio.play).toHaveBeenCalled();
    });

    it("togglePlayPause pauses when audio is playing", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }
      // Simulate playing state
      audio.paused = false;

      act(() => {
        hookResult?.togglePlayPause();
      });

      expect(audio.pause).toHaveBeenCalled();
    });
  });

  describe("seek", () => {
    it("seek() sets audio.currentTime", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }

      act(() => {
        hookResult?.seek(15);
      });

      expect(audio.currentTime).toBe(15);
    });
  });

  describe("audio element event listeners", () => {
    it("sets isPlaying=true when audio 'play' event fires", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }

      act(() => {
        audio._emit("play");
      });

      await waitFor(() => expect(hookResult?.isPlaying).toBe(true));
    });

    it("calls onPlay when audio 'play' event fires", async () => {
      const onPlay = jest.fn();

      render(
        <PlayerConsumer onPlay={onPlay} src="http://example.com/audio.mp3" />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }

      act(() => {
        audio._emit("play");
      });

      expect(onPlay).toHaveBeenCalled();
    });

    it("sets isPlaying=false when audio 'pause' event fires", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }

      // First start playing
      act(() => {
        audio._emit("play");
      });
      await waitFor(() => expect(hookResult?.isPlaying).toBe(true));

      // Then pause
      act(() => {
        audio._emit("pause");
      });

      await waitFor(() => expect(hookResult?.isPlaying).toBe(false));
    });

    it("calls onPause when audio 'pause' event fires", async () => {
      const onPause = jest.fn();

      render(
        <PlayerConsumer onPause={onPause} src="http://example.com/audio.mp3" />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }

      act(() => {
        audio._emit("pause");
      });

      expect(onPause).toHaveBeenCalled();
    });

    it("sets isPlaying=false and calls onEnded when audio 'ended' event fires", async () => {
      const onEnded = jest.fn();
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onEnded={onEnded}
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }

      act(() => {
        audio._emit("ended");
      });

      await waitFor(() => expect(hookResult?.isPlaying).toBe(false));
      expect(onEnded).toHaveBeenCalled();
    });

    it("updates currentTime from 'timeupdate' event", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }
      audio.currentTime = 10;

      act(() => {
        audio._emit("timeupdate");
      });

      await waitFor(() => expect(hookResult?.currentTime).toBe(10));
    });

    it("updates duration from 'loadedmetadata' event", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }
      audio.duration = 120;

      act(() => {
        audio._emit("loadedmetadata");
      });

      await waitFor(() => expect(hookResult?.duration).toBe(120));
    });
  });

  describe("WaveSurfer events", () => {
    it("calls onError when WaveSurfer emits an error event", async () => {
      const onError = jest.fn();
      const eventHandlers: Record<string, WaveSurferEventCallback> = {};
      mockWavesurferInstance.on.mockImplementation(
        (event: string, cb: WaveSurferEventCallback) => {
          eventHandlers[event] = cb;
        }
      );

      render(
        <PlayerConsumer onError={onError} src="http://example.com/audio.mp3" />
      );

      await waitFor(() => expect(eventHandlers.error).toBeDefined());

      const error = new Error("WaveSurfer error");
      act(() => {
        eventHandlers.error?.(error);
      });

      expect(onError).toHaveBeenCalledWith(error);
    });

    it("seeks audio on WaveSurfer click event", async () => {
      const eventHandlers: Record<string, WaveSurferEventCallback> = {};
      mockWavesurferInstance.on.mockImplementation(
        (event: string, cb: WaveSurferEventCallback) => {
          eventHandlers[event] = cb;
        }
      );

      render(<PlayerConsumer src="http://example.com/audio.mp3" />);

      await waitFor(() => expect(eventHandlers.click).toBeDefined());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }
      // duration is 30, relativeX = 0.5 → currentTime = 15
      audio.duration = 30;

      act(() => {
        eventHandlers.click?.(0.5);
      });

      expect(audio.currentTime).toBe(15);
    });
  });

  describe("cross-player coordination", () => {
    it("pauses this player when another player's audio-play event fires", async () => {
      render(<PlayerConsumer src="http://example.com/audio.mp3" />);
      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }

      // Simulate another player starting by dispatching the event with a different playerId
      act(() => {
        window.dispatchEvent(
          new CustomEvent("waveform-audio-play", {
            detail: { playerId: "other-player-id" },
          })
        );
      });

      expect(audio.pause).toHaveBeenCalled();
    });
  });

  describe("destroy", () => {
    it("destroy() cleans up WaveSurfer instance", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      mockWavesurferInstance.destroy.mockClear();

      act(() => {
        hookResult?.destroy();
      });

      expect(mockWavesurferInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it("unmounting cleans up audio element and WaveSurfer", async () => {
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;
      const { unmount } = render(
        <PlayerConsumer
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());
      expect(hookResult).not.toBeNull();

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }
      mockWavesurferInstance.destroy.mockClear();

      unmount();

      expect(audio.pause).toHaveBeenCalled();
      expect(mockWavesurferInstance.destroy).toHaveBeenCalled();
    });
  });

  describe("play() error handling", () => {
    it("calls onError when audio.play() rejects", async () => {
      const onError = jest.fn();
      let hookResult: ReturnType<typeof useWaveformPlayer> | null = null;

      render(
        <PlayerConsumer
          onError={onError}
          onResult={(r) => {
            hookResult = r;
          }}
          src="http://example.com/audio.mp3"
        />
      );

      await waitFor(() => expect(mockWaveSurferCreate).toHaveBeenCalled());

      const audio = mockAudioInstances.at(-1);
      if (!audio) {
        throw new Error("expected audio instance");
      }
      const playError = new Error("play() rejected");
      audio.play.mockRejectedValueOnce(playError);

      act(() => {
        hookResult?.play();
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(playError);
      });
    });
  });
});
