import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@/tests/app-test-utils";
import { DateRangePicker } from "./DateRangePicker";

const PLACEHOLDER = "Selecione o período";
const TODAY = new Date(2026, 8, 23);
const SEPTEMBER_RANGE: DateRange = {
  from: new Date(2026, 8, 3),
  to: new Date(2026, 8, 23),
};
const SEPTEMBER_LABEL = "03/09/26 – 23/09/26";
const SURFACE_CLASSES = [
  "rounded-md",
  "border",
  "border-gray-200",
  "bg-white",
  "shadow-sm",
];

type User = ReturnType<typeof userEvent.setup>;

const getTrigger = () =>
  screen.getByRole("button", { expanded: false }) as HTMLButtonElement;

const openPicker = async (user: User) => {
  await user.click(screen.getAllByRole("button")[0]);
  return screen.findByRole("dialog");
};

const getDayButton = (dialog: HTMLElement, date: Date) =>
  dialog.querySelector(
    `button[data-day="${date.toLocaleDateString()}"]`
  ) as HTMLButtonElement;

const waitForClose = () =>
  waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

describe("DateRangePicker", () => {
  describe("Trigger label", () => {
    it("shows the placeholder when there is no value", () => {
      render(<DateRangePicker />);

      expect(screen.getByRole("button", { name: PLACEHOLDER })).toBeVisible();
      expect(screen.getByText(PLACEHOLDER)).toHaveClass("text-gray-600");
    });

    it("shows a complete range as dd/MM/yy – dd/MM/yy", () => {
      render(<DateRangePicker value={SEPTEMBER_RANGE} />);

      expect(
        screen.getByRole("button", { name: SEPTEMBER_LABEL })
      ).toBeVisible();
      expect(screen.getByText(SEPTEMBER_LABEL)).toHaveClass("text-gray-700");
    });

    it("shows only the start date when the value has no end", () => {
      render(<DateRangePicker value={{ from: new Date(2026, 8, 3) }} />);

      expect(screen.getByRole("button", { name: "03/09/26" })).toBeVisible();
    });

    it("keeps the chevron in both states, out of the accessible name", () => {
      const { rerender } = render(<DateRangePicker />);
      expect(getTrigger().querySelector(".lucide-chevron-down")).toBeVisible();

      rerender(<DateRangePicker value={SEPTEMBER_RANGE} />);
      const trigger = getTrigger();
      expect(trigger.querySelector(".lucide-calendar")).toBeVisible();
      expect(trigger.querySelector(".lucide-chevron-down")).toBeVisible();
      expect(trigger).toHaveAccessibleName(SEPTEMBER_LABEL);
      for (const icon of trigger.querySelectorAll("svg")) {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("hugs its content with the Figma 8px gap", () => {
      render(<DateRangePicker />);

      expect(getTrigger()).toHaveClass("w-fit", "gap-2");
      expect(getTrigger()).not.toHaveClass("w-full");
    });
  });

  describe("Trigger element", () => {
    it("is a type=button announcing a dialog", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);
      const trigger = getTrigger();

      expect(trigger).toHaveAttribute("type", "button");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("forwards id, data-* and className to the button", () => {
      render(
        <DateRangePicker
          className="w-full"
          data-testid="range"
          id="campaign-period"
        />
      );

      const trigger = screen.getByTestId("range");
      expect(trigger.tagName).toBe("BUTTON");
      expect(trigger).toHaveAttribute("id", "campaign-period");
      expect(trigger).toHaveClass("w-full");
      expect(trigger).not.toHaveClass("w-fit");
    });

    it("is labelled by an external <label htmlFor>", () => {
      render(
        <>
          <label htmlFor="period">Período da campanha</label>
          <DateRangePicker id="period" />
        </>
      );

      expect(
        screen.getByRole("button", { name: "Período da campanha" })
      ).toBeVisible();
    });
  });

  describe("States", () => {
    it("uses the default border with no state", () => {
      render(<DateRangePicker />);

      expect(getTrigger()).toHaveClass("border-gray-300");
      expect(getTrigger()).toHaveAttribute("aria-invalid", "false");
    });

    it("keeps the error border while open", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker state="error" />);
      const trigger = getTrigger();

      await user.click(trigger);
      expect(trigger).toHaveAttribute("data-state", "open");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
      expect(trigger).toHaveClass("border-red-600");
      expect(trigger).not.toHaveClass("data-[state=open]:border-purple-800");
    });

    it("applies the success border", () => {
      render(<DateRangePicker state="success" />);

      expect(getTrigger()).toHaveClass("border-green-500");
    });

    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker disabled value={SEPTEMBER_RANGE} />);

      const trigger = screen.getByRole("button");
      expect(trigger).toBeDisabled();
      expect(screen.getByText(SEPTEMBER_LABEL)).toHaveClass("text-gray-400");
      await user.click(trigger);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Popover", () => {
    it("shows two months by default, from the current month", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker today={TODAY} />);

      const dialog = await openPicker(user);
      expect(within(dialog).getAllByRole("grid")).toHaveLength(2);
      expect(within(dialog).getByText("Setembro de 2026")).toBeVisible();
      expect(within(dialog).getByText("Outubro de 2026")).toBeVisible();
      expect(getDayButton(dialog, TODAY)).toHaveAttribute("data-today", "true");
    });

    it("falls back to the real current month without a today prop", async () => {
      jest.useFakeTimers({ advanceTimers: true, now: new Date(2026, 2, 4) });
      try {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        render(<DateRangePicker />);

        const dialog = await openPicker(user);
        expect(within(dialog).getByText("Março de 2026")).toBeVisible();
      } finally {
        jest.useRealTimers();
      }
    });

    it("honours numberOfMonths", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker numberOfMonths={1} />);

      const dialog = await openPicker(user);
      expect(within(dialog).getAllByRole("grid")).toHaveLength(1);
    });

    it("opens on the month of value.from", async () => {
      const user = userEvent.setup();
      render(
        <DateRangePicker
          today={TODAY}
          value={{ from: new Date(2026, 7, 25), to: TODAY }}
        />
      );

      const dialog = await openPicker(user);
      expect(within(dialog).getByText("Agosto de 2026")).toBeVisible();
      expect(within(dialog).getByText("Setembro de 2026")).toBeVisible();
    });

    it("left-aligns a single surface under the trigger", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);

      const content = await openPicker(user);
      expect(content).toHaveAttribute("data-align", "start");
      expect(content).toHaveClass("border-0", "bg-transparent", "shadow-none");
      const group = within(content).getByRole("group", { name: "Período" });
      expect(group.parentElement).toHaveClass(...SURFACE_CLASSES);
    });
  });

  describe("Selection (default mode)", () => {
    it("keeps the first click as a draft and commits on the second", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} today={TODAY} />);

      const dialog = await openPicker(user);
      await user.click(getDayButton(dialog, new Date(2026, 8, 10)));
      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeVisible();

      await user.click(getDayButton(dialog, new Date(2026, 9, 2)));
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith({
        from: new Date(2026, 8, 10),
        to: new Date(2026, 9, 2),
      });
      await waitForClose();
    });

    it("orders a second click that lands before the first", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} today={TODAY} />);

      const dialog = await openPicker(user);
      await user.click(getDayButton(dialog, new Date(2026, 8, 20)));
      await user.click(getDayButton(dialog, new Date(2026, 8, 5)));
      expect(handleChange).toHaveBeenCalledWith({
        from: new Date(2026, 8, 5),
        to: new Date(2026, 8, 20),
      });
    });

    it("starts over on the first click when reopened with a value", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(
        <DateRangePicker
          onChange={handleChange}
          today={TODAY}
          value={SEPTEMBER_RANGE}
        />
      );

      const dialog = await openPicker(user);
      await user.click(getDayButton(dialog, new Date(2026, 8, 15)));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("updates the trigger in a controlled form", async () => {
      const user = userEvent.setup();
      const Controlled = () => {
        const [range, setRange] = useState<DateRange | undefined>();
        return (
          <DateRangePicker onChange={setRange} today={TODAY} value={range} />
        );
      };
      render(<Controlled />);

      const dialog = await openPicker(user);
      await user.click(getDayButton(dialog, new Date(2026, 8, 3)));
      await user.click(getDayButton(dialog, TODAY));
      expect(
        await screen.findByRole("button", { name: SEPTEMBER_LABEL })
      ).toBeVisible();
    });

    it("discards an incomplete draft on Escape and reopens from value", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(
        <DateRangePicker
          onChange={handleChange}
          today={TODAY}
          value={SEPTEMBER_RANGE}
        />
      );

      let dialog = await openPicker(user);
      await user.click(getDayButton(dialog, new Date(2026, 8, 15)));
      await user.keyboard("{Escape}");
      await waitForClose();
      expect(handleChange).not.toHaveBeenCalled();

      dialog = await openPicker(user);
      const from = getDayButton(dialog, new Date(2026, 8, 3));
      expect(from).toHaveAttribute("data-range-start", "true");
      expect(getDayButton(dialog, new Date(2026, 8, 15))).toHaveAttribute(
        "data-range-middle",
        "true"
      );
    });

    it("discards the draft on an outside click", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(
        <>
          <span>fora</span>
          <DateRangePicker onChange={handleChange} today={TODAY} />
        </>
      );

      const dialog = await openPicker(user);
      await user.click(getDayButton(dialog, new Date(2026, 8, 15)));
      await user.click(screen.getByText("fora"));
      await waitForClose();
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Presets", () => {
    it("shows the default presets computed from today", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker today={TODAY} />);

      const dialog = await openPicker(user);
      const group = within(dialog).getByRole("group", { name: "Período" });
      for (const label of [
        "Semana atual",
        "Mês atual",
        "Últimos 7 dias",
        "Últimos 14 dias",
        "Últimos 30 dias",
      ]) {
        expect(
          within(group).getByRole("button", { name: label })
        ).toBeVisible();
      }
    });

    it("commits a preset and closes", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} today={TODAY} />);

      const dialog = await openPicker(user);
      await user.click(
        within(dialog).getByRole("button", { name: "Últimos 30 dias" })
      );
      expect(handleChange).toHaveBeenCalledWith({
        from: new Date(2026, 7, 25),
        to: TODAY,
      });
      await waitForClose();
    });

    it("marks the preset matching the value as pressed", async () => {
      const user = userEvent.setup();
      render(
        <DateRangePicker
          today={TODAY}
          value={{ from: new Date(2026, 7, 25), to: TODAY }}
        />
      );

      const dialog = await openPicker(user);
      expect(
        within(dialog).getByRole("button", { name: "Últimos 30 dias" })
      ).toHaveAttribute("aria-pressed", "true");
      expect(
        within(dialog).getByRole("button", { name: "Últimos 7 dias" })
      ).toHaveAttribute("aria-pressed", "false");
    });

    it("recomputes the default presets on every open", async () => {
      jest.useFakeTimers({ advanceTimers: true, now: new Date(2026, 8, 23) });
      try {
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const handleChange = jest.fn();
        render(<DateRangePicker onChange={handleChange} />);

        await openPicker(user);
        await user.keyboard("{Escape}");
        await waitForClose();

        jest.setSystemTime(new Date(2026, 8, 24));
        const dialog = await openPicker(user);
        await user.click(
          within(dialog).getByRole("button", { name: "Últimos 7 dias" })
        );
        expect(handleChange).toHaveBeenCalledWith({
          from: new Date(2026, 8, 18),
          to: new Date(2026, 8, 24),
        });
      } finally {
        jest.useRealTimers();
      }
    });

    it("accepts custom presets and a custom title", async () => {
      const user = userEvent.setup();
      render(
        <DateRangePicker
          presets={[{ label: "Setembro", range: SEPTEMBER_RANGE }]}
          presetsTitle="Atalhos"
        />
      );

      const dialog = await openPicker(user);
      const group = within(dialog).getByRole("group", { name: "Atalhos" });
      expect(within(group).getAllByRole("button")).toHaveLength(1);
    });

    it("shows the custom label for a range that matches no preset", async () => {
      const user = userEvent.setup();
      render(
        <DateRangePicker
          customPresetLabel="Personalizado"
          today={TODAY}
          value={SEPTEMBER_RANGE}
        />
      );

      const dialog = await openPicker(user);
      expect(within(dialog).getByText("Personalizado")).toBeVisible();
    });

    it("hides the sidebar with presets={false}", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker presets={false} />);

      const dialog = await openPicker(user);
      expect(within(dialog).queryByRole("group")).not.toBeInTheDocument();
      const root = dialog.querySelector('[data-slot="calendar"]');
      expect(root).toHaveClass(...SURFACE_CLASSES);
    });
  });

  describe("showActions", () => {
    const renderWithActions = (onChange = jest.fn(), value?: DateRange) =>
      render(
        <DateRangePicker
          customPresetLabel="Personalizado"
          onChange={onChange}
          showActions
          today={TODAY}
          value={value}
        />
      );

    it("draws the footer inside the one calendar surface", async () => {
      const user = userEvent.setup();
      renderWithActions();

      const dialog = await openPicker(user);
      const apply = within(dialog).getByRole("button", { name: "Aplicar" });
      const footer = apply.parentElement as HTMLElement;
      expect(footer).toHaveClass("border-t", "border-gray-200", "justify-end");

      const surface = footer.parentElement as HTMLElement;
      expect(surface).toHaveClass(...SURFACE_CLASSES);
      expect(surface).toContainElement(
        within(dialog).getByRole("group", { name: "Período" })
      );
      expect(dialog.querySelectorAll(".shadow-sm")).toHaveLength(1);
    });

    it("disables Aplicar until the range is complete", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      renderWithActions(handleChange);

      const dialog = await openPicker(user);
      const apply = within(dialog).getByRole("button", { name: "Aplicar" });
      expect(apply).toBeDisabled();

      await user.click(getDayButton(dialog, new Date(2026, 8, 3)));
      expect(apply).toBeDisabled();

      await user.click(getDayButton(dialog, new Date(2026, 8, 10)));
      expect(apply).toBeEnabled();
      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeVisible();
    });

    it("commits the draft with Aplicar and closes", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      renderWithActions(handleChange);

      const dialog = await openPicker(user);
      await user.click(getDayButton(dialog, new Date(2026, 8, 3)));
      await user.click(getDayButton(dialog, TODAY));
      await user.click(within(dialog).getByRole("button", { name: "Aplicar" }));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(SEPTEMBER_RANGE);
      await waitForClose();
    });

    it("keeps a preset as a draft and moves to its first month", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      renderWithActions(handleChange);

      const dialog = await openPicker(user);
      await user.click(
        within(dialog).getByRole("button", { name: "Últimos 30 dias" })
      );
      expect(handleChange).not.toHaveBeenCalled();
      expect(within(dialog).getByText("Agosto de 2026")).toBeVisible();

      await user.click(within(dialog).getByRole("button", { name: "Aplicar" }));
      expect(handleChange).toHaveBeenCalledWith({
        from: new Date(2026, 7, 25),
        to: TODAY,
      });
    });

    it("keeps the visible month for a preset with no start", async () => {
      const user = userEvent.setup();
      render(
        <DateRangePicker
          presets={[{ label: "Sem início", range: { from: undefined } }]}
          showActions
          today={TODAY}
        />
      );

      const dialog = await openPicker(user);
      await user.click(
        within(dialog).getByRole("button", { name: "Sem início" })
      );
      expect(within(dialog).getByText("Setembro de 2026")).toBeVisible();
      expect(
        within(dialog).getByRole("button", { name: "Aplicar" })
      ).toBeDisabled();
    });

    it("discards the draft with Cancelar", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      renderWithActions(handleChange, SEPTEMBER_RANGE);

      let dialog = await openPicker(user);
      await user.click(getDayButton(dialog, new Date(2026, 8, 10)));
      await user.click(getDayButton(dialog, new Date(2026, 8, 12)));
      await user.click(
        within(dialog).getByRole("button", { name: "Cancelar" })
      );
      await waitForClose();
      expect(handleChange).not.toHaveBeenCalled();

      dialog = await openPicker(user);
      expect(getDayButton(dialog, new Date(2026, 8, 3))).toHaveAttribute(
        "data-range-start",
        "true"
      );
    });

    it("discards the draft with Escape", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      renderWithActions(handleChange);

      const dialog = await openPicker(user);
      await user.click(getDayButton(dialog, new Date(2026, 8, 10)));
      await user.click(getDayButton(dialog, new Date(2026, 8, 12)));
      await user.keyboard("{Escape}");
      await waitForClose();
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("accepts custom button labels", async () => {
      const user = userEvent.setup();
      render(
        <DateRangePicker
          applyLabel="Filtrar"
          cancelLabel="Voltar"
          showActions
        />
      );

      const dialog = await openPicker(user);
      expect(
        within(dialog).getByRole("button", { name: "Filtrar" })
      ).toBeVisible();
      expect(
        within(dialog).getByRole("button", { name: "Voltar" })
      ).toBeVisible();
    });

    it("renders no footer without showActions", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);

      const dialog = await openPicker(user);
      expect(
        within(dialog).queryByRole("button", { name: "Aplicar" })
      ).not.toBeInTheDocument();
    });
  });

  describe("Bounds", () => {
    it("blocks days rejected by a disabledDates function", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      const isWeekend = (date: Date) =>
        date.getDay() === 0 || date.getDay() === 6;
      render(
        <DateRangePicker
          disabledDates={isWeekend}
          onChange={handleChange}
          today={TODAY}
        />
      );

      const dialog = await openPicker(user);
      // 13/09/2026 is a Sunday.
      const sunday = getDayButton(dialog, new Date(2026, 8, 13));
      expect(sunday).toBeDisabled();
      await user.click(getDayButton(dialog, new Date(2026, 8, 10)));
      await user.click(sunday);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("respects startMonth and endMonth", async () => {
      const user = userEvent.setup();
      render(
        <DateRangePicker
          endMonth={new Date(2026, 9, 1)}
          startMonth={new Date(2026, 8, 1)}
          today={TODAY}
        />
      );

      const dialog = await openPicker(user);
      const previous = within(dialog).getByRole("button", {
        name: "Ir para o mês anterior",
      });
      const next = within(dialog).getByRole("button", {
        name: "Ir para o próximo mês",
      });
      expect(previous).toHaveAttribute("aria-disabled", "true");
      expect(next).toHaveAttribute("aria-disabled", "true");
    });
  });
});
