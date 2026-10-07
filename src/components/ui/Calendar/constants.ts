export const MONTHS_PT_BR = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export const MONTHS_PT_BR_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

export const WEEKDAYS_PT_BR = ["D", "S", "T", "Q", "Q", "S", "S"] as const;

// Indexed by date-fns `getDay` (0 = Sunday). "SAB" drops the accent on purpose
// to match the Figma weekday header.
export const WEEKDAYS_PT_BR_SHORT = [
  "DOM",
  "SEG",
  "TER",
  "QUA",
  "QUI",
  "SEX",
  "SAB",
] as const;

export const YEAR_RANGE = 100;

export const MONTHS_PER_ROW = 4;
export const YEARS_PER_ROW = 4;
