import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/app-test-utils";
import {
  Drawer,
  DrawerContent,
  DrawerMain,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

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
});
