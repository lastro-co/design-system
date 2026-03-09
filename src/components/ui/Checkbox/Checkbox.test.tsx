import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders without crashing", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeVisible();
  });

  it("renders as unchecked by default", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders as checked when checked prop is true", () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Checkbox onClick={handleClick} />);
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles change events", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("does not trigger events when disabled", async () => {
    const handleClick = jest.fn();
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Checkbox disabled onCheckedChange={handleChange} onClick={handleClick} />
    );
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    expect(handleClick).not.toHaveBeenCalled();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const customClass = "custom-test-class";
    render(<Checkbox className={customClass} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass(customClass);
  });

  it("has correct data-slot attribute", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
  });

  it("renders CheckIcon when checked", () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole("checkbox");
    const checkIcon = checkbox.querySelector("svg");
    expect(checkIcon).toBeVisible();
  });

  it("supports aria-invalid attribute", () => {
    render(<Checkbox aria-invalid />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-invalid");
  });

  it("exports from index", () => {
    const exports = require("./index");
    expect(exports.Checkbox).toBeDefined();
  });
});
