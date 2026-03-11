import { render, screen, userEvent } from "@/tests/app-test-utils";
import { RadioGroup, RadioGroupItem } from ".";

describe("RadioGroup", () => {
  it("should render without crashing", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );
  });

  it("should render multiple items", () => {
    render(
      <RadioGroup>
        <RadioGroupItem aria-label="Option 1" value="option1" />
        <RadioGroupItem aria-label="Option 2" value="option2" />
      </RadioGroup>
    );

    const items = screen.getAllByRole("radio");
    expect(items).toHaveLength(2);
  });

  it("should accept custom className on group", () => {
    const { container } = render(
      <RadioGroup className="custom-class">
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );

    const radioGroup = container.querySelector('[data-slot="radio-group"]');
    expect(radioGroup).toHaveClass("custom-class");
  });

  it("should handle checked state via defaultValue", () => {
    render(
      <RadioGroup defaultValue="option1">
        <RadioGroupItem aria-label="Option 1" value="option1" />
        <RadioGroupItem aria-label="Option 2" value="option2" />
      </RadioGroup>
    );

    const firstItem = screen.getByLabelText("Option 1");
    expect(firstItem).toBeChecked();
  });

  it("should handle disabled state on individual item", () => {
    render(
      <RadioGroup>
        <RadioGroupItem aria-label="Option 1" disabled value="option1" />
      </RadioGroup>
    );

    const item = screen.getByLabelText("Option 1");
    expect(item).toBeDisabled();
  });

  it("should handle aria-invalid state on item", () => {
    render(
      <RadioGroup>
        <RadioGroupItem aria-invalid aria-label="Option 1" value="option1" />
      </RadioGroup>
    );

    const item = screen.getByLabelText("Option 1");
    expect(item).toHaveAttribute("aria-invalid");
  });

  it("should apply data-slot to group", () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );

    expect(
      container.querySelector('[data-slot="radio-group"]')
    ).toBeInTheDocument();
  });

  it("should apply data-slot to item", () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );

    expect(
      container.querySelector('[data-slot="radio-group-item"]')
    ).toBeInTheDocument();
  });

  it("should apply data-slot to indicator", () => {
    render(
      <RadioGroup defaultValue="option1">
        <RadioGroupItem aria-label="Option 1" value="option1" />
      </RadioGroup>
    );

    const indicator = document.querySelector(
      '[data-slot="radio-group-indicator"]'
    );
    expect(indicator).toBeInTheDocument();
  });

  it("should call onValueChange when an item is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <RadioGroup onValueChange={onValueChange}>
        <RadioGroupItem aria-label="Option 1" value="option1" />
        <RadioGroupItem aria-label="Option 2" value="option2" />
      </RadioGroup>
    );

    await user.click(screen.getByLabelText("Option 1"));
    expect(onValueChange).toHaveBeenCalledWith("option1");
  });

  it("should not call onValueChange when a disabled item is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <RadioGroup onValueChange={onValueChange}>
        <RadioGroupItem aria-label="Disabled" disabled value="disabled" />
      </RadioGroup>
    );

    await user.click(screen.getByLabelText("Disabled"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("should only allow one item to be checked at a time", async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup>
        <RadioGroupItem aria-label="Option 1" value="option1" />
        <RadioGroupItem aria-label="Option 2" value="option2" />
      </RadioGroup>
    );

    await user.click(screen.getByLabelText("Option 1"));
    expect(screen.getByLabelText("Option 1")).toBeChecked();
    expect(screen.getByLabelText("Option 2")).not.toBeChecked();

    await user.click(screen.getByLabelText("Option 2"));
    expect(screen.getByLabelText("Option 1")).not.toBeChecked();
    expect(screen.getByLabelText("Option 2")).toBeChecked();
  });

  it("should accept custom className on item", () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem className="custom-item" value="option1" />
      </RadioGroup>
    );

    const item = container.querySelector('[data-slot="radio-group-item"]');
    expect(item).toHaveClass("custom-item");
  });

  it("should render in horizontal orientation", () => {
    const { container } = render(
      <RadioGroup orientation="horizontal">
        <RadioGroupItem aria-label="A" value="a" />
        <RadioGroupItem aria-label="B" value="b" />
      </RadioGroup>
    );

    expect(
      container.querySelector('[data-slot="radio-group"]')
    ).toBeInTheDocument();
  });
});
