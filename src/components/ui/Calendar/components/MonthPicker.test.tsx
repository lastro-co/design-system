import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { MONTHS_PT_BR } from "../constants";
import { MonthPicker } from ".";

describe("MonthPicker", () => {
  const defaultProps = {
    onMonthSelect: jest.fn(),
    onYearChange: jest.fn(),
    selectedMonth: 0,
    selectedYear: 2026,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the selected year", () => {
      render(<MonthPicker {...defaultProps} />);
      expect(screen.getByText("2026")).toBeVisible();
    });

    it("renders all 12 month buttons", () => {
      render(<MonthPicker {...defaultProps} />);
      for (const month of MONTHS_PT_BR) {
        expect(screen.getByRole("button", { name: month })).toBeInTheDocument();
      }
    });

    it("renders previous year navigation button", () => {
      render(<MonthPicker {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      // First button is prev year chevron
      expect(buttons[0]).toBeInTheDocument();
    });

    it("renders next year navigation button", () => {
      render(<MonthPicker {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      // Last button is next year chevron
      expect(buttons.at(-1)).toBeInTheDocument();
    });
  });

  describe("Selected month highlighting", () => {
    it("applies selected styles to the currently selected month", () => {
      render(<MonthPicker {...defaultProps} selectedMonth={0} />);
      const janButton = screen.getByRole("button", { name: "Janeiro" });
      expect(janButton).toHaveClass("bg-purple-800", "text-white");
    });

    it("does not apply selected styles to unselected months", () => {
      render(<MonthPicker {...defaultProps} selectedMonth={0} />);
      const febButton = screen.getByRole("button", { name: "Fevereiro" });
      expect(febButton).not.toHaveClass("bg-purple-800");
      expect(febButton).toHaveClass("bg-gray-100");
    });

    it("highlights the correct month when selectedMonth changes", () => {
      render(<MonthPicker {...defaultProps} selectedMonth={6} />);
      const julyButton = screen.getByRole("button", { name: "Julho" });
      expect(julyButton).toHaveClass("bg-purple-800", "text-white");
    });
  });

  describe("Month selection interaction", () => {
    it("calls onMonthSelect with the correct index when a month is clicked", async () => {
      const user = userEvent.setup();
      const onMonthSelect = jest.fn();
      render(<MonthPicker {...defaultProps} onMonthSelect={onMonthSelect} />);

      await user.click(screen.getByRole("button", { name: "Março" }));
      expect(onMonthSelect).toHaveBeenCalledWith(2);
    });

    it("calls onMonthSelect with index 0 for Janeiro", async () => {
      const user = userEvent.setup();
      const onMonthSelect = jest.fn();
      render(<MonthPicker {...defaultProps} onMonthSelect={onMonthSelect} />);

      await user.click(screen.getByRole("button", { name: "Janeiro" }));
      expect(onMonthSelect).toHaveBeenCalledWith(0);
    });

    it("calls onMonthSelect with index 11 for Dezembro", async () => {
      const user = userEvent.setup();
      const onMonthSelect = jest.fn();
      render(<MonthPicker {...defaultProps} onMonthSelect={onMonthSelect} />);

      await user.click(screen.getByRole("button", { name: "Dezembro" }));
      expect(onMonthSelect).toHaveBeenCalledWith(11);
    });

    it("calls onMonthSelect with correct index for each month", async () => {
      const user = userEvent.setup();
      const onMonthSelect = jest.fn();
      render(<MonthPicker {...defaultProps} onMonthSelect={onMonthSelect} />);

      for (let i = 0; i < MONTHS_PT_BR.length; i++) {
        const monthName = MONTHS_PT_BR[i];
        await user.click(screen.getByRole("button", { name: monthName }));
        expect(onMonthSelect).toHaveBeenLastCalledWith(i);
      }
    });
  });

  describe("Year navigation interaction", () => {
    it("calls onYearChange with 'prev' when previous button is clicked", async () => {
      const user = userEvent.setup();
      const onYearChange = jest.fn();
      render(<MonthPicker {...defaultProps} onYearChange={onYearChange} />);

      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);
      expect(onYearChange).toHaveBeenCalledWith("prev");
    });

    it("calls onYearChange with 'next' when next button is clicked", async () => {
      const user = userEvent.setup();
      const onYearChange = jest.fn();
      render(<MonthPicker {...defaultProps} onYearChange={onYearChange} />);

      // The nav buttons are the first two: [0]=prev, [1]=next
      // Month buttons follow at indices 2..13
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[1]);
      expect(onYearChange).toHaveBeenCalledWith("next");
    });
  });

  describe("Different years", () => {
    it("displays the passed selectedYear", () => {
      render(<MonthPicker {...defaultProps} selectedYear={1999} />);
      expect(screen.getByText("1999")).toBeVisible();
    });

    it("updates displayed year when selectedYear prop changes", () => {
      const { rerender } = render(
        <MonthPicker {...defaultProps} selectedYear={2024} />
      );
      expect(screen.getByText("2024")).toBeVisible();

      rerender(<MonthPicker {...defaultProps} selectedYear={2025} />);
      expect(screen.getByText("2025")).toBeVisible();
    });
  });
});
