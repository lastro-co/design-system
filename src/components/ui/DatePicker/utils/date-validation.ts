import { isValid, parse } from "date-fns";

/**
 * Parses a formatted date string (DD/MM/YYYY) into a Date object
 * Returns undefined if the date is invalid or incomplete
 */
export function parseInputDate(value: string): Date | undefined {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Requires 8 digits for a valid date (DDMMYYYY)
  if (numbers.length !== 8) {
    return;
  }

  // Format as DD/MM/YYYY
  const formatted = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;

  // Parse using date-fns
  const date = parse(formatted, "dd/MM/yyyy", new Date());

  // Verify if the date is valid (handles cases like Feb 30)
  if (!isValid(date)) {
    return;
  }

  return date;
}
