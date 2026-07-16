import type { ComponentProps } from "react";
import { fireEvent, render, screen, userEvent } from "@/tests/app-test-utils";
import { ImageLightbox } from ".";

const SCALE_REGEX = /scale\(([\d.]+)\)/;

function getScale(element: HTMLElement): number {
  const match = element.style.transform.match(SCALE_REGEX);
  if (!match) {
    throw new Error(`No scale found in transform: ${element.style.transform}`);
  }
  return Number(match[1]);
}

function renderLightbox(
  props: Partial<ComponentProps<typeof ImageLightbox>> = {}
) {
  const onOpenChange = jest.fn();
  const result = render(
    <ImageLightbox
      alt="Foto do imóvel"
      onOpenChange={onOpenChange}
      open
      src="/image.jpg"
      {...props}
    />
  );
  return { ...result, onOpenChange };
}

describe("ImageLightbox", () => {
  describe("Rendering", () => {
    it("should not render when closed", () => {
      renderLightbox({ open: false });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should render the image when open", () => {
      renderLightbox();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByAltText("Foto do imóvel")).toBeInTheDocument();
    });

    it("should use the alt text as accessible dialog title", () => {
      renderLightbox();
      expect(
        screen.getByRole("dialog", { name: "Foto do imóvel" })
      ).toBeInTheDocument();
    });
  });

  describe("Click zoom", () => {
    it("should start without zoom", () => {
      renderLightbox();
      const zoomButton = screen.getByRole("button", {
        name: "Ampliar imagem",
      });
      expect(getScale(zoomButton)).toBe(1);
    });

    it("should zoom in when the image is clicked", async () => {
      renderLightbox();
      const zoomButton = screen.getByRole("button", {
        name: "Ampliar imagem",
      });

      await userEvent.click(zoomButton);

      expect(getScale(zoomButton)).toBe(2.5);
      expect(
        screen.getByRole("button", { name: "Reduzir imagem" })
      ).toBeInTheDocument();
    });

    it("should reset zoom when the zoomed image is clicked", async () => {
      renderLightbox();
      const zoomButton = screen.getByRole("button", {
        name: "Ampliar imagem",
      });

      await userEvent.click(zoomButton);
      await userEvent.click(
        screen.getByRole("button", { name: "Reduzir imagem" })
      );

      expect(getScale(zoomButton)).toBe(1);
      expect(zoomButton.style.transform).toContain("translate(0px, 0px)");
    });

    it("should anchor click zoom to the click position", () => {
      renderLightbox();
      const zoomButton = screen.getByRole("button", {
        name: "Ampliar imagem",
      });

      fireEvent.click(zoomButton, { clientX: 100, clientY: 40 });

      // Point (100, 40) from center stays fixed: offset = point * (1 - scale)
      expect(zoomButton.style.transform).toContain(
        "translate(-150px, -60px) scale(2.5)"
      );
    });
  });

  describe("Wheel zoom", () => {
    it("should zoom in when scrolling up", () => {
      renderLightbox();
      const dialog = screen.getByRole("dialog");
      const zoomButton = screen.getByRole("button", {
        name: "Ampliar imagem",
      });

      fireEvent.wheel(dialog, { deltaY: -100 });

      expect(getScale(zoomButton)).toBeCloseTo(Math.exp(0.2), 5);
    });

    it("should zoom out when scrolling down", () => {
      renderLightbox();
      const dialog = screen.getByRole("dialog");
      const zoomButton = screen.getByRole("button", {
        name: "Ampliar imagem",
      });

      fireEvent.wheel(dialog, { deltaY: -100 });
      fireEvent.wheel(dialog, { deltaY: -100 });
      const zoomedScale = getScale(zoomButton);

      fireEvent.wheel(dialog, { deltaY: 100 });

      expect(getScale(zoomButton)).toBeLessThan(zoomedScale);
    });

    it("should clamp zoom at maxZoom", () => {
      renderLightbox({ maxZoom: 2 });
      const dialog = screen.getByRole("dialog");
      const zoomButton = screen.getByRole("button", {
        name: "Ampliar imagem",
      });

      for (let i = 0; i < 10; i++) {
        fireEvent.wheel(dialog, { deltaY: -500 });
      }

      expect(getScale(zoomButton)).toBe(2);
    });

    it("should not zoom out below 1 and should reset the position", () => {
      renderLightbox();
      const dialog = screen.getByRole("dialog");
      const zoomButton = screen.getByRole("button", {
        name: "Ampliar imagem",
      });

      fireEvent.wheel(dialog, { deltaY: -100, clientX: 50, clientY: 50 });
      fireEvent.wheel(dialog, { deltaY: 1000 });

      expect(getScale(zoomButton)).toBe(1);
      expect(zoomButton.style.transform).toContain("translate(0px, 0px)");
    });
  });

  describe("Closing", () => {
    it("should call onOpenChange(false) when the close button is clicked", async () => {
      const { onOpenChange } = renderLightbox();

      await userEvent.click(screen.getByRole("button", { name: "Fechar" }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should call onOpenChange(false) when Escape is pressed", async () => {
      const { onOpenChange } = renderLightbox();

      await userEvent.keyboard("{Escape}");

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should call onOpenChange(false) when the backdrop is clicked", async () => {
      const { onOpenChange } = renderLightbox();

      await userEvent.click(screen.getByRole("dialog"));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should not close when the image itself is clicked", async () => {
      const { onOpenChange } = renderLightbox();

      await userEvent.click(
        screen.getByRole("button", { name: "Ampliar imagem" })
      );

      expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });

    it("should reset zoom when reopened", async () => {
      const { rerender } = renderLightbox();

      await userEvent.click(
        screen.getByRole("button", { name: "Ampliar imagem" })
      );

      rerender(
        <ImageLightbox
          alt="Foto do imóvel"
          onOpenChange={jest.fn()}
          open={false}
          src="/image.jpg"
        />
      );
      rerender(
        <ImageLightbox
          alt="Foto do imóvel"
          onOpenChange={jest.fn()}
          open
          src="/image.jpg"
        />
      );

      expect(
        getScale(screen.getByRole("button", { name: "Ampliar imagem" }))
      ).toBe(1);
    });
  });
});
