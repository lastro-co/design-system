import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { Button, buttonVariants } from "./Button";

describe("Button", () => {
  it("renders with variants and sizes", () => {
    const { rerender } = render(<Button>Default Button</Button>);

    let button = screen.getByRole("button");
    expect(button).toBeVisible();
    expect(button).toHaveClass("bg-purple-800", "h-9", "px-6");

    rerender(
      <Button color="error" size="small" variant="outlined">
        Small Outlined Error
      </Button>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("border-red-800", "h-8", "p-3");

    rerender(
      <Button color="black" size="large">
        Large Black
      </Button>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-900", "h-11", "px-8");
  });

  it("handles disabled state and click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <Button onClick={handleClick}>Clickable</Button>
    );

    let button = screen.getByRole("button");
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("exports buttonVariants with correct compound variants", () => {
    expect(buttonVariants).toBeDefined();

    expect(buttonVariants({ variant: "contained", color: "purple" })).toContain(
      "bg-purple-800"
    );
    expect(buttonVariants({ variant: "outlined", color: "error" })).toContain(
      "border-red-800"
    );
    expect(buttonVariants({ size: "small" })).toContain("h-8");
  });

  it("exports from index", () => {
    const exports = require("./index");

    expect(exports.Button).toBeDefined();
    expect(exports.buttonVariants).toBeDefined();
  });

  it("shows loading spinner when loading is true", () => {
    render(<Button loading>Loading Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    // Spinner component renders with role="status"
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("animate-spin");
  });

  it("does not show loading spinner when loading is false", () => {
    render(<Button loading={false}>Normal Button</Button>);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("disables button when loading is true", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button loading onClick={handleClick}>
        Loading
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders correct spinner size based on button size", () => {
    const { rerender } = render(
      <Button loading size="small">
        Small
      </Button>
    );

    // Small button uses 'sm' spinner size (h-4 w-4)
    let spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-4", "w-4");

    rerender(
      <Button loading size="medium">
        Medium
      </Button>
    );

    // Medium button uses 'md' spinner size (h-5 w-5)
    spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-5", "w-5");

    rerender(
      <Button loading size="large">
        Large
      </Button>
    );

    // Large button uses 'lg' spinner size (h-6 w-6)
    spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-6", "w-6");
  });

  it("hides children with opacity-0 when loading", () => {
    render(<Button loading>Loading Button</Button>);

    const button = screen.getByRole("button");
    const childrenWrapper = button.querySelector("span");

    expect(childrenWrapper).toHaveClass("opacity-0");
    expect(childrenWrapper).toHaveClass(
      "inline-flex",
      "items-center",
      "justify-center",
      "gap-2"
    );
  });

  it("shows children without opacity-0 when not loading", () => {
    render(<Button>Normal Button</Button>);

    const button = screen.getByRole("button");
    const childrenWrapper = button.querySelector("span");

    expect(childrenWrapper).not.toHaveClass("opacity-0");
    expect(childrenWrapper).toHaveClass(
      "inline-flex",
      "items-center",
      "justify-center",
      "gap-2"
    );
  });
});
