import { render, screen } from "@/tests/app-test-utils";
import { LoadingOverlay } from ".";

describe("LoadingOverlay", () => {
  it("renders nothing when visible is false", () => {
    const { container } = render(<LoadingOverlay visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders content when visible is true", () => {
    render(<LoadingOverlay visible={true} />);
    expect(screen.getByText("Carregando...")).toBeVisible();
  });

  it("renders nothing initially and shows after becoming visible", () => {
    const { container, rerender } = render(<LoadingOverlay visible={false} />);
    expect(container.firstChild).toBeNull();

    rerender(<LoadingOverlay visible={true} />);
    expect(screen.getByText("Carregando...")).toBeVisible();
  });

  it("hides after being visible when visible becomes false", () => {
    const { container, rerender } = render(<LoadingOverlay visible={true} />);
    expect(screen.getByText("Carregando...")).toBeVisible();

    rerender(<LoadingOverlay visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders custom message", () => {
    render(<LoadingOverlay message="Atualizando dados..." visible={true} />);
    expect(screen.getByText("Atualizando dados...")).toBeVisible();
  });

  it("renders default message when no message prop provided", () => {
    render(<LoadingOverlay visible={true} />);
    expect(screen.getByText("Carregando...")).toBeVisible();
  });

  it("renders spinner SVG with aria-label", () => {
    render(<LoadingOverlay visible={true} />);
    expect(screen.getByRole("img", { name: "Carregando" })).toBeInTheDocument();
  });

  it("renders spinner with animate-spin class", () => {
    const { container } = render(<LoadingOverlay visible={true} />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("applies custom className to overlay", () => {
    const { container } = render(
      <LoadingOverlay className="custom-overlay" visible={true} />
    );
    expect(container.firstChild).toHaveClass("custom-overlay");
  });

  it("does not render spinner when not visible", () => {
    const { container } = render(<LoadingOverlay visible={false} />);
    expect(container.querySelector(".animate-spin")).not.toBeInTheDocument();
  });

  it("renders message as a paragraph element", () => {
    render(<LoadingOverlay visible={true} />);
    const message = screen.getByText("Carregando...");
    expect(message.tagName).toBe("P");
  });

  it("does not render message paragraph when message is empty string", () => {
    render(<LoadingOverlay message="" visible={true} />);
    // With an empty string, message is falsy so the paragraph should not render
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });
});
