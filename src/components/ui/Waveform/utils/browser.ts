/**
 * Browser detection utilities for Waveform components
 */

/**
 * Detects if the current browser is Firefox
 */
export const isFirefox = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }
  return navigator.userAgent.includes("Firefox");
};

/**
 * Detects if the current browser is Edge (legacy or Chromium-based)
 */
export const isEdge = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }
  return navigator.userAgent.includes("Edg");
};

/**
 * Detects if the current browser is Safari
 */
export const isSafari = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }
  return (
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome")
  );
};

/**
 * Detects if the current browser is Chrome
 */
export const isChrome = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }
  return (
    navigator.userAgent.includes("Chrome") &&
    !navigator.userAgent.includes("Edg")
  );
};

/**
 * Gets the best supported audio MIME type for recording
 * @returns The best supported MIME type for the current browser
 */
export const getBestAudioMimeType = (): string => {
  if (typeof MediaRecorder === "undefined") {
    return "audio/webm";
  }

  // Firefox prefers ogg
  if (isFirefox()) {
    const firefoxTypes = [
      "audio/ogg;codecs=opus",
      "audio/ogg",
      "audio/webm;codecs=opus",
      "audio/webm",
    ];
    for (const type of firefoxTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "audio/ogg";
  }

  // Chrome, Edge, and others prefer webm
  const defaultTypes = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const type of defaultTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return "audio/webm";
};

/**
 * Normalizes a MIME type to ensure it's a proper audio type
 * Some browsers incorrectly report video/webm for audio-only recordings
 * @param mimeType The original MIME type
 * @returns The corrected audio MIME type
 */
export const normalizeAudioMimeType = (mimeType: string): string => {
  if (!mimeType) {
    return isFirefox() ? "audio/ogg" : "audio/webm";
  }

  // Fix incorrect video/* or application/* types
  if (
    mimeType.startsWith("video/") ||
    mimeType.startsWith("application/") ||
    !mimeType.startsWith("audio/")
  ) {
    return isFirefox() ? "audio/ogg" : "audio/webm";
  }

  // Add codec info if missing
  if (mimeType === "audio/ogg" && !mimeType.includes("codecs")) {
    return "audio/ogg; codecs=opus";
  }
  if (mimeType === "audio/webm" && !mimeType.includes("codecs")) {
    return "audio/webm; codecs=opus";
  }

  return mimeType;
};

/**
 * Gets the file extension for an audio MIME type
 * @param mimeType The audio MIME type
 * @returns The file extension (without dot)
 */
export const getAudioExtension = (mimeType: string): string => {
  if (mimeType.includes("ogg")) {
    return "ogg";
  }
  if (mimeType.includes("mp4")) {
    return "m4a";
  }
  return "webm";
};
