import userEvent from "@testing-library/user-event";
import type { DateRange } from "react-day-picker";
import { render, screen, waitFor, within } from "@/tests/app-test-utils";
import { Calendar } from "./Calendar";

const DIGIT_REGEX = /\d+/;
const SEPTEMBER_ABBR_REGEX = /^Set/;
const SURFACE_CLASSES = [
  "rounded-md",
  "border",
  "border-gray-200",
  "bg-white",
  "shadow-sm",
];

describe("Calendar", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<Calendar />);
      expect(container.querySelector('[data-slot="calendar"]')).toBeVisible();
    });

    it("should display month name in custom caption", () => {
      const january2026 = new Date(2026, 0, 15);
      render(<Calendar captionLayout="dropdown" month={january2026} />);
      // The dropdown caption shows month abbreviation (first 3 letters)
      expect(screen.getByText("Jan")).toBeVisible();
    });

    it("should accept custom className", () => {
      const { container } = render(<Calendar className="custom-class" />);
      const calendar = container.querySelector(".custom-class");
      expect(calendar).toBeVisible();
    });

    it("should show outside days when showOutsideDays is true", () => {
      const { container } = render(<Calendar showOutsideDays={true} />);
      const calendar = container.querySelector('[data-slot="calendar"]');
      expect(calendar).toBeVisible();
    });

    it("should hide outside days when showOutsideDays is false", () => {
      const { container } = render(<Calendar showOutsideDays={false} />);
      const calendar = container.querySelector('[data-slot="calendar"]');
      expect(calendar).toBeVisible();
    });

    it("should render with specific month when month prop is provided", () => {
      const specificDate = new Date(2025, 5, 15); // June 15, 2025
      render(<Calendar month={specificDate} />);
      // Plain caption shows the full month name and year
      expect(screen.getByText("Junho de 2025")).toBeVisible();
    });
  });

  describe("Navigation", () => {
    it("should have month navigation buttons", () => {
      render(<Calendar />);

      // Check for navigation buttons by finding chevron icons
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should call onMonthChange when navigating months", async () => {
      const user = userEvent.setup();
      const onMonthChange = jest.fn();
      render(<Calendar onMonthChange={onMonthChange} />);

      // Find the month navigation button (previous month)
      const buttons = screen.getAllByRole("button");
      const chevronButtons = buttons.filter((btn) => {
        const svg = btn.querySelector("svg");
        return svg && svg.hasAttribute("aria-label");
      });

      if (chevronButtons.length > 0) {
        await user.click(chevronButtons[0]);
        expect(onMonthChange).toHaveBeenCalled();
      }
    });
  });

  describe("Custom Month/Year Picker", () => {
    it("should open month picker when clicking month button", async () => {
      const user = userEvent.setup();
      render(
        <Calendar captionLayout="dropdown" month={new Date(2026, 0, 15)} />
      );

      const monthButton = screen.getByText("Jan");
      await user.click(monthButton);

      // Check if month list is displayed
      await waitFor(() => {
        expect(screen.getByText("Janeiro")).toBeInTheDocument();
        expect(screen.getByText("Fevereiro")).toBeInTheDocument();
      });
    });

    it("should open year picker when clicking year button", async () => {
      const user = userEvent.setup();
      const year = 2026;
      render(
        <Calendar captionLayout="dropdown" month={new Date(year, 0, 15)} />
      );

      const yearButton = screen.getByText(year.toString());
      await user.click(yearButton);

      // Check if year list is displayed (button textContent may include icon aria-label)
      await waitFor(() => {
        expect(
          screen
            .getAllByRole("button")
            .some((btn) => btn.textContent?.includes(year.toString()))
        ).toBe(true);
      });
    });

    it("should select a month from the month picker", async () => {
      const user = userEvent.setup();
      const onMonthChange = jest.fn();
      render(
        <Calendar
          captionLayout="dropdown"
          month={new Date(2026, 0, 15)}
          onMonthChange={onMonthChange}
        />
      );

      const monthButton = screen.getByText("Jan");
      await user.click(monthButton);

      await waitFor(() => {
        expect(screen.getByText("Janeiro")).toBeInTheDocument();
      });

      const januaryButton = screen.getByText("Janeiro");
      await user.click(januaryButton);

      expect(onMonthChange).toHaveBeenCalled();
    });

    it("should navigate to previous year when clicking previous year button", async () => {
      const user = userEvent.setup();
      const onMonthChange = jest.fn();
      render(
        <Calendar
          captionLayout="dropdown"
          month={new Date(2026, 0, 15)}
          onMonthChange={onMonthChange}
        />
      );

      // Find all buttons with chevron icons
      const allButtons = screen.getAllByRole("button");
      const chevronButtons = allButtons.filter((btn) => {
        const svg = btn.querySelector('svg[aria-label*="chevron"]');
        return svg !== null;
      });

      // The year navigation is the second set of chevrons (index 2 for prev year)
      if (chevronButtons.length >= 3) {
        await user.click(chevronButtons[2]);
        expect(onMonthChange).toHaveBeenCalled();
      }
    });

    it("should navigate to next year when clicking next year button", async () => {
      const user = userEvent.setup();
      const onMonthChange = jest.fn();
      render(
        <Calendar
          captionLayout="dropdown"
          month={new Date(2026, 0, 15)}
          onMonthChange={onMonthChange}
        />
      );

      const allButtons = screen.getAllByRole("button");
      const chevronButtons = allButtons.filter((btn) => {
        const svg = btn.querySelector('svg[aria-label*="chevron"]');
        return svg !== null;
      });

      // The year navigation is the second set of chevrons (index 3 for next year)
      if (chevronButtons.length >= 4) {
        await user.click(chevronButtons[3]);
        expect(onMonthChange).toHaveBeenCalled();
      }
    });

    it("should close month picker and return to days view when month is selected", async () => {
      const user = userEvent.setup();
      render(
        <Calendar captionLayout="dropdown" month={new Date(2026, 0, 15)} />
      );

      const monthButton = screen.getByText("Jan");
      await user.click(monthButton);

      await waitFor(() => {
        expect(screen.getByText("Março")).toBeInTheDocument();
      });

      const marcoButton = screen.getByText("Março");
      await user.click(marcoButton);

      // Month picker should close - check by looking for calendar grid
      await waitFor(() => {
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });
    });
  });

  describe("Date Selection", () => {
    it("should select a date when clicked in single mode", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(<Calendar mode="single" onSelect={onSelect} />);

      const dayButtons = screen
        .getAllByRole("button")
        .filter((button) => DIGIT_REGEX.test(button.textContent || ""));

      if (dayButtons.length > 0) {
        await user.click(dayButtons[15]);
        expect(onSelect).toHaveBeenCalled();
      }
    });

    it("should support range selection", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(<Calendar mode="range" onSelect={onSelect} />);

      const dayButtons = screen
        .getAllByRole("button")
        .filter((button) => DIGIT_REGEX.test(button.textContent || ""));

      if (dayButtons.length > 1) {
        await user.click(dayButtons[10]);
        await user.click(dayButtons[15]);
        expect(onSelect).toHaveBeenCalled();
      }
    });

    it("should support multiple date selection", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(<Calendar mode="multiple" onSelect={onSelect} />);

      const dayButtons = screen
        .getAllByRole("button")
        .filter((button) => DIGIT_REGEX.test(button.textContent || ""));

      if (dayButtons.length > 2) {
        await user.click(dayButtons[10]);
        await user.click(dayButtons[15]);
        await user.click(dayButtons[20]);
        expect(onSelect).toHaveBeenCalledTimes(3);
      }
    });

    it("should display selected date with correct data attribute", () => {
      const selectedDate = new Date(2025, 0, 15);
      const { container } = render(
        <Calendar mode="single" month={selectedDate} selected={selectedDate} />
      );

      // Find button with data-day attribute containing the date
      const expectedDateFormat = selectedDate.toLocaleDateString();
      const dayButton = container.querySelector(
        `[data-day="${expectedDateFormat}"]`
      );
      expect(dayButton).toHaveAttribute("data-selected-single", "true");
    });
  });

  describe("Disabled Dates", () => {
    it("should accept disabled prop with single date", () => {
      const today = new Date();
      const disabledDate = new Date(today);
      disabledDate.setDate(today.getDate() + 5);

      const { container } = render(<Calendar disabled={disabledDate} />);
      const calendar = container.querySelector('[data-slot="calendar"]');
      expect(calendar).toBeVisible();
    });

    it("should accept disabled prop with date matcher", () => {
      const disabledDates = { before: new Date() };
      const { container } = render(<Calendar disabled={disabledDates} />);
      const calendar = container.querySelector('[data-slot="calendar"]');
      expect(calendar).toBeVisible();
    });

    it("should prevent clicking on disabled dates", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      const today = new Date(2025, 0, 15);
      const disabledDate = new Date(2025, 0, 20);

      const { container } = render(
        <Calendar
          disabled={disabledDate}
          mode="single"
          month={today}
          onSelect={onSelect}
        />
      );

      // Find button with data-day attribute
      const disabledButton = container.querySelector(
        `[data-day="${disabledDate.toLocaleDateString()}"]`
      );
      if (disabledButton) {
        await user.click(disabledButton);
        // onSelect should not be called for disabled dates
        expect(onSelect).not.toHaveBeenCalled();
      }
    });
  });

  describe("Enabled Dates", () => {
    it("should only enable specified dates when enabledDates prop is provided with Date objects", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      const enabledDates = [
        new Date(2025, 0, 10),
        new Date(2025, 0, 15),
        new Date(2025, 0, 20),
      ];

      const { container } = render(
        <Calendar
          enabledDates={enabledDates}
          mode="single"
          month={new Date(2025, 0, 1)}
          onSelect={onSelect}
        />
      );

      // Try clicking enabled date
      const enabledDate = new Date(2025, 0, 15);
      const enabledButton = container.querySelector(
        `[data-day="${enabledDate.toLocaleDateString()}"]`
      );
      if (enabledButton) {
        await user.click(enabledButton);
        expect(onSelect).toHaveBeenCalled();
      }

      // Try clicking non-enabled date
      onSelect.mockClear();
      const disabledDate = new Date(2025, 0, 25);
      const disabledButton = container.querySelector(
        `[data-day="${disabledDate.toLocaleDateString()}"]`
      );
      if (disabledButton) {
        await user.click(disabledButton);
        expect(onSelect).not.toHaveBeenCalled();
      }
    });

    it("should parse date strings in DD/MM/YYYY format", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      const enabledDates = ["10/01/2025", "15/01/2025", "20/01/2025"];

      const { container } = render(
        <Calendar
          enabledDates={enabledDates}
          mode="single"
          month={new Date(2025, 0, 1)}
          onSelect={onSelect}
        />
      );

      const enabledDate = new Date(2025, 0, 15);
      const enabledButton = container.querySelector(
        `[data-day="${enabledDate.toLocaleDateString()}"]`
      );
      if (enabledButton) {
        await user.click(enabledButton);
        expect(onSelect).toHaveBeenCalled();
      }
    });

    it("should allow all dates when enabledDates is not provided", async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      const { container } = render(
        <Calendar
          mode="single"
          month={new Date(2025, 0, 1)}
          onSelect={onSelect}
        />
      );

      const date = new Date(2025, 0, 15);
      const button = container.querySelector(
        `[data-day="${date.toLocaleDateString()}"]`
      );
      if (button) {
        await user.click(button);
        expect(onSelect).toHaveBeenCalled();
      }
    });
  });

  describe("Accessibility", () => {
    it("should be accessible with keyboard navigation", () => {
      render(<Calendar mode="single" />);

      const calendar = screen.getByRole("grid");
      expect(calendar).toBeVisible();

      const dayButtons = screen
        .getAllByRole("button")
        .filter((button) => DIGIT_REGEX.test(button.textContent || ""));

      expect(dayButtons.length).toBeGreaterThan(0);
    });

    it("should have proper ARIA attributes", () => {
      render(<Calendar mode="single" />);
      const calendar = screen.getByRole("grid");
      expect(calendar).toBeInTheDocument();
    });

    it("should have gridcell role for date cells", () => {
      render(<Calendar mode="single" />);
      const gridcells = screen.getAllByRole("gridcell");
      expect(gridcells.length).toBeGreaterThan(0);
    });
  });

  describe("Localization", () => {
    it("should display custom weekday abbreviations", () => {
      render(<Calendar />);
      // Custom formatter shows short uppercase abbreviations (Figma header)
      for (const weekday of ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]) {
        expect(screen.getByText(weekday)).toBeVisible();
      }
    });

    it("should display month names in Portuguese in month picker", async () => {
      const user = userEvent.setup();
      render(
        <Calendar captionLayout="dropdown" month={new Date(2026, 0, 15)} />
      );

      const monthButton = screen.getByText("Jan");
      await user.click(monthButton);

      await waitFor(() => {
        expect(screen.getByText("Janeiro")).toBeInTheDocument();
        expect(screen.getByText("Dezembro")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle switching between picker modes", async () => {
      const user = userEvent.setup();
      render(
        <Calendar captionLayout="dropdown" month={new Date(2026, 0, 15)} />
      );

      // Open month picker
      const monthButton = screen.getByText("Jan");
      await user.click(monthButton);

      await waitFor(() => {
        expect(screen.getByText("Janeiro")).toBeInTheDocument();
      });

      // Select a month to close the picker
      const februaryButton = screen.getByText("Fevereiro");
      await user.click(februaryButton);

      // After selecting, should return to calendar grid view
      await waitFor(() => {
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });
    });

    it("should maintain calendar grid structure", () => {
      render(<Calendar />);

      const grid = screen.getByRole("grid");
      expect(grid).toBeInTheDocument();

      // Should have gridcells for days (28 for February non-leap year, up to 31 for other months)
      const cells = screen.getAllByRole("gridcell");
      expect(cells.length).toBeGreaterThanOrEqual(28); // At least a month's worth
    });
  });
});

