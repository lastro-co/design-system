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
    expect(badge).toHaveClass("bg-blue-100", "text-blue-700");
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
      gray: ["bg-gray-100", "text-gray-700"],
      green: ["bg-green-100", "text-green-700"],
      orange: ["bg-[#ffedd5]", "text-[#9a3412]"],
      purple: ["bg-purple-100", "text-purple-800"],
      red: ["bg-red-100", "text-red-700"],
      yellow: ["bg-yellow-100", "text-yellow-700"],
      blue: ["bg-blue-100", "text-blue-700"],
      white: ["bg-white", "text-gray-800"],
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

  it("should apply the default color", () => {
    const { container } = render(<Badge color="default">Default</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("bg-purple-800", "text-white");
  });

  it("should apply the secondary color", () => {
    const { container } = render(<Badge color="secondary">Secondary</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("bg-white", "text-gray-700");
  });

  it("should apply the destructive color", () => {
    const { container } = render(
      <Badge color="destructive">Destructive</Badge>
    );
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("bg-red-600", "text-white");
  });

  it("should apply the outline color with its border and compensated padding", () => {
    const { container } = render(<Badge color="outline">Outline</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass(
      "border-gray-800",
      "bg-transparent",
      "text-gray-800",
      "px-[7px]"
    );
  });

  it("should apply outline padding for medium size", () => {
    const { container } = render(
      <Badge color="outline" size="medium">
        Outline
      </Badge>
    );
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("px-[11px]");
  });

  it("should render asChild without showDot", () => {
    render(
      <Badge asChild color="purple">
        <button type="button">Preço</button>
      </Badge>
    );
    expect(screen.getByRole("button", { name: "Preço" })).toBeVisible();
  });

  it("should render asChild with showDot", () => {
    const { container } = render(
      <Badge asChild color="purple" showDot>
        <button type="button">Preço</button>
      </Badge>
    );
    const button = screen.getByRole("button", { name: "Preço" });
    expect(button).toBeVisible();
    const dot = container.querySelector(".rounded-full.h-2.w-2");
    expect(dot).toBeInTheDocument();
  });
});
