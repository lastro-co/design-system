import { render, screen } from "@/tests/app-test-utils";
import LoadingOverlay from "./LoadingOverlay";

describe("LoadingOverlay", () => {
  it("renders when visible", () => {
    const { container, rerender } = render(<LoadingOverlay visible={false} />);
    expect(container.firstChild).toBeNull();

    rerender(<LoadingOverlay visible={true} />);
    expect(screen.getByText("Carregando...")).toBeVisible();
  });

  it("renders custom message", () => {
    render(<LoadingOverlay message="Atualizando dados..." visible={true} />);
    expect(screen.getByText("Atualizando dados...")).toBeVisible();
  });

  it("renders spinner", () => {
    const { container } = render(<LoadingOverlay visible={true} />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
