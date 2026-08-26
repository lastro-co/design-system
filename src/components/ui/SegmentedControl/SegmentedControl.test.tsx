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

  // data-state, not the class: every token here is pending design sign-off, and
  // the behaviour asserted — one segment checked, the rest not — outlives whatever
  // value they land on. Radix owns this attribute, so it is a contract, not ours.
  it("marks exactly one segment as checked", () => {
    setup("bankslips");

    expect(screen.getByRole("radio", { name: "Boletos" })).toHaveAttribute(
      "data-state",
      "checked"
    );
    for (const name of ["Conversas", "Ocorrências"]) {
      expect(screen.getByRole("radio", { name })).toHaveAttribute(
        "data-state",
        "unchecked"
      );
    }
  });

  it("reports the value that was picked", async () => {
    const user = userEvent.setup();
    const onValueChange = setup();

    await user.click(screen.getByText("Ocorrências"));

    expect(onValueChange).toHaveBeenCalledWith("occurrences");
  });

  it("declares the horizontal orientation the arrow keys follow", () => {
    setup();

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
  });

  // Radix moves focus on arrow and commits on Space, which is why this is a radio
  // group and not a row of buttons. Asserting focus rather than the callback: the
  // arrow alone does not select, and measuring the callback here is what made an
  // earlier version of this test look like jsdom could not run the interaction.
  it("moves focus with the arrows and commits with Space", async () => {
    const user = userEvent.setup();
    const onValueChange = setup();

    screen.getByRole("radio", { name: "Conversas" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "Boletos" })).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard(" ");

    expect(onValueChange).toHaveBeenCalledWith("bankslips");
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

    expect(screen.getByRole("radiogroup")).toHaveClass("mt-4");
  });

  it("index.ts exports work correctly", () => {
    const indexExports = require("./index");
    expect(indexExports.SegmentedControl).toBeDefined();
  });
});
