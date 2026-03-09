"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WaveformConfig } from "../types";
import { DEFAULT_WAVEFORM_CONFIG } from "../types";

interface UseWaveformOptions {
  config?: WaveformConfig;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

interface UseWaveformReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  wavesurfer: any | null;
  isReady: boolean;
  destroy: () => void;
}

export function useWaveform({
  config = {},
  onReady,
  onError,
}: UseWaveformOptions = {}): UseWaveformReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  // Store callbacks in refs to avoid dependency issues
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_WAVEFORM_CONFIG, ...config }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config]
  );

  const destroy = useCallback(() => {
    if (wavesurferRef.current) {
      try {
        wavesurferRef.current.destroy();
      } catch {
        // Ignore errors when destroying (e.g., AudioContext already closed)
      }
      wavesurferRef.current = null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initWaveSurfer = async () => {
      if (!containerRef.current) {
        return;
      }

      try {
        const WaveSurfer = (await import("wavesurfer.js")).default;

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

        wavesurferRef.current = wavesurfer;

        if (isMounted) {
          setIsReady(true);
          onReadyRef.current?.();
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
      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.destroy();
        } catch {
          // Ignore
        }
        wavesurferRef.current = null;
      }
    };
  }, [mergedConfig]);

  return {
    containerRef,
    wavesurfer: wavesurferRef.current,
    isReady,
    destroy,
  };
}
