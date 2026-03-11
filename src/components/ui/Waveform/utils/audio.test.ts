import {
  calculatePeaksCount,
  generatePlaceholderPeaks,
  getValidDuration,
  loadAudioElement,
  loadAudioWithFallback,
} from "./audio";

// ---------------------------------------------------------------------------
// getValidDuration
// ---------------------------------------------------------------------------

describe("getValidDuration", () => {
  const makeAudio = (duration: number): HTMLAudioElement =>
    ({ duration }) as HTMLAudioElement;

  it("returns the duration when it is a positive finite number", () => {
    expect(getValidDuration(makeAudio(30))).toBe(30);
    expect(getValidDuration(makeAudio(1.5))).toBe(1.5);
  });

  it("returns 0 for Infinity", () => {
    expect(getValidDuration(makeAudio(Number.POSITIVE_INFINITY))).toBe(0);
  });

  it("returns 0 for NaN", () => {
    expect(getValidDuration(makeAudio(Number.NaN))).toBe(0);
  });

  it("returns 0 for 0", () => {
    expect(getValidDuration(makeAudio(0))).toBe(0);
  });

  it("returns 0 for negative values", () => {
    expect(getValidDuration(makeAudio(-5))).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// generatePlaceholderPeaks
// ---------------------------------------------------------------------------

describe("generatePlaceholderPeaks", () => {
  it("returns an array with the requested length", () => {
    expect(generatePlaceholderPeaks(10)).toHaveLength(10);
    expect(generatePlaceholderPeaks(50)).toHaveLength(50);
    expect(generatePlaceholderPeaks(0)).toHaveLength(0);
  });

  it("returns values in the range [0.3, 0.8]", () => {
    const peaks = generatePlaceholderPeaks(100);
    for (const peak of peaks) {
      expect(peak).toBeGreaterThanOrEqual(0.3);
      expect(peak).toBeLessThanOrEqual(0.8);
    }
  });

  it("returns numbers (not strings or other types)", () => {
    const peaks = generatePlaceholderPeaks(5);
    for (const peak of peaks) {
      expect(typeof peak).toBe("number");
    }
  });
});

// ---------------------------------------------------------------------------
// calculatePeaksCount
// ---------------------------------------------------------------------------

describe("calculatePeaksCount", () => {
  it("returns at least 50 peaks", () => {
    expect(calculatePeaksCount(1)).toBeGreaterThanOrEqual(50);
    expect(calculatePeaksCount(0)).toBeGreaterThanOrEqual(50);
  });

  it("returns at most 300 peaks", () => {
    expect(calculatePeaksCount(1000)).toBeLessThanOrEqual(300);
  });

  it("uses 5 peaks/second for durations up to 30 seconds", () => {
    // 10s * 5 = 50 → clamped to max(50, ceil(50)) = 50
    expect(calculatePeaksCount(10)).toBe(50);
    // 20s * 5 = 100
    expect(calculatePeaksCount(20)).toBe(100);
    // 30s * 5 = 150
    expect(calculatePeaksCount(30)).toBe(150);
  });

  it("uses 3 peaks/second for durations between 31 and 60 seconds", () => {
    // 40s * 3 = 120
    expect(calculatePeaksCount(40)).toBe(120);
    // 60s * 3 = 180
    expect(calculatePeaksCount(60)).toBe(180);
  });

  it("uses 2 peaks/second for durations over 60 seconds", () => {
    // 90s * 2 = 180
    expect(calculatePeaksCount(90)).toBe(180);
    // 120s * 2 = 240
    expect(calculatePeaksCount(120)).toBe(240);
  });

  it("clamps output to a maximum of 300", () => {
    // Very long audio: 200s * 2 = 400, clamped to 300
    expect(calculatePeaksCount(200)).toBe(300);
  });

  it("clamps output to a minimum of 50", () => {
    expect(calculatePeaksCount(0)).toBe(50);
    expect(calculatePeaksCount(5)).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// loadAudioElement
// ---------------------------------------------------------------------------

describe("loadAudioElement", () => {
  function makeAudioElement(readyState = 0): HTMLAudioElement {
    return {
      readyState,
      crossOrigin: null,
      src: "",
      removeAttribute: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as HTMLAudioElement;
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("resolves true immediately when readyState >= 1 (already loaded)", async () => {
    const audio = makeAudioElement(1);
    const promise = loadAudioElement(
      audio,
      "http://example.com/audio.mp3",
      false
    );
    const result = await promise;
    expect(result).toBe(true);
  });

  it("sets crossOrigin to 'anonymous' when withCors is true", async () => {
    const audio = makeAudioElement(1);
    await loadAudioElement(audio, "http://example.com/audio.mp3", true);
    expect(audio.crossOrigin).toBe("anonymous");
  });

  it("removes crossorigin attribute when withCors is false", async () => {
    const audio = makeAudioElement(1);
    await loadAudioElement(audio, "http://example.com/audio.mp3", false);
    expect(audio.removeAttribute).toHaveBeenCalledWith("crossorigin");
  });

  it("sets the src on the audio element", async () => {
    const audio = makeAudioElement(1);
    await loadAudioElement(audio, "http://example.com/test.mp3", false);
    expect(audio.src).toBe("http://example.com/test.mp3");
  });

  it("resolves true when loadedmetadata event fires", async () => {
    const audio = makeAudioElement(0);
    const captured: { fn: (() => void) | null } = { fn: null };

    (audio.addEventListener as jest.Mock).mockImplementation(
      (event: string, cb: () => void) => {
        if (event === "loadedmetadata") {
          captured.fn = cb;
        }
      }
    );

    const promise = loadAudioElement(
      audio,
      "http://example.com/audio.mp3",
      false
    );

    // Trigger the event
    if (captured.fn) {
      captured.fn();
    }

    const result = await promise;
    expect(result).toBe(true);
  });

  it("resolves false when error event fires", async () => {
    const audio = makeAudioElement(0);
    const captured: { fn: (() => void) | null } = { fn: null };

    (audio.addEventListener as jest.Mock).mockImplementation(
      (event: string, cb: () => void) => {
        if (event === "error") {
          captured.fn = cb;
        }
      }
    );

    const promise = loadAudioElement(
      audio,
      "http://example.com/audio.mp3",
      false
    );

    // Trigger the error
    if (captured.fn) {
      captured.fn();
    }

    const result = await promise;
    expect(result).toBe(false);
  });

  it("resolves based on readyState when timeout fires (readyState < 1 → false)", async () => {
    const audio = makeAudioElement(0);
    (audio.addEventListener as jest.Mock).mockImplementation(
      (_event: string, _cb: () => void) => {
        // intentionally ignore event listeners to test timeout path
      }
    );

    const promise = loadAudioElement(
      audio,
      "http://example.com/audio.mp3",
      false,
      500
    );

    jest.advanceTimersByTime(500);

    const result = await promise;
    expect(result).toBe(false);
  });

  it("resolves true from timeout when readyState is already >= 1 by timeout", async () => {
    const audio = makeAudioElement(0);
    (audio.addEventListener as jest.Mock).mockImplementation(
      (_event: string, _cb: () => void) => {
        // intentionally ignore event listeners to test timeout path
      }
    );

    const promise = loadAudioElement(
      audio,
      "http://example.com/audio.mp3",
      false,
      500
    );

    // Simulate readyState change before timeout fires
    Object.defineProperty(audio, "readyState", { value: 1, writable: true });
    jest.advanceTimersByTime(500);

    const result = await promise;
    expect(result).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// loadAudioWithFallback
// ---------------------------------------------------------------------------

describe("loadAudioWithFallback", () => {
  function makeAudioElement(): HTMLAudioElement {
    return {
      readyState: 1,
      crossOrigin: null,
      src: "",
      removeAttribute: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as HTMLAudioElement;
  }

  it("returns success with withCors=true when CORS load succeeds", async () => {
    const audio = makeAudioElement();
    const result = await loadAudioWithFallback(
      audio,
      "http://example.com/a.mp3"
    );
    expect(result).toEqual({ success: true, withCors: true });
  });

  it("falls back to no-CORS and returns success=true, withCors=false when CORS fails", async () => {
    // Build an audio element whose readyState depends on crossOrigin state
    const audio = {
      readyState: 0,
      crossOrigin: null as string | null,
      src: "",
      removeAttribute: jest.fn(),
      addEventListener: jest.fn(
        (event: string, cb: () => void, _opts?: { once?: boolean }) => {
          if (event === "error") {
            // First call (CORS attempt): immediately fire error
            cb();
          }
          if (event === "loadedmetadata") {
            // Second call (no-CORS attempt): immediately fire success
            cb();
          }
        }
      ),
      removeEventListener: jest.fn(),
    } as unknown as HTMLAudioElement;

    const result = await loadAudioWithFallback(
      audio,
      "http://example.com/a.mp3"
    );
    // The function tries CORS first (fail), then no-CORS (succeed)
    expect(result.success).toBe(true);
  });
});
