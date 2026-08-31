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

    it("closes the popover after confirming", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));
      await user.click(screen.getByText("Confirmar"));

      expect(screen.queryByText("Confirmar")).not.toBeInTheDocument();
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

    it("keeps forwarding the native title attribute to the trigger", () => {
      render(<ColorPicker {...defaultProps} title="Cor da etiqueta" />);

      const trigger = screen.getByRole("button", { name: "Selecionar cor" });
      expect(trigger).toHaveAttribute("title", "Cor da etiqueta");
    });

    it("applies contentClassName to the popover content", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} contentClassName="w-[460px]" />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      expect(
        screen.getByText("Confirmar").closest('[data-slot="popover-content"]')
      ).toHaveClass("w-[460px]");
    });
  });

  describe("Draft lifecycle", () => {
    it("reseeds the draft from value when reopened after discarding", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));
      await user.click(screen.getByTestId("mock-picker-change"));
      expect(screen.getByDisplayValue("#ff0000")).toBeVisible();

      await user.keyboard("{Escape}");
      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      expect(screen.getByDisplayValue("#7C3AED")).toBeVisible();
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it("reseeds the draft when reopened while the close animation runs", async () => {
      // jsdom loads no CSS, so Radix's Presence reads `animation-name: none` and
      // unmounts the popover content synchronously. In the browser the DS
      // PopoverContent carries `data-[state=closed]:animate-out`, which keeps the
      // content mounted for the length of the exit animation — reopening inside
      // that window must still discard the draft. Reporting the animation name
      // the real stylesheet produces exercises that path.
      const realGetComputedStyle = window.getComputedStyle.bind(window);
      const spy = jest.spyOn(window, "getComputedStyle").mockImplementation(((
        element: Element,
        pseudo?: string | null
      ) => {
        const styles = realGetComputedStyle(element, pseudo ?? undefined);
        if (
          !(element instanceof HTMLElement) ||
          element.dataset.slot !== "popover-content"
        ) {
          return styles;
        }
        return new Proxy(styles, {
          get(target, property) {
            if (property === "animationName") {
              return element.getAttribute("data-state") === "closed"
                ? "exit"
                : "enter";
            }
            const found = Reflect.get(target, property);
            return typeof found === "function" ? found.bind(target) : found;
          },
        });
      }) as typeof window.getComputedStyle);

      try {
        const user = userEvent.setup();
        render(<ColorPicker {...defaultProps} />);
        const trigger = screen.getByRole("button", { name: "Selecionar cor" });

        await user.click(trigger);
        await user.click(screen.getByTestId("mock-picker-change"));
        expect(screen.getByDisplayValue("#ff0000")).toBeVisible();

        await user.keyboard("{Escape}");
        // The exit animation is in flight, so the content is still mounted.
        expect(screen.getByText("Confirmar")).toBeVisible();

        await user.click(trigger);

        expect(screen.getByDisplayValue("#7C3AED")).toBeVisible();
        expect(defaultProps.onChange).not.toHaveBeenCalled();
      } finally {
        spy.mockRestore();
      }
    });
  });

  describe("Swatches", () => {
    it("does not render a radiogroup when no swatches are given", async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    });

    it("forwards swatches to the panel and confirms the chosen one", async () => {
      const user = userEvent.setup();
      render(
        <ColorPicker {...defaultProps} swatches={["#EF4444", "#10B981"]} />
      );

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));
      await user.click(screen.getByRole("radio", { name: "Cor #10B981" }));

      expect(defaultProps.onChange).not.toHaveBeenCalled();

      await user.click(screen.getByText("Confirmar"));

      expect(defaultProps.onChange).toHaveBeenCalledWith("#10B981");
    });

    it("hides the custom area when showCustom is false", async () => {
      const user = userEvent.setup();
      render(
        <ColorPicker
          {...defaultProps}
          showCustom={false}
          swatches={["#EF4444"]}
        />
      );

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      expect(screen.queryByTestId("hex-color-picker")).not.toBeInTheDocument();
      expect(screen.getByRole("radiogroup")).toBeVisible();
    });
  });

  describe("Panel header", () => {
    it("renders panelTitle and panelDescription inside the popover", async () => {
      const user = userEvent.setup();
      render(
        <ColorPicker
          {...defaultProps}
          panelDescription="Selecione uma cor pré-definida ou da seleção livre abaixo."
          panelTitle="Escolha uma cor"
        />
      );

      await user.click(screen.getByRole("button", { name: "Selecionar cor" }));

      expect(screen.getByText("Escolha uma cor")).toBeVisible();
      expect(
        screen.getByText(
          "Selecione uma cor pré-definida ou da seleção livre abaixo."
        )
      ).toBeVisible();
    });
  });
});
