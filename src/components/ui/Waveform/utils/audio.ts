/**
 * Audio loading utilities for Waveform components
 */

export interface AudioLoadResult {
  success: boolean;
  withCors: boolean;
}

/**
 * Loads an audio element with optional CORS
 * @param audioElement The audio element to load
 * @param src The audio source URL
 * @param withCors Whether to load with CORS
 * @param timeoutMs Timeout in milliseconds
 * @returns Promise that resolves to success status
 */
export const loadAudioElement = (
  audioElement: HTMLAudioElement,
  src: string,
  withCors: boolean,
  timeoutMs = 3000
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (withCors) {
      audioElement.crossOrigin = "anonymous";
    } else {
      audioElement.removeAttribute("crossorigin");
    }
    audioElement.src = src;

    const onLoad = () => {
      cleanup();
      resolve(true);
    };

    const onError = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      audioElement.removeEventListener("loadedmetadata", onLoad);
      audioElement.removeEventListener("error", onError);
    };

    if (audioElement.readyState >= 1) {
      resolve(true);
      return;
    }

    audioElement.addEventListener("loadedmetadata", onLoad, { once: true });
    audioElement.addEventListener("error", onError, { once: true });

    // Timeout fallback
    setTimeout(() => {
      cleanup();
      resolve(audioElement.readyState >= 1);
    }, timeoutMs);
  });
};

/**
 * Attempts to load audio with CORS, falling back to no-CORS if needed
 * @param audioElement The audio element to load
 * @param src The audio source URL
 * @returns Promise with load result
 */
export const loadAudioWithFallback = async (
  audioElement: HTMLAudioElement,
  src: string
): Promise<AudioLoadResult> => {
  // Try with CORS first
  const loadedWithCors = await loadAudioElement(audioElement, src, true);

  if (loadedWithCors) {
    return { success: true, withCors: true };
  }
  const loadedWithoutCors = await loadAudioElement(audioElement, src, false);

  return { success: loadedWithoutCors, withCors: false };
};

/**
 * Gets valid duration from an audio element
 * @param audioElement The audio element
 * @returns Valid duration or 0 if invalid
 */
export const getValidDuration = (audioElement: HTMLAudioElement): number => {
  const duration = audioElement.duration;
  return Number.isFinite(duration) && duration > 0 ? duration : 0;
};

/**
 * Generates placeholder peaks for waveform visualization
 * @param length Number of peaks to generate
 * @returns Array of peak values between 0.3 and 0.8
 */
export const generatePlaceholderPeaks = (length: number): number[] => {
  const peaks: number[] = [];
  for (let i = 0; i < length; i++) {
    const value = 0.3 + Math.random() * 0.5;
    peaks.push(value);
  }
  return peaks;
};

/**
 * Calculates the number of peaks based on duration
 * @param duration Duration in seconds
 * @returns Number of peaks to generate
 */
export const calculatePeaksCount = (duration: number): number => {
  let peaksPerSecond = 5;
  if (duration > 60) {
    peaksPerSecond = 2;
  } else if (duration > 30) {
    peaksPerSecond = 3;
  }
  return Math.min(300, Math.max(50, Math.ceil(duration * peaksPerSecond)));
};
