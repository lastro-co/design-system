import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/app-test-utils";
import { MonthYearPicker } from "./MonthYearPicker";

const TODAY = new Date(2026, 8, 23);

const SETEMBRO_2026 = "Setembro, 2026";
const PLACEHOLDER = "Selecione o mês";
const JAN_RE = /^jan$/i;
const FEV_RE = /^fev$/i;
const MAR_RE = /^mar$/i;
const JUN_RE = /^jun$/i;
const JUL_RE = /^jul$/i;
const SET_RE = /^set$/i;
const OUT_RE = /^out$/i;
const DEZ_RE = /^dez$/i;
const ANO_ANTERIOR_RE = /ano anterior/i;
const PROXIMO_ANO_RE = /próximo ano/i;

type PickerProps = Partial<React.ComponentProps<typeof MonthYearPicker>>;

function renderPicker(props: PickerProps = {}) {
  const onChange = jest.fn();
  const user = userEvent.setup();
  const utils = render(
    <MonthYearPicker onChange={onChange} today={TODAY} {...props} />
  );
  return { ...utils, onChange, user };
}

function getTrigger() {
  return screen.getByRole("button", { expanded: false });
}

async function openPicker(user: ReturnType<typeof userEvent.setup>) {
  await user.click(getTrigger());
  await waitFor(() => {
    expect(screen.getByRole("button", { name: JAN_RE })).toBeVisible();
  });
}

