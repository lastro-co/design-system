import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { toast } from "sonner";
import { act, render, screen, waitFor } from "@/tests/app-test-utils";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogRoot,
  AlertDialogTitle,
} from "../AlertDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../DropdownMenu";
import { Toaster } from "../Toaster";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerMain,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

const CLOSE_BUTTON_REGEX = /close/i;
const BACK_BUTTON_REGEX = /voltar/i;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

function renderDrawer(
  props: { width?: React.ComponentProps<typeof Drawer>["width"] } = {}
) {
  return render(
    <Drawer {...props}>
      <DrawerTrigger asChild>
        <button type="button">Open</button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="custom-header">
          <DrawerTitle className="custom-title">Drawer Title</DrawerTitle>
          <DrawerDescription className="custom-description">
            Drawer Description
          </DrawerDescription>
        </DrawerHeader>
        <DrawerMain>
          <p>Main Content</p>
        </DrawerMain>
        <DrawerFooter className="custom-footer">
          <p>Footer Content</p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

async function openDrawer(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText("Open"));
  await waitFor(() => {
    expect(screen.getByText("Drawer Title")).toBeVisible();
  });
}

describe("Drawer", () => {
  it("renders the trigger", () => {
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <button type="button">Open</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerMain>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerDescription>Description</DrawerDescription>
          </DrawerMain>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText("Open")).toBeVisible();
  });

  it("opens and shows content when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <button type="button">Open</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerMain>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer Description</DrawerDescription>
            <p>Content</p>
          </DrawerMain>
        </DrawerContent>
      </Drawer>
    );

    await user.click(screen.getByText("Open"));
    await waitFor(() => {
      expect(screen.getByText("Drawer Title")).toBeVisible();
      expect(screen.getByText("Content")).toBeVisible();
    });
  });

  it("shows close button when open", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <button type="button">Open</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerMain>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerDescription>Description</DrawerDescription>
          </DrawerMain>
        </DrawerContent>
      </Drawer>
    );

    await user.click(screen.getByText("Open"));
    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="drawer-close"]')
      ).toBeVisible();
    });
  });

  describe("sub-components rendering", () => {
    it("renders DrawerHeader with data-slot attribute", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      expect(
        document.querySelector('[data-slot="drawer-header"]')
      ).toBeInTheDocument();
    });

    it("renders DrawerHeader with custom className", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      const header = document.querySelector('[data-slot="drawer-header"]');
      expect(header).toHaveClass("custom-header");
    });

    it("renders DrawerFooter with data-slot attribute", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      expect(
        document.querySelector('[data-slot="drawer-footer"]')
      ).toBeInTheDocument();
    });

    it("renders DrawerFooter with custom className", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      const footer = document.querySelector('[data-slot="drawer-footer"]');
      expect(footer).toHaveClass("custom-footer");
    });

    it("renders DrawerTitle with correct text", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      expect(screen.getByText("Drawer Title")).toBeVisible();
    });

    it("renders DrawerTitle with data-slot attribute", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      expect(
        document.querySelector('[data-slot="drawer-title"]')
      ).toBeInTheDocument();
    });

    it("renders DrawerTitle with custom className", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      const title = document.querySelector('[data-slot="drawer-title"]');
      expect(title).toHaveClass("custom-title");
    });

    it("renders DrawerDescription with correct text", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      expect(screen.getByText("Drawer Description")).toBeVisible();
    });

    it("renders DrawerDescription with data-slot attribute", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      expect(
        document.querySelector('[data-slot="drawer-description"]')
      ).toBeInTheDocument();
    });

    it("renders DrawerDescription with custom className", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      const description = document.querySelector(
        '[data-slot="drawer-description"]'
      );
      expect(description).toHaveClass("custom-description");
    });

    it("renders DrawerMain with data-slot attribute", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      expect(
        document.querySelector('[data-slot="drawer-main"]')
      ).toBeInTheDocument();
    });

    it("renders full composition with all sub-components", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      expect(screen.getByText("Drawer Title")).toBeVisible();
      expect(screen.getByText("Drawer Description")).toBeVisible();
      expect(screen.getByText("Main Content")).toBeVisible();
      expect(screen.getByText("Footer Content")).toBeVisible();
    });
  });

  describe("DrawerHeader back button and action props", () => {
    it("renders the back button by default", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      expect(
        screen.getByRole("button", { name: BACK_BUTTON_REGEX })
      ).toBeVisible();
    });

    it("closes the drawer when the default back button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button">Open</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader />
            <DrawerMain>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Description</DrawerDescription>
              <p>Drawer Body</p>
            </DrawerMain>
          </DrawerContent>
        </Drawer>
      );

      await openDrawer(user);
      await user.click(screen.getByRole("button", { name: BACK_BUTTON_REGEX }));

      await waitFor(() => {
        expect(screen.queryByText("Drawer Body")).not.toBeInTheDocument();
      });
    });

    it("calls onBack instead of closing the drawer when onBack is passed", async () => {
      const user = userEvent.setup();
      const onBack = jest.fn();
      render(
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button">Open</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader onBack={onBack} />
            <DrawerMain>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Description</DrawerDescription>
              <p>Drawer Body</p>
            </DrawerMain>
          </DrawerContent>
        </Drawer>
      );

      await openDrawer(user);
      await user.click(screen.getByRole("button", { name: BACK_BUTTON_REGEX }));

      expect(onBack).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Drawer Body")).toBeVisible();
    });

    it("hides the back button when hideBackButton is true", async () => {
      const user = userEvent.setup();
      render(
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button">Open</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader hideBackButton />
            <DrawerMain>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Description</DrawerDescription>
            </DrawerMain>
          </DrawerContent>
        </Drawer>
      );

      await openDrawer(user);

      expect(
        screen.queryByRole("button", { name: BACK_BUTTON_REGEX })
      ).not.toBeInTheDocument();
    });

    it("renders the action node", async () => {
      const user = userEvent.setup();
      render(
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button">Open</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader action={<span>Header Action</span>} />
            <DrawerMain>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Description</DrawerDescription>
            </DrawerMain>
          </DrawerContent>
        </Drawer>
      );

      await openDrawer(user);

      expect(screen.getByText("Header Action")).toBeVisible();
    });

    it("renders the action node alongside the hidden back button", async () => {
      const user = userEvent.setup();
      render(
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button">Open</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader action={<span>Header Action</span>} hideBackButton>
              <DrawerTitle>Drawer Title</DrawerTitle>
            </DrawerHeader>
            <DrawerMain>
              <DrawerDescription>Description</DrawerDescription>
            </DrawerMain>
          </DrawerContent>
        </Drawer>
      );

      await openDrawer(user);

      expect(
        screen.queryByRole("button", { name: BACK_BUTTON_REGEX })
      ).not.toBeInTheDocument();
      expect(screen.getByText("Header Action")).toBeVisible();
    });
  });

  describe("width prop", () => {
    it("applies sm width class to drawer content", async () => {
      const user = userEvent.setup();
      renderDrawer({ width: "sm" });
      await openDrawer(user);

      const content = document.querySelector('[data-slot="drawer-content"]');
      expect(content?.className).toContain("sm:max-w-sm");
    });

    it("applies md width class to drawer content", async () => {
      const user = userEvent.setup();
      renderDrawer({ width: "md" });
      await openDrawer(user);

      const content = document.querySelector('[data-slot="drawer-content"]');
      expect(content?.className).toContain("sm:max-w-md");
    });

    it("applies lg width class to drawer content", async () => {
      const user = userEvent.setup();
      renderDrawer({ width: "lg" });
      await openDrawer(user);

      const content = document.querySelector('[data-slot="drawer-content"]');
      expect(content?.className).toContain("sm:max-w-lg");
    });

    it("applies xl width class to drawer content", async () => {
      const user = userEvent.setup();
      renderDrawer({ width: "xl" });
      await openDrawer(user);

      const content = document.querySelector('[data-slot="drawer-content"]');
      expect(content?.className).toContain("sm:max-w-xl");
    });

    it("applies full width class to drawer content", async () => {
      const user = userEvent.setup();
      renderDrawer({ width: "full" });
      await openDrawer(user);

      const content = document.querySelector('[data-slot="drawer-content"]');
      expect(content?.className).toContain("w-full");
    });

    it("applies default width class when no width is specified", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      const content = document.querySelector('[data-slot="drawer-content"]');
      expect(content?.className).toContain("sm:max-w-[600px]");
    });
  });

  describe("close button interaction", () => {
    it("closes drawer when the built-in close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button">Open</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerMain>
              <DrawerTitle>Title</DrawerTitle>
              <DrawerDescription>Description</DrawerDescription>
              <p>Drawer Body</p>
            </DrawerMain>
          </DrawerContent>
        </Drawer>
      );

      await user.click(screen.getByText("Open"));
      await waitFor(() => {
        expect(screen.getByText("Drawer Body")).toBeVisible();
      });

      await user.click(
        screen.getByRole("button", { name: CLOSE_BUTTON_REGEX })
      );
      await waitFor(() => {
        expect(screen.queryByText("Drawer Body")).not.toBeInTheDocument();
      });
    });

    it("closes drawer when a custom DrawerClose button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button">Open</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerMain>
              <DrawerTitle>Title</DrawerTitle>
              <DrawerDescription>Description</DrawerDescription>
              <p>Drawer Body</p>
            </DrawerMain>
            <DrawerFooter>
              <DrawerClose asChild>
                <button type="button">Dismiss</button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );

      await user.click(screen.getByText("Open"));
      await waitFor(() => {
        expect(screen.getByText("Drawer Body")).toBeVisible();
      });

      await user.click(screen.getByText("Dismiss"));
      await waitFor(() => {
        expect(screen.queryByText("Drawer Body")).not.toBeInTheDocument();
      });
    });
  });

  describe("body pointer-events cleanup", () => {
    // vaul and Radix's scroll-lock can race when this drawer closes right as
    // another Radix overlay (e.g. a DropdownMenu item) closed in the same
    // tick to open it — the lock ref-count desyncs and
    // `<body style="pointer-events: none">` is left stuck forever, freezing
    // the whole page (nothing in the document is clickable anymore).
    function DropdownOpenedDrawerScenario() {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button">Trigger</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setOpen(true)}>
                Open drawer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Drawer onOpenChange={setOpen} open={open}>
            <DrawerContent>
              <DrawerMain>
                <DrawerTitle>Title</DrawerTitle>
                <DrawerDescription>Description</DrawerDescription>
                <p>Drawer Body</p>
              </DrawerMain>
            </DrawerContent>
          </Drawer>
        </div>
      );
    }

    it("clears a stuck body pointer-events after opening from a DropdownMenu item closes", async () => {
      const user = userEvent.setup();

      render(<DropdownOpenedDrawerScenario />);

      await user.click(screen.getByText("Trigger"));
      await waitFor(() => {
        expect(screen.getByText("Open drawer")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Open drawer"));
      await waitFor(() => {
        expect(screen.getByText("Drawer Body")).toBeVisible();
      });

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByText("Drawer Body")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(document.body.style.pointerEvents).not.toBe("none");
      });

      // The page must be interactive again: the trigger reopens the menu.
      await user.click(screen.getByText("Trigger"));
      await waitFor(() => {
        expect(screen.getByText("Open drawer")).toBeInTheDocument();
      });
    });

    // Guards the inverse failure mode: if this drawer closes to make way for
    // an AlertDialog (e.g. a delete confirmation triggered from inside the
    // drawer, as TeamCard does), the cleanup must NOT clear the lock the
    // AlertDialog still legitimately needs — that would let clicks reach
    // the page behind an open confirmation dialog.
    function DrawerToAlertDialogScenario() {
      const [drawerOpen, setDrawerOpen] = useState(true);
      const [alertOpen, setAlertOpen] = useState(false);
      return (
        <div>
          <button type="button">Background button</button>

          <Drawer onOpenChange={setDrawerOpen} open={drawerOpen}>
            <DrawerContent>
              <DrawerMain>
                <DrawerTitle>Title</DrawerTitle>
                <DrawerDescription>Description</DrawerDescription>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setAlertOpen(true);
                  }}
                  type="button"
                >
                  Delete
                </button>
              </DrawerMain>
            </DrawerContent>
          </Drawer>

          <AlertDialogRoot onOpenChange={setAlertOpen} open={alertOpen}>
            <AlertDialogContent>
              <AlertDialogTitle>Confirm</AlertDialogTitle>
              <AlertDialogAction onClick={() => setAlertOpen(false)}>
                Confirm delete
              </AlertDialogAction>
            </AlertDialogContent>
          </AlertDialogRoot>
        </div>
      );
    }

    it("does not clear the lock while an AlertDialog opened from this drawer is still open", async () => {
      const user = userEvent.setup();
      render(<DrawerToAlertDialogScenario />);

      await waitFor(() => {
        expect(screen.getByText("Delete")).toBeVisible();
      });

      // Closes this drawer and opens the AlertDialog in the same handler —
      // the exact race the cleanup frame has to resolve correctly.
      await user.click(screen.getByText("Delete"));

      await waitFor(() => {
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.getByText("Confirm delete")).toBeVisible();
      });

      expect(document.body.style.pointerEvents).toBe("none");
    });

    // vaul only calls `onOpenChange` for its own internal close paths (Esc,
    // outside-click, drag, close button). When a controlled `open` prop is
    // flipped to `false` by the parent itself — e.g. after an async save
    // resolves — vaul never calls `onOpenChange`, so the cleanup in
    // `handleOpenChange` alone would never run. This scenario reproduces
    // that: the Drawer is opened from a DropdownMenu item (the same race as
    // above), then closed via a "Save" button whose handler flips `open` to
    // `false` asynchronously, mirroring a real `await save(); onClose()`
    // pattern — never through vaul's internal Esc/X/outside-click paths.
    function DropdownOpenedDrawerClosedExternallyScenario() {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button">Trigger</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setOpen(true)}>
                Open drawer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Drawer onOpenChange={setOpen} open={open}>
            <DrawerContent>
              <DrawerMain>
                <DrawerTitle>Title</DrawerTitle>
                <DrawerDescription>Description</DrawerDescription>
                <button
                  onClick={async () => {
                    await Promise.resolve();
                    setOpen(false);
                  }}
                  type="button"
                >
                  Save
                </button>
              </DrawerMain>
            </DrawerContent>
          </Drawer>
        </div>
      );
    }

    it("clears a stuck body pointer-events after an externally-controlled close (no Esc/X/outside-click)", async () => {
      const user = userEvent.setup();

      render(<DropdownOpenedDrawerClosedExternallyScenario />);

      await user.click(screen.getByText("Trigger"));
      await waitFor(() => {
        expect(screen.getByText("Open drawer")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Open drawer"));
      await waitFor(() => {
        expect(screen.getByText("Save")).toBeVisible();
      });

      // Closes the drawer via a parent state update after an await — never
      // through vaul's internal onOpenChange path.
      await user.click(screen.getByText("Save"));
      await waitFor(() => {
        expect(screen.queryByText("Save")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(document.body.style.pointerEvents).not.toBe("none");
      });

      // The page must be interactive again: the trigger reopens the menu.
      await user.click(screen.getByText("Trigger"));
      await waitFor(() => {
        expect(screen.getByText("Open drawer")).toBeInTheDocument();
      });
    });

    it("does not run external-close cleanup for an uncontrolled drawer", async () => {
      const user = userEvent.setup();
      renderDrawer();
      await openDrawer(user);

      await user.click(
        screen.getByRole("button", { name: CLOSE_BUTTON_REGEX })
      );
      await waitFor(() => {
        expect(screen.queryByText("Drawer Title")).not.toBeInTheDocument();
      });

      expect(document.body.style.pointerEvents).not.toBe("none");
    });
  });

  describe("barrel exports", () => {
    it("exports all 11 named components from index", () => {
      const exports = require("./index");
      expect(exports.Drawer).toBeDefined();
      expect(exports.DrawerPortal).toBeDefined();
      expect(exports.DrawerOverlay).toBeDefined();
      expect(exports.DrawerTrigger).toBeDefined();
      expect(exports.DrawerClose).toBeDefined();
      expect(exports.DrawerContent).toBeDefined();
      expect(exports.DrawerHeader).toBeDefined();
      expect(exports.DrawerMain).toBeDefined();
      expect(exports.DrawerFooter).toBeDefined();
      expect(exports.DrawerTitle).toBeDefined();
      expect(exports.DrawerDescription).toBeDefined();
    });
  });
});

