import { render, screen } from "@/tests/app-test-utils";
import { LaisGlowOrb } from "./LaisGlowOrb";

const getOrb = (container: HTMLElement) =>
  container.querySelector('[data-slot="lais-glow-orb"]') as HTMLElement;

describe("LaisGlowOrb", () => {
  it("renders the primary variant by default", () => {
    const { container } = render(<LaisGlowOrb />);
    const orb = getOrb(container);
    expect(orb).toBeInTheDocument();
    expect(orb).toHaveAttribute("data-variant", "primary");
    expect(orb).toHaveClass("lais-glow-orb-primary");
  });

  it("renders the secondary variant when requested", () => {
    const { container } = render(<LaisGlowOrb variant="secondary" />);
    const orb = getOrb(container);
    expect(orb).toHaveAttribute("data-variant", "secondary");
    expect(orb).toHaveClass("lais-glow-orb-secondary");
    expect(orb).not.toHaveClass("lais-glow-orb-primary");
  });

  it("is decorative: hidden from assistive tech and inert to pointers", () => {
    const { container } = render(<LaisGlowOrb />);
    const orb = getOrb(container);
    expect(orb).toHaveAttribute("aria-hidden", "true");
    expect(orb).toHaveClass("pointer-events-none");
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("merges placement classes from className", () => {
    const { container } = render(<LaisGlowOrb className="top-1/2 left-1/2" />);
    const orb = getOrb(container);
    expect(orb).toHaveClass("top-1/2", "left-1/2", "absolute");
  });
});
