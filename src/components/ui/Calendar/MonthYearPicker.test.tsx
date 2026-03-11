import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/app-test-utils";
import { MonthYearPicker } from "./MonthYearPicker";

// Top-level regex constants
const MARCO_2026_RE = /março.*2026/i;
const JANEIRO_2025_RE = /janeiro.*2025/i;
const DEZEMBRO_2024_RE = /dezembro.*2024/i;
const JANEIRO_2026_RE = /janeiro.*2026/i;
const JUNHO_2025_RE = /junho.*2025/i;
const JANEIRO_2024_RE = /janeiro.*2024/i;
const JAN_RE = /^jan$/i;
const DEZ_RE = /^dez$/i;
const JUN_RE = /^jun$/i;
const FEV_RE = /^fev$/i;
const MAR_RE = /^mar$/i;
const ANO_ANTERIOR_RE = /ano anterior/i;
const PROXIMO_ANO_RE = /próximo ano/i;

describe("MonthYearPicker", () => {
  describe("rendering", () => {
    it("renders the month name and year in the trigger button", () => {
      render(<MonthYearPicker month={3} onChange={jest.fn()} year={2026} />);
      expect(
        screen.getByRole("button", { name: MARCO_2026_RE })
      ).toBeInTheDocument();
    });

    it("renders the month name for January (month 1)", () => {
      render(<MonthYearPicker month={1} onChange={jest.fn()} year={2025} />);
      expect(
        screen.getByRole("button", { name: JANEIRO_2025_RE })
      ).toBeInTheDocument();
    });

    it("renders the month name for December (month 12)", () => {
      render(<MonthYearPicker month={12} onChange={jest.fn()} year={2024} />);
      expect(
        screen.getByRole("button", { name: DEZEMBRO_2024_RE })
      ).toBeInTheDocument();
    });
  });

  describe("popover open/close", () => {
    it("opens the popover when the trigger button is clicked", async () => {
      const user = userEvent.setup();
      render(<MonthYearPicker month={3} onChange={jest.fn()} year={2026} />);

      const trigger = screen.getByRole("button", { name: MARCO_2026_RE });
      await user.click(trigger);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: JAN_RE })
        ).toBeInTheDocument();
      });
    });

    it("renders all 12 short month labels in the popover grid", async () => {
      const user = userEvent.setup();
      render(<MonthYearPicker month={1} onChange={jest.fn()} year={2026} />);

      await user.click(screen.getByRole("button", { name: JANEIRO_2026_RE }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: JAN_RE })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: DEZ_RE })
        ).toBeInTheDocument();
      });
    });

    it("shows the current display year inside the popover", async () => {
      const user = userEvent.setup();
      render(<MonthYearPicker month={6} onChange={jest.fn()} year={2025} />);

      await user.click(screen.getByRole("button", { name: JUNHO_2025_RE }));

      await waitFor(() => {
        expect(screen.getByText("2025")).toBeInTheDocument();
      });
    });
  });

  describe("month selection", () => {
    it("calls onChange with the selected month and current display year", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<MonthYearPicker month={3} onChange={onChange} year={2026} />);

      await user.click(screen.getByRole("button", { name: MARCO_2026_RE }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: JAN_RE })
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: JAN_RE }));

      expect(onChange).toHaveBeenCalledWith(1, 2026);
    });

    it("calls onChange with the correct month number for June (index 5)", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <MonthYearPicker
          maxMonth={12}
          maxYear={2026}
          month={1}
          onChange={onChange}
          year={2026}
        />
      );

      await user.click(screen.getByRole("button", { name: JANEIRO_2026_RE }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: JUN_RE })
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: JUN_RE }));

      expect(onChange).toHaveBeenCalledWith(6, 2026);
    });

    it("closes the popover after a month is selected", async () => {
      const user = userEvent.setup();
      render(<MonthYearPicker month={3} onChange={jest.fn()} year={2026} />);

      await user.click(screen.getByRole("button", { name: MARCO_2026_RE }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: FEV_RE })
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: FEV_RE }));

      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: FEV_RE })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("year navigation", () => {
    it("renders year navigation buttons inside the popover", async () => {
      const user = userEvent.setup();
      render(<MonthYearPicker month={3} onChange={jest.fn()} year={2026} />);

      await user.click(screen.getByRole("button", { name: MARCO_2026_RE }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: ANO_ANTERIOR_RE })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: PROXIMO_ANO_RE })
        ).toBeInTheDocument();
      });
    });

    it('navigates to the previous year when "Ano anterior" is clicked', async () => {
      const user = userEvent.setup();
      render(<MonthYearPicker month={3} onChange={jest.fn()} year={2026} />);

      await user.click(screen.getByRole("button", { name: MARCO_2026_RE }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: ANO_ANTERIOR_RE })
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: ANO_ANTERIOR_RE }));

      expect(screen.getByText("2025")).toBeInTheDocument();
    });

    it('disables the "Ano anterior" button when displayYear equals minYear', async () => {
      const user = userEvent.setup();
      render(
        <MonthYearPicker
          minYear={2024}
          month={1}
          onChange={jest.fn()}
          year={2024}
        />
      );

      await user.click(screen.getByRole("button", { name: JANEIRO_2024_RE }));

      await waitFor(() => {
        const prevBtn = screen.getByRole("button", { name: ANO_ANTERIOR_RE });
        expect(prevBtn).toBeDisabled();
      });
    });
  });

  describe("selected month highlight", () => {
    it("marks the currently selected month in the grid", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MonthYearPicker month={3} onChange={jest.fn()} year={2026} />
      );

      await user.click(screen.getByRole("button", { name: MARCO_2026_RE }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: MAR_RE })
        ).toBeInTheDocument();
      });

      const marBtn = screen.getByRole("button", { name: MAR_RE });
      expect(marBtn.className).toContain("bg-purple-100");

      expect(container).toBeTruthy();
    });
  });
});
