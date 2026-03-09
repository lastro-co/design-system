import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders without crashing", () => {
    render(<Switch />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeVisible();
  });

  it("renders as unchecked by default", () => {
    render(<Switch />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
  });

  it("renders as checked when defaultChecked is true", () => {
    render(<Switch defaultChecked />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-state", "checked");
  });

  it("renders as checked when checked prop is true", () => {
    render(<Switch checked onCheckedChange={jest.fn()} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-state", "checked");
  });

  it("toggles state on click", async () => {
    const user = userEvent.setup();
    render(<Switch />);
    const switchEl = screen.getByRole("switch");

    expect(switchEl).toHaveAttribute("data-state", "unchecked");
    await user.click(switchEl);
    expect(switchEl).toHaveAttribute("data-state", "checked");
    await user.click(switchEl);
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
  });

  it("calls onCheckedChange when toggled", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Switch onCheckedChange={handleChange} />);
    const switchEl = screen.getByRole("switch");

    await user.click(switchEl);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Switch disabled />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeDisabled();
  });

  it("does not trigger onCheckedChange when disabled", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Switch disabled onCheckedChange={handleChange} />);
    const switchEl = screen.getByRole("switch");

    await user.click(switchEl);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<Switch className="custom-test-class" />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveClass("custom-test-class");
  });

  it("has correct data-slot attribute", () => {
    render(<Switch />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("data-slot", "switch");
  });

  it("applies size classes for xs", () => {
    render(<Switch size="xs" />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveClass("h-3.5", "w-6");
  });

  it("applies size classes for md (default)", () => {
    render(<Switch />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveClass("h-[22px]", "w-10");
  });

  it("applies size classes for 2xl", () => {
    render(<Switch size="2xl" />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveClass("h-[34px]", "w-16");
  });

  it("uses bg-current for checked state via data-state class", () => {
    render(<Switch />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveClass("data-[state=checked]:bg-current");
  });

  it("renders thumb with correct data-slot", () => {
    const { container } = render(<Switch />);
    const thumb = container.querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toBeInTheDocument();
  });

  it("exports from index", () => {
    const exports = require("./index");
    expect(exports.Switch).toBeDefined();
    expect(exports.switchVariants).toBeDefined();
  });
});
