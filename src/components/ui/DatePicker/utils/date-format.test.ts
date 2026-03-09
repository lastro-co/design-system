import { formatInputDate } from "./date-format";

describe("date-format utils", () => {
  describe("formatInputDate", () => {
    it("should format numbers as DD/MM/YYYY", () => {
      expect(formatInputDate("15062025")).toBe("15/06/2025");
    });

    it("should remove non-numeric characters", () => {
      expect(formatInputDate("a1b5c0d6e2f0g2h5")).toBe("15/06/2025");
    });

    it("should format partial input - day only", () => {
      expect(formatInputDate("15")).toBe("15");
    });

    it("should format partial input - day and month", () => {
      expect(formatInputDate("1506")).toBe("15/06");
    });

    it("should limit to 8 digits", () => {
      expect(formatInputDate("150620259999")).toBe("15/06/2025");
    });

    it("should handle empty string", () => {
      expect(formatInputDate("")).toBe("");
    });
  });
});
