"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { MicIcon, PaperPlaneIcon, PauseIcon, TrashIcon } from "../../icons";
import { IconButton } from "../IconButton";
import { Spinner } from "../Spinner";
import { useWaveformRecorder } from "./hooks";
import { formatDuration, type WaveformRecorderProps } from "./types";

export function WaveformRecorder({
  config,
  className,
  autoStart = true,
  loading = false,
  onCancel,
  onSend,
}: WaveformRecorderProps) {
  const {
    containerRef,
    recordingState,
    duration,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useWaveformRecorder({
    config,
    autoStart,
    onRecordEnd: onSend,
    onError: () => {
      onCancel();
    },
  });

  const handlePauseResume = useCallback(() => {
    if (recordingState === "recording") {
      pauseRecording();
    } else if (recordingState === "paused") {
      resumeRecording();
    }
  }, [recordingState, pauseRecording, resumeRecording]);

  const handleDelete = useCallback(() => {
    stopRecording();
    onCancel();
  }, [stopRecording, onCancel]);

  const handleSend = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  const isRecording = recordingState === "recording";
  const isPaused = recordingState === "paused";

  return (
    <div className={cn("flex flex-1 items-center gap-2", className)}>
      <IconButton
        aria-label="Excluir gravação"
        className="size-[36px] hover:border-none"
        disabled={loading}
        onClick={handleDelete}
        shape="circular"
        size="small"
        variant="ghost"
      >
        <TrashIcon
          className={cn(
            "transition-all duration-200 ease-out",
            loading ? "cursor-not-allowed" : "cursor-pointer hover:text-red-600"
          )}
          color="gray-600"
          size="lg"
        />
      </IconButton>

      <div className="flex flex-1 items-center gap-2">
        <div className="min-w-0 flex-1" ref={containerRef} />

        <span className="min-w-[40px] shrink-0 text-right font-mono text-gray-600 text-sm">
          {formatDuration(duration)}
        </span>
      </div>

      <IconButton
        aria-label={isRecording ? "Pausar" : "Continuar gravação"}
        className="size-[36px] rounded-full border border-gray-300 hover:border-purple-300 hover:bg-purple-50"
        disabled={loading}
        onClick={handlePauseResume}
        shape="circular"
        size="small"
        variant="ghost"
      >
        {isRecording ? (
          <PauseIcon
            className={cn(
              "transition-all duration-200 ease-out",
              loading ? "cursor-not-allowed" : "cursor-pointer"
            )}
            color="purple-800"
            size="md"
          />
        ) : (
          <MicIcon
            className={cn(
              "transition-all duration-200 ease-out",
              loading ? "cursor-not-allowed" : "cursor-pointer"
            )}
            color="purple-800"
            size="md"
          />
        )}
      </IconButton>

      <IconButton
        aria-label="Enviar áudio"
        className="size-[36px] bg-purple-800 hover:bg-purple-700"
        disabled={loading || (!isRecording && !isPaused)}
        onClick={handleSend}
        shape="circular"
        size="small"
        variant="contained"
      >
        {loading ? (
          <Spinner color="purple-800" size="md" />
        ) : (
          <PaperPlaneIcon
            className="cursor-pointer transition-all duration-200 ease-out"
            color="white"
            size="md"
          />
        )}
      </IconButton>
    </div>
  );
}
