import { render, screen } from "@/tests/app-test-utils";
import { LoadingOverlay } from ".";

describe("LoadingOverlay", () => {
  it("renders nothing when not visible", () => {
    const { container } = render(<LoadingOverlay visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders with default message when visible", () => {
    render(<LoadingOverlay visible={true} />);
    expect(screen.getByText("Carregando...")).toBeVisible();
  });

  it("renders custom message", () => {
    render(<LoadingOverlay message="Atualizando dados..." visible={true} />);
    expect(screen.getByText("Atualizando dados...")).toBeVisible();
  });

  it("hides message when empty string is passed", () => {
    render(<LoadingOverlay message="" visible={true} />);
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });

  it("renders spinner", () => {
    const { container } = render(<LoadingOverlay visible={true} />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
