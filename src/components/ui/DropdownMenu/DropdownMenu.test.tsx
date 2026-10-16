import userEvent from "@testing-library/user-event";
import { act, render, screen, waitFor } from "@/tests/app-test-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

describe("DropdownMenu", () => {
  it("renders trigger element", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("Open menu")).toBeInTheDocument();
  });

  it("opens menu on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open menu"));

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });

  it("renders menu items with children", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>First Option</DropdownMenuItem>
          <DropdownMenuItem>Second Option</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByText("First Option")).toBeInTheDocument();
      expect(screen.getByText("Second Option")).toBeInTheDocument();
    });
  });

  it("calls onSelect handler when item is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleSelect}>Click me</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Click me"));

    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it("renders menu item with icon", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<span data-testid="item-icon">🔧</span>}>
            With Icon
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("item-icon")).toBeInTheDocument();
      expect(screen.getByText("With Icon")).toBeInTheDocument();
    });
  });

  it("applies destructive styling when variant is destructive", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));

    await waitFor(() => {
      const destructiveItem = screen.getByText("Delete");
      expect(
        destructiveItem.closest('[data-slot="dropdown-menu-item"]')
      ).toHaveClass("text-red-600");
    });
  });

  it("renders disabled menu item", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));

    await waitFor(() => {
      const item = screen
        .getByText("Disabled Item")
        .closest('[data-slot="dropdown-menu-item"]');
      expect(item).toHaveAttribute("data-disabled");
    });
  });

  it("renders separator", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuItem>Second</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByTestId("separator")).toBeInTheDocument();
      expect(screen.getByTestId("separator")).toHaveClass("h-px");
    });
  });

  it("renders label", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));

    await waitFor(() => {
      expect(screen.getByText("Actions")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toHaveClass("font-semibold");
    });
  });

  it("applies custom className to menu item", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="custom-class">Custom</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));

    await waitFor(() => {
      const item = screen.getByText("Custom");
      expect(item.closest('[data-slot="dropdown-menu-item"]')).toHaveClass(
        "custom-class"
      );
    });
  });

  it("applies custom className to content", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));

    await waitFor(() => {
      const content = screen.getByRole("menu");
      expect(content).toHaveClass("custom-content");
    });
  });

  it("renders with data-slot attributes", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Trigger");
    expect(trigger).toHaveAttribute("data-slot", "dropdown-menu-trigger");

    await user.click(trigger);

    await waitFor(() => {
      const content = screen.getByRole("menu");
      expect(content).toHaveAttribute("data-slot", "dropdown-menu-content");

      const item = screen
        .getByText("Item")
        .closest('[data-slot="dropdown-menu-item"]');
      expect(item).toBeInTheDocument();
    });
  });

  it("index.ts exports work correctly", () => {
    const indexExports = require("./index");
    expect(indexExports.DropdownMenu).toBeDefined();
    expect(indexExports.DropdownMenuTrigger).toBeDefined();
    expect(indexExports.DropdownMenuContent).toBeDefined();
    expect(indexExports.DropdownMenuItem).toBeDefined();
    expect(indexExports.DropdownMenuSeparator).toBeDefined();
    expect(indexExports.DropdownMenuLabel).toBeDefined();
  });

  it("respects a controlled open prop", async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();

    const { rerender } = render(
      <DropdownMenu onOpenChange={handleOpenChange} open={false}>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Trigger"));
    expect(handleOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();

    rerender(
      <DropdownMenu onOpenChange={handleOpenChange} open={true}>
        <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });

  describe("openOnHover", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("does not open on hover when openOnHover is not set", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Option 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.hover(screen.getByText("Trigger"));
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("opens after openDelay when hovering the trigger", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <DropdownMenu openDelay={150} openOnHover>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Option 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.hover(screen.getByText("Trigger"));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(100);
      });
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    it("closes after closeDelay when the pointer leaves the trigger", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <DropdownMenu closeDelay={150} modal={false} openDelay={0} openOnHover>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Option 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.hover(screen.getByText("Trigger"));
      act(() => {
        jest.advanceTimersByTime(0);
      });
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.unhover(screen.getByText("Trigger"));
      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });

    it("stays open when the pointer moves from the trigger to the content", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <DropdownMenu closeDelay={150} modal={false} openDelay={0} openOnHover>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Option 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.hover(screen.getByText("Trigger"));
      act(() => {
        jest.advanceTimersByTime(0);
      });
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.unhover(screen.getByText("Trigger"));
      await user.hover(screen.getByText("Option 1"));
      act(() => {
        jest.advanceTimersByTime(150);
      });

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("closes after closeDelay when the pointer leaves the content", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <DropdownMenu closeDelay={150} modal={false} openDelay={0} openOnHover>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Option 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.hover(screen.getByText("Trigger"));
      act(() => {
        jest.advanceTimersByTime(0);
      });
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.hover(screen.getByText("Option 1"));
      await user.unhover(screen.getByText("Option 1"));
      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });

    it("still opens on click even when openOnHover is set", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <DropdownMenu openOnHover>
          <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Option 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });
  });
});
