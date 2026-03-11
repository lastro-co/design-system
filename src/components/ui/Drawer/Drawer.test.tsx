import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/app-test-utils";
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
        const content = document.querySelector('[data-slot="drawer-content"]');
        expect(content).toHaveAttribute("data-state", "closed");
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
        const content = document.querySelector('[data-slot="drawer-content"]');
        expect(content).toHaveAttribute("data-state", "closed");
      });
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
