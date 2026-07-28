import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { Button, buttonVariants } from "./Button";

describe("Button", () => {
  it("renders with variants and sizes", () => {
    const { rerender } = render(<Button>Default Button</Button>);

    let button = screen.getByRole("button");
    expect(button).toBeVisible();
    expect(button).toHaveClass("bg-purple-800", "h-10", "px-4");

    rerender(
      <Button color="error" size="small" variant="outlined">
        Small Outlined Error
      </Button>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("border-red-800", "h-8", "px-3");

    rerender(
      <Button color="black" size="large">
        Large Black
      </Button>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-700", "h-11", "px-6");
  });

  it("renders ghost and link variants", () => {
    const { rerender } = render(<Button variant="ghost">Ghost</Button>);

    let button = screen.getByRole("button");
    expect(button).toHaveClass("text-purple-800", "hover:bg-purple-50");

    rerender(<Button variant="link">Link</Button>);

    button = screen.getByRole("button");
    expect(button).toHaveClass("text-purple-800", "hover:underline");
    expect(button).toHaveClass("h-auto");
  });

  it("applies a distinct disabled style per variant", () => {
    const { rerender } = render(<Button variant="contained">Contained</Button>);

    let button = screen.getByRole("button");
    expect(button).toHaveClass("disabled:bg-gray-300", "disabled:opacity-45");

    rerender(<Button variant="outlined">Outlined</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("disabled:border-gray-300", "disabled:bg-white");

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole("button");
    expect(button).not.toHaveClass("disabled:bg-gray-300");

    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("disabled:text-gray-600");
    expect(button).not.toHaveClass("disabled:bg-gray-300");
  });

  it("applies active and focus-visible classes", () => {
    render(<Button>Focusable</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("active:bg-purple-950");
    expect(button).toHaveClass(
      "focus-visible:ring-2",
      "focus-visible:ring-purple-400",
      "focus-visible:ring-offset-2"
    );
  });

  it("forwards ref to the underlying button element", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders as a child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/somewhere">Link Button</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveClass("bg-purple-800");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
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
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    // Spinner component renders with role="status"
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("animate-spin");
  });

  it("does not show loading spinner when loading is false", () => {
    render(<Button loading={false}>Normal Button</Button>);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveAttribute("aria-busy");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("blocks clicks when loading is true, without applying disabled styles", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button loading onClick={handleClick}>
        Loading
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("pointer-events-none", "bg-purple-800");
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("uses real disabled attribute (and its styles) when disabled is explicitly set", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("renders the spinner at a fixed size regardless of button size", () => {
    const { rerender } = render(
      <Button loading size="small">
        Small
      </Button>
    );

    let spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("size-4");

    rerender(
      <Button loading size="large">
        Large
      </Button>
    );

    spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("size-4");
  });

  it("renders spinner and label together when loading", () => {
    render(<Button loading>Loading Button</Button>);

    const button = screen.getByRole("button");
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(button).toHaveTextContent("Loading Button");
  });
});
