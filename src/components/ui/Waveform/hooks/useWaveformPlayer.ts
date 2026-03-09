"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { WaveformConfig } from "../types";
import { DEFAULT_PLAYER_CONFIG } from "../types";
import {
  calculatePeaksCount,
  generatePlaceholderPeaks,
  getValidDuration,
  isFirefox,
  loadAudioElement,
} from "../utils";

// Custom event for coordinating audio playback - only one audio should play at a time
const AUDIO_PLAY_EVENT = "waveform-audio-play";

interface UseWaveformPlayerOptions {
  /** Audio source URL */
  src: string;
  /** Waveform configuration */
  config?: WaveformConfig;
  /** Called when the player is ready */
  onReady?: () => void;
  /** Called when playback starts */
  onPlay?: () => void;
  /** Called when playback pauses */
  onPause?: () => void;
  /** Called when playback ends */
  onEnded?: () => void;
  /** Called when an error occurs */
  onError?: (error: Error) => void;
}

interface UseWaveformPlayerReturn {
  /** Ref to attach to the waveform container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the player is ready to play */
  isReady: boolean;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Start playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Toggle play/pause */
  togglePlayPause: () => void;
  /** Seek to a specific time */
  seek: (time: number) => void;
  /** Destroy the player instance */
  destroy: () => void;
}

export function useWaveformPlayer({
  src,
  config = {},
  onReady,
  onPlay,
  onPause,
  onEnded,
  onError,
}: UseWaveformPlayerOptions): UseWaveformPlayerReturn {
  const playerId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Store callbacks in refs to avoid dependency issues
  const callbackRefs = useRef({ onReady, onPlay, onPause, onEnded, onError });
  callbackRefs.current = { onReady, onPlay, onPause, onEnded, onError };

  // Store config in ref to avoid re-initialization on re-renders
  const configRef = useRef({ ...DEFAULT_PLAYER_CONFIG, ...config });

  // State
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Listen for other audio players starting - pause this one if another starts
  useEffect(() => {
    const handleOtherAudioPlay = (event: CustomEvent<{ playerId: string }>) => {
      if (event.detail.playerId !== playerId && audioRef.current) {
        audioRef.current.pause();
      }
    };

    window.addEventListener(
      AUDIO_PLAY_EVENT,
      handleOtherAudioPlay as EventListener
    );

    return () => {
      window.removeEventListener(
        AUDIO_PLAY_EVENT,
        handleOtherAudioPlay as EventListener
      );
    };
  }, [playerId]);

  // Cleanup wavesurfer instance
  const destroy = useCallback(() => {
    if (wavesurferRef.current) {
      try {
        wavesurferRef.current.destroy();
      } catch {
        // Ignore errors when destroying
      }
      wavesurferRef.current = null;
    }
  }, []);

  // Play audio
  const play = useCallback(() => {
    // Notify other players to stop
    window.dispatchEvent(
      new CustomEvent(AUDIO_PLAY_EVENT, { detail: { playerId } })
    );

    if (audioRef.current) {
      audioRef.current.play().catch((error: Error) => {
        callbackRefs.current.onError?.(error);
      });
    }
  }, [playerId]);

  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        play();
      } else {
        pause();
      }
    }
  }, [play, pause]);

  // Seek to a specific time
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  // Initialize wavesurfer
  useEffect(() => {
    let isMounted = true;

    const initWaveSurfer = async () => {
      if (!containerRef.current || !src) {
        return;
      }

      try {
        const WaveSurfer = (await import("wavesurfer.js")).default;

        if (!isMounted || !containerRef.current) {
          return;
        }

        // Create audio element
        const audioElement = new Audio();
        audioElement.preload = "metadata";
        audioRef.current = audioElement;

        // Load audio - try with CORS first (non-Firefox), fall back to no-CORS
        if (isFirefox()) {
          await loadAudioElement(audioElement, src, false);
        } else {
          const loadedWithCors = await loadAudioElement(
            audioElement,
            src,
            true
          );
          if (!loadedWithCors) {
            await loadAudioElement(audioElement, src, false);
          }
        }

        if (!isMounted || !containerRef.current) {
          return;
        }

        // Get duration
        const validDuration = getValidDuration(audioElement);
        const visualDuration = validDuration > 0 ? validDuration : 30;

        if (validDuration > 0) {
          setDuration(validDuration);
        }

        // Generate peaks for visualization
        const peaksCount = calculatePeaksCount(visualDuration);
        const placeholderPeaks = generatePlaceholderPeaks(peaksCount);

        // Create wavesurfer for visualization only (audio playback via native element)
        const waveConfig = configRef.current;
        const wavesurfer = WaveSurfer.create({
          container: containerRef.current,
          height: waveConfig.height,
          normalize: waveConfig.normalize,
          waveColor: waveConfig.waveColor,
          progressColor: waveConfig.progressColor,
          cursorColor: waveConfig.cursorColor,
          cursorWidth: waveConfig.cursorWidth,
          barWidth: waveConfig.barWidth,
          barGap: waveConfig.barGap,
          barRadius: waveConfig.barRadius,
          barHeight: waveConfig.barHeight,
          fillParent: true,
          interact: waveConfig.interact,
          peaks: [placeholderPeaks],
          duration: visualDuration,
        });

        // Setup native audio event listeners - always use audio element for playback
        audioElement.addEventListener("play", () => {
          if (isMounted) {
            setIsPlaying(true);
            callbackRefs.current.onPlay?.();
          }
        });

        audioElement.addEventListener("pause", () => {
          if (isMounted) {
            setIsPlaying(false);
            callbackRefs.current.onPause?.();
          }
        });

        audioElement.addEventListener("ended", () => {
          if (isMounted) {
            setIsPlaying(false);
            wavesurfer.seekTo(0);
            callbackRefs.current.onEnded?.();
          }
        });

        audioElement.addEventListener("timeupdate", () => {
          if (isMounted) {
            setCurrentTime(audioElement.currentTime);
            // Sync wavesurfer progress
            const dur = audioElement.duration;
            if (Number.isFinite(dur) && dur > 0) {
              wavesurfer.seekTo(audioElement.currentTime / dur);
            }
          }
        });

        audioElement.addEventListener("loadedmetadata", () => {
          if (isMounted) {
            const dur = getValidDuration(audioElement);
            if (dur > 0) {
              setDuration(dur);
            }
          }
        });

        // Handle click to seek on waveform
        wavesurfer.on("click", (relativeX: number) => {
          if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
            audioRef.current.currentTime =
              relativeX * audioRef.current.duration;
          }
        });

        // Wavesurfer ready event
        wavesurfer.on("ready", () => {
          if (isMounted) {
            setIsReady(true);
            callbackRefs.current.onReady?.();
          }
        });

        wavesurfer.on("error", (error: Error) => {
          if (isMounted) {
            callbackRefs.current.onError?.(error);
          }
        });

        wavesurferRef.current = wavesurfer;
      } catch (error) {
        if (isMounted) {
          callbackRefs.current.onError?.(error as Error);
        }
      }
    };

    initWaveSurfer();

    return () => {
      isMounted = false;
      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.destroy();
        } catch {
          // Ignore
        }
        wavesurferRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [src]);

  return {
    containerRef,
    isReady,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    togglePlayPause,
    seek,
    destroy,
  };
}
