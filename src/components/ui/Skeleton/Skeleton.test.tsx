import { render, screen } from "@/tests/app-test-utils";
import { Skeleton } from ".";

describe("Skeleton", () => {
  it("should render", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');

    expect(skeleton).toBeVisible();
    expect(skeleton).toHaveClass("animate-pulse", "rounded-md", "bg-gray-200");
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
  });

  it("should merge custom className with default classes", () => {
    const { container } = render(
      <Skeleton className="custom-class h-4 w-32" />
    );
    const skeleton = container.querySelector('[data-slot="skeleton"]');

    expect(skeleton).toBeVisible();
    expect(skeleton).toHaveClass(
      "animate-pulse",
      "rounded-md",
      "bg-gray-200",
      "custom-class",
      "h-4",
      "w-32"
    );
  });

  it("should render children content", () => {
    render(
      <Skeleton>
        <span>inner</span>
      </Skeleton>
    );
    expect(screen.getByText("inner")).toBeInTheDocument();
  });

  it("should forward additional HTML attributes", () => {
    const { container } = render(
      <Skeleton aria-label="Loading content" data-testid="my-skeleton" />
    );
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveAttribute("aria-label", "Loading content");
    expect(skeleton).toHaveAttribute("data-testid", "my-skeleton");
  });

  it("should forward role attribute", () => {
    const { container } = render(<Skeleton role="status" />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveAttribute("role", "status");
  });
});
