import { render, screen } from "@/tests/app-test-utils";
import { Label, labelVariants } from ".";

describe("Label", () => {
  it("renders with text content", () => {
    render(<Label>Label text</Label>);
    expect(screen.getByText("Label text")).toBeVisible();
  });

  it("renders as a label element", () => {
    render(<Label>My label</Label>);
    expect(screen.getByText("My label").tagName).toBe("LABEL");
  });

  it("applies data-slot attribute", () => {
    render(<Label>Slotted</Label>);
    expect(screen.getByText("Slotted")).toHaveAttribute("data-slot", "label");
  });

  it("applies htmlFor to associate with an input", () => {
    render(
      <>
        <Label htmlFor="my-input">Name</Label>
        <input id="my-input" />
      </>
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("applies default input variant styles", () => {
    render(<Label>Input label</Label>);
    const label = screen.getByText("Input label");
    expect(label).toHaveClass("text-gray-800", "text-sm");
  });

  it("applies section variant styles", () => {
    render(<Label variant="section">Section label</Label>);
    const label = screen.getByText("Section label");
    expect(label).toHaveClass("text-base", "text-black");
  });

  it("applies custom className alongside variant styles", () => {
    render(<Label className="extra-class">Styled label</Label>);
    expect(screen.getByText("Styled label")).toHaveClass("extra-class");
  });

  it("forwards additional props to the label element", () => {
    render(<Label data-testid="test-label">Props label</Label>);
    expect(screen.getByTestId("test-label")).toBeInTheDocument();
  });

  it("exports labelVariants from index", () => {
    expect(labelVariants).toBeDefined();
    expect(typeof labelVariants).toBe("function");
  });

  it("labelVariants generates correct class for input variant", () => {
    const classes = labelVariants({ variant: "input" });
    expect(classes).toContain("text-sm");
    expect(classes).toContain("text-gray-800");
  });

  it("labelVariants generates correct class for section variant", () => {
    const classes = labelVariants({ variant: "section" });
    expect(classes).toContain("text-base");
    expect(classes).toContain("text-black");
  });

  it("exports from index", () => {
    const exports = require("./index");
    expect(exports.Label).toBeDefined();
    expect(exports.labelVariants).toBeDefined();
  });
});
