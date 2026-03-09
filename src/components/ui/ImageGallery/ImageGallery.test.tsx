import { render, screen, userEvent } from "@/tests/app-test-utils";
import { ImageGallery } from "./ImageGallery";

// Top-level regex patterns for performance
const ANTERIOR_REGEX = /anterior/i;
const PROXIMA_REGEX = /próxima/i;
const SELECIONAR_REGEX = /selecionar/i;
const SELECIONAR_IMAGEM_REGEX = /selecionar imagem/i;
const APARTAMENTO_REGEX = /apartamento/i;

const SAMPLE_IMAGES = ["/image1.jpg", "/image2.jpg", "/image3.jpg"];

describe("ImageGallery", () => {
  describe("Empty state", () => {
    it("should render empty message when no images", () => {
      render(<ImageGallery alt="Test" images={[]} />);
      expect(screen.getByText("Sem imagens disponíveis")).toBeInTheDocument();
    });

    it("should render custom empty message", () => {
      render(
        <ImageGallery
          alt="Test"
          emptyMessage="Nenhuma foto disponível"
          images={[]}
        />
      );
      expect(screen.getByText("Nenhuma foto disponível")).toBeInTheDocument();
    });

    it("should not render navigation or thumbnails when empty", () => {
      render(<ImageGallery alt="Test" images={[]} />);
      expect(
        screen.queryByRole("button", { name: ANTERIOR_REGEX })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: PROXIMA_REGEX })
      ).not.toBeInTheDocument();
    });
  });

  describe("Single image", () => {
    it("should render image without navigation", () => {
      render(<ImageGallery alt="Property" images={["/single.jpg"]} />);

      expect(screen.getByRole("img")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: ANTERIOR_REGEX })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: PROXIMA_REGEX })
      ).not.toBeInTheDocument();
    });

    it("should not render thumbnails for single image", () => {
      render(<ImageGallery alt="Property" images={["/single.jpg"]} />);
      expect(
        screen.queryByRole("button", { name: SELECIONAR_REGEX })
      ).not.toBeInTheDocument();
    });
  });

  describe("Multiple images", () => {
    it("should render navigation arrows", () => {
      render(<ImageGallery alt="Property" images={SAMPLE_IMAGES} />);

      expect(
        screen.getByRole("button", { name: "Imagem anterior" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Próxima imagem" })
      ).toBeInTheDocument();
    });

    it("should render image counter", () => {
      render(<ImageGallery alt="Property" images={SAMPLE_IMAGES} />);
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("should render thumbnails", () => {
      render(<ImageGallery alt="Property" images={SAMPLE_IMAGES} />);

      const thumbnails = screen.getAllByRole("button", {
        name: SELECIONAR_IMAGEM_REGEX,
      });
      expect(thumbnails).toHaveLength(3);
    });

    it("should navigate to next image when clicking next button", async () => {
      const user = userEvent.setup();
      render(<ImageGallery alt="Property" images={SAMPLE_IMAGES} />);

      expect(screen.getByText("1 / 3")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Próxima imagem" }));

      expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });

    it("should navigate to previous image when clicking previous button", async () => {
      const user = userEvent.setup();
      render(<ImageGallery alt="Property" images={SAMPLE_IMAGES} />);

      // Click next first to go to image 2
      await user.click(screen.getByRole("button", { name: "Próxima imagem" }));
      expect(screen.getByText("2 / 3")).toBeInTheDocument();

      // Click previous to go back to image 1
      await user.click(screen.getByRole("button", { name: "Imagem anterior" }));
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("should wrap around when navigating past last image", async () => {
      const user = userEvent.setup();
      render(<ImageGallery alt="Property" images={SAMPLE_IMAGES} />);

      // Click next 3 times to wrap around
      await user.click(screen.getByRole("button", { name: "Próxima imagem" }));
      await user.click(screen.getByRole("button", { name: "Próxima imagem" }));
      await user.click(screen.getByRole("button", { name: "Próxima imagem" }));

      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("should wrap around when navigating before first image", async () => {
      const user = userEvent.setup();
      render(<ImageGallery alt="Property" images={SAMPLE_IMAGES} />);

      // Click previous to wrap to last image
      await user.click(screen.getByRole("button", { name: "Imagem anterior" }));

      expect(screen.getByText("3 / 3")).toBeInTheDocument();
    });

    it("should navigate to specific image when clicking thumbnail", async () => {
      const user = userEvent.setup();
      render(<ImageGallery alt="Property" images={SAMPLE_IMAGES} />);

      const thumbnails = screen.getAllByRole("button", {
        name: SELECIONAR_IMAGEM_REGEX,
      });

      await user.click(thumbnails[2]);

      expect(screen.getByText("3 / 3")).toBeInTheDocument();
    });
  });

  describe("Overlays", () => {
    it("should render top-left overlay", () => {
      render(
        <ImageGallery
          alt="Property"
          images={SAMPLE_IMAGES}
          topLeftOverlay={<span data-testid="top-left">Featured</span>}
        />
      );

      expect(screen.getByTestId("top-left")).toBeInTheDocument();
      expect(screen.getByText("Featured")).toBeInTheDocument();
    });

    it("should render top-right overlay", () => {
      render(
        <ImageGallery
          alt="Property"
          images={SAMPLE_IMAGES}
          topRightOverlay={<span data-testid="top-right">Active</span>}
        />
      );

      expect(screen.getByTestId("top-right")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("should render both overlays together", () => {
      render(
        <ImageGallery
          alt="Property"
          images={SAMPLE_IMAGES}
          topLeftOverlay={<span>Left</span>}
          topRightOverlay={<span>Right</span>}
        />
      );

      expect(screen.getByText("Left")).toBeInTheDocument();
      expect(screen.getByText("Right")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct alt text with image count", () => {
      render(<ImageGallery alt="Apartamento" images={SAMPLE_IMAGES} />);

      const img = screen.getByRole("img", { name: APARTAMENTO_REGEX });
      expect(img).toHaveAttribute("alt", "Apartamento - 1 de 3");
    });

    it("should have accessible thumbnail buttons", () => {
      render(<ImageGallery alt="Property" images={SAMPLE_IMAGES} />);

      expect(
        screen.getByRole("button", { name: "Selecionar imagem 1 de 3" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Selecionar imagem 2 de 3" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Selecionar imagem 3 de 3" })
      ).toBeInTheDocument();
    });
  });

  describe("Custom className", () => {
    it("should apply custom className to container", () => {
      const { container } = render(
        <ImageGallery
          alt="Property"
          className="custom-gallery"
          images={SAMPLE_IMAGES}
        />
      );

      expect(container.firstChild).toHaveClass("custom-gallery");
    });

    it("should apply custom className to empty state", () => {
      const { container } = render(
        <ImageGallery alt="Property" className="custom-empty" images={[]} />
      );

      expect(container.firstChild).toHaveClass("custom-empty");
    });
  });

  describe("Exports", () => {
    it("should export ImageGallery and ImageGalleryProps from index", () => {
      const indexExports = require("./index");
      expect(indexExports.ImageGallery).toBeDefined();
    });
  });
});
