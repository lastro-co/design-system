import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WaveformPlayer } from "./WaveformPlayer";

// ---------------------------------------------------------------------------
// Mock useWaveformPlayer so we never touch WaveSurfer or Audio in these tests
// ---------------------------------------------------------------------------

const mockTogglePlayPause = jest.fn();
const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockSeek = jest.fn();
const mockDestroy = jest.fn();

const mockHookState = {
  containerRef: { current: null },
  isReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  play: mockPlay,
  pause: mockPause,
  togglePlayPause: mockTogglePlayPause,
  seek: mockSeek,
  destroy: mockDestroy,
};

jest.mock("./hooks", () => ({
  useWaveformPlayer: jest.fn(() => ({ ...mockHookState })),
  useWaveformRecorder: jest.fn(),
  useWaveform: jest.fn(),
}));

import { useWaveformPlayer } from "./hooks";

const mockUseWaveformPlayer = useWaveformPlayer as jest.Mock;

function setHookState(overrides: Partial<typeof mockHookState>) {
  mockUseWaveformPlayer.mockReturnValue({ ...mockHookState, ...overrides });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("WaveformPlayer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWaveformPlayer.mockReturnValue({ ...mockHookState });
  });

  describe("rendering", () => {
    it("renders the waveform container div", () => {
      const { container } = render(
        <WaveformPlayer src="http://example.com/audio.mp3" />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it("shows the play button by default when not playing", () => {
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      expect(
        screen.getByRole("button", { name: "Reproduzir" })
      ).toBeInTheDocument();
    });

    it("shows the pause button when playing", () => {
      setHookState({ isReady: true, isPlaying: true });
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      expect(
        screen.getByRole("button", { name: "Pausar" })
      ).toBeInTheDocument();
    });

    it("hides controls when showControls=false", () => {
      render(
        <WaveformPlayer
          showControls={false}
          src="http://example.com/audio.mp3"
        />
      );
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("shows controls by default (showControls defaults to true)", () => {
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("shows duration when showDuration=true (default)", () => {
      setHookState({ duration: 90 });
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      // formatDuration(90) = "1:30"
      expect(screen.getByText("1:30")).toBeInTheDocument();
    });

    it("hides duration when showDuration=false", () => {
      setHookState({ duration: 90 });
      render(
        <WaveformPlayer
          showDuration={false}
          src="http://example.com/audio.mp3"
        />
      );
      expect(screen.queryByText("1:30")).not.toBeInTheDocument();
    });

    it("displays currentTime when playing", () => {
      setHookState({ isPlaying: true, currentTime: 15, duration: 90 });
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      // When isPlaying or currentTime > 0, shows currentTime
      expect(screen.getByText("0:15")).toBeInTheDocument();
    });

    it("displays currentTime when currentTime > 0 (not playing)", () => {
      setHookState({ isPlaying: false, currentTime: 5, duration: 30 });
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      expect(screen.getByText("0:05")).toBeInTheDocument();
    });

    it("displays duration when not playing and currentTime is 0", () => {
      setHookState({ isPlaying: false, currentTime: 0, duration: 60 });
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      // formatDuration(60) = "1:00"
      expect(screen.getByText("1:00")).toBeInTheDocument();
    });

    it("disables the play button when not ready", () => {
      setHookState({ isReady: false });
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("enables the play button when ready", () => {
      setHookState({ isReady: true });
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      expect(screen.getByRole("button")).toBeEnabled();
    });

    it("applies custom className to the outer wrapper", () => {
      const { container } = render(
        <WaveformPlayer
          className="custom-player"
          src="http://example.com/audio.mp3"
        />
      );
      expect(container.firstChild).toHaveClass("custom-player");
    });
  });

  describe("interactions", () => {
    it("calls togglePlayPause when the play button is clicked", async () => {
      setHookState({ isReady: true, isPlaying: false });
      const user = userEvent.setup();
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);

      await user.click(screen.getByRole("button", { name: "Reproduzir" }));

      expect(mockTogglePlayPause).toHaveBeenCalledTimes(1);
    });

    it("calls togglePlayPause when the pause button is clicked", async () => {
      setHookState({ isReady: true, isPlaying: true });
      const user = userEvent.setup();
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);

      await user.click(screen.getByRole("button", { name: "Pausar" }));

      expect(mockTogglePlayPause).toHaveBeenCalledTimes(1);
    });

    it("does not call togglePlayPause when button is disabled (not ready)", async () => {
      setHookState({ isReady: false });
      const user = userEvent.setup();
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);

      await user.click(screen.getByRole("button"));

      expect(mockTogglePlayPause).not.toHaveBeenCalled();
    });
  });

  describe("callback forwarding", () => {
    it("forwards onEnded to useWaveformPlayer", () => {
      const onEnded = jest.fn();
      render(
        <WaveformPlayer onEnded={onEnded} src="http://example.com/audio.mp3" />
      );
      expect(mockUseWaveformPlayer).toHaveBeenCalledWith(
        expect.objectContaining({ onEnded })
      );
    });

    it("forwards onPlay to useWaveformPlayer", () => {
      const onPlay = jest.fn();
      render(
        <WaveformPlayer onPlay={onPlay} src="http://example.com/audio.mp3" />
      );
      expect(mockUseWaveformPlayer).toHaveBeenCalledWith(
        expect.objectContaining({ onPlay })
      );
    });

    it("forwards onPause to useWaveformPlayer", () => {
      const onPause = jest.fn();
      render(
        <WaveformPlayer onPause={onPause} src="http://example.com/audio.mp3" />
      );
      expect(mockUseWaveformPlayer).toHaveBeenCalledWith(
        expect.objectContaining({ onPause })
      );
    });

    it("forwards onError to useWaveformPlayer", () => {
      const onError = jest.fn();
      render(
        <WaveformPlayer onError={onError} src="http://example.com/audio.mp3" />
      );
      expect(mockUseWaveformPlayer).toHaveBeenCalledWith(
        expect.objectContaining({ onError })
      );
    });

    it("forwards config to useWaveformPlayer", () => {
      const config = { height: 48, waveColor: "#ff0000" };
      render(
        <WaveformPlayer config={config} src="http://example.com/audio.mp3" />
      );
      expect(mockUseWaveformPlayer).toHaveBeenCalledWith(
        expect.objectContaining({ config })
      );
    });
  });

  describe("duration display logic", () => {
    it("shows '0:00' when duration is 0 and not playing", () => {
      setHookState({ currentTime: 0, duration: 0, isPlaying: false });
      render(<WaveformPlayer src="http://example.com/audio.mp3" />);
      expect(screen.getByText("0:00")).toBeInTheDocument();
    });
  });
});
