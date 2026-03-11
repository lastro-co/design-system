import { render, screen, userEvent } from "@/tests/app-test-utils";
import { FilePreview } from ".";

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

  it("renders remove button as disabled when disabled prop is true", () => {
    const onRemove = jest.fn();
    render(
      <FilePreview
        disabled
        fileName="doc.pdf"
        fileSize={500}
        onRemove={onRemove}
      />
    );
    const removeButton = screen.getByRole("button", {
      name: REMOVER_ARQUIVO_REGEX,
    });
    expect(removeButton).toBeDisabled();
  });

  it("does not call onRemove when button is disabled and clicked", async () => {
    const onRemove = jest.fn();
    const user = userEvent.setup();
    render(
      <FilePreview
        disabled
        fileName="doc.pdf"
        fileSize={500}
        onRemove={onRemove}
      />
    );
    const removeButton = screen.getByRole("button", {
      name: REMOVER_ARQUIVO_REGEX,
    });
    await user.click(removeButton);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("formats file size in bytes for small files", () => {
    render(<FilePreview fileName="tiny.txt" fileSize={512} />);
    expect(screen.getByText("512 B")).toBeInTheDocument();
  });

  it("formats file size in MB for large files", () => {
    render(<FilePreview fileName="large.zip" fileSize={2 * 1024 * 1024} />);
    expect(screen.getByText("2.0 MB")).toBeInTheDocument();
  });

  it("renders the Excluir label on the remove button", () => {
    const onRemove = jest.fn();
    render(
      <FilePreview fileName="doc.pdf" fileSize={500} onRemove={onRemove} />
    );
    expect(screen.getByText("Excluir")).toBeInTheDocument();
  });

  it("renders with mimeType prop without error", () => {
    render(
      <FilePreview
        fileName="report.pdf"
        fileSize={2048}
        mimeType="application/pdf"
      />
    );
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
  });

  it("exports from index", () => {
    const exports = require("./index");
    expect(exports.FilePreview).toBeDefined();
  });
});
