import { render, screen, userEvent } from "@/tests/app-test-utils";
import { NumberInput } from ".";

const INCREMENT_RE = /Increase value/i;
const DECREMENT_RE = /Decrease value/i;
const AUMENTAR_RE = /Aumentar valor/i;
const DIMINUIR_RE = /Diminuir valor/i;

describe("NumberInput", () => {
  it("renders the input and both stepper buttons", () => {
    render(<NumberInput data-testid="input" value="1" />);

    expect(screen.getByTestId("input")).toHaveAttribute("type", "number");
    expect(screen.getByRole("button", { name: INCREMENT_RE })).toBeVisible();
    expect(screen.getByRole("button", { name: DECREMENT_RE })).toBeVisible();
  });

  it("emits onValueChange with the new value on increment", async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    render(<NumberInput onValueChange={onValueChange} value="3" />);

    await user.click(screen.getByRole("button", { name: INCREMENT_RE }));

    expect(onValueChange).toHaveBeenCalledWith("4");
  });

  it("emits onValueChange with the new value on decrement", async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    render(<NumberInput onValueChange={onValueChange} value="3" />);

    await user.click(screen.getByRole("button", { name: DECREMENT_RE }));

    expect(onValueChange).toHaveBeenCalledWith("2");
  });

  it("uses the configured step", async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    render(<NumberInput onValueChange={onValueChange} step={5} value="10" />);

    await user.click(screen.getByRole("button", { name: INCREMENT_RE }));

    expect(onValueChange).toHaveBeenCalledWith("15");
  });

  it("disables the increment button at max", () => {
    render(<NumberInput max={3} value="3" />);

    expect(screen.getByRole("button", { name: INCREMENT_RE })).toBeDisabled();
    expect(screen.getByRole("button", { name: DECREMENT_RE })).toBeEnabled();
  });

  it("disables the decrement button at min", () => {
    render(<NumberInput min={1} value="1" />);

    expect(screen.getByRole("button", { name: DECREMENT_RE })).toBeDisabled();
    expect(screen.getByRole("button", { name: INCREMENT_RE })).toBeEnabled();
  });

  it("disables both buttons + the input when `disabled` is set", () => {
    render(<NumberInput data-testid="input" disabled value="1" />);

    expect(screen.getByTestId("input")).toBeDisabled();
    expect(screen.getByRole("button", { name: INCREMENT_RE })).toBeDisabled();
    expect(screen.getByRole("button", { name: DECREMENT_RE })).toBeDisabled();
  });

  it("clamps to max when the projected increment would exceed it", async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    // Step 5 with max 3 + value 1 → next would be 6 → clamp to 3.
    // Increment button is disabled because next > max, so simulate the
    // edge by setting value = max - small step that fits, then stepping.
    render(
      <NumberInput max={10} onValueChange={onValueChange} step={5} value="8" />
    );

    await user.click(screen.getByRole("button", { name: INCREMENT_RE }));

    expect(onValueChange).toHaveBeenCalledWith("10");
  });

  it("clamps to min when the projected decrement would go below it", async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    render(
      <NumberInput min={0} onValueChange={onValueChange} step={5} value="2" />
    );

    await user.click(screen.getByRole("button", { name: DECREMENT_RE }));

    expect(onValueChange).toHaveBeenCalledWith("0");
  });

  it("forwards typed values via onValueChange and onChange", async () => {
    const onValueChange = jest.fn();
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <NumberInput
        data-testid="input"
        onChange={onChange}
        onValueChange={onValueChange}
        value=""
      />
    );

    await user.type(screen.getByTestId("input"), "7");

    expect(onValueChange).toHaveBeenCalledWith("7");
    expect(onChange).toHaveBeenCalled();
  });

  it("supports localized aria-labels", () => {
    render(
      <NumberInput
        decrementAriaLabel="Diminuir valor"
        incrementAriaLabel="Aumentar valor"
        value="1"
      />
    );

    expect(screen.getByRole("button", { name: AUMENTAR_RE })).toBeVisible();
    expect(screen.getByRole("button", { name: DIMINUIR_RE })).toBeVisible();
  });

  it("forwards aria-invalid to the underlying input", () => {
    render(<NumberInput aria-invalid data-testid="input" value="1" />);

    expect(screen.getByTestId("input")).toHaveAttribute("aria-invalid");
  });

  it("exports from index", () => {
    const exports = require("./index");
    expect(exports.NumberInput).toBeDefined();
  });
});
