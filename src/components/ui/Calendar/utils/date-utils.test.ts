import {
  createDateMatcher,
  generateYearRange,
  parseDateString,
} from "./date-utils";

describe("date-utils", () => {
  describe("parseDateString", () => {
    describe("valid inputs", () => {
      it("parses a valid DD/MM/YYYY date string", () => {
        const result = parseDateString("15/01/2025");
        expect(result).not.toBeNull();
        expect(result?.getDate()).toBe(15);
        expect(result?.getMonth()).toBe(0); // January
        expect(result?.getFullYear()).toBe(2025);
      });

      it("parses the first day of a month", () => {
        const result = parseDateString("01/06/2024");
        expect(result).not.toBeNull();
        expect(result?.getDate()).toBe(1);
        expect(result?.getMonth()).toBe(5); // June
        expect(result?.getFullYear()).toBe(2024);
      });

      it("parses the last day of December", () => {
        const result = parseDateString("31/12/2023");
        expect(result).not.toBeNull();
        expect(result?.getDate()).toBe(31);
        expect(result?.getMonth()).toBe(11); // December
        expect(result?.getFullYear()).toBe(2023);
      });

      it("parses a leap year date", () => {
        const result = parseDateString("29/02/2024");
        expect(result).not.toBeNull();
        expect(result?.getDate()).toBe(29);
        expect(result?.getMonth()).toBe(1);
        expect(result?.getFullYear()).toBe(2024);
      });

      it("returns a Date instance", () => {
        const result = parseDateString("10/03/2025");
        expect(result).toBeInstanceOf(Date);
      });
    });

    describe("invalid inputs", () => {
      it("returns null for an empty string", () => {
        expect(parseDateString("")).toBeNull();
      });

      it("returns null for a plainly alphabetic string", () => {
        expect(parseDateString("abc/def/ghij")).toBeNull();
      });

      it("returns null for a random non-date string", () => {
        expect(parseDateString("not-a-date")).toBeNull();
      });

      it("returns null for a non-string value (number coerced)", () => {
        // The function signature accepts string but guards against non-strings
        expect(parseDateString(null as unknown as string)).toBeNull();
      });

      it("returns null for a date with month > 12", () => {
        expect(parseDateString("01/13/2025")).toBeNull();
      });
    });
  });

  describe("createDateMatcher", () => {
    it("returns a function", () => {
      expect(typeof createDateMatcher([])).toBe("function");
    });

    it("matcher returns true (disabled) for dates NOT in the enabled list", () => {
      const enabledDates = [new Date(2025, 0, 15)];
      const matcher = createDateMatcher(enabledDates);
      const notEnabled = new Date(2025, 0, 16);
      expect(matcher(notEnabled)).toBe(true);
    });

    it("matcher returns false (enabled) for dates IN the enabled list", () => {
      const enabledDates = [new Date(2025, 0, 15)];
      const matcher = createDateMatcher(enabledDates);
      const enabled = new Date(2025, 0, 15);
      expect(matcher(enabled)).toBe(false);
    });

    it("matcher works with multiple enabled dates", () => {
      const enabledDates = [
        new Date(2025, 0, 10),
        new Date(2025, 0, 15),
        new Date(2025, 0, 20),
      ];
      const matcher = createDateMatcher(enabledDates);

      expect(matcher(new Date(2025, 0, 10))).toBe(false);
      expect(matcher(new Date(2025, 0, 15))).toBe(false);
      expect(matcher(new Date(2025, 0, 20))).toBe(false);
      expect(matcher(new Date(2025, 0, 11))).toBe(true);
    });

    it("accepts string dates in DD/MM/YYYY format", () => {
      const enabledDates = ["15/01/2025", "20/01/2025"];
      const matcher = createDateMatcher(enabledDates);

      expect(matcher(new Date(2025, 0, 15))).toBe(false);
      expect(matcher(new Date(2025, 0, 20))).toBe(false);
      expect(matcher(new Date(2025, 0, 16))).toBe(true);
    });

    it("filters out invalid date strings (they don't enable any date)", () => {
      const enabledDates = ["invalid-date", new Date(2025, 0, 15)];
      const matcher = createDateMatcher(enabledDates);

      // The invalid string is ignored; valid date is still enabled
      expect(matcher(new Date(2025, 0, 15))).toBe(false);
      expect(matcher(new Date(2025, 0, 16))).toBe(true);
    });

    it("matcher returns true for all dates when enabledDates is empty", () => {
      const matcher = createDateMatcher([]);
      expect(matcher(new Date(2025, 0, 1))).toBe(true);
      expect(matcher(new Date(2025, 6, 15))).toBe(true);
    });

    it("compares dates by calendar day ignoring time", () => {
      const enabledDate = new Date(2025, 0, 15, 0, 0, 0);
      const matcher = createDateMatcher([enabledDate]);

      // Same calendar day, different time
      const differentTime = new Date(2025, 0, 15, 23, 59, 59);
      expect(matcher(differentTime)).toBe(false);
    });
  });

  describe("generateYearRange", () => {
    it("returns an array of the specified length", () => {
      const result = generateYearRange(2026, 6);
      expect(result).toHaveLength(6);
    });

    it("returns an array centered around the given year", () => {
      const result = generateYearRange(2026, 6);
      // startYear = 2026 - floor(6/2) = 2026 - 3 = 2023
      expect(result[0]).toBe(2023);
      expect(result.at(-1)).toBe(2028);
    });

    it("returns consecutive years", () => {
      const result = generateYearRange(2026, 6);
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBe(result[i - 1] + 1);
      }
    });

    it("handles range of 1", () => {
      const result = generateYearRange(2026, 1);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(2026);
    });

    it("handles range of 100", () => {
      const result = generateYearRange(2026, 100);
      expect(result).toHaveLength(100);
      // startYear = 2026 - 50 = 1976
      expect(result[0]).toBe(1976);
      expect(result[99]).toBe(2075);
    });

    it("handles an even range value symmetrically (floor of half)", () => {
      // range=4 → startYear = center - 2
      const result = generateYearRange(2000, 4);
      expect(result[0]).toBe(1998);
      expect(result[3]).toBe(2001);
    });

    it("handles an odd range value symmetrically (floor of half)", () => {
      // range=5 → startYear = center - 2
      const result = generateYearRange(2000, 5);
      expect(result[0]).toBe(1998);
      expect(result[4]).toBe(2002);
    });
  });
});
