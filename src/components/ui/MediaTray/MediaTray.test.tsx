import { useState } from "react";
import {
  act,
  createEvent,
  fireEvent,
  render,
  screen,
  userEvent,
} from "@/tests/app-test-utils";
import {
  MediaTray,
  type MediaTrayItem,
  type MediaTrayProps,
  moveItem,
} from ".";

const TILE_WIDTH = 84;
const TILE_STRIDE = 100;
const ADD_LABEL = "Adicionar mídia";

// jsdom has no PointerEvent, so fireEvent.pointer* would drop clientX and button
class TestPointerEvent extends MouseEvent {
  readonly pointerId: number;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 0;
  }
}

beforeAll(() => {
  if (!window.PointerEvent) {
    Object.defineProperty(window, "PointerEvent", {
      configurable: true,
      value: TestPointerEvent,
    });
  }
});

const buildItems = (): MediaTrayItem[] => [
  { id: "1", kind: "image", fileName: "um.jpg", src: "1.jpg" },
  { id: "2", kind: "video", fileName: "dois.mp4" },
  { id: "3", kind: "file", fileName: "tres.pdf" },
];

const ids = (items: MediaTrayItem[]) => items.map((item) => item.id);

function ControlledTray({ onReorder, ...props }: Partial<MediaTrayProps>) {
  const [items, setItems] = useState(buildItems);
  return (
    <MediaTray
      {...props}
      items={items}
      onReorder={(next) => {
        onReorder?.(next);
        setItems(next);
      }}
    />
  );
}

const mockTileRects = () => {
  const listItems = screen.getAllByRole("listitem");
  listItems.forEach((li, index) => {
    const left = index * TILE_STRIDE;
    jest.spyOn(li, "getBoundingClientRect").mockReturnValue({
      left,
      right: left + TILE_WIDTH,
      width: TILE_WIDTH,
      top: 0,
      bottom: 44,
      height: 44,
      x: left,
      y: 0,
      toJSON: () => ({}),
    });
  });
  return listItems;
};

