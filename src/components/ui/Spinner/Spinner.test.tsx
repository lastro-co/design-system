import { render, screen } from "@/tests/app-test-utils";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("should render with role status and animate-spin class", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeVisible();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("should be accessible with aria-label", () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText("Loader Icon");
    expect(spinner).toBeVisible();
  });

  it("should accept custom className, size and color props", () => {
    render(<Spinner className="custom-class" color="blue-600" size="xl" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("custom-class", "text-blue-600", "h-8", "w-8");
  });
});
