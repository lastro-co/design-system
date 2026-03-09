import { render } from "@/tests/app-test-utils";
import { Skeleton } from "./Skeleton";

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
});
