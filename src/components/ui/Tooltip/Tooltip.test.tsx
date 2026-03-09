import { render, screen, waitFor } from "@/tests/app-test-utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

describe("Tooltip", () => {
  it("renders all components with correct data-slots and styling", async () => {
    render(
      <TooltipProvider data-testid="provider" delayDuration={100}>
        <Tooltip open={true}>
          <TooltipTrigger asChild data-testid="trigger">
            <button type="button">Trigger</button>
          </TooltipTrigger>
          <TooltipContent className="custom-class" data-testid="content">
            <p>Content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveAttribute("data-slot", "tooltip-trigger");
    expect(trigger).toHaveAttribute("aria-describedby");

    await waitFor(() => {
      const content = screen.getByTestId("content");
      expect(content).toHaveAttribute("data-slot", "tooltip-content");
      expect(content).toHaveClass("z-50", "max-w-80", "custom-class");
    });
  });

  it("handles auto-wrapper and arrow visibility", async () => {
    const { rerender } = render(
      <TooltipProvider>
        <Tooltip open={true}>
          <TooltipTrigger asChild>
            <button type="button">Auto-wrapped</button>
          </TooltipTrigger>
          <TooltipContent data-testid="content">
            <p>With arrow</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    await waitFor(() => {
      const content = screen.getByTestId("content");
      const arrow = content.querySelector('[class*="size-2.5"]');
      expect(arrow).toBeInTheDocument();
    });

    rerender(
      <TooltipProvider>
        <Tooltip open={true}>
          <TooltipTrigger asChild>
            <button type="button">No arrow</button>
          </TooltipTrigger>
          <TooltipContent
            data-testid="content"
            hideArrow={true}
            sideOffset={20}
          >
            <p>Without arrow</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await waitFor(() => {
      const content = screen.getByTestId("content");
      const arrow = content.querySelector('[class*="size-2.5"]');
      expect(arrow).not.toBeInTheDocument();
    });
  });

  it("exports from index", () => {
    const exports = require("./index");

    expect(exports.Tooltip).toBeDefined();
    expect(exports.TooltipContent).toBeDefined();
    expect(exports.TooltipProvider).toBeDefined();
    expect(exports.TooltipTrigger).toBeDefined();
  });
});
