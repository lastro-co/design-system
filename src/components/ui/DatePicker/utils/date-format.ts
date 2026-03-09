import { format } from "date-fns";

/**
 * Formats a Date object to DD/MM/YYYY string format
 */
export function formatDateToDisplay(date: Date | undefined): string {
  if (!date) {
    return "";
  }

  return format(date, "dd/MM/yyyy");
}

/**
 * Formats user input to DD/MM/YYYY as they type
 * Removes non-numeric characters and adds slashes automatically
 */
export function formatInputDate(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Format as user types
  if (numbers.length <= 2) {
    return numbers;
  }
  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
}
