import { render, screen, userEvent } from "@/tests/app-test-utils";
import { MediaGrid, type MediaGridItem } from ".";

const OVERFLOW_TEXT_REGEX = /\+\d/;

const buildItems = (count: number): MediaGridItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `m${index}`,
    kind: "image",
    src: `${index}.jpg`,
    alt: `Foto ${index + 1}`,
  }));

const getGrid = () => screen.getByRole("list");
const getCells = () => screen.getAllByRole("listitem");

describe("MediaGrid", () => {
  describe("Overflow", () => {
    it("shows maxVisible cells with +N on the last one", () => {
      render(
        <MediaGrid columns={4} items={buildItems(10)} onItemClick={jest.fn()} />
      );
      expect(getCells()).toHaveLength(8);
      expect(getGrid()).toHaveClass("grid-cols-4");
      const overflow = screen.getByRole("button", {
        name: "Ver mais 2 mídias",
      });
      expect(overflow).toBeVisible();
      expect(overflow).toHaveTextContent("+2");
      expect(getCells()[7]).toHaveClass("aspect-square");
    });

    it("calls onItemClick with the real index, including the +N cell", async () => {
      const user = userEvent.setup();
      const onItemClick = jest.fn();
      render(
        <MediaGrid
          columns={4}
          items={buildItems(10)}
          onItemClick={onItemClick}
        />
      );
      await user.click(screen.getByRole("button", { name: "Foto 3" }));
      await user.click(
        screen.getByRole("button", { name: "Ver mais 2 mídias" })
      );
      expect(onItemClick).toHaveBeenNthCalledWith(1, 2);
      expect(onItemClick).toHaveBeenNthCalledWith(2, 7);
    });

    it("defaults to 2 columns and 4 visible items", () => {
      render(<MediaGrid items={buildItems(6)} onItemClick={jest.fn()} />);
      expect(getCells()).toHaveLength(4);
      expect(getGrid()).toHaveClass("grid-cols-2");
      expect(
        screen.getByRole("button", { name: "Ver mais 2 mídias" })
      ).toBeVisible();
    });

    it("respects a custom maxVisible", () => {
      render(
        <MediaGrid
          columns={4}
          items={buildItems(5)}
          maxVisible={3}
          onItemClick={jest.fn()}
        />
      );
      expect(getCells()).toHaveLength(3);
      expect(getGrid()).toHaveClass("grid-cols-3");
      expect(
        screen.getByRole("button", { name: "Ver mais 2 mídias" })
      ).toBeVisible();
    });

    it("exposes the +N label without onItemClick", () => {
      render(<MediaGrid items={buildItems(5)} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.getByText("Ver mais 1 mídia")).toBeVisible();
    });
  });

  describe("Layout", () => {
    it("renders a single item full width without +N", () => {
      render(<MediaGrid columns={4} items={buildItems(1)} />);
      expect(getGrid()).toHaveClass("grid-cols-1");
      expect(getCells()[0]).toHaveClass("aspect-square");
      expect(screen.queryByText(OVERFLOW_TEXT_REGEX)).not.toBeInTheDocument();
    });

    it("stretches the last of 3 items across the row with 2 columns", () => {
      render(<MediaGrid columns={2} items={buildItems(3)} />);
      expect(getGrid()).toHaveClass("grid-cols-2");
      expect(getCells()[2]).toHaveClass("col-span-2");
      expect(getCells()[1]).not.toHaveClass("col-span-2");
    });

    it.each([
      [2, "grid-cols-2", undefined],
      [3, "grid-cols-3", undefined],
      [4, "grid-cols-4", undefined],
      [5, "grid-cols-4", "col-span-4"],
      [6, "grid-cols-4", "col-span-3"],
      [7, "grid-cols-4", "col-span-2"],
      [8, "grid-cols-4", undefined],
    ])("lays out %i items with 4 columns", (count, gridClass, lastSpan) => {
      render(<MediaGrid columns={4} items={buildItems(count)} />);
      expect(getGrid()).toHaveClass(gridClass);
      const last = getCells().at(-1);
      if (lastSpan) {
        expect(last).toHaveClass(lastSpan);
      } else {
        expect(last).toHaveClass("aspect-square");
      }
    });

    it("renders nothing without items", () => {
      const { container } = render(<MediaGrid items={[]} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("merges a custom className", () => {
      render(<MediaGrid className="custom" items={buildItems(2)} />);
      expect(getGrid()).toHaveClass("custom", "grid");
    });
  });

  describe("Media", () => {
    it("renders images with object-cover and their alt", () => {
      render(<MediaGrid items={buildItems(1)} />);
      const img = screen.getByRole("img", { name: "Foto 1" });
      expect(img).toHaveClass("object-cover");
      expect(img).toHaveAttribute("src", "0.jpg");
    });

    it("renders videos with a play icon", () => {
      const { container } = render(
        <MediaGrid
          items={[{ id: "v", kind: "video", src: "v.mp4", alt: "Vídeo 1" }]}
        />
      );
      const video = container.querySelector("video");
      expect(video).toHaveAttribute("src", "v.mp4");
      expect(video).toHaveAttribute("aria-label", "Vídeo 1");
      expect(container.querySelector(".lucide-play")).toBeVisible();
    });

    it("hides the play icon behind the +N overlay", () => {
      const items: MediaGridItem[] = [
        ...buildItems(3),
        { id: "v", kind: "video", src: "v.mp4", alt: "Vídeo" },
        ...buildItems(2).map((item) => ({ ...item, id: `x${item.id}` })),
      ];
      const { container } = render(<MediaGrid items={items} />);
      expect(container.querySelector(".lucide-play")).not.toBeInTheDocument();
      expect(container.querySelector("video")).not.toHaveAttribute(
        "aria-label"
      );
    });
  });

  describe("Overlay slot", () => {
    it("renders the overlay for each visible item", () => {
      render(
        <MediaGrid
          items={buildItems(5)}
          renderItemOverlay={(item, index) => (
            <span>{`${item.id}-${index} 10:42`}</span>
          )}
        />
      );
      expect(screen.getByText("m0-0 10:42")).toBeVisible();
      expect(screen.getByText("m3-3 10:42")).toBeVisible();
      expect(screen.queryByText("m4-4 10:42")).not.toBeInTheDocument();
    });

    it("keeps the overlay outside the clickable button", () => {
      const { container } = render(
        <MediaGrid
          items={buildItems(1)}
          onItemClick={jest.fn()}
          renderItemOverlay={() => <span>10:42</span>}
        />
      );
      expect(container.querySelector("button")).not.toHaveTextContent("10:42");
      expect(screen.getByText("10:42")).toBeVisible();
    });
  });
});
