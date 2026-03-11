import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { YEAR_RANGE } from "../constants";
import { generateYearRange } from "../utils/date-utils";
import { YearPicker } from ".";

describe("YearPicker", () => {
  const defaultProps = {
    onNavigate: jest.fn(),
    onYearSelect: jest.fn(),
    selectedYear: 2026,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders a range of years centered on selectedYear", () => {
      render(<YearPicker {...defaultProps} selectedYear={2026} />);
      const years = generateYearRange(2026, YEAR_RANGE);
      // Spot-check a few years are visible
      expect(
        screen.getByRole("button", { name: String(years[0]) })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: String(years.at(-1)) })
      ).toBeInTheDocument();
    });

    it("renders a year range label showing first and last year", () => {
      render(<YearPicker {...defaultProps} selectedYear={2026} />);
      const years = generateYearRange(2026, YEAR_RANGE);
      const first = years[0];
      const last = years.at(-1);
      // The range span shows "YYYY - YYYY"
      expect(screen.getByText(`${first} - ${last}`)).toBeVisible();
    });

    it("renders previous range navigation button", () => {
      render(<YearPicker {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toBeInTheDocument();
    });

    it("renders next range navigation button", () => {
      render(<YearPicker {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.at(-1)).toBeInTheDocument();
    });
  });

  describe("Selected year highlighting", () => {
    it("applies selected styles to the currently selected year", () => {
      render(<YearPicker {...defaultProps} selectedYear={2026} />);
      const yearButton = screen.getByRole("button", { name: "2026" });
      expect(yearButton).toHaveClass("bg-purple-800", "text-white");
    });

    it("does not apply selected styles to non-selected years", () => {
      render(<YearPicker {...defaultProps} selectedYear={2026} />);
      const years = generateYearRange(2026, YEAR_RANGE);
      const otherYear = years.find((y) => y !== 2026) as number;
      const otherButton = screen.getByRole("button", {
        name: String(otherYear),
      });
      expect(otherButton).not.toHaveClass("bg-purple-800");
      expect(otherButton).toHaveClass("bg-gray-100");
    });
  });

  describe("Year selection interaction", () => {
    it("calls onYearSelect with the correct year when a year is clicked", async () => {
      const user = userEvent.setup();
      const onYearSelect = jest.fn();
      render(<YearPicker {...defaultProps} onYearSelect={onYearSelect} />);

      await user.click(screen.getByRole("button", { name: "2026" }));
      expect(onYearSelect).toHaveBeenCalledWith(2026);
    });

    it("calls onYearSelect with correct year for any visible year button", async () => {
      const user = userEvent.setup();
      const onYearSelect = jest.fn();
      render(
        <YearPicker
          {...defaultProps}
          onYearSelect={onYearSelect}
          selectedYear={2026}
        />
      );

      const years = generateYearRange(2026, YEAR_RANGE);
      const targetYear = years[0];
      await user.click(
        screen.getByRole("button", { name: String(targetYear) })
      );
      expect(onYearSelect).toHaveBeenCalledWith(targetYear);
    });
  });

  describe("Navigation interaction", () => {
    it("calls onNavigate with 'prev' when previous button is clicked", async () => {
      const user = userEvent.setup();
      const onNavigate = jest.fn();
      render(<YearPicker {...defaultProps} onNavigate={onNavigate} />);

      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);
      expect(onNavigate).toHaveBeenCalledWith("prev");
    });

    it("calls onNavigate with 'next' when next button is clicked", async () => {
      const user = userEvent.setup();
      const onNavigate = jest.fn();
      render(<YearPicker {...defaultProps} onNavigate={onNavigate} />);

      // The nav buttons are the first two: [0]=prev, [1]=next
      // Year buttons follow at indices 2..101 (for YEAR_RANGE=100)
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[1]);
      expect(onNavigate).toHaveBeenCalledWith("next");
    });
  });

  describe("Different selectedYear values", () => {
    it("renders year buttons centered on the selectedYear", () => {
      render(<YearPicker {...defaultProps} selectedYear={1990} />);
      const years = generateYearRange(1990, YEAR_RANGE);
      expect(
        screen.getByRole("button", { name: String(years[0]) })
      ).toBeInTheDocument();
    });

    it("highlights the correct year when selectedYear differs", () => {
      render(<YearPicker {...defaultProps} selectedYear={2000} />);
      const button = screen.getByRole("button", { name: "2000" });
      expect(button).toHaveClass("bg-purple-800");
    });
  });
});
