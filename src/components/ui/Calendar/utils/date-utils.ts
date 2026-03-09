import { isSameDay, isValid, parse } from "date-fns";

/**
 * Parses a date string in DD/MM/YYYY format to a Date object
 * @param dateStr - String in DD/MM/YYYY format
 * @returns Date object or null if invalid
 */
export function parseDateString(dateStr: string): Date | null {
  if (typeof dateStr !== "string") {
    return null;
  }

  const date = parse(dateStr, "dd/MM/yyyy", new Date());

  if (!isValid(date)) {
    return null;
  }

  return date;
}

/**
 * Creates a date matcher function for react-day-picker
 * @param enabledDates - Array of Date objects or date strings in DD/MM/YYYY format
 * @returns Matcher function that returns true if date should be disabled
 */
export function createDateMatcher(
  enabledDates: (Date | string)[]
): (date: Date) => boolean {
  const parsedDates = enabledDates
    .map((d) => (typeof d === "string" ? parseDateString(d) : d))
    .filter((d): d is Date => d !== null);

  return (date: Date) =>
    !parsedDates.some((enabledDate) => isSameDay(date, enabledDate));
}

/**
 * Generates an array of years around a center year
 */
export function generateYearRange(centerYear: number, range: number): number[] {
  const startYear = centerYear - Math.floor(range / 2);
  return Array.from({ length: range }, (_, i) => startYear + i);
}
