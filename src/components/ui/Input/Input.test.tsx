import { render, screen } from "@/tests/app-test-utils";
import { Input } from "./Input";

describe("Input", () => {
  it("should render input element", () => {
    render(<Input placeholder="Test input" />);
    expect(screen.getByPlaceholderText("Test input")).toBeVisible();
  });

  it("should render with icon", () => {
    const icon = <span data-testid="test-icon">🔍</span>;
    render(<Input icon={icon} placeholder="Search" />);
    expect(screen.getByTestId("test-icon")).toBeVisible();
    expect(screen.getByPlaceholderText("Search")).toBeVisible();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled placeholder="Disabled input" />);
    expect(screen.getByPlaceholderText("Disabled input")).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<Input className="custom-class" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveClass("custom-class");
  });

  it("should handle error state with aria-invalid", () => {
    render(<Input aria-invalid placeholder="Error input" />);
    expect(screen.getByPlaceholderText("Error input")).toHaveAttribute(
      "aria-invalid"
    );
  });

  it("should render disabled input with icon", () => {
    const icon = <span data-testid="disabled-icon">📧</span>;
    render(<Input disabled icon={icon} placeholder="Disabled with icon" />);
    expect(screen.getByTestId("disabled-icon")).toBeVisible();
    expect(screen.getByPlaceholderText("Disabled with icon")).toBeDisabled();
  });

  it("should handle error state with icon", () => {
    const icon = <span data-testid="error-icon">⚠️</span>;
    render(<Input aria-invalid icon={icon} placeholder="Error with icon" />);
    expect(screen.getByTestId("error-icon")).toBeVisible();
    expect(screen.getByPlaceholderText("Error with icon")).toHaveAttribute(
      "aria-invalid"
    );
  });

  it("should render different input types", () => {
    const { rerender } = render(
      <Input placeholder="Email input" type="email" />
    );
    expect(screen.getByPlaceholderText("Email input")).toHaveAttribute(
      "type",
      "email"
    );

    rerender(<Input placeholder="Password input" type="password" />);
    expect(screen.getByPlaceholderText("Password input")).toHaveAttribute(
      "type",
      "password"
    );
  });
});