describe("moveItem", () => {
  it("moves an item forward", () => {
    expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
  });

  it("moves an item backward", () => {
    expect(moveItem(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });

  it("returns the same order in a new array when from equals to", () => {
    const items = ["a", "b"];
    const result = moveItem(items, 1, 1);
    expect(result).toEqual(["a", "b"]);
    expect(result).not.toBe(items);
  });

  it("ignores out-of-range indexes", () => {
    expect(moveItem(["a", "b"], 0, 5)).toEqual(["a", "b"]);
    expect(moveItem(["a", "b"], -1, 0)).toEqual(["a", "b"]);
  });
});

describe("MediaTray", () => {
  describe("Rendering", () => {
    it("renders numbered tiles in order", () => {
      render(<MediaTray items={buildItems()} onSelect={jest.fn()} />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3);
      expect(listItems[0]).toHaveTextContent("1");
      expect(listItems[2]).toHaveTextContent("3");
      expect(screen.getByRole("button", { name: "dois.mp4" })).toBeVisible();
    });

    it("renders only the add button when empty", () => {
      render(<MediaTray items={[]} onAdd={jest.fn()} />);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: ADD_LABEL })).toBeVisible();
      expect(screen.getAllByRole("button")).toHaveLength(1);
    });

    it("renders static previews without onSelect or onReorder", () => {
      render(<MediaTray items={buildItems()} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.getByRole("img", { name: "um.jpg" })).toBeVisible();
    });

    it("marks the selected item", () => {
      render(
        <MediaTray items={buildItems()} onSelect={jest.fn()} selectedId="2" />
      );
      expect(screen.getByRole("button", { name: "dois.mp4" })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      expect(screen.getByRole("button", { name: "um.jpg" })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });

    it("uses a custom add label and merges className", () => {
      const { container } = render(
        <MediaTray
          addLabel="Adicionar arquivo"
          className="custom"
          items={[]}
          onAdd={jest.fn()}
        />
      );
      expect(
        screen.getByRole("button", { name: "Adicionar arquivo" })
      ).toBeVisible();
      expect(container.firstChild).toHaveClass("custom", "overflow-x-auto");
    });
  });

  describe("Callbacks", () => {
    it("calls onSelect and onRemove with the item id", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      const onRemove = jest.fn();
      render(
        <MediaTray
          items={buildItems()}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      );
      await user.click(screen.getByRole("button", { name: "tres.pdf" }));
      await user.click(screen.getByRole("button", { name: "Remover um.jpg" }));
      expect(onSelect).toHaveBeenCalledWith("3");
      expect(onRemove).toHaveBeenCalledWith("1");
      expect(onSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe("Batch limit", () => {
    it("disables the add button when the limit is reached", () => {
      render(<MediaTray items={buildItems()} maxItems={3} onAdd={jest.fn()} />);
      expect(screen.getByRole("button", { name: ADD_LABEL })).toBeDisabled();
    });

    it("calls onAdd below the limit", async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      render(<MediaTray items={buildItems()} maxItems={4} onAdd={onAdd} />);
      const addButton = screen.getByRole("button", { name: ADD_LABEL });
      expect(addButton).toBeEnabled();
      await user.click(addButton);
      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it("keeps the add button enabled without maxItems", () => {
      render(<MediaTray items={buildItems()} onAdd={jest.fn()} />);
      expect(screen.getByRole("button", { name: ADD_LABEL })).toBeEnabled();
    });
  });

  describe("Keyboard reorder", () => {
    it("moves the item right with Alt+ArrowRight, announces it and keeps focus", async () => {
      const user = userEvent.setup();
      const onReorder = jest.fn();
      render(<ControlledTray onReorder={onReorder} />);
      const first = screen.getByRole("button", { name: "um.jpg" });
      first.focus();

      await user.keyboard("{Alt>}{ArrowRight}{/Alt}");

      expect(ids(onReorder.mock.calls[0][0])).toEqual(["2", "1", "3"]);
      expect(screen.getByRole("button", { name: "um.jpg" })).toHaveFocus();
      expect(
        screen.getByText("um.jpg movido para a posição 2 de 3")
      ).toBeVisible();
      expect(screen.getAllByRole("listitem")[1]).toHaveTextContent("2");
    });

    it("moves the item left with Alt+ArrowLeft", async () => {
      const user = userEvent.setup();
      const onReorder = jest.fn();
      render(<ControlledTray onReorder={onReorder} />);
      screen.getByRole("button", { name: "tres.pdf" }).focus();

      await user.keyboard("{Alt>}{ArrowLeft}{/Alt}");

      expect(ids(onReorder.mock.calls[0][0])).toEqual(["1", "3", "2"]);
      expect(screen.getByRole("button", { name: "tres.pdf" })).toHaveFocus();
    });

    it("prevents the browser default for Alt+Arrow", () => {
      render(<ControlledTray />);
      const first = screen.getByRole("button", { name: "um.jpg" });
      const event = createEvent.keyDown(first, {
        key: "ArrowRight",
        altKey: true,
      });
      fireEvent(first, event);
      expect(event.defaultPrevented).toBe(true);
    });

    it("prevents the default but does not reorder past the edges", () => {
      const onReorder = jest.fn();
      render(<ControlledTray onReorder={onReorder} />);
      const first = screen.getByRole("button", { name: "um.jpg" });
      const event = createEvent.keyDown(first, {
        key: "ArrowLeft",
        altKey: true,
      });
      fireEvent(first, event);
      expect(event.defaultPrevented).toBe(true);
      expect(onReorder).not.toHaveBeenCalled();
    });

    it("ignores arrows without Alt and keys from the remove button", () => {
      const onReorder = jest.fn();
      render(<ControlledTray onRemove={jest.fn()} onReorder={onReorder} />);
      const first = screen.getByRole("button", { name: "um.jpg" });
      fireEvent.keyDown(first, { key: "ArrowRight" });
      fireEvent.keyDown(
        screen.getByRole("button", { name: "Remover um.jpg" }),
        {
          key: "ArrowRight",
          altKey: true,
        }
      );
      expect(onReorder).not.toHaveBeenCalled();
    });
  });

  describe("Pointer reorder", () => {
    it("moves the first item to the end when dragged past the last tile", () => {
      const onReorder = jest.fn();
      render(<ControlledTray onReorder={onReorder} />);
      const [first] = mockTileRects();

      fireEvent.pointerDown(first, { button: 0, clientX: 40, pointerId: 1 });
      fireEvent.pointerMove(first, { clientX: 150, pointerId: 1 });
      expect(first).toHaveClass("opacity-50");
      fireEvent.pointerMove(first, { clientX: 250, pointerId: 1 });
      fireEvent.pointerUp(first, { clientX: 250, pointerId: 1 });

      expect(ids(onReorder.mock.calls[0][0])).toEqual(["2", "3", "1"]);
      expect(
        screen.getByText("um.jpg movido para a posição 3 de 3")
      ).toBeVisible();
    });

    it("suppresses the click that follows a drag", () => {
      const onSelect = jest.fn();
      render(<ControlledTray onSelect={onSelect} />);
      const [first] = mockTileRects();

      fireEvent.pointerDown(first, { button: 0, clientX: 40, pointerId: 1 });
      fireEvent.pointerMove(first, { clientX: 150, pointerId: 1 });
      fireEvent.pointerUp(first, { clientX: 150, pointerId: 1 });
      fireEvent.click(screen.getByRole("button", { name: "um.jpg" }));
      expect(onSelect).not.toHaveBeenCalled();

      fireEvent.click(screen.getByRole("button", { name: "um.jpg" }));
      expect(onSelect).toHaveBeenCalledWith("1");
    });

    it("treats a movement below the threshold as a click", () => {
      const onReorder = jest.fn();
      const onSelect = jest.fn();
      render(<ControlledTray onReorder={onReorder} onSelect={onSelect} />);
      const [first] = mockTileRects();
      const button = screen.getByRole("button", { name: "um.jpg" });

      fireEvent.pointerDown(button, { button: 0, clientX: 40, pointerId: 1 });
      fireEvent.pointerMove(button, { clientX: 43, pointerId: 1 });
      fireEvent.pointerUp(button, { clientX: 43, pointerId: 1 });
      fireEvent.click(button);

      expect(first).not.toHaveClass("opacity-50");
      expect(onReorder).not.toHaveBeenCalled();
      expect(onSelect).toHaveBeenCalledWith("1");
    });

    it("does not reorder when dropped back on the same position", () => {
      const onReorder = jest.fn();
      render(<ControlledTray onReorder={onReorder} />);
      const [first] = mockTileRects();

      fireEvent.pointerDown(first, { button: 0, clientX: 40, pointerId: 1 });
      fireEvent.pointerMove(first, { clientX: 60, pointerId: 1 });
      fireEvent.pointerUp(first, { clientX: 60, pointerId: 1 });

      expect(onReorder).not.toHaveBeenCalled();
    });

    it("aborts the drag on pointercancel", () => {
      const onReorder = jest.fn();
      render(<ControlledTray onReorder={onReorder} />);
      const [first] = mockTileRects();

      fireEvent.pointerDown(first, { button: 0, clientX: 40, pointerId: 1 });
      fireEvent.pointerMove(first, { clientX: 250, pointerId: 1 });
      fireEvent.pointerCancel(first, { pointerId: 1 });
      fireEvent.pointerUp(first, { clientX: 250, pointerId: 1 });

      expect(first).not.toHaveClass("opacity-50");
      expect(onReorder).not.toHaveBeenCalled();
    });

    it("ignores drags started on the remove button or with a secondary button", () => {
      const onReorder = jest.fn();
      render(<ControlledTray onRemove={jest.fn()} onReorder={onReorder} />);
      const [first] = mockTileRects();
      const remove = screen.getByRole("button", { name: "Remover um.jpg" });

      fireEvent.pointerDown(remove, { button: 0, clientX: 40, pointerId: 1 });
      fireEvent.pointerMove(first, { clientX: 250, pointerId: 1 });
      fireEvent.pointerUp(first, { clientX: 250, pointerId: 1 });
      fireEvent.pointerDown(first, { button: 2, clientX: 40, pointerId: 2 });
      fireEvent.pointerMove(first, { clientX: 250, pointerId: 2 });
      fireEvent.pointerUp(first, { clientX: 250, pointerId: 2 });

      expect(onReorder).not.toHaveBeenCalled();
    });

    it("captures the pointer when supported", () => {
      render(<ControlledTray />);
      const [first] = mockTileRects();
      const setPointerCapture = jest.fn();
      Object.defineProperty(first, "setPointerCapture", {
        value: setPointerCapture,
      });

      fireEvent.pointerDown(first, { button: 0, clientX: 40, pointerId: 7 });

      expect(setPointerCapture).toHaveBeenCalledWith(7);
    });
  });

  describe("Disabled", () => {
    it("blocks drag, keyboard reorder, removal and add", async () => {
      const user = userEvent.setup();
      const onReorder = jest.fn();
      const onRemove = jest.fn();
      const onAdd = jest.fn();
      render(
        <ControlledTray
          disabled
          onAdd={onAdd}
          onRemove={onRemove}
          onReorder={onReorder}
        />
      );
      const [first] = mockTileRects();

      fireEvent.pointerDown(first, { button: 0, clientX: 40, pointerId: 1 });
      fireEvent.pointerMove(first, { clientX: 250, pointerId: 1 });
      fireEvent.pointerUp(first, { clientX: 250, pointerId: 1 });
      fireEvent.keyDown(screen.getByRole("button", { name: "um.jpg" }), {
        key: "ArrowRight",
        altKey: true,
      });
      await user.click(screen.getByRole("button", { name: "Remover um.jpg" }));
      await user.click(screen.getByRole("button", { name: ADD_LABEL }));

      expect(first).not.toHaveClass("touch-none");
      expect(onReorder).not.toHaveBeenCalled();
      expect(onRemove).not.toHaveBeenCalled();
      expect(onAdd).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: ADD_LABEL })).toBeDisabled();
    });
  });

  it("does not move focus when the moved item is no longer rendered", () => {
    const onReorder = jest.fn();
    const { rerender } = render(
      <MediaTray items={buildItems()} onReorder={onReorder} />
    );
    const first = screen.getByRole("button", { name: "um.jpg" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight", altKey: true });

    act(() => {
      rerender(
        <MediaTray items={buildItems().slice(1)} onReorder={onReorder} />
      );
    });

    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: "um.jpg" })
    ).not.toBeInTheDocument();
  });
});
