import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { ColorPicker } from ".";

// Mock react-colorful to avoid canvas rendering issues in tests
jest.mock("react-colorful", () => ({
  HexColorPicker: ({ onChange }: { onChange: (color: string) => void }) => (
    <div data-testid="hex-color-picker">
      <button
        data-testid="mock-picker-change"
        onClick={() => onChange("#ff0000")}
        type="button"
      >
        Pick Red
      </button>
    </div>
  ),
}));

describe("ColorPicker", () => {
  const defaultProps = {
    value: "#7C3AED",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the trigger button with the correct background color", () => {
      render(<ColorPicker {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: "Selecionar cor" });
      expect(trigger).toBeVisible();
      expect(trigger).toHaveStyle({ backgroundColor: "#7C3AED" });
    });

    it("does not show popover content initially", () => {
      render(<ColorPicker {...defaultProps} />);

      expect(screen.queryByText("Confirmar")).not.toBeInTheDocument();
    });
  });

  describe("Popover interaction", () => {
    it("opens the popover when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      expect(screen.getByText("Confirmar")).toBeVisible();
      expect(screen.getByTestId("hex-color-picker")).toBeVisible();
    });

    it("shows the hex input with current value when opened", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      const hexInput = screen.getByDisplayValue("#7C3AED");
      expect(hexInput).toBeVisible();
    });

    it("shows the hue slider when opened", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      const slider = screen.getByRole("slider");
      expect(slider).toBeVisible();
    });
  });

  describe("Hex input", () => {
    it("updates the draft color when a valid hex is typed", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      const hexInput = screen.getByDisplayValue("#7C3AED");
      await user.clear(hexInput);
      await user.type(hexInput, "#FF5733");

      expect(hexInput).toHaveValue("#FF5733");
    });

    it("rejects invalid hex characters", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      const hexInput = screen.getByDisplayValue("#7C3AED");
      await user.clear(hexInput);
      await user.type(hexInput, "#ZZZZZZ");

      // Should not accept invalid hex — input stays at # after clear
      expect(hexInput).not.toHaveValue("#ZZZZZZ");
    });
  });

  describe("Confirm behavior", () => {
    it("calls onChange with the draft color when Confirmar is clicked", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      // Use the mock picker to change color
      await user.click(screen.getByTestId("mock-picker-change"));

      await user.click(screen.getByText("Confirmar"));

      expect(defaultProps.onChange).toHaveBeenCalledWith("#ff0000");
    });

    it("does not call onChange if popover is closed without confirming", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      // Change color via mock picker
      await user.click(screen.getByTestId("mock-picker-change"));

      // Press Escape to close without confirming
      await user.keyboard("{Escape}");

      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });

  describe("Props forwarding", () => {
    it("applies custom className to the trigger button", () => {
      render(<ColorPicker {...defaultProps} className="custom-class" />);

      const trigger = screen.getByRole("button", { name: "Selecionar cor" });
      expect(trigger).toHaveClass("custom-class");
    });
  });
});
