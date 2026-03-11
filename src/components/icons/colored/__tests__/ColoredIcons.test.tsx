import { render, screen } from "@/tests/app-test-utils";
import { DocumentUpIcon, ImageUpIcon } from "..";

describe("Colored Icons", () => {
  describe("DocumentUpIcon", () => {
    it("renders with default dimensions", () => {
      render(<DocumentUpIcon />);
      const icon = screen.getByRole("img", { name: "Document Upload Icon" });
      expect(icon).toBeVisible();
      expect(icon).toHaveAttribute("width", "50");
      expect(icon).toHaveAttribute("height", "50");
    });

    it("renders with custom dimensions", () => {
      render(<DocumentUpIcon height={80} width={80} />);
      const icon = screen.getByRole("img", { name: "Document Upload Icon" });
      expect(icon).toHaveAttribute("width", "80");
      expect(icon).toHaveAttribute("height", "80");
      expect(icon).toHaveStyle({ minWidth: "80px", minHeight: "80px" });
    });

    it("accepts custom className", () => {
      render(<DocumentUpIcon className="custom-class" />);
      const icon = screen.getByRole("img", { name: "Document Upload Icon" });
      expect(icon).toHaveClass("custom-class");
    });

    it("has correct viewBox", () => {
      render(<DocumentUpIcon />);
      const icon = screen.getByRole("img", { name: "Document Upload Icon" });
      expect(icon).toHaveAttribute("viewBox", "0 0 50 50");
    });
  });

  describe("ImageUpIcon", () => {
    it("renders with default dimensions", () => {
      render(<ImageUpIcon />);
      const icon = screen.getByRole("img", { name: "Image Upload Icon" });
      expect(icon).toBeVisible();
      expect(icon).toHaveAttribute("width", "64");
      expect(icon).toHaveAttribute("height", "46");
    });

    it("renders with custom dimensions", () => {
      render(<ImageUpIcon height={92} width={128} />);
      const icon = screen.getByRole("img", { name: "Image Upload Icon" });
      expect(icon).toHaveAttribute("width", "128");
      expect(icon).toHaveAttribute("height", "92");
      expect(icon).toHaveStyle({ minWidth: "128px", minHeight: "92px" });
    });

    it("accepts custom className", () => {
      render(<ImageUpIcon className="my-icon" />);
      const icon = screen.getByRole("img", { name: "Image Upload Icon" });
      expect(icon).toHaveClass("my-icon");
    });

    it("has correct viewBox", () => {
      render(<ImageUpIcon />);
      const icon = screen.getByRole("img", { name: "Image Upload Icon" });
      expect(icon).toHaveAttribute("viewBox", "0 0 64 46");
    });

    it("generates unique clip path id", () => {
      const { container } = render(<ImageUpIcon />);
      const clipPath = container.querySelector("clipPath");
      expect(clipPath).toBeInTheDocument();
      expect(clipPath?.id).toContain("image-up-clip-");
    });
  });

  describe("Exports", () => {
    it("exports all colored icons from barrel", () => {
      const exports = require("../index");
      expect(exports.DocumentUpIcon).toBeDefined();
      expect(exports.ImageUpIcon).toBeDefined();
    });
  });
});
