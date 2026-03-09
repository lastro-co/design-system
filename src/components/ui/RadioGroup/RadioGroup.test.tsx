import { render, screen } from "@/tests/app-test-utils";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

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

  it("should accept custom className", () => {
    const { container } = render(
      <RadioGroup className="custom-class">
        <RadioGroupItem value="option1" />
      </RadioGroup>
    );

    const radioGroup = container.querySelector('[data-slot="radio-group"]');
    expect(radioGroup).toHaveClass("custom-class");
  });

  it("should handle checked state", () => {
    render(
      <RadioGroup defaultValue="option1">
        <RadioGroupItem aria-label="Option 1" value="option1" />
        <RadioGroupItem aria-label="Option 2" value="option2" />
      </RadioGroup>
    );

    const firstItem = screen.getByLabelText("Option 1");
    expect(firstItem).toBeChecked();
  });

  it("should handle disabled state", () => {
    render(
      <RadioGroup>
        <RadioGroupItem aria-label="Option 1" disabled value="option1" />
      </RadioGroup>
    );

    const item = screen.getByLabelText("Option 1");
    expect(item).toBeDisabled();
  });

  it("should handle invalid state", () => {
    render(
      <RadioGroup>
        <RadioGroupItem aria-invalid aria-label="Option 1" value="option1" />
      </RadioGroup>
    );

    const item = screen.getByLabelText("Option 1");
    expect(item).toHaveAttribute("aria-invalid");
  });
});
