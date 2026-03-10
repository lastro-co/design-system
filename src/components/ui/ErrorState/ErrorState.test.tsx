import { render, screen } from "@/tests/app-test-utils";
import { ErrorState } from "./ErrorState";

const RECARREGUE_REGEX = /Recarregue a página. Se o erro persistir/;
const ERRO_AO_CARREGAR_REGEX = /erro ao carregar/i;

describe("ErrorState", () => {
  it("renders default title and description", () => {
    render(<ErrorState />);
    expect(screen.getByText("Tente novamente")).toBeInTheDocument();
    expect(screen.getByText(RECARREGUE_REGEX)).toBeInTheDocument();
  });

  it("renders custom title and description", () => {
    render(
      <ErrorState
        description="Tente novamente mais tarde."
        title="Algo deu errado"
      />
    );
    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();
    expect(screen.getByText("Tente novamente mais tarde.")).toBeInTheDocument();
  });

  it("renders error image when errorImageSrc is provided", () => {
    render(<ErrorState errorImageSrc="/error.svg" />);
    const img = screen.getByRole("img", { name: ERRO_AO_CARREGAR_REGEX });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/error.svg");
  });

  it("does not render image when errorImageSrc is not provided", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ErrorState className="custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });
});
