import userEvent from "@testing-library/user-event";
import React from "react";
import { render, screen } from "@/tests/app-test-utils";
import { FilterButton } from "./FilterButton";

describe("FilterButton", () => {
  it('renders with default label "Filtros"', () => {
    render(<FilterButton />);

    expect(screen.getByText("Filtros")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<FilterButton label="Custom Filter" />);

    expect(screen.getByText("Custom Filter")).toBeInTheDocument();
  });

  it("renders as a button element", () => {
    render(<FilterButton />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders icon when count is 0", () => {
    render(<FilterButton count={0} />);

    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("renders counter badge when count is greater than 0", () => {
    render(<FilterButton count={3} />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("hides icon and shows counter when count > 0", () => {
    render(<FilterButton count={5} />);

    expect(screen.getByText("5")).toBeInTheDocument();
    const button = screen.getByRole("button");
    // Counter replaces icon by default
    expect(button.querySelectorAll("svg").length).toBe(0);
  });

  it("shows both icon and counter when showIconWithCount is true", () => {
    render(<FilterButton count={2} showIconWithCount />);

    expect(screen.getByText("2")).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("renders label on the left by default", () => {
    render(<FilterButton count={1} label="Filter" />);

    const button = screen.getByRole("button");
    const children = Array.from(button.children);
    const labelIndex = children.findIndex(
      (child) => child.textContent === "Filter"
    );
    const counterIndex = children.findIndex(
      (child) => child.textContent === "1"
    );

    expect(labelIndex).toBeLessThan(counterIndex);
  });

  it('renders label on the right when labelPosition is "right"', () => {
    render(<FilterButton count={1} label="Filter" labelPosition="right" />);

    const button = screen.getByRole("button");
    const children = Array.from(button.children);
    const labelIndex = children.findIndex(
      (child) => child.textContent === "Filter"
    );
    const counterIndex = children.findIndex(
      (child) => child.textContent === "1"
    );

    expect(labelIndex).toBeGreaterThan(counterIndex);
  });

  it("applies active filter styling when count > 0", () => {
    render(<FilterButton count={1} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-purple-100");
    expect(button).toHaveClass("bg-purple-100");
  });

  it("applies default styling when count is 0", () => {
    render(<FilterButton count={0} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-gray-200");
    expect(button).toHaveClass("bg-white");
  });

  it("disables the button when disabled prop is true", () => {
    render(<FilterButton disabled />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies disabled styling", () => {
    render(<FilterButton disabled />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("cursor-not-allowed");
    expect(button).toHaveClass("opacity-50");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<FilterButton onClick={handleClick} />);

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<FilterButton disabled onClick={handleClick} />);

    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders custom icon", () => {
    render(<FilterButton icon={<span data-testid="custom-icon">Icon</span>} />);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<FilterButton className="custom-class" />);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("forwards ref to button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<FilterButton ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has type="button" attribute', () => {
    render(<FilterButton />);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("passes additional props to button", () => {
    render(
      <FilterButton aria-label="Filter options" data-testid="filter-btn" />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Filter options");
    expect(button).toHaveAttribute("data-testid", "filter-btn");
  });

  it("applies purple text to label when filters are active", () => {
    render(<FilterButton count={1} label="Filter" />);

    const label = screen.getByText("Filter");
    expect(label).toHaveClass("text-purple-900");
  });

  it("applies gray text to label when no active filters", () => {
    render(<FilterButton count={0} label="Filter" />);

    const label = screen.getByText("Filter");
    expect(label).toHaveClass("text-gray-600");
  });

  it("applies gray text to label when disabled", () => {
    render(<FilterButton disabled label="Filter" />);

    const label = screen.getByText("Filter");
    expect(label).toHaveClass("text-gray-400");
  });

  it("index.ts exports work correctly", () => {
    const indexExports = require("./index");
    expect(indexExports.FilterButton).toBeDefined();
  });
});