describe("MonthYearPicker", () => {
  describe("trigger", () => {
    it("renders the full month name, a comma and the year", () => {
      renderPicker({ month: 9, year: 2026 });
      expect(screen.getByRole("button", { name: SETEMBRO_2026 })).toBeVisible();
    });

    it("renders January and December from the 1-indexed month", () => {
      const { rerender } = renderPicker({ month: 1, year: 2025 });
      expect(
        screen.getByRole("button", { name: "Janeiro, 2025" })
      ).toBeVisible();

      rerender(
        <MonthYearPicker
          month={12}
          onChange={jest.fn()}
          today={TODAY}
          year={2024}
        />
      );
      expect(
        screen.getByRole("button", { name: "Dezembro, 2024" })
      ).toBeVisible();
    });

    it("shows the default placeholder in gray-600 without a value", () => {
      renderPicker();
      const label = screen.getByText(PLACEHOLDER);
      expect(label).toBeVisible();
      expect(label).toHaveClass("text-gray-600");
    });

    it("shows a custom placeholder", () => {
      renderPicker({ placeholder: "Escolha" });
      expect(screen.getByRole("button", { name: "Escolha" })).toBeVisible();
    });

    it("treats a month without a year as empty", () => {
      renderPicker({ month: 3 });
      expect(screen.getByText(PLACEHOLDER)).toBeVisible();
    });

    it("renders the value in gray-700", () => {
      renderPicker({ month: 9, year: 2026 });
      expect(screen.getByText(SETEMBRO_2026)).toHaveClass("text-gray-700");
    });

    it.each([
      ["empty", {}],
      ["with a value", { month: 9, year: 2026 }],
    ])("shows only the chevron, no calendar icon, when %s", (_, props) => {
      renderPicker(props);
      const icons = getTrigger().querySelectorAll("svg");
      expect(icons).toHaveLength(1);
      expect(icons[0]).toHaveClass("lucide-chevron-down");
    });

    it("hugs its content at the medium 40px height by default", () => {
      renderPicker({ month: 9, year: 2026 });
      expect(getTrigger()).toHaveClass("w-fit", "h-10", "px-4", "text-sm");
    });

    it('applies the compact Button height with size="small"', () => {
      renderPicker({ month: 9, size: "small", year: 2026 });
      const trigger = getTrigger();
      expect(trigger).toHaveClass("h-8", "px-3", "text-[13px]");
      expect(trigger).not.toHaveClass("h-10");
    });

    it("falls back to medium when size is null", () => {
      renderPicker({ size: null });
      expect(getTrigger()).toHaveClass("h-10");
    });

    it("forwards className and extra props to the trigger", () => {
      renderPicker({
        className: "mt-4",
        "data-testid": "picker",
      } as PickerProps);
      expect(screen.getByTestId("picker")).toHaveClass("mt-4", "w-fit");
    });

    it("renders the error state", () => {
      renderPicker({ state: "error" });
      const trigger = getTrigger();
      expect(trigger).toHaveAttribute("aria-invalid", "true");
      expect(trigger).toHaveClass("border-red-600");
    });

    it("does not open while disabled", async () => {
      const { user } = renderPicker({ disabled: true });
      expect(getTrigger()).toBeDisabled();
      await user.click(getTrigger());
      expect(
        screen.queryByRole("button", { name: JAN_RE })
      ).not.toBeInTheDocument();
    });
  });

  describe("popover", () => {
    it("opens the 4x3 month grid on click", async () => {
      const { user } = renderPicker({ month: 9, year: 2026 });
      await openPicker(user);

      expect(screen.getByRole("button", { name: DEZ_RE })).toBeVisible();
      expect(screen.getByText("2026")).toBeVisible();
    });

    it("aligns the popover to the end of the trigger", async () => {
      const { user } = renderPicker({ month: 9, year: 2026 });
      await openPicker(user);

      expect(
        document.querySelector("[data-slot='popover-content']")
      ).toHaveAttribute("data-align", "end");
    });

    it("draws a single surface: the popover is bare, the inner container carries it", async () => {
      const { user } = renderPicker({ month: 9, year: 2026 });
      await openPicker(user);

      const popover = document.querySelector(
        "[data-slot='popover-content']"
      ) as HTMLElement;
      expect(popover).toHaveClass(
        "border-0",
        "bg-transparent",
        "p-0",
        "shadow-none"
      );

      const surface = popover.firstElementChild as HTMLElement;
      expect(surface).toHaveClass(
        "rounded-md",
        "border",
        "border-gray-200",
        "bg-white",
        "shadow-sm",
        "p-4"
      );
      expect(surface.firstElementChild).toHaveClass("w-56.5");
    });
  });

  describe("month selection", () => {
    it("calls onChange with the 1-indexed month and the displayed year, then closes", async () => {
      const { onChange, user } = renderPicker({ month: 3, year: 2026 });
      await openPicker(user);

      await user.click(screen.getByRole("button", { name: FEV_RE }));

      expect(onChange).toHaveBeenCalledWith(2, 2026);
      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: FEV_RE })
        ).not.toBeInTheDocument();
      });
    });

    it("selects from the empty state using the current year", async () => {
      const { onChange, user } = renderPicker();
      await openPicker(user);

      expect(screen.getByText("2026")).toBeVisible();
      await user.click(screen.getByRole("button", { name: JUN_RE }));

      expect(onChange).toHaveBeenCalledWith(6, 2026);
    });

    it("uses the year navigated to", async () => {
      const { onChange, user } = renderPicker({ month: 3, year: 2026 });
      await openPicker(user);

      await user.click(screen.getByRole("button", { name: ANO_ANTERIOR_RE }));
      await user.click(screen.getByRole("button", { name: DEZ_RE }));

      expect(onChange).toHaveBeenCalledWith(12, 2025);
    });
  });

  describe("year navigation", () => {
    it("moves back and forward one year", async () => {
      const { user } = renderPicker({ month: 3, year: 2025 });
      await openPicker(user);

      await user.click(screen.getByRole("button", { name: ANO_ANTERIOR_RE }));
      expect(screen.getByText("2024")).toBeVisible();

      await user.click(screen.getByRole("button", { name: PROXIMO_ANO_RE }));
      await user.click(screen.getByRole("button", { name: PROXIMO_ANO_RE }));
      expect(screen.getByText("2026")).toBeVisible();
    });

    it("disables the previous button at minYear (default 2024)", async () => {
      const { user } = renderPicker({ month: 1, year: 2024 });
      await openPicker(user);

      expect(
        screen.getByRole("button", { name: ANO_ANTERIOR_RE })
      ).toBeDisabled();
    });

    it("honours a custom minYear", async () => {
      const { user } = renderPicker({ minYear: 2020, month: 1, year: 2024 });
      await openPicker(user);

      expect(
        screen.getByRole("button", { name: ANO_ANTERIOR_RE })
      ).toBeEnabled();
    });

    it("disables the next button at maxYear (default: today's year)", async () => {
      const { user } = renderPicker({ month: 1, year: 2026 });
      await openPicker(user);

      expect(
        screen.getByRole("button", { name: PROXIMO_ANO_RE })
      ).toBeDisabled();
    });

    it("enables the next button below a custom maxYear", async () => {
      const { user } = renderPicker({ maxYear: 2027, month: 1, year: 2026 });
      await openPicker(user);

      expect(
        screen.getByRole("button", { name: PROXIMO_ANO_RE })
      ).toBeEnabled();
    });

    it("resets the displayed year to the value on reopen", async () => {
      const { user } = renderPicker({ month: 3, year: 2026 });
      await openPicker(user);
      await user.click(screen.getByRole("button", { name: ANO_ANTERIOR_RE }));
      expect(screen.getByText("2025")).toBeVisible();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: JAN_RE })
        ).not.toBeInTheDocument();
      });

      await openPicker(user);
      expect(screen.getByText("2026")).toBeVisible();
    });
  });

  describe("disabled future months", () => {
    it("disables months after today's month in the current year by default", async () => {
      const { onChange, user } = renderPicker({ month: 3, year: 2026 });
      await openPicker(user);

      const out = screen.getByRole("button", { name: OUT_RE });
      expect(out).toBeDisabled();
      expect(out).toHaveClass("opacity-30");
      expect(screen.getByRole("button", { name: SET_RE })).toBeEnabled();

      await user.click(out);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("honours a custom maxMonth", async () => {
      const { user } = renderPicker({
        maxMonth: 6,
        maxYear: 2026,
        month: 3,
        year: 2026,
      });
      await openPicker(user);

      expect(screen.getByRole("button", { name: JUN_RE })).toBeEnabled();
      expect(screen.getByRole("button", { name: JUL_RE })).toBeDisabled();
    });

    it("keeps every month enabled before maxYear", async () => {
      const { user } = renderPicker({ month: 3, year: 2025 });
      await openPicker(user);

      expect(screen.getByRole("button", { name: DEZ_RE })).toBeEnabled();
    });
  });

  describe("current and selected month", () => {
    it("marks today's month in semibold purple with aria-current when not selected", async () => {
      const { user } = renderPicker({ maxYear: 2030 });
      await openPicker(user);

      const set = screen.getByRole("button", { name: SET_RE });
      expect(set).toHaveAttribute("aria-current", "date");
      expect(set).toHaveAttribute("aria-pressed", "false");
      expect(set).toHaveClass("font-semibold", "text-purple-800");
      expect(set).not.toHaveClass("bg-purple-800");

      const jan = screen.getByRole("button", { name: JAN_RE });
      expect(jan).not.toHaveAttribute("aria-current");
      expect(jan).toHaveClass("text-gray-600", "hover:bg-gray-100");
    });

    it("does not mark today's month in another displayed year", async () => {
      const { user } = renderPicker({ month: 3, year: 2025 });
      await openPicker(user);

      expect(screen.getByRole("button", { name: SET_RE })).not.toHaveAttribute(
        "aria-current"
      );
    });

    it("fills the selected month in purple-800 with aria-pressed", async () => {
      const { user } = renderPicker({ month: 3, year: 2026 });
      await openPicker(user);

      const mar = screen.getByRole("button", { name: MAR_RE });
      expect(mar).toHaveAttribute("aria-pressed", "true");
      expect(mar).toHaveClass(
        "bg-purple-800",
        "text-white",
        "font-medium",
        "rounded-lg"
      );
      expect(screen.getByRole("button", { name: JAN_RE })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });

    it("uses the selected style, not the current-month style, when today's month is selected", async () => {
      const { user } = renderPicker({ maxYear: 2030, month: 9, year: 2026 });
      await openPicker(user);

      const set = screen.getByRole("button", { name: SET_RE });
      expect(set).toHaveAttribute("aria-pressed", "true");
      expect(set).toHaveClass("bg-purple-800", "text-white");
      expect(set).not.toHaveClass("text-purple-800", "font-semibold");
    });

    it("does not select the month in another displayed year", async () => {
      const { user } = renderPicker({ month: 3, year: 2026 });
      await openPicker(user);
      await user.click(screen.getByRole("button", { name: ANO_ANTERIOR_RE }));

      expect(screen.getByRole("button", { name: MAR_RE })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });
  });
});
