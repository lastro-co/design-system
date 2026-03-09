import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";

describe("Popover", () => {
  it("renders all components with correct data-slots", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverAnchor data-testid="anchor">Anchor</PopoverAnchor>
        <PopoverTrigger data-testid="trigger">Trigger</PopoverTrigger>
        <PopoverContent data-testid="content">Content</PopoverContent>
      </Popover>
    );

    expect(screen.getByTestId("trigger")).toHaveAttribute(
      "data-slot",
      "popover-trigger"
    );
    expect(screen.getByTestId("anchor")).toHaveAttribute(
      "data-slot",
      "popover-anchor"
    );

    await user.click(screen.getByTestId("trigger"));

    const content = screen.getByTestId("content");
    expect(content).toHaveAttribute("data-slot", "popover-content");
    expect(content).toBeVisible();
  });

  it("works in controlled mode", () => {
    const onOpenChange = jest.fn();

    render(
      <Popover onOpenChange={onOpenChange} open={true}>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );

    expect(screen.getByText("Content")).toBeVisible();
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(screen.getByText("Content")).toBeVisible();
  });

  it("exports all components from index", () => {
    const exports = require("./index");

    expect(exports.Popover).toBeDefined();
    expect(exports.PopoverTrigger).toBeDefined();
    expect(exports.PopoverContent).toBeDefined();
    expect(exports.PopoverAnchor).toBeDefined();
  });
});
