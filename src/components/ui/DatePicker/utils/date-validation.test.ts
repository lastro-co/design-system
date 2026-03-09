import { parseInputDate } from "./date-validation";

describe("date-validation utils", () => {
  describe("parseInputDate", () => {
    it("should parse valid date string", () => {
      const result = parseInputDate("15062025");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(15);
      expect(result?.getMonth()).toBe(5); // June (0-indexed)
      expect(result?.getFullYear()).toBe(2025);
    });

    it("should parse formatted date string", () => {
      const result = parseInputDate("15/06/2025");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(15);
      expect(result?.getMonth()).toBe(5);
      expect(result?.getFullYear()).toBe(2025);
    });

    it("should return undefined for incomplete date", () => {
      expect(parseInputDate("1506")).toBeUndefined();
      expect(parseInputDate("150620")).toBeUndefined();
    });

    it("should return undefined for invalid month", () => {
      expect(parseInputDate("15132025")).toBeUndefined(); // Month 13
      expect(parseInputDate("15002025")).toBeUndefined(); // Month 0
    });

    it("should return undefined for invalid day", () => {
      expect(parseInputDate("00062025")).toBeUndefined(); // Day 0
      expect(parseInputDate("32062025")).toBeUndefined(); // Day 32
    });

    it("should return undefined for invalid date (Feb 30)", () => {
      expect(parseInputDate("30022025")).toBeUndefined();
    });

    it("should accept leap year date (Feb 29)", () => {
      const result = parseInputDate("29022024"); // 2024 is leap year
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(29);
      expect(result?.getMonth()).toBe(1); // February
      expect(result?.getFullYear()).toBe(2024);
    });

    it("should reject Feb 29 on non-leap year", () => {
      expect(parseInputDate("29022025")).toBeUndefined(); // 2025 is not leap year
    });

    it("should return undefined for empty string", () => {
      expect(parseInputDate("")).toBeUndefined();
    });

    it("should handle strings with letters", () => {
      expect(parseInputDate("abc")).toBeUndefined();
    });
  });
});
