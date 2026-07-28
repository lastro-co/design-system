import userEvent from "@testing-library/user-event";
import { CloseIcon } from "@/components/icons";
import { render, screen } from "@/tests/app-test-utils";
import { IconButton, iconButtonVariants } from "./IconButton";

describe("IconButton", () => {
  it("forces the child icon to a fixed 16px size regardless of button size", () => {
    render(
      <IconButton aria-label="Close">
        <CloseIcon size="lg" />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("[&_svg]:!size-4");
  });

  it("renders with all variants and sizes", () => {
    const { rerender } = render(
      <IconButton
        aria-label="Close"
        color="purple"
        shape="circular"
        size="small"
        variant="outlined"
      >
        <CloseIcon />
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
      <IconButton
        aria-label="Close"
        color="black"
        size="large"
        variant="contained"
      >
        <CloseIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("size-12", "border-0", "bg-gray-700");

    rerender(
      <IconButton aria-label="Close" shape="square" size="medium">
        <CloseIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("size-10", "rounded-[10px]", "border");
  });

  it("scales the square radius with size", () => {
    const { rerender } = render(
      <IconButton aria-label="Close" shape="square" size="small">
        <CloseIcon />
      </IconButton>
    );

    let button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-lg");

    rerender(
      <IconButton aria-label="Close" shape="square" size="medium">
        <CloseIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-[10px]");

    rerender(
      <IconButton aria-label="Close" shape="square" size="large">
        <CloseIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-xl");
  });

  it("renders the error color for outlined and ghost variants", () => {
    const { rerender } = render(
      <IconButton aria-label="Delete" color="error" variant="outlined">
        <CloseIcon />
      </IconButton>
    );

    let button = screen.getByRole("button");
    expect(button).toHaveClass("text-red-600", "hover:bg-red-50");

    rerender(
      <IconButton aria-label="Delete" color="error" variant="ghost">
        <CloseIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("text-red-600", "hover:bg-red-50");
  });

  it("applies active and focus-visible classes", () => {
    render(
      <IconButton aria-label="Close" color="purple" variant="contained">
        <CloseIcon />
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
      <IconButton aria-label="Close" disabled variant="contained">
        <CloseIcon />
      </IconButton>
    );

    let button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:bg-gray-300", "disabled:opacity-45");

    rerender(
      <IconButton aria-label="Close" disabled variant="outlined">
        <CloseIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("disabled:border-gray-300", "disabled:bg-white");

    rerender(
      <IconButton aria-label="Close" disabled variant="ghost">
        <CloseIcon />
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
        <CloseIcon />
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
        <CloseIcon />
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
        <CloseIcon />
      </IconButton>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders as a child element when asChild is true", () => {
    render(
      <IconButton aria-label="Close" asChild>
        <a href="/somewhere">
          <CloseIcon />
        </a>
      </IconButton>
    );

    const link = screen.getByRole("link", { name: "Close" });
    expect(link.tagName).toBe("A");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
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

    // Test variant combinations
    expect(iconButtonVariants({ variant: "contained" })).toContain("border-0");
    expect(iconButtonVariants({ variant: "outlined" })).toContain("border");

    // Test compound variants
    expect(
      iconButtonVariants({ variant: "contained", color: "black" })
    ).toContain("bg-gray-700");
    expect(
      iconButtonVariants({ variant: "outlined", color: "purple" })
    ).toContain("border-gray-300");
    expect(
      iconButtonVariants({ variant: "contained", color: "purple" })
    ).toContain("bg-purple-800");
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
