import { render, screen } from "@/tests/app-test-utils";
import { InfoTooltip } from ".";

const LABEL = "Informação sobre conversão";

describe("InfoTooltip", () => {
  describe("Rendering", () => {
    it("renders the trigger button with the provided aria-label", () => {
      render(<InfoTooltip aria-label={LABEL}>conteúdo</InfoTooltip>);

      expect(screen.getByRole("button", { name: LABEL })).toBeVisible();
    });

    it("renders the info icon as decorative without a native title tooltip", () => {
      render(<InfoTooltip aria-label={LABEL}>conteúdo</InfoTooltip>);

      const button = screen.getByRole("button", { name: LABEL });
      const svg = button.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg?.querySelector("title")?.textContent).toBe("");
      expect(
        button.querySelector('[aria-label="Info Icon"]')
      ).not.toBeInTheDocument();
    });

    it("applies extra className to the trigger", () => {
      render(
        <InfoTooltip aria-label={LABEL} className="ml-2">
          conteúdo
        </InfoTooltip>
      );

      expect(screen.getByRole("button", { name: LABEL })).toHaveClass("ml-2");
    });
  });

  describe("Tooltip content", () => {
    it("shows the tooltip content when the trigger is focused", async () => {
      render(<InfoTooltip aria-label={LABEL}>Texto do tooltip</InfoTooltip>);

      screen.getByRole("button", { name: LABEL }).focus();

      const tooltip = await screen.findByRole("tooltip");
      expect(tooltip).toHaveTextContent("Texto do tooltip");
    });
  });

  describe("Exports", () => {
    it("exports from index", () => {
      const exports = require("./index");
      expect(exports.InfoTooltip).toBeDefined();
      expect(typeof exports.InfoTooltip).toBe("function");
    });
  });
});
