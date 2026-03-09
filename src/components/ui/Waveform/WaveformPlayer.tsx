"use client";

import { cn } from "../../../lib/utils";
import { PauseIcon, PlayIcon } from "../../icons";
import { useWaveformPlayer } from "./hooks";
import { formatDuration, type WaveformPlayerProps } from "./types";

interface WaveformPlayerComponentProps extends WaveformPlayerProps {
  /** Show play/pause button */
  showControls?: boolean;
  /** Show duration */
  showDuration?: boolean;
  /** Called when an error occurs */
  onError?: (error: Error) => void;
}

export function WaveformPlayer({
  src,
  config,
  className,
  showControls = true,
  showDuration = true,
  onEnded,
  onPlay,
  onPause,
  onError,
}: WaveformPlayerComponentProps) {
  const {
    containerRef,
    isReady,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
  } = useWaveformPlayer({
    src,
    config,
    onEnded,
    onPlay,
    onPause,
    onError,
  });

  return (
    <div className={cn("flex items-center gap-4 px-4", className)}>
      {showControls && (
        <button
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          className="ml-4 shrink-0 disabled:opacity-50"
          disabled={!isReady}
          onClick={togglePlayPause}
          type="button"
        >
          {isPlaying ? (
            <PauseIcon
              className="cursor-pointer text-gray-600 transition-all duration-200 ease-out hover:text-gray-900"
              size="md"
            />
          ) : (
            <PlayIcon
              className="cursor-pointer text-gray-600 transition-all duration-200 ease-out hover:text-gray-900"
              size="md"
            />
          )}
        </button>
      )}

      <div
        className="min-h-[32px] min-w-[100px] max-w-[200px] flex-1"
        ref={containerRef}
      />

      {showDuration && (
        <span className="shrink-0 font-mono text-gray-900 text-xs">
          {formatDuration(
            currentTime > 0 || isPlaying ? currentTime : duration
          )}
        </span>
      )}
    </div>
  );
}
