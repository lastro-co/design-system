import { render } from "@testing-library/react";
import { Toaster } from "./Toaster";

describe("Toaster", () => {
  it("should render without crashing", () => {
    const { container } = render(<Toaster />);
    expect(container).toBeVisible();
  });

  it("should render with custom position", () => {
    const { container } = render(<Toaster position="bottom-right" />);
    expect(container).toBeVisible();
  });

  it("should render with close button disabled", () => {
    const { container } = render(<Toaster closeButton={false} />);
    expect(container).toBeVisible();
  });
});
