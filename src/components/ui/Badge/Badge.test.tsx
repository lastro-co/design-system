import { render, screen } from "@/tests/app-test-utils";
import { Badge } from "./Badge";

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
});
