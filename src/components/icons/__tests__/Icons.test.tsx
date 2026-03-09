import { render, screen } from "@/tests/app-test-utils";
import * as Icons from "../";

// Extract all icon components and their names
const iconEntries = Object.entries(Icons).filter(
  ([name, component]) =>
    name.endsWith("Icon") && typeof component === "function"
);

describe("Icon Components", () => {
  // Test each icon individually
  iconEntries.forEach(([iconName, IconComponent]) => {
    describe(iconName, () => {
      it("should render correctly", () => {
        render(<IconComponent />);

        const icon = screen.getByRole("img");
        expect(icon).toBeVisible();
        expect(icon).toHaveAttribute("viewBox"); // viewBox can vary per icon
        expect(icon).toHaveClass("h-5", "w-5"); // default md size
        expect(icon).toHaveAttribute("aria-label");
      });

      it("should render with custom size", () => {
        render(<IconComponent size="lg" />);

        const icon = screen.getByRole("img");
        expect(icon).toHaveClass("h-6", "w-6");
      });

      it("should render with custom className", () => {
        render(<IconComponent className="text-blue-500" />);

        const icon = screen.getByRole("img");
        expect(icon).toHaveClass("text-blue-500");
      });

      it("should contain svg content", () => {
        render(<IconComponent />);

        const icon = screen.getByRole("img");
        // Check for common SVG elements (path, circle, rect, etc.)
        const svgContent = icon.querySelector("path, circle, rect, polygon");
        expect(svgContent).toBeInTheDocument();
      });

      it("should pass through additional props", () => {
        render(
          <IconComponent data-testid={`test-${iconName.toLowerCase()}`} />
        );

        const icon = screen.getByTestId(`test-${iconName.toLowerCase()}`);
        expect(icon).toBeVisible();
      });
    });
  });

  describe("All Size Variants", () => {
    it("should work with all size variants", () => {
      const sizes = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
      const expectedClasses = [
        "h-3 w-3",
        "h-4 w-4",
        "h-5 w-5",
        "h-6 w-6",
        "h-8 w-8",
        "h-10 w-10",
      ];

      // Test with the first available icon
      const [, FirstIcon] = iconEntries[0];

      sizes.forEach((size, index) => {
        const { unmount } = render(<FirstIcon size={size} />);
        const icon = screen.getByRole("img");
        const [height, width] = expectedClasses[index].split(" ");
        expect(icon).toHaveClass(height, width);
        unmount();
      });
    });
  });

  describe("All Icons Integration", () => {
    it("should render all icons together", () => {
      render(
        <div>
          {iconEntries.map(([iconName, IconComponent], index) => (
            <IconComponent data-testid={`icon-${index}`} key={iconName} />
          ))}
        </div>
      );

      // Verify all icons are rendered
      iconEntries.forEach((_, index) => {
        expect(screen.getByTestId(`icon-${index}`)).toBeVisible();
      });
    });

    it("should maintain consistent behavior across all icons", () => {
      iconEntries.slice(0, 3).forEach(([, IconComponent]) => {
        const { unmount } = render(
          <IconComponent className="text-red-500" size="lg" />
        );

        const icon = screen.getByRole("img");
        expect(icon).toHaveClass("h-6", "w-6", "text-red-500");

        unmount();
      });
    });
  });
});
