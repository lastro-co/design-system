import { render, screen } from "@/tests/app-test-utils";
import { Status, StatusIndicator, StatusLabel } from "./index";

describe("Status", () => {
  it("renders with online status", () => {
    render(
      <Status status="online">
        <StatusLabel />
      </Status>
    );
    // The Status component applies the status as a class for group-based CSS targeting
    const badge = document.querySelector(".online");
    expect(badge).toBeInTheDocument();
  });

  it("renders with offline status", () => {
    render(
      <Status status="offline">
        <StatusLabel />
      </Status>
    );
    const badge = document.querySelector(".offline");
    expect(badge).toBeInTheDocument();
  });

  it("renders with maintenance status", () => {
    render(
      <Status status="maintenance">
        <StatusLabel />
      </Status>
    );
    const badge = document.querySelector(".maintenance");
    expect(badge).toBeInTheDocument();
  });

  it("renders with degraded status", () => {
    render(
      <Status status="degraded">
        <StatusLabel />
      </Status>
    );
    const badge = document.querySelector(".degraded");
    expect(badge).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Status className="custom-status" status="online">
        <StatusLabel />
      </Status>
    );
    const badge = document.querySelector(".custom-status");
    expect(badge).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <Status status="online">
        <span data-testid="child">Status Content</span>
      </Status>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

describe("StatusIndicator", () => {
  it("renders the indicator span", () => {
    const { container } = render(<StatusIndicator />);
    // Should render a span with two inner spans (ping animation + solid dot)
    const outer = container.firstChild as HTMLElement;
    expect(outer.tagName).toBe("SPAN");
    expect(outer.children).toHaveLength(2);
  });

  it("applies custom className", () => {
    render(<StatusIndicator className="custom-indicator" />);
    const indicator = document.querySelector(".custom-indicator");
    expect(indicator).toBeInTheDocument();
  });

  it("passes through additional HTML attributes", () => {
    render(<StatusIndicator data-testid="indicator" />);
    expect(screen.getByTestId("indicator")).toBeInTheDocument();
  });
});

describe("StatusLabel", () => {
  it("renders custom children when provided", () => {
    render(<StatusLabel>Custom Label</StatusLabel>);
    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  it("renders default status labels when no children provided", () => {
    const { container } = render(<StatusLabel />);
    // When no children, renders hidden spans for each status
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders hidden online label span when no children", () => {
    render(<StatusLabel />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("renders hidden offline label span when no children", () => {
    render(<StatusLabel />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("renders hidden maintenance label span when no children", () => {
    render(<StatusLabel />);
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });

  it("renders hidden degraded label span when no children", () => {
    render(<StatusLabel />);
    expect(screen.getByText("Degraded")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<StatusLabel className="custom-label">Label</StatusLabel>);
    const label = document.querySelector(".custom-label");
    expect(label).toBeInTheDocument();
  });

  it("passes through additional HTML attributes", () => {
    render(<StatusLabel data-testid="status-label">Label</StatusLabel>);
    expect(screen.getByTestId("status-label")).toBeInTheDocument();
  });
});

describe("Status composition", () => {
  it("renders Status with StatusIndicator and StatusLabel", () => {
    render(
      <Status status="online">
        <StatusIndicator data-testid="indicator" />
        <StatusLabel>System Online</StatusLabel>
      </Status>
    );
    expect(screen.getByTestId("indicator")).toBeInTheDocument();
    expect(screen.getByText("System Online")).toBeInTheDocument();
  });

  it("renders full composition with default StatusLabel", () => {
    const { container } = render(
      <Status status="online">
        <StatusIndicator />
        <StatusLabel />
      </Status>
    );
    // Both indicator and label should be present
    expect(container.querySelectorAll("span").length).toBeGreaterThan(0);
  });
});
