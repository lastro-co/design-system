import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { ToggleChip } from "./ToggleChip";

describe("ToggleChip", () => {
  it("reflects the selected state via aria-pressed", () => {
    render(
      <ToggleChip onSelectedChange={jest.fn()} selected>
        Apenas com a Lais
      </ToggleChip>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onSelectedChange with the toggled value", async () => {
    const onSelectedChange = jest.fn();
    const user = userEvent.setup();
    render(
      <ToggleChip onSelectedChange={onSelectedChange} selected={false}>
        Ativa
      </ToggleChip>
    );

    await user.click(screen.getByRole("button"));
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it("toggles back to false when already selected", async () => {
    const onSelectedChange = jest.fn();
    const user = userEvent.setup();
    render(
      <ToggleChip onSelectedChange={onSelectedChange} selected>
        Ativa
      </ToggleChip>
    );

    await user.click(screen.getByRole("button"));
    expect(onSelectedChange).toHaveBeenCalledWith(false);
  });

  it("renders children and merges className", () => {
    render(
      <ToggleChip
        className="custom-class"
        onSelectedChange={jest.fn()}
        selected
      >
        Pausada
      </ToggleChip>
    );
    const chip = screen.getByRole("button", { name: "Pausada" });
    expect(chip).toBeVisible();
    expect(chip).toHaveClass("custom-class");
  });
});
