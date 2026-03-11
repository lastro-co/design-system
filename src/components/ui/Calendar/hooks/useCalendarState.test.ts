import { act } from "@testing-library/react";
import { renderHook } from "@/tests/app-test-utils";
import { useCalendarState } from ".";

describe("useCalendarState", () => {
  describe("Initial state", () => {
    it("initialises pickerView to 'days'", () => {
      const { result } = renderHook(() => useCalendarState());
      expect(result.current.pickerView).toBe("days");
    });

    it("initialises currentMonth to today when no initialMonth is given", () => {
      const before = new Date();
      const { result } = renderHook(() => useCalendarState());
      const after = new Date();

      const current = result.current.currentMonth;
      expect(current.getFullYear()).toBeGreaterThanOrEqual(
        before.getFullYear()
      );
      expect(current.getFullYear()).toBeLessThanOrEqual(after.getFullYear());
    });

    it("initialises currentMonth to the provided initialMonth", () => {
      const initialMonth = new Date(2024, 5, 1); // June 2024
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      expect(result.current.currentMonth.getFullYear()).toBe(2024);
      expect(result.current.currentMonth.getMonth()).toBe(5);
    });
  });

  describe("setPickerView", () => {
    it("changes pickerView to 'months'", () => {
      const { result } = renderHook(() => useCalendarState());

      act(() => {
        result.current.setPickerView("months");
      });

      expect(result.current.pickerView).toBe("months");
    });

    it("changes pickerView to 'years'", () => {
      const { result } = renderHook(() => useCalendarState());

      act(() => {
        result.current.setPickerView("years");
      });

      expect(result.current.pickerView).toBe("years");
    });

    it("changes pickerView back to 'days'", () => {
      const { result } = renderHook(() => useCalendarState());

      act(() => {
        result.current.setPickerView("months");
      });
      act(() => {
        result.current.setPickerView("days");
      });

      expect(result.current.pickerView).toBe("days");
    });
  });

  describe("setCurrentMonth", () => {
    it("updates the currentMonth directly", () => {
      const { result } = renderHook(() => useCalendarState());
      const newMonth = new Date(2030, 11, 1);

      act(() => {
        result.current.setCurrentMonth(newMonth);
      });

      expect(result.current.currentMonth.getFullYear()).toBe(2030);
      expect(result.current.currentMonth.getMonth()).toBe(11);
    });
  });

  describe("handleMonthSelect", () => {
    it("sets the currentMonth to the selected month index", () => {
      const initialMonth = new Date(2026, 0, 1);
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleMonthSelect(5); // June (0-indexed)
      });

      expect(result.current.currentMonth.getMonth()).toBe(5);
      expect(result.current.currentMonth.getFullYear()).toBe(2026);
    });

    it("preserves the current year when selecting a month", () => {
      const initialMonth = new Date(2025, 3, 1);
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleMonthSelect(10); // November
      });

      expect(result.current.currentMonth.getMonth()).toBe(10);
      expect(result.current.currentMonth.getFullYear()).toBe(2025);
    });

    it("resets pickerView to 'days' after selecting a month", () => {
      const { result } = renderHook(() => useCalendarState());

      act(() => {
        result.current.setPickerView("months");
      });
      act(() => {
        result.current.handleMonthSelect(3);
      });

      expect(result.current.pickerView).toBe("days");
    });
  });

  describe("handleYearSelect", () => {
    it("sets the currentMonth year to the selected year", () => {
      const initialMonth = new Date(2026, 5, 1);
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleYearSelect(2030);
      });

      expect(result.current.currentMonth.getFullYear()).toBe(2030);
    });

    it("preserves the current month when selecting a year", () => {
      const initialMonth = new Date(2026, 7, 1); // August 2026
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleYearSelect(2020);
      });

      expect(result.current.currentMonth.getMonth()).toBe(7);
      expect(result.current.currentMonth.getFullYear()).toBe(2020);
    });

    it("resets pickerView to 'days' after selecting a year", () => {
      const { result } = renderHook(() => useCalendarState());

      act(() => {
        result.current.setPickerView("years");
      });
      act(() => {
        result.current.handleYearSelect(2024);
      });

      expect(result.current.pickerView).toBe("days");
    });
  });

  describe("handleMonthYearChange", () => {
    it("decrements the year by 1 when direction is 'prev'", () => {
      const initialMonth = new Date(2026, 5, 1);
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleMonthYearChange("prev");
      });

      expect(result.current.currentMonth.getFullYear()).toBe(2025);
    });

    it("increments the year by 1 when direction is 'next'", () => {
      const initialMonth = new Date(2026, 5, 1);
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleMonthYearChange("next");
      });

      expect(result.current.currentMonth.getFullYear()).toBe(2027);
    });

    it("preserves the month when navigating years", () => {
      const initialMonth = new Date(2026, 3, 1); // April 2026
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleMonthYearChange("next");
      });

      expect(result.current.currentMonth.getMonth()).toBe(3);
    });

    it("sets day to 1 after year change", () => {
      const initialMonth = new Date(2026, 5, 15);
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleMonthYearChange("next");
      });

      expect(result.current.currentMonth.getDate()).toBe(1);
    });
  });

  describe("handleYearNavigate", () => {
    it("shifts the current year back by 100 when direction is 'prev'", () => {
      const initialMonth = new Date(2026, 5, 1);
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleYearNavigate("prev");
      });

      expect(result.current.currentMonth.getFullYear()).toBe(1926);
    });

    it("shifts the current year forward by 100 when direction is 'next'", () => {
      const initialMonth = new Date(2026, 5, 1);
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleYearNavigate("next");
      });

      expect(result.current.currentMonth.getFullYear()).toBe(2126);
    });

    it("preserves the month when navigating year ranges", () => {
      const initialMonth = new Date(2026, 9, 1); // October 2026
      const { result } = renderHook(() => useCalendarState({ initialMonth }));

      act(() => {
        result.current.handleYearNavigate("next");
      });

      expect(result.current.currentMonth.getMonth()).toBe(9);
    });
  });
});
