import { render, screen, userEvent } from "@/tests/app-test-utils";
import { Input } from ".";

describe("Input", () => {
  it("renders input element", () => {
    render(<Input placeholder="Test input" />);
    expect(screen.getByPlaceholderText("Test input")).toBeVisible();
  });

  it("renders with icon", () => {
    const icon = <span data-testid="test-icon">icon</span>;
    render(<Input icon={icon} placeholder="Search" />);
    expect(screen.getByTestId("test-icon")).toBeVisible();
    expect(screen.getByPlaceholderText("Search")).toBeVisible();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled placeholder="Disabled input" />);
    expect(screen.getByPlaceholderText("Disabled input")).toBeDisabled();
  });

  it("applies custom className without icon", () => {
    render(<Input className="custom-class" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveClass("custom-class");
  });

  it("applies custom className to wrapper div when icon is present", () => {
    const icon = <span>i</span>;
    render(
      <Input
        className="wrapper-class"
        data-testid="input-field"
        icon={icon}
        placeholder="With icon"
      />
    );
    // className on icon variant goes to the outer div
    const wrapper = screen.getByPlaceholderText("With icon").closest("div");
    expect(wrapper).toHaveClass("wrapper-class");
  });

  it("handles error state with aria-invalid", () => {
    render(<Input aria-invalid placeholder="Error input" />);
    expect(screen.getByPlaceholderText("Error input")).toHaveAttribute(
      "aria-invalid"
    );
  });

  it("renders disabled input with icon", () => {
    const icon = <span data-testid="disabled-icon">icon</span>;
    render(<Input disabled icon={icon} placeholder="Disabled with icon" />);
    expect(screen.getByTestId("disabled-icon")).toBeVisible();
    expect(screen.getByPlaceholderText("Disabled with icon")).toBeDisabled();
  });

  it("handles error state with icon", () => {
    const icon = <span data-testid="error-icon">icon</span>;
    render(<Input aria-invalid icon={icon} placeholder="Error with icon" />);
    expect(screen.getByTestId("error-icon")).toBeVisible();
    expect(screen.getByPlaceholderText("Error with icon")).toHaveAttribute(
      "aria-invalid"
    );
  });

  it("renders different input types", () => {
    const { rerender } = render(
      <Input placeholder="Email input" type="email" />
    );
    expect(screen.getByPlaceholderText("Email input")).toHaveAttribute(
      "type",
      "email"
    );

    rerender(<Input placeholder="Password input" type="password" />);
    expect(screen.getByPlaceholderText("Password input")).toHaveAttribute(
      "type",
      "password"
    );
  });

  describe("clear button (search type)", () => {
    it("renders clear button for search type with value and onClear handler", () => {
      render(
        <Input
          onChange={jest.fn()}
          onClear={jest.fn()}
          placeholder="Search"
          type="search"
          value="some query"
        />
      );
      expect(
        screen.getByRole("button", { name: "Clear search" })
      ).toBeInTheDocument();
    });

    it("calls onClear when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onClear = jest.fn();
      render(
        <Input
          onChange={jest.fn()}
          onClear={onClear}
          placeholder="Search"
          type="search"
          value="query"
        />
      );
      await user.click(screen.getByRole("button", { name: "Clear search" }));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("does not render clear button when value is empty", () => {
      render(
        <Input
          onChange={jest.fn()}
          onClear={jest.fn()}
          placeholder="Search"
          type="search"
          value=""
        />
      );
      expect(
        screen.queryByRole("button", { name: "Clear search" })
      ).not.toBeInTheDocument();
    });

    it("does not render clear button when onClear is not provided", () => {
      render(
        <Input
          onChange={jest.fn()}
          placeholder="Search"
          type="search"
          value="query"
        />
      );
      expect(
        screen.queryByRole("button", { name: "Clear search" })
      ).not.toBeInTheDocument();
    });

    it("does not render clear button when input is disabled", () => {
      render(
        <Input
          disabled
          onChange={jest.fn()}
          onClear={jest.fn()}
          placeholder="Search"
          type="search"
          value="query"
        />
      );
      expect(
        screen.queryByRole("button", { name: "Clear search" })
      ).not.toBeInTheDocument();
    });

    it("renders clear button alongside icon for search type", () => {
      const icon = <span data-testid="search-icon">icon</span>;
      render(
        <Input
          icon={icon}
          onChange={jest.fn()}
          onClear={jest.fn()}
          placeholder="Search"
          type="search"
          value="term"
        />
      );
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Clear search" })
      ).toBeInTheDocument();
    });
  });

  it("has data-slot attribute on the input element", () => {
    render(<Input data-testid="slotted" />);
    expect(screen.getByTestId("slotted")).toHaveAttribute("data-slot", "input");
  });

  it("has data-slot attribute on the input element when icon is provided", () => {
    const icon = <span>i</span>;
    render(<Input icon={icon} placeholder="with icon" />);
    expect(screen.getByPlaceholderText("with icon")).toHaveAttribute(
      "data-slot",
      "input"
    );
  });

  it("exports from index", () => {
    const exports = require("./index");
    expect(exports.Input).toBeDefined();
  });
});
