import { render, screen } from "@/tests/app-test-utils";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("should render textarea element", () => {
    render(<Textarea placeholder="Test textarea" />);
    expect(screen.getByPlaceholderText("Test textarea")).toBeVisible();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);
    expect(screen.getByPlaceholderText("Disabled textarea")).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveClass("custom-class");
  });

  it("should handle error state with aria-invalid", () => {
    render(<Textarea aria-invalid placeholder="Error textarea" />);
    expect(screen.getByPlaceholderText("Error textarea")).toHaveAttribute(
      "aria-invalid"
    );
  });

  it("should start with 1 row when maxRows is defined", () => {
    render(<Textarea data-testid="textarea" maxRows={5} />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("rows", "1");
  });

  it("should not have rows attribute when maxRows is not defined", () => {
    render(<Textarea data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).not.toHaveAttribute("rows");
  });

  it("should apply resize-none class when resizable is false", () => {
    render(<Textarea data-testid="textarea" resizable={false} />);
    expect(screen.getByTestId("textarea")).toHaveClass("resize-none");
  });
});
