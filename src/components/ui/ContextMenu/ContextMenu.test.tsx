import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@/tests/app-test-utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
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

  it("renders menu item with left icon", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem leftIcon={<span data-testid="left-icon">🔧</span>}>
            With Left Icon
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByText("With Left Icon")).toBeInTheDocument();
    });
  });

  it("renders menu item with right icon", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem rightIcon={<span data-testid="right-icon">→</span>}>
            With Right Icon
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
      expect(screen.getByText("With Right Icon")).toBeInTheDocument();
    });
  });

  it("applies destructive styling when destructive prop is true", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem destructive>Delete</ContextMenuItem>
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

  it("applies inset padding when inset prop is true", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem inset>Inset Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      const insetItem = screen.getByText("Inset Item");
      expect(insetItem.closest('[data-slot="context-menu-item"]')).toHaveClass(
        "pl-8"
      );
    });
  });

  it("renders separator", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>First</ContextMenuItem>
          <ContextMenuSeparator data-testid="separator" />
          <ContextMenuItem>Second</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByTestId("separator")).toBeInTheDocument();
      expect(screen.getByTestId("separator")).toHaveClass("h-px");
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

  it("renders label with inset", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel inset>Inset Label</ContextMenuLabel>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      const label = screen.getByText("Inset Label");
      expect(label).toHaveClass("pl-8");
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
    expect(indexExports.ContextMenuSeparator).toBeDefined();
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

  it("applies custom className to separator", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSeparator className="custom-sep" data-testid="sep" />
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("sep")).toHaveClass("custom-sep");
    });
  });
});
