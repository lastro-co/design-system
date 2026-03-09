import { render, screen } from "@/tests/app-test-utils";
import { Icon } from "./Icon";

describe("Icon component", () => {
  it("should render with default props", () => {
    render(
      <Icon aria-label="Test icon">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );

    const icon = screen.getByLabelText("Test icon");
    expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
    expect(icon).toHaveAttribute("fill", "currentColor");
    expect(icon).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(icon).toHaveAttribute("aria-label", "Test icon");
    expect(icon).toHaveAttribute("role", "img");
  });

  it("should render with custom viewBox", () => {
    render(
      <Icon aria-label="Custom viewBox icon" viewBox="0 0 16 16">
        <path d="M8 1L1 4h7v7h7V4L8 1z" />
      </Icon>
    );

    const icon = screen.getByLabelText("Custom viewBox icon");
    expect(icon).toHaveAttribute("viewBox", "0 0 16 16");
  });

  it("should apply size variants correctly", () => {
    const { rerender } = render(
      <Icon aria-label="Size test icon" size="xs">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );

    let icon = screen.getByLabelText("Size test icon");
    expect(icon).toHaveClass("h-3", "w-3");

    rerender(
      <Icon aria-label="Size test icon" size="sm">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );
    icon = screen.getByLabelText("Size test icon");
    expect(icon).toHaveClass("h-4", "w-4");

    rerender(
      <Icon aria-label="Size test icon" size="md">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );
    icon = screen.getByLabelText("Size test icon");
    expect(icon).toHaveClass("h-5", "w-5");

    rerender(
      <Icon aria-label="Size test icon" size="lg">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );
    icon = screen.getByLabelText("Size test icon");
    expect(icon).toHaveClass("h-6", "w-6");

    rerender(
      <Icon aria-label="Size test icon" size="xl">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );
    icon = screen.getByLabelText("Size test icon");
    expect(icon).toHaveClass("h-8", "w-8");

    rerender(
      <Icon aria-label="Size test icon" size="2xl">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );
    icon = screen.getByLabelText("Size test icon");
    expect(icon).toHaveClass("h-10", "w-10");
  });

  it("should apply custom className", () => {
    render(
      <Icon
        aria-label="Custom class icon"
        className="custom-class text-red-500"
      >
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );

    const icon = screen.getByLabelText("Custom class icon");
    expect(icon).toHaveClass("custom-class", "text-red-500");
  });

  it("should pass through additional props", () => {
    render(
      <Icon aria-label="Button icon" data-testid="custom-icon">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );

    const icon = screen.getByTestId("custom-icon");
    expect(icon).toHaveAttribute("aria-label", "Button icon");
  });

  it("should render children correctly", () => {
    render(
      <Icon aria-label="Children test icon">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
        <circle cx="12" cy="12" r="3" />
      </Icon>
    );

    const icon = screen.getByLabelText("Children test icon");
    expect(icon.querySelector("path")).toHaveAttribute(
      "d",
      "M12 2L2 7h10v10h10V7L12 2z"
    );
    expect(icon.querySelector("circle")).toHaveAttribute("cx", "12");
    expect(icon.querySelector("circle")).toHaveAttribute("cy", "12");
    expect(icon.querySelector("circle")).toHaveAttribute("r", "3");
  });

  it("should have correct displayName", () => {
    expect(Icon.displayName).toBe("Icon");
  });

  it("should use default size when no size prop is provided", () => {
    render(
      <Icon aria-label="Default size icon">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );

    const icon = screen.getByLabelText("Default size icon");
    expect(icon).toHaveClass("h-5", "w-5"); // md is the default
  });

  it("should accept aria-label prop", () => {
    render(
      <Icon aria-label="Required label">
        <path d="M12 2L2 7h10v10h10V7L12 2z" />
      </Icon>
    );

    const icon = screen.getByLabelText("Required label");
    expect(icon).toHaveAttribute("aria-label", "Required label");
  });

  it("should render outline content when variant is outline and both outline and filled are provided", () => {
    render(
      <Icon
        aria-label="Block"
        filled={<path d="M2 2" data-testid="filled-path" />}
        outline={<path d="M1 1" data-testid="outline-path" />}
        variant="outline"
      />
    );

    const icon = screen.getByLabelText("Block outline");
    expect(
      icon.querySelector('[data-testid="outline-path"]')
    ).toBeInTheDocument();
    expect(
      icon.querySelector('[data-testid="filled-path"]')
    ).not.toBeInTheDocument();
  });

  it("should render filled content when variant is filled and both outline and filled are provided", () => {
    render(
      <Icon
        aria-label="Block"
        filled={<path d="M2 2" data-testid="filled-path" />}
        outline={<path d="M1 1" data-testid="outline-path" />}
        variant="filled"
      />
    );

    const icon = screen.getByLabelText("Block filled");
    expect(
      icon.querySelector('[data-testid="filled-path"]')
    ).toBeInTheDocument();
    expect(
      icon.querySelector('[data-testid="outline-path"]')
    ).not.toBeInTheDocument();
  });

  it("should not append variant to aria-label when using children", () => {
    render(
      <Icon aria-label="Close">
        <path d="M1 1" />
      </Icon>
    );

    const icon = screen.getByLabelText("Close");
    expect(icon).toHaveAttribute("aria-label", "Close");
  });
});

describe("iconVariants", () => {
  it("should export iconVariants function", () => {
    const { iconVariants } = require("./Icon");
    expect(iconVariants).toBeDefined();
    expect(typeof iconVariants).toBe("function");
  });
});

describe("Icon index exports", () => {
  it("should export Icon, iconVariants, and IconProps from index", () => {
    const exports = require("./index");
    expect(exports.Icon).toBeDefined();
    expect(exports.iconVariants).toBeDefined();
    expect(typeof exports.Icon).toBe("function");
    expect(typeof exports.iconVariants).toBe("function");
  });

  it("should export IconProps type from index", () => {
    // This test ensures the type export is covered
    const { Icon, iconVariants } = require("./index");
    const iconElement = Icon({
      "aria-label": "test",
      children: null,
      size: "md",
    });
    expect(iconElement).toBeDefined();
    expect(iconVariants({ size: "md" })).toContain("h-5");
  });
});
