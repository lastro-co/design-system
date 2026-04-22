import { fireEvent, render, screen } from "@/tests/app-test-utils";
import { LaisLogo } from "./LaisLogo";

const LAIS_REGEX = /lais/i;

describe("LaisLogo", () => {
  describe("default (full wordmark)", () => {
    it("renders the full-width SVG with width='110' and height='32'", () => {
      render(<LaisLogo />);
      const svg = screen.getByRole("img", { name: LAIS_REGEX });
      expect(svg).toBeVisible();
      expect(svg).toHaveAttribute("width", "110");
      expect(svg).toHaveAttribute("height", "32");
    });

    it("has aria-label='Lais' by default", () => {
      render(<LaisLogo />);
      expect(screen.getByRole("img", { name: "Lais" })).toBeVisible();
    });

    it("contains 9 symbol paths inside the <g> element", () => {
      const { container } = render(<LaisLogo />);
      const paths = container.querySelectorAll("g path");
      expect(paths.length).toBeGreaterThanOrEqual(9);
    });

    it("has fill='none' on the root svg", () => {
      const { container } = render(<LaisLogo />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("fill", "none");
    });

    it("has data-slot='lais-logo'", () => {
      const { container } = render(<LaisLogo />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("data-slot", "lais-logo");
    });

    it("cursor-pointer class is present when animateOnHover is true (default)", () => {
      const { container } = render(<LaisLogo />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("class")).toContain("cursor-pointer");
    });
  });

  describe("symbolOnly variant", () => {
    it("renders the compact symbol SVG with width='32' and height='32'", () => {
      render(<LaisLogo symbolOnly />);
      const svg = screen.getByRole("img", { name: LAIS_REGEX });
      expect(svg).toHaveAttribute("width", "32");
      expect(svg).toHaveAttribute("height", "32");
    });

    it("has viewBox '0 0 32 32'", () => {
      const { container } = render(<LaisLogo symbolOnly />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 32 32");
    });

    it("has data-slot='lais-logo'", () => {
      const { container } = render(<LaisLogo symbolOnly />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("data-slot", "lais-logo");
    });
  });

  describe("animateOnHover={false}", () => {
    it("does NOT have cursor-pointer class", () => {
      const { container } = render(<LaisLogo animateOnHover={false} />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("class")).not.toContain("cursor-pointer");
    });

    it("inner <g> style transform stays at rotate(0deg) after mouseenter", () => {
      const { container } = render(<LaisLogo animateOnHover={false} />);
      const svg = container.querySelector("svg");
      if (svg) {
        fireEvent.mouseEnter(svg);
      }
      const allGroups = container.querySelectorAll("g");
      const symbolGroup = Array.from(allGroups).find(
        (g) => g.getAttribute("style") !== null
      );
      expect(symbolGroup).not.toBeNull();
      expect(symbolGroup?.getAttribute("style")).toContain("rotate(0deg)");
    });
  });

  describe("animateOnHover (default true)", () => {
    it("cursor-pointer class is present", () => {
      const { container } = render(<LaisLogo animateOnHover />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("class")).toContain("cursor-pointer");
    });

    it("inner <g> style transform moves to rotate(360deg) on mouseenter", () => {
      const { container } = render(<LaisLogo animateOnHover />);
      const svg = container.querySelector("svg");
      if (svg) {
        fireEvent.mouseEnter(svg);
      }
      const allGroups = container.querySelectorAll("g");
      const symbolGroup = Array.from(allGroups).find(
        (g) => g.getAttribute("style") !== null
      );
      expect(symbolGroup).not.toBeNull();
      expect(symbolGroup?.getAttribute("style")).toContain("rotate(360deg)");
    });

    it("inner <g> style resets to rotate(0deg) on mouseleave after mouseenter", () => {
      const { container } = render(<LaisLogo animateOnHover />);
      const svg = container.querySelector("svg");
      if (svg) {
        fireEvent.mouseEnter(svg);
        fireEvent.mouseLeave(svg);
      }
      const allGroups = container.querySelectorAll("g");
      const symbolGroup = Array.from(allGroups).find(
        (g) => g.getAttribute("style") !== null
      );
      expect(symbolGroup).not.toBeNull();
      expect(symbolGroup?.getAttribute("style")).toContain("rotate(0deg)");
    });
  });

  describe("custom aria-label", () => {
    it("respects custom aria-label prop", () => {
      render(<LaisLogo aria-label="Logo Customizado" />);
      expect(
        screen.getByRole("img", { name: "Logo Customizado" })
      ).toBeVisible();
    });

    it("custom aria-label is set on symbolOnly variant too", () => {
      render(<LaisLogo aria-label="Symbol Custom" symbolOnly />);
      expect(screen.getByRole("img", { name: "Symbol Custom" })).toBeVisible();
    });
  });

  describe("className pass-through", () => {
    it("merges custom className onto the svg element", () => {
      const { container } = render(<LaisLogo className="h-7 w-auto" />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("class")).toContain("h-7");
      expect(svg?.getAttribute("class")).toContain("w-auto");
    });
  });

  describe("additional SVG props forwarding", () => {
    it("forwards data-testid to the svg element", () => {
      render(<LaisLogo data-testid="lais-logo-test" />);
      expect(screen.getByTestId("lais-logo-test")).toBeVisible();
    });
  });
});
