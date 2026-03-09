import { CloseIcon } from "@/components/icons";
import { render, screen } from "@/tests/app-test-utils";
import { IconButton, iconButtonVariants } from "./IconButton";

describe("IconButton", () => {
  it("renders with all variants and features", () => {
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
      "border-purple-800"
    );

    rerender(
      <IconButton
        aria-label="Close"
        color="default"
        size="large"
        variant="contained"
      >
        <CloseIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("size-11", "border-0", "bg-gray-300");

    rerender(
      <IconButton aria-label="Close" shape="square" size="medium">
        <CloseIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("size-9", "rounded-md", "border");
  });

  it("handles loading and disabled states", () => {
    const { rerender } = render(
      <IconButton aria-label="Loading" loading size="small">
        <CloseIcon />
      </IconButton>
    );

    let button = screen.getByRole("button");
    expect(button).toBeDisabled();

    const spinner = button.querySelector(".animate-spin");
    expect(spinner).toBeVisible();
    expect(spinner).toHaveStyle({ width: "16px", height: "16px" });

    rerender(
      <IconButton aria-label="Close" className="custom-class" disabled>
        <CloseIcon />
      </IconButton>
    );

    button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "custom-class",
      "disabled:bg-gray-100",
      "disabled:text-gray-600"
    );
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

  it("iconButtonVariants generates correct classes", () => {
    expect(iconButtonVariants).toBeDefined();
    expect(typeof iconButtonVariants).toBe("function");

    // Test default variant
    expect(iconButtonVariants()).toContain("size-9");
    expect(iconButtonVariants()).toContain("rounded-md");
    expect(iconButtonVariants()).toContain("border");

    // Test size variants
    expect(iconButtonVariants({ size: "small" })).toContain("size-8");
    expect(iconButtonVariants({ size: "medium" })).toContain("size-9");
    expect(iconButtonVariants({ size: "large" })).toContain("size-11");

    // Test shape variants
    expect(iconButtonVariants({ shape: "circular" })).toContain("rounded-full");
    expect(iconButtonVariants({ shape: "square" })).toContain("rounded-md");

    // Test variant combinations
    expect(iconButtonVariants({ variant: "contained" })).toContain("border-0");
    expect(iconButtonVariants({ variant: "outlined" })).toContain("border");

    // Test compound variants
    expect(
      iconButtonVariants({ variant: "contained", color: "default" })
    ).toContain("bg-gray-300");
    expect(
      iconButtonVariants({ variant: "outlined", color: "purple" })
    ).toContain("border-purple-800");
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
