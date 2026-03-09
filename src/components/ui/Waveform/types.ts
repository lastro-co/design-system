/**
 * Formats seconds into MM:SS format
 * @param seconds Duration in seconds
 * @returns Formatted string (e.g., "01:30")
 */
export function formatDuration(seconds: number): string {
  // Handle invalid values (Infinity, NaN, negative)
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export interface WaveformConfig {
  height?: number;
  waveColor?: string;
  progressColor?: string;
  cursorColor?: string;
  cursorWidth?: number;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
  barHeight?: number;
  normalize?: boolean;
  interact?: boolean;
}

export interface WaveformProps {
  /** Configuration for the waveform display */
  config?: WaveformConfig;
  /** CSS class name */
  className?: string;
}

export interface WaveformRecorderProps extends WaveformProps {
  /** Called when recording is cancelled */
  onCancel: () => void;
  /** Called when recording is sent with the audio blob */
  onSend: (blob: Blob) => void;
  /** Whether to auto-start recording on mount */
  autoStart?: boolean;
  /** Whether the audio is being sent/uploaded */
  loading?: boolean;
}

export interface WaveformPlayerProps extends WaveformProps {
  /** Audio source URL */
  src: string;
  /** Called when playback ends */
  onEnded?: () => void;
  /** Called when playback starts */
  onPlay?: () => void;
  /** Called when playback is paused */
  onPause?: () => void;
}

export const DEFAULT_WAVEFORM_CONFIG: Required<WaveformConfig> = {
  height: 32,
  waveColor: "#8624ff",
  progressColor: "#8624ff",
  cursorColor: "transparent",
  cursorWidth: 0,
  barWidth: 3,
  barGap: 2,
  barRadius: 30,
  barHeight: 0.8,
  normalize: true,
  interact: false,
};

export const DEFAULT_PLAYER_CONFIG: Required<WaveformConfig> = {
  ...DEFAULT_WAVEFORM_CONFIG,
  waveColor: "#999999", // Gray-500 when not played
  progressColor: "#323232", // Gray-900 when played
  interact: true,
};
