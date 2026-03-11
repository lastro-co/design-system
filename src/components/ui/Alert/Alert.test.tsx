import { render, screen } from "@/tests/app-test-utils";
import { Alert, AlertDescription, AlertTitle } from "./Alert";

describe("Alert", () => {
  it("renders with default success severity", () => {
    render(<Alert>Test alert</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toBeVisible();
  });

  it("renders with different severities", () => {
    const { rerender } = render(<Alert severity="error">Error message</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("border-l-red-600");

    rerender(<Alert severity="warning">Warning message</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("border-l-yellow-600");

    rerender(<Alert severity="info">Info message</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("border-l-blue-600");

    rerender(<Alert severity="success">Success message</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("border-l-green-600");
  });

  it("accepts custom className", () => {
    render(<Alert className="custom-class">Test</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("custom-class");
  });

  it("renders children content", () => {
    render(<Alert>Test content</Alert>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(<Alert>Content</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("data-slot", "alert");
  });
});

describe("AlertTitle", () => {
  it("renders with correct data-slot", () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
      </Alert>
    );
    const title = screen.getByText("Alert Title");
    expect(title).toBeVisible();
  });

  it("accepts custom className", () => {
    render(
      <Alert>
        <AlertTitle className="custom-title">Title</AlertTitle>
      </Alert>
    );
    expect(screen.getByText("Title")).toHaveClass("custom-title");
  });

  it("renders icon for each severity", () => {
    const severities = ["success", "info", "warning", "error"] as const;

    severities.forEach((severity) => {
      const { unmount } = render(
        <Alert severity={severity}>
          <AlertTitle>Title</AlertTitle>
        </Alert>
      );
      expect(screen.getByRole("img")).toBeInTheDocument();
      unmount();
    });
  });

  it("has data-slot attribute", () => {
    render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
      </Alert>
    );
    const titleEl = screen
      .getByText("Title")
      .closest('[data-slot="alert-title"]');
    expect(titleEl).toBeInTheDocument();
  });

  it("throws when used outside Alert", () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => render(<AlertTitle>Orphan</AlertTitle>)).toThrow(
      "AlertTitle and AlertDescription must be used within an Alert component"
    );
    console.error = originalError;
  });
});

describe("AlertDescription", () => {
  it("renders with correct data-slot", () => {
    render(
      <Alert>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );
    const description = screen.getByText("Alert description");
    expect(description).toBeVisible();
  });

  it("accepts custom className", () => {
    render(
      <Alert>
        <AlertDescription className="custom-desc">Description</AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Description")).toHaveClass("custom-desc");
  });

  it("has data-slot attribute", () => {
    render(
      <Alert>
        <AlertDescription>Description</AlertDescription>
      </Alert>
    );
    const descEl = screen
      .getByText("Description")
      .closest('[data-slot="alert-description"]');
    expect(descEl).toBeInTheDocument();
  });

  it("throws when used outside Alert", () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => render(<AlertDescription>Orphan</AlertDescription>)).toThrow(
      "AlertTitle and AlertDescription must be used within an Alert component"
    );
    console.error = originalError;
  });
});
