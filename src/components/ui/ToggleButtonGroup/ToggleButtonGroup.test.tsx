import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { ToggleButtonGroup } from "./ToggleButtonGroup";

const defaultOptions = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

describe("ToggleButtonGroup", () => {
  it("renders all options", () => {
    render(
      <ToggleButtonGroup
        onValueChange={jest.fn()}
        options={defaultOptions}
        value="month"
      />
    );

    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Day")).toBeInTheDocument();
  });

  it("highlights selected option", () => {
    render(
      <ToggleButtonGroup
        onValueChange={jest.fn()}
        options={defaultOptions}
        value="week"
      />
    );

    const weekButton = screen.getByText("Week").closest("button");
    const monthButton = screen.getByText("Month").closest("button");

    // Selected button should have contained variant (no border class, but has bg)
    expect(weekButton).toHaveClass("bg-purple-800");
    // Unselected button should have outlined variant
    expect(monthButton).toHaveClass("border-purple-800");
  });

  it("calls onValueChange when option is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <ToggleButtonGroup
        onValueChange={handleChange}
        options={defaultOptions}
        value="month"
      />
    );

    await user.click(screen.getByText("Week"));
    expect(handleChange).toHaveBeenCalledWith("week");
  });

  it("renders with no initial selection", () => {
    render(
      <ToggleButtonGroup
        onValueChange={jest.fn()}
        options={defaultOptions}
        value={undefined}
      />
    );

    // All buttons should be outlined (not contained)
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("border-purple-800");
    });
  });

  it("applies custom className to container", () => {
    const { container } = render(
      <ToggleButtonGroup
        className="custom-class"
        onValueChange={jest.fn()}
        options={defaultOptions}
        value="month"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders buttons with correct type attribute", () => {
    render(
      <ToggleButtonGroup
        onValueChange={jest.fn()}
        options={defaultOptions}
        value="month"
      />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveAttribute("type", "button");
    });
  });

  it("handles two options correctly", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const twoOptions = [
      { value: "buy", label: "Buy" },
      { value: "rent", label: "Rent" },
    ];

    render(
      <ToggleButtonGroup
        onValueChange={handleChange}
        options={twoOptions}
        value="buy"
      />
    );

    expect(screen.getByText("Buy")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();

    await user.click(screen.getByText("Rent"));
    expect(handleChange).toHaveBeenCalledWith("rent");
  });

  it("maintains selection when clicking already selected option", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <ToggleButtonGroup
        onValueChange={handleChange}
        options={defaultOptions}
        value="month"
      />
    );

    await user.click(screen.getByText("Month"));
    expect(handleChange).toHaveBeenCalledWith("month");
  });

  it("index.ts exports work correctly", () => {
    const indexExports = require("./index");
    expect(indexExports.ToggleButtonGroup).toBeDefined();
  });
});
