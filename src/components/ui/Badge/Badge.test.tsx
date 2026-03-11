import { render, screen } from "@/tests/app-test-utils";
import { Badge } from ".";

describe("Badge", () => {
  it("should render with text content", () => {
    render(<Badge>Badge Text</Badge>);
    expect(screen.getByText("Badge Text")).toBeVisible();
  });

  it("should apply color variant", () => {
    const { container } = render(<Badge color="blue">Blue Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("bg-blue-50", "text-blue-800");
  });

  it("should apply size variant", () => {
    const { container } = render(<Badge size="small">Small Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("text-xs");
  });

  it("should apply medium size variant", () => {
    const { container } = render(<Badge size="medium">Medium Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("text-sm", "px-3");
  });

  it("should accept custom className", () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("custom-class");
  });

  it("should apply isNumber variant", () => {
    const { container } = render(<Badge isNumber>2</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("h-5", "min-w-5", "p-1");
  });

  it("should render dot when showDot is true", () => {
    const { container } = render(<Badge showDot>With dot</Badge>);
    const dot = container.querySelector("span > span");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("rounded-full");
  });

  it("should not render dot when showDot is false", () => {
    const { container } = render(<Badge>No dot</Badge>);
    // The badge span itself has no inner dot span
    const badge = container.querySelector('[data-slot="badge"]');
    const dot = badge?.querySelector(".rounded-full.h-2.w-2");
    expect(dot).not.toBeInTheDocument();
  });

  it("should apply custom dotColor when showDot is true", () => {
    const { container } = render(
      <Badge dotColor="#ff0000" showDot>
        Colored dot
      </Badge>
    );
    const dot = container.querySelector("span > span") as HTMLElement;
    expect(dot).toHaveStyle({ backgroundColor: "#ff0000" });
  });

  it("should use currentColor for dot when dotColor is not provided", () => {
    const { container } = render(<Badge showDot>Default dot</Badge>);
    const dot = container.querySelector("span > span") as HTMLElement;
    // JSDOM normalizes "currentColor" to "currentcolor" (lowercase)
    expect(dot.style.backgroundColor).toBe("currentcolor");
  });

  it("should apply all color variants", () => {
    const colorMap = {
      gray: ["bg-gray-100", "text-gray-800"],
      green: ["bg-green-50", "text-green-800"],
      orange: ["bg-orange-50", "text-orange-800"],
      purple: ["bg-purple-300", "text-purple-800"],
      red: ["bg-red-50", "text-red-800"],
      white: ["bg-white", "text-gray-800"],
      yellow: ["bg-yellow-50", "text-yellow-800"],
    } as const;

    for (const [color, classes] of Object.entries(colorMap)) {
      const { container, unmount } = render(
        <Badge color={color as any}>{color}</Badge>
      );
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass(...classes);
      unmount();
    }
  });
});