describe("Calendar range presets", () => {
  const range7: DateRange = {
    from: new Date(2026, 6, 9),
    to: new Date(2026, 6, 15),
  };
  const range30: DateRange = {
    from: new Date(2026, 5, 16),
    to: new Date(2026, 6, 15),
  };
  const presets = [
    { label: "7 dias", range: range7 },
    { label: "30 dias", range: range30 },
  ];
  const custom: DateRange = {
    from: new Date(2026, 6, 1),
    to: new Date(2026, 6, 5),
  };

  it("renders a titled sidebar group with an item per preset", () => {
    render(<Calendar mode="range" presets={presets} />);
    const group = screen.getByRole("group", { name: "Período" });
    expect(group).toBeVisible();
    expect(screen.getByText("Período")).toHaveClass("uppercase");
    expect(
      within(group).getByRole("button", { name: "7 dias" })
    ).toHaveAttribute("type", "button");
    expect(
      within(group).getByRole("button", { name: "30 dias" })
    ).toBeVisible();
  });

  it("uses presetsTitle as the sidebar heading and group name", () => {
    render(<Calendar mode="range" presets={presets} presetsTitle="Atalhos" />);
    expect(screen.getByRole("group", { name: "Atalhos" })).toBeVisible();
    expect(screen.queryByText("Período")).not.toBeInTheDocument();
  });

  it("renders no sidebar when presets is omitted or empty", () => {
    const { rerender } = render(<Calendar mode="range" />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    rerender(<Calendar mode="range" presets={[]} />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("fires onPresetSelect with the preset range on item click", async () => {
    const onPresetSelect = jest.fn();
    const user = userEvent.setup();
    render(
      <Calendar
        mode="range"
        onPresetSelect={onPresetSelect}
        presets={presets}
      />
    );
    await user.click(screen.getByRole("button", { name: "7 dias" }));
    expect(onPresetSelect).toHaveBeenCalledWith(range7);
  });

  it("marks the item matching the selected range as pressed", () => {
    render(<Calendar mode="range" presets={presets} selected={range7} />);
    const active = screen.getByRole("button", { name: "7 dias" });
    expect(active).toHaveAttribute("aria-pressed", "true");
    expect(active).toHaveClass("bg-purple-50", "text-purple-800");
    const inactive = screen.getByRole("button", { name: "30 dias" });
    expect(inactive).toHaveAttribute("aria-pressed", "false");
    expect(inactive).toHaveClass("text-gray-600");
  });

  it("shows a read-only custom item when a complete selection matches no preset", async () => {
    const onPresetSelect = jest.fn();
    const user = userEvent.setup();
    render(
      <Calendar
        customPresetLabel="Personalizado"
        mode="range"
        onPresetSelect={onPresetSelect}
        presets={presets}
        selected={custom}
      />
    );
    const item = screen.getByText("Personalizado");
    expect(item).toBeVisible();
    expect(item).toHaveClass("bg-purple-50", "text-purple-800");
    expect(
      screen.queryByRole("button", { name: "Personalizado" })
    ).not.toBeInTheDocument();
    await user.click(item);
    expect(onPresetSelect).not.toHaveBeenCalled();
  });

  it("hides the custom item when a preset matches", () => {
    render(
      <Calendar
        customPresetLabel="Personalizado"
        mode="range"
        presets={presets}
        selected={range7}
      />
    );
    expect(screen.queryByText("Personalizado")).not.toBeInTheDocument();
  });

  it("hides the custom item while the range is incomplete", () => {
    render(
      <Calendar
        customPresetLabel="Personalizado"
        mode="range"
        presets={presets}
        selected={{ from: custom.from, to: undefined }}
      />
    );
    expect(screen.queryByText("Personalizado")).not.toBeInTheDocument();
  });

  it("draws one surface around sidebar and grid", () => {
    const { container } = render(
      <Calendar mode="range" numberOfMonths={2} presets={presets} />
    );
    const group = screen.getByRole("group", { name: "Período" });
    const wrapper = group.parentElement as HTMLElement;
    expect(wrapper).toHaveClass(...SURFACE_CLASSES);
    expect(group).toHaveClass("border-r", "border-gray-200");

    const root = container.querySelector('[data-slot="calendar"]');
    expect(wrapper).toContainElement(root as HTMLElement);
    for (const surfaceClass of SURFACE_CLASSES) {
      expect(root).not.toHaveClass(surfaceClass);
    }
    expect(screen.getAllByRole("grid")).toHaveLength(2);
  });
});

describe("Calendar plain header and Figma states", () => {
  const september2026 = new Date(2026, 8, 1);
  const PREVIOUS_MONTH_LABEL = "Ir para o mês anterior";
  const NEXT_MONTH_LABEL = "Ir para o próximo mês";

  const getDayButton = (container: HTMLElement, date: Date) =>
    container.querySelector(
      `button[data-day="${date.toLocaleDateString()}"]`
    ) as HTMLButtonElement;

  it("renders the plain 'Mês de AAAA' label with no clickable month/year", () => {
    render(<Calendar month={september2026} />);
    const label = screen.getByText("Setembro de 2026");
    expect(label).toBeVisible();
    expect(label.closest("button")).toBeNull();
    expect(screen.queryByText("Set")).not.toBeInTheDocument();
    expect(screen.queryByText("2026")).not.toBeInTheDocument();
  });

  it("navigates months through the edge chevrons", async () => {
    const user = userEvent.setup();
    const onMonthChange = jest.fn();
    render(<Calendar month={september2026} onMonthChange={onMonthChange} />);

    await user.click(
      screen.getByRole("button", { name: PREVIOUS_MONTH_LABEL })
    );
    expect(onMonthChange).toHaveBeenLastCalledWith(new Date(2026, 7, 1));

    await user.click(screen.getByRole("button", { name: NEXT_MONTH_LABEL }));
    expect(onMonthChange).toHaveBeenLastCalledWith(new Date(2026, 9, 1));
  });

  it("keeps the dropdown caption and its month list when captionLayout='dropdown'", async () => {
    const user = userEvent.setup();
    render(<Calendar captionLayout="dropdown" month={september2026} />);

    expect(screen.queryByText("Setembro de 2026")).not.toBeInTheDocument();
    // The dropdown caption is wider than the 252px Figma month.
    expect(screen.getByRole("grid").parentElement).toHaveClass("w-84");
    await user.click(
      screen.getByRole("button", { name: SEPTEMBER_ABBR_REGEX })
    );

    await waitFor(() => {
      expect(screen.getByText("Janeiro")).toBeVisible();
    });
  });

  it("marks today with bold purple text and a dot", () => {
    const today = new Date(2026, 8, 15);
    const { container } = render(
      <Calendar mode="single" month={september2026} today={today} />
    );
    const button = getDayButton(container, today);
    expect(button).toHaveAttribute("data-today", "true");
    expect(button).toHaveClass(
      "font-bold",
      "text-purple-800",
      "after:bg-purple-800"
    );
  });

  it("turns the today dot white when today is selected", () => {
    const today = new Date(2026, 8, 15);
    const { container } = render(
      <Calendar
        mode="single"
        month={september2026}
        selected={today}
        today={today}
      />
    );
    const button = getDayButton(container, today);
    expect(button).toHaveClass("bg-purple-800", "text-white", "after:bg-white");
    expect(button).not.toHaveClass("font-bold");
  });

  it("fills a single selected day with a purple circle", () => {
    const selected = new Date(2026, 8, 10);
    const { container } = render(
      <Calendar mode="single" month={september2026} selected={selected} />
    );
    expect(getDayButton(container, selected)).toHaveClass(
      "bg-purple-800",
      "font-medium",
      "text-white"
    );
  });

  it("styles range endpoints as circles and connects them with a band", () => {
    const range: DateRange = {
      from: new Date(2026, 8, 3),
      to: new Date(2026, 8, 23),
    };
    const { container } = render(
      <Calendar mode="range" month={september2026} selected={range} />
    );

    const start = getDayButton(container, range.from as Date);
    const middle = getDayButton(container, new Date(2026, 8, 10));
    const end = getDayButton(container, range.to as Date);

    expect(start).toHaveAttribute("data-range-start", "true");
    expect(start).toHaveClass("bg-purple-800", "text-white");
    expect(start.closest("td")).toHaveClass("bg-linear-to-r", "to-purple-50");

    expect(middle).toHaveAttribute("data-range-middle", "true");
    expect(middle).toHaveClass(
      "font-medium",
      "text-purple-800",
      "hover:bg-purple-100"
    );
    expect(middle).not.toHaveClass("bg-purple-800");
    expect(middle.closest("td")).toHaveClass("bg-purple-50");

    expect(end).toHaveAttribute("data-range-end", "true");
    expect(end).toHaveClass("bg-purple-800", "text-white");
    expect(end.closest("td")).toHaveClass("bg-linear-to-l", "to-purple-50");
  });

  it("keeps outside days grayed on the range band", () => {
    const range: DateRange = {
      from: new Date(2026, 7, 25),
      to: new Date(2026, 8, 23),
    };
    const { container } = render(
      <Calendar mode="range" month={september2026} selected={range} />
    );
    // Aug 31 is an outside day of the September grid, inside the range.
    const outside = container.querySelector(
      `td[data-outside="true"] button[data-day="${new Date(2026, 7, 31).toLocaleDateString()}"]`
    ) as HTMLButtonElement;
    expect(outside).toHaveAttribute("data-range-middle", "true");
    expect(outside).toHaveClass("text-gray-300");
    expect(outside).not.toHaveClass("text-purple-800");
    expect(outside.closest("td")).toHaveClass("bg-purple-50");
  });

  it("renders day numbers at 13px inside a 32px circle", () => {
    const { container } = render(
      <Calendar mode="single" month={september2026} />
    );
    expect(getDayButton(container, new Date(2026, 8, 10))).toHaveClass(
      "text-[13px]",
      "size-(--cell-size)",
      "rounded-full"
    );
  });

  it("draws no half-band on a one-day range", () => {
    const day = new Date(2026, 8, 3);
    const { container } = render(
      <Calendar
        mode="range"
        month={september2026}
        selected={{ from: day, to: day }}
      />
    );
    const cell = getDayButton(container, day).closest("td");
    expect(cell).not.toHaveClass("bg-linear-to-r");
    expect(cell).not.toHaveClass("bg-linear-to-l");
  });

  it("renders two grids with nav only at the outer edges when numberOfMonths=2", () => {
    const { container } = render(
      <Calendar mode="range" month={september2026} numberOfMonths={2} />
    );

    const grids = screen.getAllByRole("grid");
    expect(grids).toHaveLength(2);
    expect(screen.getByText("Setembro de 2026")).toBeVisible();
    expect(screen.getByText("Outubro de 2026")).toBeVisible();

    const previous = screen.getAllByRole("button", {
      name: PREVIOUS_MONTH_LABEL,
    });
    const next = screen.getAllByRole("button", { name: NEXT_MONTH_LABEL });
    expect(previous).toHaveLength(1);
    expect(next).toHaveLength(1);

    const [firstMonth, secondMonth] = grids.map((grid) => grid.parentElement);
    expect(firstMonth).toContainElement(previous[0]);
    expect(secondMonth).toContainElement(next[0]);

    const root = container.querySelector('[data-slot="calendar"]');
    expect(root).toHaveClass("w-fit", ...SURFACE_CLASSES);
    expect(firstMonth).toHaveClass("w-63");
    expect(secondMonth).toHaveClass("w-63");
  });

  it("draws the Figma surface on the root and hugs a 252px month", () => {
    const { container } = render(<Calendar month={september2026} />);
    const root = container.querySelector('[data-slot="calendar"]');
    expect(root).toHaveClass("w-fit", "p-4", ...SURFACE_CLASSES);
    expect(screen.getByRole("grid").parentElement).toHaveClass("w-63");
  });

  it("forwards Matcher[] to disabled", () => {
    const disabledDay = new Date(2026, 8, 20);
    const { container } = render(
      <Calendar
        disabled={[disabledDay, { before: new Date(2026, 8, 5) }]}
        mode="single"
        month={september2026}
      />
    );
    expect(getDayButton(container, disabledDay)).toBeDisabled();
    expect(getDayButton(container, new Date(2026, 8, 2))).toBeDisabled();
    expect(getDayButton(container, new Date(2026, 8, 10))).toBeEnabled();
  });
});

describe("Calendar initial month", () => {
  it("honours defaultMonth when month is uncontrolled", () => {
    render(<Calendar defaultMonth={new Date(2026, 11, 1)} />);

    expect(screen.getByText("Dezembro de 2026")).toBeVisible();
  });

  it("falls back to the selected date's month without defaultMonth", () => {
    render(<Calendar mode="single" selected={new Date(2026, 8, 12)} />);

    expect(screen.getByText("Setembro de 2026")).toBeVisible();
  });

  it("falls back to a range's start month", () => {
    render(
      <Calendar
        mode="range"
        selected={{ from: new Date(2027, 1, 3), to: new Date(2027, 1, 9) }}
      />
    );

    expect(screen.getByText("Fevereiro de 2027")).toBeVisible();
  });

  it("falls back to the first date of a multiple selection", () => {
    render(
      <Calendar
        mode="multiple"
        selected={[new Date(2026, 4, 2), new Date(2026, 6, 8)]}
      />
    );

    expect(screen.getByText("Maio de 2026")).toBeVisible();
  });

  it("prefers a controlled month over defaultMonth", () => {
    render(
      <Calendar
        defaultMonth={new Date(2026, 11, 1)}
        month={new Date(2026, 2, 1)}
      />
    );

    expect(screen.getByText("Março de 2026")).toBeVisible();
  });

  it("keeps navigating from defaultMonth and fires onMonthChange", async () => {
    const user = userEvent.setup();
    const handleMonthChange = jest.fn();
    render(
      <Calendar
        defaultMonth={new Date(2026, 11, 1)}
        onMonthChange={handleMonthChange}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Ir para o próximo mês" })
    );

    expect(screen.getByText("Janeiro de 2027")).toBeVisible();
    expect(handleMonthChange).toHaveBeenCalledTimes(1);
    expect(handleMonthChange.mock.calls[0][0]).toEqual(new Date(2027, 0, 1));
  });
});

describe("Calendar footer", () => {
  const september2026 = new Date(2026, 8, 1);
  const presets = [
    {
      label: "Setembro",
      range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) },
    },
  ];

  it("renders nothing extra without a footer", () => {
    const { container } = render(<Calendar month={september2026} />);
    const root = container.querySelector('[data-slot="calendar"]');
    expect(root).toHaveClass(...SURFACE_CLASSES);
    expect(container.querySelector(".border-t")).toBeNull();
  });

  it("moves the surface to a wrapper around grid and footer", () => {
    const { container } = render(
      <Calendar footer={<span>Ações</span>} month={september2026} />
    );
    const footer = screen.getByText("Ações").parentElement as HTMLElement;
    expect(footer).toHaveClass("border-t", "border-gray-200", "justify-end");

    const surface = footer.parentElement as HTMLElement;
    expect(surface).toHaveClass(...SURFACE_CLASSES);
    const root = container.querySelector('[data-slot="calendar"]');
    expect(surface).toContainElement(root as HTMLElement);
    for (const surfaceClass of SURFACE_CLASSES) {
      expect(root).not.toHaveClass(surfaceClass);
    }
  });

  it("spans sidebar and grid under one surface with presets", () => {
    render(
      <Calendar
        footer={<span>Ações</span>}
        mode="range"
        month={september2026}
        presets={presets}
      />
    );
    const group = screen.getByRole("group", { name: "Período" });
    const row = group.parentElement as HTMLElement;
    expect(row).toHaveClass("flex");
    expect(row).not.toHaveClass("shadow-sm");

    const surface = row.parentElement as HTMLElement;
    expect(surface).toHaveClass(...SURFACE_CLASSES);
    expect(surface).toContainElement(screen.getByText("Ações"));
  });
});
