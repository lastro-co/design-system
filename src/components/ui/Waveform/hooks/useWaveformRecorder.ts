"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WaveformConfig } from "../types";
import { DEFAULT_WAVEFORM_CONFIG } from "../types";
import { getBestAudioMimeType } from "../utils";

type RecordingState = "idle" | "recording" | "paused";

interface UseWaveformRecorderOptions {
  config?: WaveformConfig;
  autoStart?: boolean;
  onRecordEnd?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

interface UseWaveformRecorderReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  recordingState: RecordingState;
  duration: number;
  startRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  destroy: () => void;
}

export function useWaveformRecorder({
  config = {},
  autoStart = true,
  onRecordEnd,
  onError,
}: UseWaveformRecorderOptions = {}): UseWaveformRecorderReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);
  const recordRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDestroyedRef = useRef(false);

  // Store callbacks in refs to avoid dependency issues
  const onRecordEndRef = useRef(onRecordEnd);
  const onErrorRef = useRef(onError);
  onRecordEndRef.current = onRecordEnd;
  onErrorRef.current = onError;

  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);

  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_WAVEFORM_CONFIG, ...config }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config]
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const destroy = useCallback(() => {
    if (isDestroyedRef.current) {
      return;
    }
    isDestroyedRef.current = true;

    stopTimer();

    if (recordRef.current) {
      try {
        recordRef.current.destroy();
      } catch {
        // Ignore errors when destroying
      }
      recordRef.current = null;
    }

    if (wavesurferRef.current) {
      try {
        wavesurferRef.current.destroy();
      } catch {
        // Ignore errors when destroying (e.g., AudioContext already closed)
      }
      wavesurferRef.current = null;
    }
  }, [stopTimer]);

  const startRecording = useCallback(async () => {
    if (!recordRef.current) {
      return;
    }

    try {
      await recordRef.current.startRecording();
      setRecordingState("recording");
      startTimer();
    } catch (error) {
      onErrorRef.current?.(error as Error);
    }
  }, [startTimer]);

  const pauseRecording = useCallback(() => {
    if (!recordRef.current || recordingState !== "recording") {
      return;
    }

    recordRef.current.pauseRecording();
    setRecordingState("paused");
    stopTimer();
  }, [recordingState, stopTimer]);

  const resumeRecording = useCallback(() => {
    if (!recordRef.current || recordingState !== "paused") {
      return;
    }

    recordRef.current.resumeRecording();
    setRecordingState("recording");
    startTimer();
  }, [recordingState, startTimer]);

  const stopRecording = useCallback(() => {
    if (!recordRef.current) {
      return;
    }

    recordRef.current.stopRecording();
    setRecordingState("idle");
    stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    let isMounted = true;
    isDestroyedRef.current = false;

    const initWaveSurfer = async () => {
      if (!containerRef.current) {
        return;
      }

      try {
        const WaveSurfer = (await import("wavesurfer.js")).default;
        const RecordPlugin = (
          await import("wavesurfer.js/dist/plugins/record.esm.js")
        ).default;

        if (!isMounted || !containerRef.current) {
          return;
        }

        const wavesurfer = WaveSurfer.create({
          container: containerRef.current,
          height: mergedConfig.height,
          normalize: mergedConfig.normalize,
          waveColor: mergedConfig.waveColor,
          progressColor: mergedConfig.progressColor,
          cursorColor: mergedConfig.cursorColor,
          cursorWidth: mergedConfig.cursorWidth,
          barWidth: mergedConfig.barWidth,
          barGap: mergedConfig.barGap,
          barRadius: mergedConfig.barRadius,
          barHeight: mergedConfig.barHeight,
          fillParent: true,
          interact: mergedConfig.interact,
          autoScroll: true,
          autoCenter: true,
          sampleRate: 8000,
        });

        const record = wavesurfer.registerPlugin(
          RecordPlugin.create({
            scrollingWaveform: true,
            renderRecordedAudio: false,
            mimeType: getBestAudioMimeType(),
          })
        );

        record.on("record-end", (blob: Blob) => {
          if (isMounted) {
            onRecordEndRef.current?.(blob);
          }
        });

        wavesurferRef.current = wavesurfer;
        recordRef.current = record;

        if (isMounted && autoStart) {
          await record.startRecording();
          setRecordingState("recording");
          setDuration(0);
          startTimer();
        }
      } catch (error) {
        if (isMounted) {
          onErrorRef.current?.(error as Error);
        }
      }
    };

    initWaveSurfer();

    return () => {
      isMounted = false;
      stopTimer();

      if (recordRef.current) {
        try {
          recordRef.current.destroy();
        } catch {
          // Ignore
        }
        recordRef.current = null;
      }

      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.destroy();
        } catch {
          // Ignore
        }
        wavesurferRef.current = null;
      }
    };
  }, [autoStart, mergedConfig, startTimer, stopTimer]);

  return {
    containerRef,
    recordingState,
    duration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    destroy,
  };
}
