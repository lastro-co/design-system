import { render, screen } from "@/tests/app-test-utils";
import { Badge } from ".";

const NEWLINE_REGEX = /\n/;

describe("Badge", () => {
  it("should render with text content", () => {
    render(<Badge>Badge Text</Badge>);
    expect(screen.getByText("Badge Text")).toBeVisible();
  });

  it("should apply the base layout classes as a single unbroken className", () => {
    const { container } = render(<Badge>Base</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge?.className).not.toMatch(NEWLINE_REGEX);
    expect(badge).toHaveClass(
      "inline-flex",
      "rounded-full",
      "has-[>img]:pl-1.5",
      "has-[>svg]:pl-1.5"
    );
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
    expect(badge).toHaveClass("text-sm", "h-6");
  });

  it("should accept custom className", () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("custom-class");
  });

  it("should apply isNumber variant", () => {
    const { container } = render(<Badge isNumber>2</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass("h-5", "min-w-5", "px-1");
  });

  it("should apply all color variants", () => {
    const colorMap = {
      default: ["bg-purple-800", "text-white"],
      secondary: ["bg-white", "text-gray-700"],
      destructive: ["bg-red-600", "text-white"],
      outline: ["border-gray-800", "bg-white", "text-gray-800"],
      gray: ["bg-gray-100", "text-gray-700"],
      green: ["bg-green-100", "text-green-700"],
      orange: ["bg-orange-100", "text-orange-700"],
      purple: ["bg-purple-100", "text-purple-800"],
      red: ["bg-red-100", "text-red-700"],
      yellow: ["bg-yellow-100", "text-yellow-700"],
      blue: ["bg-blue-100", "text-blue-700"],
    } as const;

    for (const [color, classes] of Object.entries(colorMap)) {
      const { container, unmount } = render(
        <Badge color={color as keyof typeof colorMap}>{color}</Badge>
      );
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass(...classes);
      unmount();
    }
  });

  it("should render asChild with a single child", () => {
    render(
      <Badge asChild color="purple">
        <button type="button">Preço</button>
      </Badge>
    );
    expect(screen.getByRole("button", { name: "Preço" })).toBeVisible();
  });
});
