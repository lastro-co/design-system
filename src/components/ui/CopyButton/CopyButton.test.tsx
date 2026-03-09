import userEvent from "@testing-library/user-event";
import { act, render, screen, waitFor } from "@/tests/app-test-utils";
import { CopyButton } from "./CopyButton";

const COPY_BUTTON_LABEL = /copy to clipboard/i;

describe("CopyButton", () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });
  });

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

  it("shows check icon after copying and reverts to copy icon", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    render(<CopyButton value="test value" />);

    const button = screen.getByRole("button", { name: COPY_BUTTON_LABEL });

    // Initially shows copy icon
    expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
    expect(
      button.querySelector('[aria-label="Check Icon"]')
    ).not.toBeInTheDocument();

    // Click to copy
    await user.click(button);

    // Should show check icon after copying
    await waitFor(() => {
      expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
      expect(
        button.querySelector('[aria-label="Copy Icon"]')
      ).not.toBeInTheDocument();
    });

    // Fast-forward time by 1500ms
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Should revert to copy icon
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

    // First click
    await user.click(button);
    await waitFor(() => {
      expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
    });

    // Wait for icon to revert
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    await waitFor(() => {
      expect(button.querySelector('[aria-label="Copy Icon"]')).toBeVisible();
    });

    // Second click
    await user.click(button);
    await waitFor(() => {
      expect(button.querySelector('[aria-label="Check Icon"]')).toBeVisible();
    });

    jest.useRealTimers();
  });

  it("exports from index", () => {
    const exports = require("./index");

    expect(exports.CopyButton).toBeDefined();
    expect(typeof exports.CopyButton).toBe("function");
  });
});
