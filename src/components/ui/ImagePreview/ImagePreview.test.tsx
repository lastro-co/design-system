import { render, screen, userEvent } from "@/tests/app-test-utils";
import { ImagePreview } from "./ImagePreview";

const PHOTO_JPG_REGEX = /photo\.jpg/;
const SIZE_2_KB_REGEX = /2\.0 KB/;
const REMOVER_IMAGEM_REGEX = /remover imagem/i;

describe("ImagePreview", () => {
  it("renders image with alt text", () => {
    render(<ImagePreview alt="Preview" src="https://example.com/image.jpg" />);
    const img = screen.getByRole("img", { name: "Preview" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("renders file name and size when provided", () => {
    render(
      <ImagePreview
        alt="Test"
        fileName="photo.jpg"
        fileSize={2048}
        src="/img.jpg"
      />
    );
    expect(screen.getByText(PHOTO_JPG_REGEX)).toBeInTheDocument();
    expect(screen.getByText(SIZE_2_KB_REGEX)).toBeInTheDocument();
  });

  it("renders remove button when onRemove is provided", () => {
    const onRemove = jest.fn();
    render(<ImagePreview alt="Test" onRemove={onRemove} src="/img.jpg" />);
    expect(
      screen.getByRole("button", { name: REMOVER_IMAGEM_REGEX })
    ).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const onRemove = jest.fn();
    const user = userEvent.setup();
    render(<ImagePreview alt="Test" onRemove={onRemove} src="/img.jpg" />);
    await user.click(
      screen.getByRole("button", { name: REMOVER_IMAGEM_REGEX })
    );
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(
      <ImagePreview alt="Test" className="custom-class" src="/img.jpg" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });
});
