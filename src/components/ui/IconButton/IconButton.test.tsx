import userEvent from "@testing-library/user-event";
import { XIcon } from "@/components/icons.v2";
import { render, screen } from "@/tests/app-test-utils";
import { IconButton, iconButtonVariants } from "./IconButton";

const TEXT_COLOR_CLASS = /\btext-/;

describe("IconButton", () => {
  it("defaults the child icon to 16px, but lets an explicit size class win", () => {
    render(
      <IconButton aria-label="Close">
        <XIcon />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("[&_svg:not([class*='size-'])]:size-4");

    const { container } = render(
      <IconButton aria-label="Close">
        <XIcon className="size-6" />
      </IconButton>
    );

    expect(container.querySelector("svg")).toHaveClass("size-6");
  });

  it("renders with all variants and sizes", () => {
    const { rerender } = render(
      <IconButton
        aria-label="Close"
        shape="circular"
        size="small"
        variant="outline"
      >
        <XIcon />
      </IconButton>
    );

    let button = screen.getByRole("button");
    expect(button).toBeVisible();
    expect(button).toHaveClass(
      "size-8",
      "rounded-full",
      "border",
      "border-gray-300"
    );

    rerender(
      <IconButton aria-label="Close" size="large" variant="default">
        <XIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("size-12", "border-0", "bg-purple-800");

    rerender(
      <IconButton aria-label="Close" shape="square" size="medium">
        <XIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("size-10", "rounded-[10px]", "border");
  });

  it("scales the square radius with size", () => {
    const { rerender } = render(
      <IconButton aria-label="Close" shape="square" size="small">
        <XIcon />
      </IconButton>
    );

    let button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-lg");

    rerender(
      <IconButton aria-label="Close" shape="square" size="medium">
        <XIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-[10px]");

    rerender(
      <IconButton aria-label="Close" shape="square" size="large">
        <XIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-xl");
  });

  it("renders the destructive variant", () => {
    render(
      <IconButton aria-label="Delete" variant="destructive">
        <XIcon />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-white",
      "text-red-600",
      "hover:bg-red-50",
      "hover:text-red-700"
    );
  });

  it("renders the ghost variant", () => {
    render(
      <IconButton aria-label="Close" variant="ghost">
        <XIcon />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-transparent",
      "text-gray-600",
      "hover:bg-gray-50",
      "hover:text-gray-800"
    );
  });

  it("keeps the pressed look on the ghost variant while active", () => {
    const { rerender } = render(
      <IconButton aria-label="Notificações" variant="ghost">
        <XIcon />
      </IconButton>
    );
    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("data-active");
    expect(button).toHaveClass(
      "data-[active=true]:bg-gray-50",
      "data-[active=true]:text-gray-800"
    );

    rerender(
      <IconButton active aria-label="Notificações" variant="ghost">
        <XIcon />
      </IconButton>
    );
    expect(button).toHaveAttribute("data-active", "true");
  });

  it("forwards active to the child element when asChild is true", () => {
    render(
      <IconButton active aria-label="Notificações" asChild variant="ghost">
        <a href="/notifications">
          <XIcon />
        </a>
      </IconButton>
    );

    expect(screen.getByRole("link")).toHaveAttribute("data-active", "true");
  });

  it("renders the selected variant with the ToggleChip selected tokens", () => {
    render(
      <IconButton aria-label="Filters" variant="selected">
        <XIcon />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "border",
      "border-purple-600",
      "bg-purple-50",
      "text-purple-800",
      "hover:bg-purple-100",
      "active:bg-purple-100",
      "disabled:border-purple-600",
      "disabled:bg-purple-50"
    );
  });

  it("paints the child icon purple-800 in the selected variant via currentColor", () => {
    const { container } = render(
      <IconButton aria-label="Filters" variant="selected">
        <XIcon />
      </IconButton>
    );

    const icon = container.querySelector("svg");
    // lucide icons draw with the stroke, so the color is inherited there.
    expect(icon).toHaveAttribute("stroke", "currentColor");
    expect(icon?.getAttribute("class") ?? "").not.toMatch(TEXT_COLOR_CLASS);
    expect(screen.getByRole("button")).toHaveClass("text-purple-800");
  });

  it("keeps the other variants free of the selected tokens", () => {
    for (const variant of [
      "default",
      "outline",
      "ghost",
      "destructive",
    ] as const) {
      const classes = iconButtonVariants({ variant });
      expect(classes).not.toContain("bg-purple-50");
      expect(classes).not.toContain("border-purple-600");
    }
  });

  it("applies active and focus-visible classes", () => {
    render(
      <IconButton aria-label="Close" variant="default">
        <XIcon />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("active:bg-purple-950");
    expect(button).toHaveClass(
      "focus-visible:ring-2",
      "focus-visible:ring-purple-400",
      "focus-visible:ring-offset-2"
    );
  });

  it("applies a distinct disabled style per variant", () => {
    const { rerender } = render(
      <IconButton aria-label="Close" disabled variant="default">
        <XIcon />
      </IconButton>
    );

    let button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:bg-gray-300", "disabled:opacity-45");

    rerender(
      <IconButton aria-label="Close" disabled variant="outline">
        <XIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("disabled:border-gray-300", "disabled:bg-white");

    rerender(
      <IconButton aria-label="Close" disabled variant="ghost">
        <XIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).not.toHaveClass("disabled:bg-gray-300");
  });

  it("shows a fixed-size spinner and blocks clicks when loading, without disabled styles", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <IconButton aria-label="Loading" loading onClick={handleClick}>
        <XIcon />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveClass("pointer-events-none");

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("size-4", "animate-spin");

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("uses the real disabled attribute when disabled is explicitly set", () => {
    render(
      <IconButton aria-label="Close" disabled>
        <XIcon />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(
      <IconButton aria-label="Close" ref={ref}>
        <XIcon />
      </IconButton>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders as a child element when asChild is true", () => {
    render(
      <IconButton aria-label="Close" asChild>
        <a href="/somewhere">
          <XIcon />
        </a>
      </IconButton>
    );

    const link = screen.getByRole("link", { name: "Close" });
    expect(link.tagName).toBe("A");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("forwards onClick to the child element when asChild is true", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <IconButton aria-label="Close" asChild onClick={handleClick}>
        <a href="/somewhere">
          <XIcon />
        </a>
      </IconButton>
    );

    await user.click(screen.getByRole("link", { name: "Close" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("marks the child element as aria-disabled when asChild and disabled are set together", () => {
    render(
      <IconButton aria-label="Close" asChild disabled>
        <a href="/somewhere">
          <XIcon />
        </a>
      </IconButton>
    );

    const link = screen.getByRole("link", { name: "Close" });
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("iconButtonVariants generates correct classes", () => {
    expect(iconButtonVariants).toBeDefined();
    expect(typeof iconButtonVariants).toBe("function");

    // Test default variant
    expect(iconButtonVariants()).toContain("size-10");
    expect(iconButtonVariants()).toContain("rounded-[10px]");
    expect(iconButtonVariants()).toContain("border");

    // Test size variants
    expect(iconButtonVariants({ size: "small" })).toContain("size-8");
    expect(iconButtonVariants({ size: "medium" })).toContain("size-10");
    expect(iconButtonVariants({ size: "large" })).toContain("size-12");

    // Test shape variants
    expect(iconButtonVariants({ shape: "circular" })).toContain("rounded-full");
    expect(iconButtonVariants({ shape: "square", size: "large" })).toContain(
      "rounded-xl"
    );

    // Test variant classes
    expect(iconButtonVariants({ variant: "default" })).toContain("border-0");
    expect(iconButtonVariants({ variant: "outline" })).toContain("border");
    expect(iconButtonVariants({ variant: "default" })).toContain(
      "bg-purple-800"
    );
    expect(iconButtonVariants({ variant: "outline" })).toContain(
      "border-gray-300"
    );
    expect(iconButtonVariants({ variant: "ghost" })).toContain(
      "bg-transparent"
    );
    expect(iconButtonVariants({ variant: "destructive" })).toContain(
      "text-red-600"
    );
    expect(iconButtonVariants({ variant: "selected" })).toContain(
      "bg-purple-50"
    );
  });

  it("index.ts exports work correctly", () => {
    // Test imports from index file
    const indexExports = require("./index");
    expect(indexExports.IconButton).toBeDefined();
    expect(indexExports.iconButtonVariants).toBeDefined();
    expect(typeof indexExports.IconButton).toBe("object"); // forwardRef returns an object
    expect(typeof indexExports.iconButtonVariants).toBe("function");
  });
});