const CLOSE_TOAST_LABEL = "Close toast";
const TOAST_MESSAGE = "Subset salvo";

function renderOpenDrawerWithToaster(
  props: Partial<React.ComponentProps<typeof DrawerContent>> = {}
) {
  const onOpenChange = jest.fn();
  render(
    <>
      <Drawer onOpenChange={onOpenChange} open>
        <DrawerContent {...props}>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>Drawer Description</DrawerDescription>
        </DrawerContent>
      </Drawer>
      <Toaster />
    </>
  );
  return { onOpenChange };
}

const overlay = () => {
  const element = document.querySelector<HTMLElement>(
    '[data-slot="drawer-overlay"]'
  );
  if (!element) {
    throw new Error("drawer overlay is not rendered");
  }
  return element;
};

describe("Drawer with a Toaster", () => {
  afterEach(() => {
    act(() => {
      toast.dismiss();
    });
  });

  it("lets the toast close button be clicked without closing the drawer", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderOpenDrawerWithToaster();
    act(() => {
      toast(TOAST_MESSAGE, {
        closeButton: true,
        duration: Number.POSITIVE_INFINITY,
      });
    });

    await user.click(
      await screen.findByRole("button", { name: CLOSE_TOAST_LABEL })
    );

    await waitFor(() => {
      expect(screen.queryByText(TOAST_MESSAGE)).not.toBeInTheDocument();
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText("Drawer Title")).toBeVisible();
  });

  it("runs a toast action without closing the drawer", async () => {
    const user = userEvent.setup();
    const onUndo = jest.fn();
    const { onOpenChange } = renderOpenDrawerWithToaster();
    act(() => {
      toast(TOAST_MESSAGE, {
        action: { label: "Desfazer", onClick: onUndo },
        duration: Number.POSITIVE_INFINITY,
      });
    });

    await user.click(await screen.findByRole("button", { name: "Desfazer" }));

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("still closes when the overlay is pressed", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderOpenDrawerWithToaster();

    await user.click(overlay());

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("still closes on Escape", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderOpenDrawerWithToaster();

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls the caller's onPointerDownOutside, for the overlay and for a toast", async () => {
    const user = userEvent.setup();
    const onPointerDownOutside = jest.fn();
    renderOpenDrawerWithToaster({ onPointerDownOutside });
    act(() => {
      toast(TOAST_MESSAGE, {
        closeButton: true,
        duration: Number.POSITIVE_INFINITY,
      });
    });

    await user.click(
      await screen.findByRole("button", { name: CLOSE_TOAST_LABEL })
    );
    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);

    await user.click(overlay());
    expect(onPointerDownOutside).toHaveBeenCalledTimes(2);
  });

  it("stays open when the caller's onPointerDownOutside prevents the dismiss", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderOpenDrawerWithToaster({
      onPointerDownOutside: (event) => event.preventDefault(),
    });

    await user.click(overlay());

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
