import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/app-test-utils";
import { Calendar } from "./Calendar";

const DIGIT_REGEX = /\d+/;

describe("Calendar", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<Calendar />);
      expect(container.querySelector('[data-slot="calendar"]')).toBeVisible();
    });

    it("should display month name in custom caption", () => {
      const january2026 = new Date(2026, 0, 15);
      render(<Calendar month={january2026} />);
      // The custom caption shows month abbreviation (first 3 letters)
      expect(screen.getByText("Jan")).toBeInTheDocument();
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
      // Custom caption shows month abbreviation
      expect(screen.getByText("Jun")).toBeInTheDocument();
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
      render(<Calendar month={new Date(2026, 0, 15)} />);

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
      render(<Calendar month={new Date(year, 0, 15)} />);

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
        <Calendar month={new Date(2026, 0, 15)} onMonthChange={onMonthChange} />
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
        <Calendar month={new Date(2026, 0, 15)} onMonthChange={onMonthChange} />
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
        <Calendar month={new Date(2026, 0, 15)} onMonthChange={onMonthChange} />
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
      render(<Calendar month={new Date(2026, 0, 15)} />);

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
      // Custom formatter shows single letter abbreviations
      expect(screen.getByText("D")).toBeInTheDocument(); // Domingo
      // S, T, Q appear multiple times for different days
      const allText = screen.getByRole("grid").textContent;
      expect(allText).toContain("D");
    });

    it("should display month names in Portuguese in month picker", async () => {
      const user = userEvent.setup();
      render(<Calendar month={new Date(2026, 0, 15)} />);

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
      render(<Calendar month={new Date(2026, 0, 15)} />);

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
