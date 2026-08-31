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

  it("renders thumbContent inside the thumb", () => {
    const { container } = render(
      <Switch thumbContent={<span data-testid="thumb-mark" />} />
    );
    const thumb = container.querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toContainElement(screen.getByTestId("thumb-mark"));
  });

  it("leaves the thumb empty when thumbContent is omitted", () => {
    const { container } = render(<Switch />);
    const thumb = container.querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toBeEmptyDOMElement();
  });

  // SwitchPrimitive.Root accepts children and has always dropped them. The prop
  // type now rejects them outright, so the ts-expect-error is the assertion:
  // remove the Omit and this file stops compiling.
  it("still ignores children", () => {
    // @ts-expect-error children is not part of the Switch API
    render(<Switch>should not render</Switch>);
    expect(screen.queryByText("should not render")).not.toBeInTheDocument();
  });

  // Named for what it checks: the centering lives on the thumb's own classes and
  // holds with or without content, so passing content here would prove nothing.
  it("makes the thumb a centering flex container", () => {
    const { container } = render(<Switch />);
    const thumb = container.querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toHaveClass("flex", "items-center", "justify-center");
  });

  // The regression the knob mark introduced: decorative artwork becoming the
  // control's name. LaisLogo carries a default aria-label, so an unlabelled
  // switch announced as "Lais" until the thumb was hidden from assistive tech.
  it("keeps thumbContent out of the accessible name", () => {
    render(
      <Switch
        aria-label="Atendimento"
        thumbContent={<span aria-label="Lais" role="img" />}
      />
    );

    expect(screen.getByRole("switch")).toHaveAccessibleName("Atendimento");
  });

  it("leaves an unlabelled switch unnamed even with a mark in the thumb", () => {
    render(<Switch thumbContent={<span aria-label="Lais" role="img" />} />);

    expect(screen.getByRole("switch")).toHaveAccessibleName("");
  });

  // The toggle reads abrupt at Tailwind's 150ms default; the slower ease-out is
  // the deliberate feel, so a silent revert should fail here.
  it("eases the track and the thumb over the same duration", () => {
    const { container } = render(<Switch />);
    const switchEl = screen.getByRole("switch");
    const thumb = container.querySelector('[data-slot="switch-thumb"]');

    expect(switchEl).toHaveClass("duration-300", "ease-out");
    expect(thumb).toHaveClass("duration-300", "ease-out");
  });

  it("exports from index", () => {
    const exports = require("./index");
    expect(exports.Switch).toBeDefined();
    expect(exports.switchVariants).toBeDefined();
  });
});
