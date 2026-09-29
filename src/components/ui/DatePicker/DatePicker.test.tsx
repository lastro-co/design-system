import { useState } from "react";
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@/tests/app-test-utils";
import { DatePicker } from "./DatePicker";

const PLACEHOLDER = "Selecione uma data";
const SEPTEMBER_12_2026 = new Date(2026, 8, 12);
const SEPTEMBER_LABEL = "12 de setembro de 2026";
const NEXT_MONTH_LABEL = "Ir para o próximo mês";

const openPicker = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button"));
  return screen.findByRole("dialog");
};

describe("DatePicker", () => {
  describe("Trigger label", () => {
    it("shows the placeholder when there is no value", () => {
      render(<DatePicker />);

      const trigger = screen.getByRole("button", { name: PLACEHOLDER });
      expect(trigger).toBeVisible();
      expect(screen.getByText(PLACEHOLDER)).toHaveClass("text-gray-600");
    });

    it("shows a custom placeholder", () => {
      render(<DatePicker placeholder="Data de nascimento" />);

      expect(
        screen.getByRole("button", { name: "Data de nascimento" })
      ).toBeVisible();
    });

    it("shows the value in long Portuguese format with a lowercase month", () => {
      render(<DatePicker value={SEPTEMBER_12_2026} />);

      expect(
        screen.getByRole("button", { name: SEPTEMBER_LABEL })
      ).toBeVisible();
      expect(screen.getByText(SEPTEMBER_LABEL)).toHaveClass("text-gray-700");
    });

    it("does not zero-pad single-digit days", () => {
      render(<DatePicker value={new Date(2026, 0, 5)} />);

      expect(screen.getByText("5 de janeiro de 2026")).toBeVisible();
    });

    it("keeps the icons out of the accessible name", () => {
      render(<DatePicker value={SEPTEMBER_12_2026} />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAccessibleName(SEPTEMBER_LABEL);
      for (const icon of trigger.querySelectorAll("svg")) {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("shows the calendar icon and the chevron while empty", () => {
      render(<DatePicker />);

      const trigger = screen.getByRole("button");
      expect(trigger.querySelector(".lucide-calendar")).toBeVisible();
      expect(trigger.querySelector(".lucide-chevron-down")).toBeVisible();
    });

    it("drops the chevron once a date is selected, as in the Figma", () => {
      render(<DatePicker value={SEPTEMBER_12_2026} />);

      const trigger = screen.getByRole("button");
      expect(trigger.querySelector(".lucide-calendar")).toBeVisible();
      expect(
        trigger.querySelector(".lucide-chevron-down")
      ).not.toBeInTheDocument();
    });

    it("updates the label when the controlled value changes externally", () => {
      const { rerender } = render(<DatePicker value={SEPTEMBER_12_2026} />);
      expect(screen.getByText(SEPTEMBER_LABEL)).toBeVisible();

      rerender(<DatePicker value={new Date(2026, 11, 10)} />);
      expect(screen.getByText("10 de dezembro de 2026")).toBeVisible();

      rerender(<DatePicker value={undefined} />);
      expect(screen.getByText(PLACEHOLDER)).toBeVisible();
    });
  });

  describe("Trigger element", () => {
    it("is a native type=button so it never submits a form", () => {
      render(<DatePicker />);

      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("announces a dialog popup and its expanded state", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      const trigger = screen.getByRole("button");

      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("data-state", "open");
    });

    it("forwards id, data-* and className to the button", () => {
      render(
        <DatePicker className="w-fit" data-testid="picker" id="visit-date" />
      );

      const trigger = screen.getByTestId("picker");
      expect(trigger.tagName).toBe("BUTTON");
      expect(trigger).toHaveAttribute("id", "visit-date");
      expect(trigger).toHaveClass("w-fit");
    });

    it("is labelled by an external <label htmlFor>", () => {
      render(
        <>
          <label htmlFor="visit-date">Data da visita</label>
          <DatePicker id="visit-date" />
        </>
      );

      expect(
        screen.getByRole("button", { name: "Data da visita" })
      ).toBeVisible();
    });

    it("is reachable by keyboard and opens with Enter", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);

      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(await screen.findByRole("dialog")).toBeVisible();
    });
  });

  describe("States", () => {
    it("uses the default border when there is no state", () => {
      render(<DatePicker />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveClass("border-gray-300");
      expect(trigger).toHaveAttribute("aria-invalid", "false");
    });

    it("marks the button invalid for state=error", () => {
      render(<DatePicker state="error" />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
      expect(trigger).toHaveClass("border-red-600");
      expect(trigger).not.toHaveClass("border-gray-300");
    });

    it("keeps the error border while focused or open", async () => {
      const user = userEvent.setup();
      render(<DatePicker state="error" />);
      const trigger = screen.getByRole("button");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("data-state", "open");
      expect(trigger).toHaveClass("border-red-600");
      for (const purple of [
        "focus-visible:border-purple-800",
        "data-[state=open]:border-purple-800",
      ]) {
        expect(trigger).not.toHaveClass(purple);
      }
    });

    it("keeps an aria-invalid passed by the consumer", () => {
      render(<DatePicker aria-invalid />);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("applies the success border for state=success", () => {
      render(<DatePicker state="success" />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveClass("border-green-500");
      expect(trigger).toHaveAttribute("aria-invalid", "false");
    });

    it("lets error take precedence over success", () => {
      render(<DatePicker aria-invalid state="success" />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
      expect(trigger).not.toHaveClass("border-green-500");
    });

    it("shows the purple focus border when open", () => {
      render(<DatePicker />);

      expect(screen.getByRole("button")).toHaveClass(
        "focus-visible:border-purple-800",
        "data-[state=open]:border-purple-800"
      );
    });
  });

  describe("Disabled", () => {
    it("disables the native button with muted styles", () => {
      render(<DatePicker disabled value={SEPTEMBER_12_2026} />);

      const trigger = screen.getByRole("button");
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveClass(
        "disabled:bg-gray-50",
        "disabled:cursor-not-allowed"
      );
      expect(screen.getByText(SEPTEMBER_LABEL)).toHaveClass("text-gray-400");
    });

    it("does not open when clicked", async () => {
      const user = userEvent.setup();
      render(<DatePicker disabled />);

      await user.click(screen.getByRole("button"));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Popover", () => {
    it("opens the calendar on click", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);

      const dialog = await openPicker(user);
      expect(within(dialog).getByRole("grid")).toBeVisible();
    });

    it("shows only the calendar's surface, not a second popover one", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);

      const content = await openPicker(user);
      expect(content).toHaveClass(
        "border-0",
        "bg-transparent",
        "p-0",
        "shadow-none",
        "w-auto"
      );
      for (const popoverSurface of ["border", "shadow-sm", "p-4"]) {
        expect(content).not.toHaveClass(popoverSurface);
      }

      const calendar = content.querySelector('[data-slot="calendar"]');
      expect(calendar).toHaveClass(
        "rounded-md",
        "border",
        "border-gray-200",
        "bg-white",
        "shadow-sm"
      );
    });

    it("left-aligns the popover with the trigger", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);

      const content = await openPicker(user);
      expect(content).toHaveAttribute("data-align", "start");
    });

    it("uses the plain caption header, not the dropdown one", async () => {
      const user = userEvent.setup();
      render(<DatePicker value={SEPTEMBER_12_2026} />);

      const dialog = await openPicker(user);
      expect(within(dialog).getByText("Setembro de 2026")).toBeVisible();
    });

    it("opens on the month of the value", async () => {
      const user = userEvent.setup();
      render(<DatePicker value={new Date(2026, 11, 10)} />);

      const dialog = await openPicker(user);
      expect(within(dialog).getByText("Dezembro de 2026")).toBeVisible();
    });

    it("opens on the current month when there is no value", async () => {
      jest.useFakeTimers({ advanceTimers: true, now: new Date(2026, 2, 4) });
      try {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<DatePicker />);

        const dialog = await openPicker(user);
        expect(within(dialog).getByText("Março de 2026")).toBeVisible();
      } finally {
        jest.useRealTimers();
      }
    });

    it("re-seeds the month from an externally changed value on the next open", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<DatePicker value={SEPTEMBER_12_2026} />);

      await openPicker(user);
      await user.keyboard("{Escape}");
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      );

      rerender(<DatePicker value={new Date(2027, 1, 3)} />);

      const dialog = await openPicker(user);
      expect(within(dialog).getByText("Fevereiro de 2027")).toBeVisible();
    });

    it("forgets in-popover navigation after closing", async () => {
      const user = userEvent.setup();
      render(<DatePicker value={SEPTEMBER_12_2026} />);

      let dialog = await openPicker(user);
      await user.click(
        within(dialog).getByRole("button", { name: NEXT_MONTH_LABEL })
      );
      expect(within(dialog).getByText("Outubro de 2026")).toBeVisible();

      await user.keyboard("{Escape}");
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      );

      dialog = await openPicker(user);
      expect(within(dialog).getByText("Setembro de 2026")).toBeVisible();
    });
  });

  describe("Selection", () => {
    it("calls onChange with the clicked date and closes", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DatePicker onChange={handleChange} value={SEPTEMBER_12_2026} />);

      const dialog = await openPicker(user);
      await user.click(within(dialog).getByText("20"));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(new Date(2026, 8, 20));
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      );
    });

    it("updates the label after a selection in a controlled form", async () => {
      const user = userEvent.setup();
      const Controlled = () => {
        const [date, setDate] = useState<Date | undefined>(SEPTEMBER_12_2026);
        return <DatePicker onChange={setDate} value={date} />;
      };
      render(<Controlled />);

      const dialog = await openPicker(user);
      await user.click(within(dialog).getByText("20"));

      expect(
        await screen.findByRole("button", { name: "20 de setembro de 2026" })
      ).toBeVisible();
    });

    it("deselects (onChange(undefined)) when the selected day is clicked again", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DatePicker onChange={handleChange} value={SEPTEMBER_12_2026} />);

      const dialog = await openPicker(user);
      await user.click(within(dialog).getByText("12"));

      expect(handleChange).toHaveBeenCalledWith(undefined);
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      );
    });
  });

  describe("disabledDates", () => {
    const getDayButton = (dialog: HTMLElement, day: string) =>
      within(dialog).getByText(day).closest("button") as HTMLButtonElement;

    it("accepts a matcher function", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      const isWeekend = (date: Date) =>
        date.getDay() === 0 || date.getDay() === 6;
      render(
        <DatePicker
          disabledDates={isWeekend}
          onChange={handleChange}
          value={SEPTEMBER_12_2026}
        />
      );

      const dialog = await openPicker(user);
      // 13/09/2026 is a Sunday, 14/09/2026 a Monday.
      expect(getDayButton(dialog, "13")).toBeDisabled();
      expect(getDayButton(dialog, "14")).toBeEnabled();

      await user.click(getDayButton(dialog, "13"));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("accepts a Date[] (backward compatible)", async () => {
      const user = userEvent.setup();
      render(
        <DatePicker
          disabledDates={[new Date(2026, 8, 15), new Date(2026, 8, 16)]}
          value={SEPTEMBER_12_2026}
        />
      );

      const dialog = await openPicker(user);
      expect(getDayButton(dialog, "15")).toBeDisabled();
      expect(getDayButton(dialog, "16")).toBeDisabled();
      expect(getDayButton(dialog, "17")).toBeEnabled();
    });
  });
});
