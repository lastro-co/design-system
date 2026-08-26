import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { value: "conversations", label: "Conversas" },
  { value: "bankslips", label: "Boletos" },
  { value: "occurrences", label: "Ocorrências" },
];

function setup(value = "conversations", onValueChange = jest.fn()) {
  render(
    <SegmentedControl
      aria-label="Série exibida"
      onValueChange={onValueChange}
      options={options}
      value={value}
    />
  );
  return onValueChange;
}

describe("SegmentedControl", () => {
  it("renders every option", () => {
    setup();

    for (const option of options) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });

  // The reason this component exists rather than a row of buttons: selection has
  // to reach assistive tech, not just the eye.
  it("exposes the selection to assistive tech, not only through colour", () => {
    setup("bankslips");

    expect(screen.getByRole("radiogroup")).toHaveAccessibleName(
      "Série exibida"
    );
    expect(screen.getByRole("radio", { checked: true })).toHaveTextContent(
      "Boletos"
    );
    expect(screen.getAllByRole("radio", { checked: false })).toHaveLength(2);
  });

  it("gives a surface to the selected segment only", () => {
    setup("bankslips");

    expect(screen.getByText("Boletos")).toHaveClass("bg-white");
    expect(screen.getByText("Conversas")).toHaveClass("bg-transparent");
    expect(screen.getByText("Ocorrências")).toHaveClass("bg-transparent");
  });

  it("reports the value that was picked", async () => {
    const user = userEvent.setup();
    const onValueChange = setup();

    await user.click(screen.getByText("Ocorrências"));

    expect(onValueChange).toHaveBeenCalledWith("occurrences");
  });

  // Arrow navigation itself comes from Radix's roving focus and is NOT asserted
  // here: jsdom does not exercise it — verified by driving the DS's own
  // RadioGroup the same way, which also reports nothing. What is assertable is
  // the contract that tells the browser and AT which keys apply.
  it("declares the horizontal orientation the arrow keys follow", () => {
    setup();

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
  });

  it("does not report a disabled segment", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <SegmentedControl
        aria-label="Série exibida"
        onValueChange={onValueChange}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B", disabled: true },
        ]}
        value="a"
      />
    );

    await user.click(screen.getByText("B"));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByText("B")).toBeDisabled();
  });

  it("merges an external className onto the track", () => {
    render(
      <SegmentedControl
        aria-label="Série exibida"
        className="mt-4"
        onValueChange={jest.fn()}
        options={options}
        value="conversations"
      />
    );

    const track = screen.getByRole("radiogroup");
    expect(track).toHaveClass("mt-4");
    expect(track).toHaveClass("bg-gray-100");
  });

  it("index.ts exports work correctly", () => {
    const indexExports = require("./index");
    expect(indexExports.SegmentedControl).toBeDefined();
  });
});
