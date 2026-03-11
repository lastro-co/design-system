import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WaveformRecorder } from "./WaveformRecorder";

// ---------------------------------------------------------------------------
// Mock useWaveformRecorder so tests stay pure component tests
// ---------------------------------------------------------------------------

const mockPauseRecording = jest.fn();
const mockResumeRecording = jest.fn();
const mockStopRecording = jest.fn();
const mockDestroy = jest.fn();
const mockStartRecording = jest.fn().mockResolvedValue(undefined);

const mockHookState = {
  containerRef: { current: null },
  recordingState: "recording" as "idle" | "recording" | "paused",
  duration: 0,
  startRecording: mockStartRecording,
  pauseRecording: mockPauseRecording,
  resumeRecording: mockResumeRecording,
  stopRecording: mockStopRecording,
  destroy: mockDestroy,
};

jest.mock("./hooks", () => ({
  useWaveformRecorder: jest.fn(() => ({ ...mockHookState })),
  useWaveformPlayer: jest.fn(),
  useWaveform: jest.fn(),
}));

import { useWaveformRecorder } from "./hooks";

const mockUseWaveformRecorder = useWaveformRecorder as jest.Mock;

function setHookState(overrides: Partial<typeof mockHookState>) {
  mockUseWaveformRecorder.mockReturnValue({ ...mockHookState, ...overrides });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("WaveformRecorder", () => {
  const defaultProps = {
    onCancel: jest.fn(),
    onSend: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWaveformRecorder.mockReturnValue({ ...mockHookState });
  });

  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<WaveformRecorder {...defaultProps} />);
      expect(container.firstChild).toBeTruthy();
    });

    it("renders the delete button", () => {
      render(<WaveformRecorder {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Excluir gravação" })
      ).toBeInTheDocument();
    });

    it("renders the send button", () => {
      render(<WaveformRecorder {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Enviar áudio" })
      ).toBeInTheDocument();
    });

    it("shows pause button when recording", () => {
      setHookState({ recordingState: "recording" });
      render(<WaveformRecorder {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Pausar" })
      ).toBeInTheDocument();
    });

    it("shows mic/resume button when paused", () => {
      setHookState({ recordingState: "paused" });
      render(<WaveformRecorder {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Continuar gravação" })
      ).toBeInTheDocument();
    });

    it("displays formatted duration", () => {
      setHookState({ duration: 65 });
      render(<WaveformRecorder {...defaultProps} />);
      // formatDuration(65) = "1:05"
      expect(screen.getByText("1:05")).toBeInTheDocument();
    });

    it("displays 0:00 when duration is 0", () => {
      setHookState({ duration: 0 });
      render(<WaveformRecorder {...defaultProps} />);
      expect(screen.getByText("0:00")).toBeInTheDocument();
    });

    it("applies custom className to the outer wrapper", () => {
      const { container } = render(
        <WaveformRecorder {...defaultProps} className="custom-recorder" />
      );
      expect(container.firstChild).toHaveClass("custom-recorder");
    });
  });

  describe("send button state", () => {
    it("enables send button when recording", () => {
      setHookState({ recordingState: "recording" });
      render(<WaveformRecorder {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Enviar áudio" })
      ).toBeEnabled();
    });

    it("enables send button when paused", () => {
      setHookState({ recordingState: "paused" });
      render(<WaveformRecorder {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Enviar áudio" })
      ).toBeEnabled();
    });

    it("disables send button when idle", () => {
      setHookState({ recordingState: "idle" });
      render(<WaveformRecorder {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "Enviar áudio" })
      ).toBeDisabled();
    });

    it("disables send button when loading", () => {
      setHookState({ recordingState: "recording" });
      render(<WaveformRecorder {...defaultProps} loading={true} />);
      expect(
        screen.getByRole("button", { name: "Enviar áudio" })
      ).toBeDisabled();
    });
  });

  describe("loading state", () => {
    it("disables delete button when loading", () => {
      render(<WaveformRecorder {...defaultProps} loading={true} />);
      expect(
        screen.getByRole("button", { name: "Excluir gravação" })
      ).toBeDisabled();
    });

    it("disables pause/resume button when loading", () => {
      render(<WaveformRecorder {...defaultProps} loading={true} />);
      expect(screen.getByRole("button", { name: "Pausar" })).toBeDisabled();
    });

    it("delete button is enabled when not loading", () => {
      render(<WaveformRecorder {...defaultProps} loading={false} />);
      expect(
        screen.getByRole("button", { name: "Excluir gravação" })
      ).toBeEnabled();
    });
  });

  describe("interactions", () => {
    it("calls stopRecording and onCancel when delete button is clicked", async () => {
      const onCancel = jest.fn();
      const user = userEvent.setup();
      render(<WaveformRecorder onCancel={onCancel} onSend={jest.fn()} />);

      await user.click(
        screen.getByRole("button", { name: "Excluir gravação" })
      );

      expect(mockStopRecording).toHaveBeenCalledTimes(1);
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("calls pauseRecording when pause button is clicked while recording", async () => {
      setHookState({ recordingState: "recording" });
      const user = userEvent.setup();
      render(<WaveformRecorder {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Pausar" }));

      expect(mockPauseRecording).toHaveBeenCalledTimes(1);
    });

    it("calls resumeRecording when mic button is clicked while paused", async () => {
      setHookState({ recordingState: "paused" });
      const user = userEvent.setup();
      render(<WaveformRecorder {...defaultProps} />);

      await user.click(
        screen.getByRole("button", { name: "Continuar gravação" })
      );

      expect(mockResumeRecording).toHaveBeenCalledTimes(1);
    });

    it("calls stopRecording when send button is clicked", async () => {
      setHookState({ recordingState: "recording" });
      const user = userEvent.setup();
      render(<WaveformRecorder {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Enviar áudio" }));

      expect(mockStopRecording).toHaveBeenCalledTimes(1);
    });

    it("does not call pauseRecording when pause button is disabled (loading)", async () => {
      setHookState({ recordingState: "recording" });
      const user = userEvent.setup();
      render(<WaveformRecorder {...defaultProps} loading={true} />);

      await user.click(screen.getByRole("button", { name: "Pausar" }));

      expect(mockPauseRecording).not.toHaveBeenCalled();
    });
  });

  describe("callback forwarding to hook", () => {
    it("forwards autoStart=true to useWaveformRecorder", () => {
      render(<WaveformRecorder {...defaultProps} autoStart={true} />);
      expect(mockUseWaveformRecorder).toHaveBeenCalledWith(
        expect.objectContaining({ autoStart: true })
      );
    });

    it("forwards autoStart=false to useWaveformRecorder", () => {
      render(<WaveformRecorder {...defaultProps} autoStart={false} />);
      expect(mockUseWaveformRecorder).toHaveBeenCalledWith(
        expect.objectContaining({ autoStart: false })
      );
    });

    it("forwards config to useWaveformRecorder", () => {
      const config = { height: 48, waveColor: "#00ff00" };
      render(<WaveformRecorder {...defaultProps} config={config} />);
      expect(mockUseWaveformRecorder).toHaveBeenCalledWith(
        expect.objectContaining({ config })
      );
    });

    it("calls onCancel when the hook's onError fires", () => {
      const onCancel = jest.fn();
      // Capture the onError callback passed to the hook
      let capturedOnError: ((e: Error) => void) | undefined;
      mockUseWaveformRecorder.mockImplementation(
        ({ onError }: { onError?: (e: Error) => void }) => {
          capturedOnError = onError;
          return { ...mockHookState };
        }
      );

      render(<WaveformRecorder onCancel={onCancel} onSend={jest.fn()} />);

      capturedOnError?.(new Error("mic error"));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("passes onSend as onRecordEnd to the hook", () => {
      const onSend = jest.fn();
      render(<WaveformRecorder onCancel={jest.fn()} onSend={onSend} />);

      expect(mockUseWaveformRecorder).toHaveBeenCalledWith(
        expect.objectContaining({ onRecordEnd: onSend })
      );
    });
  });
});
