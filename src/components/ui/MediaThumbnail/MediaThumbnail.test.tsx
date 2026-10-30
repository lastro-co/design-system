import { render, screen, userEvent } from "@/tests/app-test-utils";
import { MediaThumbnail } from ".";

const REMOVE_NAME = "Remover foto.jpg";

describe("MediaThumbnail", () => {
  describe("Rendering", () => {
    it("renders the order badge as index + 1", () => {
      render(
        <MediaThumbnail
          fileName="foto.jpg"
          index={2}
          kind="image"
          src="a.jpg"
        />
      );
      expect(screen.getByText("3")).toBeVisible();
    });

    it("does not render a badge without index", () => {
      const { container } = render(
        <MediaThumbnail fileName="foto.jpg" kind="image" src="a.jpg" />
      );
      expect(
        container.querySelector('[data-slot="badge"]')
      ).not.toBeInTheDocument();
    });

    it("renders an image preview with object-cover", () => {
      const { container } = render(
        <MediaThumbnail fileName="foto.jpg" kind="image" src="a.jpg" />
      );
      const img = container.querySelector("img");
      expect(img).toHaveAttribute("src", "a.jpg");
      expect(img).toHaveClass("object-cover");
      expect(img).toHaveAttribute("draggable", "false");
    });

    it("renders a video poster with a play icon", () => {
      const { container } = render(
        <MediaThumbnail fileName="video.mp4" kind="video" src="poster.jpg" />
      );
      expect(container.querySelector("img")).toHaveAttribute(
        "src",
        "poster.jpg"
      );
      expect(container.querySelector(".lucide-play")).toBeVisible();
    });

    it("renders the video fallback without a poster", () => {
      const { container } = render(
        <MediaThumbnail fileName="video.mp4" kind="video" />
      );
      expect(container.querySelector("img")).not.toBeInTheDocument();
      expect(container.querySelector(".lucide-play")).toBeVisible();
      expect(container.querySelector(".bg-gray-800")).toBeVisible();
    });

    it("renders the file type icon for files", () => {
      render(
        <MediaThumbnail
          fileName="contrato.pdf"
          kind="file"
          mimeType="application/pdf"
        />
      );
      expect(screen.getByText("PDF")).toBeVisible();
    });

    it("falls back to the file type icon for an image without src", () => {
      render(<MediaThumbnail fileName="foto.png" kind="image" />);
      expect(screen.getByText("IMG")).toBeVisible();
    });

    it("renders a static labelled preview without onSelect", () => {
      render(<MediaThumbnail fileName="foto.jpg" kind="image" src="a.jpg" />);
      expect(screen.getByRole("img", { name: "foto.jpg" })).toBeVisible();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("merges a custom className", () => {
      const { container } = render(
        <MediaThumbnail className="custom" fileName="a.pdf" kind="file" />
      );
      expect(container.firstChild).toHaveClass("custom", "h-11", "w-21");
    });
  });

  describe("Selection and removal", () => {
    it("calls onRemove without calling onSelect", async () => {
      const user = userEvent.setup();
      const onRemove = jest.fn();
      const onSelect = jest.fn();
      render(
        <MediaThumbnail
          fileName="foto.jpg"
          kind="image"
          onRemove={onRemove}
          onSelect={onSelect}
          src="a.jpg"
        />
      );
      await user.click(screen.getByRole("button", { name: REMOVE_NAME }));
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onSelect).not.toHaveBeenCalled();
    });

    it("calls onSelect when the tile is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(
        <MediaThumbnail
          fileName="foto.jpg"
          kind="image"
          onSelect={onSelect}
          src="a.jpg"
        />
      );
      await user.click(screen.getByRole("button", { name: "foto.jpg" }));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it("reflects selected through aria-pressed", () => {
      const { rerender } = render(
        <MediaThumbnail
          fileName="foto.jpg"
          kind="image"
          onSelect={jest.fn()}
          selected={false}
          src="a.jpg"
        />
      );
      const tile = screen.getByRole("button", { name: "foto.jpg" });
      expect(tile).toHaveAttribute("aria-pressed", "false");

      rerender(
        <MediaThumbnail
          fileName="foto.jpg"
          kind="image"
          onSelect={jest.fn()}
          selected
          src="a.jpg"
        />
      );
      expect(tile).toHaveAttribute("aria-pressed", "true");
      expect(tile).toHaveClass("border-purple-800");
    });

    it("never nests a button inside another button", () => {
      const { container } = render(
        <MediaThumbnail
          fileName="foto.jpg"
          kind="image"
          onRemove={jest.fn()}
          onSelect={jest.fn()}
          src="a.jpg"
        />
      );
      expect(screen.getAllByRole("button")).toHaveLength(2);
      expect(container.querySelector("button button")).not.toBeInTheDocument();
    });

    it("disables both buttons when disabled", () => {
      render(
        <MediaThumbnail
          disabled
          fileName="foto.jpg"
          kind="image"
          onRemove={jest.fn()}
          onSelect={jest.fn()}
          src="a.jpg"
        />
      );
      expect(screen.getByRole("button", { name: "foto.jpg" })).toBeDisabled();
      expect(screen.getByRole("button", { name: REMOVE_NAME })).toBeDisabled();
    });
  });

  describe("Invalid state", () => {
    it("exposes aria-invalid, the alert icon and an accessible message", () => {
      const { container } = render(
        <MediaThumbnail
          fileName="foto.jpg"
          invalid
          invalidMessage="Arquivo acima de 16 MB"
          kind="image"
          onSelect={jest.fn()}
          src="a.jpg"
        />
      );
      const tile = screen.getByRole("button", { name: "foto.jpg" });
      expect(tile).toHaveAttribute("aria-invalid", "true");
      expect(tile).toHaveClass("border-red-600");
      expect(tile).toHaveAccessibleDescription("Arquivo acima de 16 MB");
      expect(container.querySelector(".lucide-circle-alert")).toBeVisible();
      expect(container.firstChild).toHaveAttribute(
        "title",
        "Arquivo acima de 16 MB"
      );
    });

    it("marks the static preview as invalid", () => {
      render(
        <MediaThumbnail
          fileName="foto.jpg"
          invalid
          invalidMessage="Formato não suportado"
          kind="image"
          src="a.jpg"
        />
      );
      const preview = screen.getByRole("img", { name: "foto.jpg" });
      expect(preview).toHaveAttribute("aria-invalid", "true");
      expect(preview).toHaveAccessibleDescription("Formato não suportado");
    });

    it("does not describe the tile when there is no message", () => {
      render(
        <MediaThumbnail
          fileName="foto.jpg"
          invalid
          kind="image"
          onSelect={jest.fn()}
          src="a.jpg"
        />
      );
      const tile = screen.getByRole("button", { name: "foto.jpg" });
      expect(tile).toHaveAttribute("aria-invalid", "true");
      expect(tile).not.toHaveAttribute("aria-describedby");
    });

    it("omits aria-invalid when valid", () => {
      render(
        <MediaThumbnail
          fileName="foto.jpg"
          kind="image"
          onSelect={jest.fn()}
          src="a.jpg"
        />
      );
      expect(
        screen.getByRole("button", { name: "foto.jpg" })
      ).not.toHaveAttribute("aria-invalid");
    });
  });
});
