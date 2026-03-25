import { render, screen } from "@/tests/app-test-utils";
import { Progress } from ".";

const FIFTY_PERCENT_RE = /50%/;

function getTrack(container: HTMLElement) {
  return container.querySelector(
    '[data-slot="progress"]'
  ) as HTMLElement | null;
}

function getIndicator(container: HTMLElement) {
  const track = getTrack(container);
  return track?.querySelector("div") as HTMLElement | null;
}

describe("Progress", () => {
  describe("rendering", () => {
    it("should render the progress track", () => {
      const { container } = render(<Progress value={50} />);
      expect(getTrack(container)).toBeInTheDocument();
    });

    it("should not show percentage text by default", () => {
      render(<Progress value={50} />);
      expect(screen.queryByText(FIFTY_PERCENT_RE)).not.toBeInTheDocument();
    });

    it("should show percentage text when showPercentage is true", () => {
      render(<Progress showPercentage value={50} />);
      expect(screen.getByText("50%")).toBeVisible();
    });

    it("should round the percentage value when showPercentage is true", () => {
      render(<Progress showPercentage value={33.7} />);
      expect(screen.getByText("34%")).toBeVisible();
    });

    it("should show 0% when value is 0 and showPercentage is true", () => {
      render(<Progress showPercentage value={0} />);
      expect(screen.getByText("0%")).toBeVisible();
    });

    it("should show 100% when value is 100 and showPercentage is true", () => {
      render(<Progress showPercentage value={100} />);
      expect(screen.getByText("100%")).toBeVisible();
    });

    it("should handle undefined value gracefully", () => {
      const { container } = render(<Progress />);
      expect(getTrack(container)).toBeInTheDocument();
    });
  });

  describe("size variants", () => {
    it("should apply md size class by default", () => {
      const { container } = render(<Progress value={50} />);
      expect(getTrack(container)).toHaveClass("h-2");
    });

    it("should apply xs size class", () => {
      const { container } = render(<Progress size="xs" value={50} />);
      expect(getTrack(container)).toHaveClass("h-1");
    });

    it("should apply lg size class", () => {
      const { container } = render(<Progress size="lg" value={50} />);
      expect(getTrack(container)).toHaveClass("h-3");
    });
  });

  describe("color variants", () => {
    it("should apply purple track and indicator colors by default", () => {
      const { container } = render(<Progress value={50} />);
      expect(getTrack(container)).toHaveClass("bg-purple-400/30");
      expect(getIndicator(container)).toHaveClass("bg-purple-600");
    });

    it("should apply blue track and indicator colors", () => {
      const { container } = render(<Progress color="blue" value={50} />);
      expect(getTrack(container)).toHaveClass("bg-blue-600/20");
      expect(getIndicator(container)).toHaveClass("bg-blue-600");
    });

    it("should apply green track and indicator colors", () => {
      const { container } = render(<Progress color="green" value={50} />);
      expect(getTrack(container)).toHaveClass("bg-green-600/20");
      expect(getIndicator(container)).toHaveClass("bg-green-600");
    });

    it("should apply red track and indicator colors", () => {
      const { container } = render(<Progress color="red" value={50} />);
      expect(getTrack(container)).toHaveClass("bg-red-600/20");
      expect(getIndicator(container)).toHaveClass("bg-red-600");
    });

    it("should apply yellow track and indicator colors", () => {
      const { container } = render(<Progress color="yellow" value={50} />);
      expect(getTrack(container)).toHaveClass("bg-yellow-600/20");
      expect(getIndicator(container)).toHaveClass("bg-yellow-600");
    });

    it("should apply gray track and indicator colors", () => {
      const { container } = render(<Progress color="gray" value={50} />);
      expect(getTrack(container)).toHaveClass("bg-gray-300");
      expect(getIndicator(container)).toHaveClass("bg-gray-600");
    });
  });

  describe("rounded prop", () => {
    it("should apply rounded-full to track and indicator by default", () => {
      const { container } = render(<Progress value={50} />);
      expect(getTrack(container)).toHaveClass("rounded-full");
      expect(getIndicator(container)).toHaveClass("rounded-full");
    });

    it("should not apply rounded-full when rounded is false", () => {
      const { container } = render(<Progress rounded={false} value={50} />);
      expect(getTrack(container)).not.toHaveClass("rounded-full");
      expect(getIndicator(container)).not.toHaveClass("rounded-full");
    });
  });

  describe("indicator transform", () => {
    it("should translate indicator fully left when value is 0", () => {
      const { container } = render(<Progress value={0} />);
      expect(getIndicator(container)?.style.transform).toBe(
        "translateX(-100%)"
      );
    });

    it("should not translate indicator when value is 100", () => {
      const { container } = render(<Progress value={100} />);
      expect(getIndicator(container)?.style.transform).toBe("translateX(-0%)");
    });

    it("should translate indicator halfway when value is 50", () => {
      const { container } = render(<Progress value={50} />);
      expect(getIndicator(container)?.style.transform).toBe("translateX(-50%)");
    });
  });

  describe("animate prop", () => {
    it("starts from 0 and animates to target value on mount", () => {
      // Drive the rAF step callback synchronously: first call is mid-animation
      // (elapsed = 500ms with duration 1000ms → progress 0.5), second call
      // completes the animation (elapsed >= duration).
      const startTime = 1000;
      let callCount = 0;
      const rafSpy = jest
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((cb) => {
          callCount += 1;
          // First call: halfway through; second call: past the duration
          const elapsed = callCount === 1 ? 500 : 1500;
          cb(startTime + elapsed);
          return callCount;
        });

      jest.spyOn(performance, "now").mockReturnValue(startTime);

      const { container } = render(
        <Progress animate animationDuration={1000} value={75} />
      );

      // After synchronous rAF execution the indicator should have advanced
      const indicator = getIndicator(container);
      // The transform will not be -100% (the initial 0-value state)
      expect(indicator?.style.transform).not.toBe("translateX(-100%)");

      rafSpy.mockRestore();
      (performance.now as jest.Mock).mockRestore();
    });

    it("cancels the animation frame on unmount when animate is true", () => {
      const cancelSpy = jest.spyOn(window, "cancelAnimationFrame");
      jest.spyOn(window, "requestAnimationFrame").mockImplementation(() => 42);

      const { unmount } = render(
        <Progress animate animationDuration={1000} value={75} />
      );
      unmount();

      expect(cancelSpy).toHaveBeenCalledWith(42);

      cancelSpy.mockRestore();
      (window.requestAnimationFrame as jest.Mock).mockRestore();
    });
  });

  describe("transition classes", () => {
    it("should apply transition classes on indicator when animate is false", () => {
      const { container } = render(<Progress animate={false} value={50} />);
      expect(getIndicator(container)).toHaveClass(
        "transition-all",
        "duration-300",
        "ease-in-out"
      );
    });

    it("should not apply transition classes on indicator when animate is true", () => {
      const { container } = render(<Progress animate value={50} />);
      expect(getIndicator(container)).not.toHaveClass("transition-all");
    });
  });

  describe("custom className props", () => {
    it("should apply custom className to the track", () => {
      const { container } = render(
        <Progress className="custom-track" value={50} />
      );
      expect(getTrack(container)).toHaveClass("custom-track");
    });

    it("should apply indicatorClassName to the indicator", () => {
      const { container } = render(
        <Progress indicatorClassName="custom-indicator" value={50} />
      );
      expect(getIndicator(container)).toHaveClass("custom-indicator");
    });
  });

  describe("accessibility", () => {
    it("should have progressbar role", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("should forward aria-label to the progressbar", () => {
      render(<Progress aria-label="Upload progress" value={50} />);
      expect(
        screen.getByRole("progressbar", { name: "Upload progress" })
      ).toBeInTheDocument();
    });

    it("should forward additional HTML attributes to the track", () => {
      const { container } = render(
        <Progress data-testid="my-progress" value={50} />
      );
      expect(getTrack(container)).toHaveAttribute("data-testid", "my-progress");
    });
  });
});
