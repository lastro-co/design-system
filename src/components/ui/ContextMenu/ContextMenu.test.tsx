import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@/tests/app-test-utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "./ContextMenu";

describe("ContextMenu", () => {
  it("renders trigger element", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Option 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(screen.getByText("Right-click me")).toBeInTheDocument();
  });

  it("opens menu on context menu event", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Option 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByText("Right-click me");
    fireEvent.contextMenu(trigger);

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });

  it("renders menu items with children", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>First Option</ContextMenuItem>
          <ContextMenuItem>Second Option</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByText("First Option")).toBeInTheDocument();
      expect(screen.getByText("Second Option")).toBeInTheDocument();
    });
  });

  it("calls onClick handler when item is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleClick}>Click me</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    const menuItem = screen.getByText("Click me");
    await user.click(menuItem);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders menu item with icon", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem icon={<span data-testid="item-icon">🔧</span>}>
            With Icon
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("item-icon")).toBeInTheDocument();
      expect(screen.getByText("With Icon")).toBeInTheDocument();
    });
  });

  it("applies destructive styling when variant is destructive", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      const destructiveItem = screen.getByText("Delete");
      expect(
        destructiveItem.closest('[data-slot="context-menu-item"]')
      ).toHaveClass("text-red-600");
    });
  });

  it("renders label", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuItem>Action 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByText("Actions")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toHaveClass("font-semibold");
    });
  });

  it("applies custom className to menu item", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="custom-class">Custom</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      const item = screen.getByText("Custom");
      expect(item.closest('[data-slot="context-menu-item"]')).toHaveClass(
        "custom-class"
      );
    });
  });

  it("applies custom className to content", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent className="custom-content">
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      const content = screen.getByRole("menu");
      expect(content).toHaveClass("custom-content");
    });
  });

  it("renders with data-slot attributes", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByText("Trigger");
    expect(trigger).toHaveAttribute("data-slot", "context-menu-trigger");

    fireEvent.contextMenu(trigger);

    await waitFor(() => {
      const content = screen.getByRole("menu");
      expect(content).toHaveAttribute("data-slot", "context-menu-content");

      const item = screen
        .getByText("Item")
        .closest('[data-slot="context-menu-item"]');
      expect(item).toBeInTheDocument();
    });
  });

  it("index.ts exports work correctly", () => {
    const indexExports = require("./index");
    expect(indexExports.ContextMenu).toBeDefined();
    expect(indexExports.ContextMenuTrigger).toBeDefined();
    expect(indexExports.ContextMenuContent).toBeDefined();
    expect(indexExports.ContextMenuItem).toBeDefined();
    expect(indexExports.ContextMenuLabel).toBeDefined();
  });

  it("stops propagation when content is clicked without onClick prop", async () => {
    const user = userEvent.setup();
    const parentClickHandler = jest.fn();

    render(
      <div onClick={parentClickHandler} role="none">
        <ContextMenu>
          <ContextMenuTrigger>Trigger</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    const menu = screen.getByRole("menu");
    await user.click(menu);

    expect(parentClickHandler).not.toHaveBeenCalled();
  });

  it("stops propagation when content is clicked with onClick prop", async () => {
    const user = userEvent.setup();
    const parentClickHandler = jest.fn();
    const contentClickHandler = jest.fn();

    render(
      <div onClick={parentClickHandler} role="none">
        <ContextMenu>
          <ContextMenuTrigger>Trigger</ContextMenuTrigger>
          <ContextMenuContent onClick={contentClickHandler}>
            <ContextMenuItem>Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    const menu = screen.getByRole("menu");
    await user.click(menu);

    expect(contentClickHandler).toHaveBeenCalledTimes(1);
    expect(parentClickHandler).not.toHaveBeenCalled();
  });

  it("stops propagation when menu item is clicked without onClick prop", async () => {
    const user = userEvent.setup();
    const parentClickHandler = jest.fn();

    render(
      <div onClick={parentClickHandler} role="none">
        <ContextMenu>
          <ContextMenuTrigger>Trigger</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>No handler</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByText("No handler")).toBeInTheDocument();
    });

    await user.click(screen.getByText("No handler"));

    expect(parentClickHandler).not.toHaveBeenCalled();
  });

  it("renders disabled menu item", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled>Disabled Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      const item = screen
        .getByText("Disabled Item")
        .closest('[data-slot="context-menu-item"]');
      expect(item).toHaveAttribute("data-disabled");
    });
  });
});
