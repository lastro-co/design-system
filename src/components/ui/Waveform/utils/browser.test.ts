import {
  getAudioExtension,
  getBestAudioMimeType,
  isChrome,
  isEdge,
  isFirefox,
  isSafari,
  normalizeAudioMimeType,
} from "./browser";

// ---------------------------------------------------------------------------
// Browser detection helpers
// ---------------------------------------------------------------------------

describe("isFirefox", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it("returns true when userAgent contains 'Firefox'", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Firefox/120.0" },
      writable: true,
      configurable: true,
    });
    expect(isFirefox()).toBe(true);
  });

  it("returns false when userAgent does not contain 'Firefox'", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0" },
      writable: true,
      configurable: true,
    });
    expect(isFirefox()).toBe(false);
  });

  it("returns false when navigator is undefined", () => {
    Object.defineProperty(global, "navigator", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(isFirefox()).toBe(false);
  });
});

describe("isEdge", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it("returns true when userAgent contains 'Edg'", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Edg/120.0" },
      writable: true,
      configurable: true,
    });
    expect(isEdge()).toBe(true);
  });

  it("returns false when userAgent does not contain 'Edg'", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0" },
      writable: true,
      configurable: true,
    });
    expect(isEdge()).toBe(false);
  });

  it("returns false when navigator is undefined", () => {
    Object.defineProperty(global, "navigator", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(isEdge()).toBe(false);
  });
});

describe("isSafari", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it("returns true for a Safari-only userAgent (contains Safari but not Chrome)", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 AppleWebKit/605 Safari/604" },
      writable: true,
      configurable: true,
    });
    expect(isSafari()).toBe(true);
  });

  it("returns false when userAgent contains both Safari and Chrome (Chrome browser)", () => {
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36",
      },
      writable: true,
      configurable: true,
    });
    expect(isSafari()).toBe(false);
  });

  it("returns false when userAgent contains neither Safari nor Chrome", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Firefox/120.0" },
      writable: true,
      configurable: true,
    });
    expect(isSafari()).toBe(false);
  });

  it("returns false when navigator is undefined", () => {
    Object.defineProperty(global, "navigator", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(isSafari()).toBe(false);
  });
});

describe("isChrome", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it("returns true when userAgent contains Chrome but not Edg", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
      writable: true,
      configurable: true,
    });
    expect(isChrome()).toBe(true);
  });

  it("returns false when userAgent contains both Chrome and Edg (Edge browser)", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Edg/120.0" },
      writable: true,
      configurable: true,
    });
    expect(isChrome()).toBe(false);
  });

  it("returns false when userAgent does not contain Chrome", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Firefox/120.0" },
      writable: true,
      configurable: true,
    });
    expect(isChrome()).toBe(false);
  });

  it("returns false when navigator is undefined", () => {
    Object.defineProperty(global, "navigator", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(isChrome()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getBestAudioMimeType
// ---------------------------------------------------------------------------

describe("getBestAudioMimeType", () => {
  const originalMediaRecorder = global.MediaRecorder;
  const originalNavigator = global.navigator;

  afterEach(() => {
    global.MediaRecorder = originalMediaRecorder;
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it("returns 'audio/webm' when MediaRecorder is undefined", () => {
    (global as any).MediaRecorder = undefined;
    expect(getBestAudioMimeType()).toBe("audio/webm");
  });

  it("returns first supported Firefox type ('audio/ogg;codecs=opus') in Firefox", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Firefox/120.0" },
      writable: true,
      configurable: true,
    });
    global.MediaRecorder = {
      isTypeSupported: (type: string) => type === "audio/ogg;codecs=opus",
    } as any;
    expect(getBestAudioMimeType()).toBe("audio/ogg;codecs=opus");
  });

  it("falls through Firefox types and returns 'audio/ogg' when none are supported in Firefox", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Firefox/120.0" },
      writable: true,
      configurable: true,
    });
    global.MediaRecorder = {
      isTypeSupported: () => false,
    } as any;
    expect(getBestAudioMimeType()).toBe("audio/ogg");
  });

  it("returns 'audio/webm;codecs=opus' as first supported type in Chrome", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
      writable: true,
      configurable: true,
    });
    global.MediaRecorder = {
      isTypeSupported: (type: string) => type === "audio/webm;codecs=opus",
    } as any;
    expect(getBestAudioMimeType()).toBe("audio/webm;codecs=opus");
  });

  it("returns 'audio/webm' fallback when no types are supported in Chrome", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
      writable: true,
      configurable: true,
    });
    global.MediaRecorder = {
      isTypeSupported: () => false,
    } as any;
    expect(getBestAudioMimeType()).toBe("audio/webm");
  });

  it("returns 'audio/mp4' when only mp4 is supported (non-Firefox)", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
      writable: true,
      configurable: true,
    });
    global.MediaRecorder = {
      isTypeSupported: (type: string) => type === "audio/mp4",
    } as any;
    expect(getBestAudioMimeType()).toBe("audio/mp4");
  });
});

