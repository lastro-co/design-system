import { render, screen } from "@/tests/app-test-utils";
import { Dropzone, DropzoneEmptyState } from "./Dropzone";

// biome-ignore lint/suspicious/noEmptyBlockStatements: no-op for test Dropzone onDrop
const noop = (): void => {};

describe("Dropzone", () => {
  it("renders with children and file input", () => {
    render(
      <Dropzone onDrop={noop}>
        <DropzoneEmptyState>
          Arraste arquivos ou clique para enviar
        </DropzoneEmptyState>
      </Dropzone>
    );
    expect(
      screen.getByText("Arraste arquivos ou clique para enviar")
    ).toBeInTheDocument();
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
  });

  it("applies custom className to the trigger", () => {
    const { container } = render(
      <Dropzone className="custom-dropzone" onDrop={noop}>
        <span>Upload</span>
      </Dropzone>
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("custom-dropzone");
  });

  it("renders when disabled", () => {
    const { container } = render(
      <Dropzone disabled onDrop={noop}>
        <span>Upload</span>
      </Dropzone>
    );
    const button = container.querySelector("button");
    expect(button).toBeDisabled();
  });
});
