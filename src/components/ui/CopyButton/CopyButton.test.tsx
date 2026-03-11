import userEvent from "@testing-library/user-event";
import { act, render, screen, waitFor } from "@/tests/app-test-utils";
import { CopyButton } from ".";

const COPY_BUTTON_LABEL = /copy to clipboard/i;

describe("CopyButton", () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });
  });

  describe("Rendering", () => {
    it("renders the copy button with correct styling", () => {
      render(<CopyButton value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      expect(button).toBeVisible();
      expect(button).toHaveClass("bg-purple-300", "hover:bg-purple-300");
    });

    it("shows copy icon initially", () => {
      render(<CopyButton value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
      expect(
        button.querySelector('[aria-label="Check Icon"]')
      ).not.toBeInTheDocument();
    });

    it("renders children alongside the copy button", () => {
      render(
        <CopyButton value="test value">
          <span>Some text</span>
        </CopyButton>
      );

      expect(screen.getByText("Some text")).toBeVisible();
      expect(
        screen.getByRole("button", { name: COPY_BUTTON_LABEL })
      ).toBeVisible();
    });

    it("renders without children", () => {
      render(<CopyButton value="test value" />);
      expect(
        screen.getByRole("button", { name: COPY_BUTTON_LABEL })
      ).toBeVisible();
    });
  });

  describe("alwaysVisible prop", () => {
    it("applies opacity-0 class when alwaysVisible is false (default)", () => {
      render(<CopyButton value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      expect(button).toHaveClass("opacity-0");
    });

    it("does not apply opacity-0 when alwaysVisible is true", () => {
      render(<CopyButton alwaysVisible value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      expect(button).not.toHaveClass("opacity-0");
    });
  });

  describe("asSpan prop", () => {
    it("renders as a button element by default", () => {
      render(<CopyButton value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      expect(button.tagName).toBe("BUTTON");
    });

    it("renders as a span with role=button when asSpan is true", () => {
      render(<CopyButton asSpan value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      expect(button.tagName).toBe("SPAN");
    });

    it("has tabIndex=0 when asSpan is true", () => {
      render(<CopyButton asSpan value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      expect(button).toHaveAttribute("tabindex", "0");
    });

    it("shows check icon after copying in asSpan mode", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(<CopyButton asSpan value="span value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      await user.click(button);

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      });

      jest.useRealTimers();
    });
  });

  describe("Clipboard copy interaction", () => {
    it("shows check icon after copying and reverts to copy icon", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(<CopyButton value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });

      expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
      expect(
        button.querySelector('[aria-label="Check Icon"]')
      ).not.toBeInTheDocument();

      await user.click(button);

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
        expect(
          button.querySelector('[aria-label="Copy Icon"]')
        ).not.toBeInTheDocument();
      });

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
        expect(
          button.querySelector('[aria-label="Check Icon"]')
        ).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it("handles multiple clicks correctly", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(<CopyButton value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });

      await user.click(button);
      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      });

      act(() => {
        jest.advanceTimersByTime(1500);
      });
      await waitFor(() => {
        expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
      });

      await user.click(button);
      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      });

      jest.useRealTimers();
    });

    it("resets the timeout when clicked rapidly (debounce behavior)", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(<CopyButton value="test value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });

      await user.click(button);
      await user.click(button);

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      });

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
      });

      jest.useRealTimers();
    });
  });

  describe("Clipboard fallback (execCommand)", () => {
    let originalWriteText: typeof navigator.clipboard.writeText;
    let execCommandMock: jest.Mock;

    beforeEach(() => {
      originalWriteText = navigator.clipboard.writeText;
      navigator.clipboard.writeText = jest
        .fn()
        .mockRejectedValue(new Error("clipboard unavailable"));
      execCommandMock = jest.fn().mockReturnValue(false);
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: execCommandMock,
        writable: true,
      });
    });

    afterEach(() => {
      navigator.clipboard.writeText = originalWriteText;
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: undefined,
        writable: true,
      });
    });

    it("shows check icon after successful execCommand fallback copy", async () => {
      jest.useFakeTimers();
      execCommandMock.mockReturnValue(true);

      const user = userEvent.setup({ delay: null });
      render(<CopyButton value="fallback value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      await user.click(button);

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      });

      jest.useRealTimers();
    });

    it("reverts to copy icon after fallback timeout elapses", async () => {
      jest.useFakeTimers();
      execCommandMock.mockReturnValue(true);

      const user = userEvent.setup({ delay: null });
      render(<CopyButton value="fallback value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      await user.click(button);

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      });

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
      });

      jest.useRealTimers();
    });

    it("keeps copy icon when execCommand returns false", async () => {
      execCommandMock.mockReturnValue(false);

      const user = userEvent.setup({ delay: null });
      render(<CopyButton value="fallback value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      await user.click(button);

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
        expect(
          button.querySelector('[aria-label="Check Icon"]')
        ).not.toBeInTheDocument();
      });
    });

    it("cleans up the textarea after a successful execCommand copy", async () => {
      execCommandMock.mockReturnValue(true);
      const appendChildSpy = jest.spyOn(HTMLElement.prototype, "appendChild");
      const removeChildSpy = jest.spyOn(HTMLElement.prototype, "removeChild");

      const user = userEvent.setup({ delay: null });
      render(<CopyButton value="fallback value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      await user.click(button);

      await waitFor(() => {
        const appendedTextarea = appendChildSpy.mock.calls.find(
          ([node]) => (node as HTMLElement).tagName === "TEXTAREA"
        );
        expect(appendedTextarea).toBeDefined();
        expect(removeChildSpy).toHaveBeenCalled();
      });

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it("resets the fallback timeout when clicked rapidly (debounce behavior)", async () => {
      jest.useFakeTimers();
      execCommandMock.mockReturnValue(true);

      const user = userEvent.setup({ delay: null });
      render(<CopyButton value="fallback value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });

      await user.click(button);
      await user.click(button);

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      });

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
      });

      jest.useRealTimers();
    });

    it("silently handles errors thrown by execCommand itself", async () => {
      execCommandMock.mockImplementation(() => {
        throw new Error("execCommand not supported");
      });

      const user = userEvent.setup({ delay: null });
      render(<CopyButton value="fallback value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });

      await expect(user.click(button)).resolves.not.toThrow();

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
      });
    });
  });

  describe("asSpan keyboard interaction", () => {
    it("triggers copy when Enter key is pressed", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(<CopyButton asSpan value="keyboard value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      button.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      });

      jest.useRealTimers();
    });

    it("triggers copy when Space key is pressed", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(<CopyButton asSpan value="keyboard value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      button.focus();
      await user.keyboard(" ");

      await waitFor(() => {
        expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      });

      jest.useRealTimers();
    });

    it("does not trigger copy when Tab key is pressed", async () => {
      const user = userEvent.setup({ delay: null });

      render(<CopyButton asSpan value="keyboard value" />);

      const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });
      button.focus();
      await user.keyboard("{Tab}");

      expect(
        button.querySelector('[aria-label="Copy Icon"]')
      ).toBeInTheDocument();
      expect(
        button.querySelector('[aria-label="Check Icon"]')
      ).not.toBeInTheDocument();
    });
  });

  describe("Exports", () => {
    it("exports from index", () => {
      const exports = require("./index");
      expect(exports.CopyButton).toBeDefined();
      expect(typeof exports.CopyButton).toBe("function");
    });
  });
});