// ---------------------------------------------------------------------------
// normalizeAudioMimeType
// ---------------------------------------------------------------------------

describe("normalizeAudioMimeType", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it("returns 'audio/webm' for empty string in a non-Firefox browser", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
      writable: true,
      configurable: true,
    });
    expect(normalizeAudioMimeType("")).toBe("audio/webm");
  });

  it("returns 'audio/ogg' for empty string in Firefox", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Firefox/120.0" },
      writable: true,
      configurable: true,
    });
    expect(normalizeAudioMimeType("")).toBe("audio/ogg");
  });

  it("corrects 'video/webm' to 'audio/webm' in a non-Firefox browser", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
      writable: true,
      configurable: true,
    });
    expect(normalizeAudioMimeType("video/webm")).toBe("audio/webm");
  });

  it("corrects 'application/octet-stream' to 'audio/webm' in a non-Firefox browser", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
      writable: true,
      configurable: true,
    });
    expect(normalizeAudioMimeType("application/octet-stream")).toBe(
      "audio/webm"
    );
  });

  it("corrects 'video/webm' to 'audio/ogg' in Firefox", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Firefox/120.0" },
      writable: true,
      configurable: true,
    });
    expect(normalizeAudioMimeType("video/webm")).toBe("audio/ogg");
  });

  it("adds codecs to 'audio/ogg' when codecs are missing", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
      writable: true,
      configurable: true,
    });
    expect(normalizeAudioMimeType("audio/ogg")).toBe("audio/ogg; codecs=opus");
  });

  it("adds codecs to 'audio/webm' when codecs are missing", () => {
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0 Safari/537.36" },
      writable: true,
      configurable: true,
    });
    expect(normalizeAudioMimeType("audio/webm")).toBe(
      "audio/webm; codecs=opus"
    );
  });

  it("returns the same type when already fully specified (audio/webm;codecs=opus)", () => {
    expect(normalizeAudioMimeType("audio/webm;codecs=opus")).toBe(
      "audio/webm;codecs=opus"
    );
  });

  it("returns the same type for audio/mp4", () => {
    expect(normalizeAudioMimeType("audio/mp4")).toBe("audio/mp4");
  });
});

// ---------------------------------------------------------------------------
// getAudioExtension
// ---------------------------------------------------------------------------

describe("getAudioExtension", () => {
  it("returns 'ogg' for ogg mime types", () => {
    expect(getAudioExtension("audio/ogg")).toBe("ogg");
    expect(getAudioExtension("audio/ogg;codecs=opus")).toBe("ogg");
  });

  it("returns 'm4a' for mp4 mime types", () => {
    expect(getAudioExtension("audio/mp4")).toBe("m4a");
  });

  it("returns 'webm' for webm mime types", () => {
    expect(getAudioExtension("audio/webm")).toBe("webm");
    expect(getAudioExtension("audio/webm;codecs=opus")).toBe("webm");
  });

  it("returns 'webm' as default for unknown mime types", () => {
    expect(getAudioExtension("audio/unknown")).toBe("webm");
    expect(getAudioExtension("")).toBe("webm");
  });
});
