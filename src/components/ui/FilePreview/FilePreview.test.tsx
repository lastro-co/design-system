import { render, screen, userEvent } from "@/tests/app-test-utils";
import { FilePreview } from "./FilePreview";

const REMOVER_ARQUIVO_REGEX = /remover arquivo/i;

describe("FilePreview", () => {
  it("renders file name and formatted size", () => {
    render(<FilePreview fileName="document.pdf" fileSize={1024} />);
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
    expect(screen.getByText("1.0 KB")).toBeInTheDocument();
  });

  it("renders remove button when onRemove is provided", () => {
    const onRemove = jest.fn();
    render(
      <FilePreview fileName="doc.pdf" fileSize={500} onRemove={onRemove} />
    );
    const removeButton = screen.getByRole("button", {
      name: REMOVER_ARQUIVO_REGEX,
    });
    expect(removeButton).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const onRemove = jest.fn();
    const user = userEvent.setup();
    render(
      <FilePreview fileName="doc.pdf" fileSize={500} onRemove={onRemove} />
    );
    await user.click(
      screen.getByRole("button", { name: REMOVER_ARQUIVO_REGEX })
    );
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("does not render remove button when onRemove is not provided", () => {
    render(<FilePreview fileName="doc.pdf" fileSize={500} />);
    expect(
      screen.queryByRole("button", { name: REMOVER_ARQUIVO_REGEX })
    ).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FilePreview className="custom-class" fileName="doc.pdf" fileSize={100} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });
});
