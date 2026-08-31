import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@/tests/app-test-utils";
import { ColorPickerPanel } from ".";

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

const SWATCHES = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6"];

describe("ColorPickerPanel", () => {
  const defaultProps = {
    value: "#7C3AED",
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Default rendering (no swatches, no header)", () => {
    it("renders the custom picker, hue slider, hex input and confirm button", () => {
      render(<ColorPickerPanel {...defaultProps} />);

      expect(screen.getByTestId("hex-color-picker")).toBeVisible();
      expect(screen.getByRole("slider")).toBeVisible();
      expect(screen.getByDisplayValue("#7C3AED")).toBeVisible();
      expect(screen.getByRole("button", { name: "Confirmar" })).toBeVisible();
    });

    it("does not render a swatch radiogroup", () => {
      render(<ColorPickerPanel {...defaultProps} />);

      expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    });

    it("does not render a title or description", () => {
      render(<ColorPickerPanel {...defaultProps} />);

      expect(screen.queryByText("Escolha uma cor")).not.toBeInTheDocument();
    });
  });

  describe("Swatch grid", () => {
    it("renders one radio per swatch inside a labelled radiogroup", () => {
      render(<ColorPickerPanel {...defaultProps} swatches={SWATCHES} />);

      const group = screen.getByRole("radiogroup", {
        name: "Cores predefinidas",
      });
      expect(group).toBeVisible();
      expect(screen.getAllByRole("radio")).toHaveLength(SWATCHES.length);
    });

    it("marks the swatch matching value as checked", () => {
      render(
        <ColorPickerPanel
          {...defaultProps}
          swatches={[...SWATCHES, "#7C3AED"]}
        />
      );

      expect(screen.getByRole("radio", { name: "Cor #7C3AED" })).toBeChecked();
      expect(
        screen.getByRole("radio", { name: "Cor #EF4444" })
      ).not.toBeChecked();
    });

    it("matches the active swatch case-insensitively", () => {
      render(
        <ColorPickerPanel
          onConfirm={defaultProps.onConfirm}
          swatches={["#28e4a8"]}
          value="#28E4A8"
        />
      );

      expect(screen.getByRole("radio", { name: "Cor #28e4a8" })).toBeChecked();
    });

    it("does not mark any swatch when value is outside the list", () => {
      render(<ColorPickerPanel {...defaultProps} swatches={SWATCHES} />);

      for (const radio of screen.getAllByRole("radio")) {
        expect(radio).not.toBeChecked();
      }
    });

    it("dedupes swatches that differ only in casing", () => {
      render(
        <ColorPickerPanel
          {...defaultProps}
          swatches={["#EF4444", "#ef4444", "#10B981"]}
        />
      );

      expect(screen.getAllByRole("radio")).toHaveLength(2);
    });

    it("does not confirm when a swatch is clicked", async () => {
      const user = userEvent.setup();
      render(<ColorPickerPanel {...defaultProps} swatches={SWATCHES} />);

      await user.click(screen.getByRole("radio", { name: "Cor #EF4444" }));

      expect(defaultProps.onConfirm).not.toHaveBeenCalled();
    });

    it("confirms the swatch color, preserving the caller's casing", async () => {
      const user = userEvent.setup();
      render(<ColorPickerPanel {...defaultProps} swatches={SWATCHES} />);

      await user.click(screen.getByRole("radio", { name: "Cor #EF4444" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      expect(defaultProps.onConfirm).toHaveBeenCalledWith("#EF4444");
    });

    it("syncs the hex input with the selected swatch", async () => {
      const user = userEvent.setup();
      render(<ColorPickerPanel {...defaultProps} swatches={SWATCHES} />);

      await user.click(screen.getByRole("radio", { name: "Cor #10B981" }));

      expect(screen.getByDisplayValue("#10B981")).toBeVisible();
    });

    it("keeps a single swatch in the tab order (roving tabindex)", async () => {
      const user = userEvent.setup();
      render(
        <ColorPickerPanel
          onConfirm={defaultProps.onConfirm}
          swatches={SWATCHES}
          value="#EF4444"
        />
      );

      await user.tab();

      const tabbable = screen
        .getAllByRole("radio")
        .filter((radio) => radio.getAttribute("tabindex") === "0");
      expect(tabbable).toEqual([
        screen.getByRole("radio", { name: "Cor #EF4444" }),
      ]);

      await user.keyboard("{ArrowRight}");

      const tabbableAfter = screen
        .getAllByRole("radio")
        .filter((radio) => radio.getAttribute("tabindex") === "0");
      expect(tabbableAfter).toEqual([
        screen.getByRole("radio", { name: "Cor #F59E0B" }),
      ]);
    });

    it("moves focus with the arrow keys and selects with Space", async () => {
      const user = userEvent.setup();
      render(
        <ColorPickerPanel
          onConfirm={defaultProps.onConfirm}
          swatches={SWATCHES}
          value="#EF4444"
        />
      );

      await user.tab();
      expect(screen.getByRole("radio", { name: "Cor #EF4444" })).toHaveFocus();

      await user.keyboard("{ArrowRight}{ArrowRight}");
      expect(screen.getByRole("radio", { name: "Cor #10B981" })).toHaveFocus();

      await user.keyboard("[Space]");

      expect(screen.getByRole("radio", { name: "Cor #10B981" })).toBeChecked();
      expect(
        screen.getByRole("radio", { name: "Cor #EF4444" })
      ).not.toBeChecked();
      expect(screen.getByDisplayValue("#10B981")).toBeVisible();
    });

    it("wraps around at the end of the grid", async () => {
      const user = userEvent.setup();
      render(
        <ColorPickerPanel
          onConfirm={defaultProps.onConfirm}
          swatches={SWATCHES}
          value="#EF4444"
        />
      );

      await user.tab();
      await user.keyboard("{ArrowLeft}");

      expect(screen.getByRole("radio", { name: "Cor #3B82F6" })).toHaveFocus();
    });
  });

  describe("showCustom", () => {
    it("hides the saturation area, hue slider and hex input when false", () => {
      render(
        <ColorPickerPanel
          {...defaultProps}
          showCustom={false}
          swatches={SWATCHES}
        />
      );

      expect(screen.queryByTestId("hex-color-picker")).not.toBeInTheDocument();
      expect(screen.queryByRole("slider")).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("#7C3AED")).not.toBeInTheDocument();
    });

    it("keeps the confirm button when false", async () => {
      const user = userEvent.setup();
      render(
        <ColorPickerPanel
          {...defaultProps}
          showCustom={false}
          swatches={SWATCHES}
        />
      );

      await user.click(screen.getByRole("radio", { name: "Cor #3B82F6" }));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      expect(defaultProps.onConfirm).toHaveBeenCalledWith("#3B82F6");
    });
  });

  describe("Header", () => {
    it("renders the title and description when provided", () => {
      render(
        <ColorPickerPanel
          {...defaultProps}
          description="Selecione uma cor pré-definida."
          title="Escolha uma cor"
        />
      );

      expect(screen.getByText("Escolha uma cor")).toBeVisible();
      expect(screen.getByText("Selecione uma cor pré-definida.")).toBeVisible();
    });

    it("renders the description without a title", () => {
      render(<ColorPickerPanel {...defaultProps} description="Só apoio." />);

      expect(screen.getByText("Só apoio.")).toBeVisible();
    });
  });

  describe("Footer", () => {
    it("right-aligns the confirm button when footerAlign is end", () => {
      render(<ColorPickerPanel {...defaultProps} footerAlign="end" />);

      expect(screen.getByRole("button", { name: "Confirmar" })).toHaveClass(
        "self-end"
      );
    });
  });

  describe("Custom picker", () => {
    it("confirms the color picked in the saturation area", async () => {
      const user = userEvent.setup();
      render(<ColorPickerPanel {...defaultProps} />);

      await user.click(screen.getByTestId("mock-picker-change"));
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      expect(defaultProps.onConfirm).toHaveBeenCalledWith("#ff0000");
    });

    it("reflects the typed hex on the hue slider", async () => {
      const user = userEvent.setup();
      render(<ColorPickerPanel {...defaultProps} />);

      await user.clear(screen.getByDisplayValue("#7C3AED"));
      await user.type(screen.getByDisplayValue("#"), "#00FF00");

      expect(screen.getByRole("slider")).toHaveValue("120");
    });

    it("accepts a hex typed without the leading hash", async () => {
      const user = userEvent.setup();
      render(<ColorPickerPanel {...defaultProps} />);

      const hexInput = screen.getByDisplayValue("#7C3AED");
      await user.clear(hexInput);
      await user.type(screen.getByDisplayValue("#"), "FF5733");
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      expect(defaultProps.onConfirm).toHaveBeenCalledWith("#FF5733");
    });

    it("rejects invalid hex characters", async () => {
      const user = userEvent.setup();
      render(<ColorPickerPanel {...defaultProps} />);

      const hexInput = screen.getByDisplayValue("#7C3AED");
      await user.clear(hexInput);
      await user.type(hexInput, "#ZZZZZZ");

      expect(hexInput).not.toHaveValue("#ZZZZZZ");
    });

    it("keeps the hue at 0 for achromatic colors", () => {
      render(
        <ColorPickerPanel onConfirm={defaultProps.onConfirm} value="#FFFFFF" />
      );

      expect(screen.getByRole("slider")).toHaveValue("0");
    });

    it("derives the hue for red-dominant colors", () => {
      render(
        <ColorPickerPanel onConfirm={defaultProps.onConfirm} value="#FF0000" />
      );

      expect(screen.getByRole("slider")).toHaveValue("0");
    });

    it("derives the hue for blue-dominant colors", () => {
      render(
        <ColorPickerPanel onConfirm={defaultProps.onConfirm} value="#0000FF" />
      );

      expect(screen.getByRole("slider")).toHaveValue("240");
    });

    it("converts the hue slider value into a hex color", async () => {
      const user = userEvent.setup();
      render(<ColorPickerPanel {...defaultProps} />);

      fireEvent.change(screen.getByRole("slider"), {
        target: { value: "180" },
      });
      await user.click(screen.getByRole("button", { name: "Confirmar" }));

      expect(defaultProps.onConfirm).toHaveBeenCalledWith("#00ffff");
    });
  });

  describe("Injected stylesheet", () => {
    it("inserts a single style block no matter how many panels render", () => {
      render(
        <div>
          <ColorPickerPanel onConfirm={jest.fn()} value="#111111" />
          <ColorPickerPanel onConfirm={jest.fn()} value="#222222" />
          <ColorPickerPanel onConfirm={jest.fn()} value="#333333" />
        </div>
      );

      const blocks = [...document.querySelectorAll("style")].filter((style) =>
        style.textContent?.includes(".ds-color-picker")
      );
      expect(blocks).toHaveLength(1);
    });
  });

  describe("Props forwarding", () => {
    it("applies a custom className to the root element", () => {
      const { container } = render(
        <ColorPickerPanel {...defaultProps} className="custom-panel" />
      );

      expect(container.firstChild).toHaveClass("custom-panel");
    });
  });
});
