import {
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import type { CalendarPreset } from "./Calendar";

// Sunday, matching the DOM…SAB weekday header.
const WEEK_STARTS_ON = 0;

// "Últimos N dias" counts today, so the range starts N - 1 days back.
const LAST_DAYS_OPTIONS = [7, 14, 30] as const;

/**
 * The Figma "Período" shortcuts. Not applied by default: pass
 * `presets={getDefaultCalendarPresets()}` to opt in.
 */
export function getDefaultCalendarPresets(
  today: Date = new Date()
): CalendarPreset[] {
  const day = startOfDay(today);

  return [
    {
      label: "Semana atual",
      range: {
        from: startOfWeek(day, { weekStartsOn: WEEK_STARTS_ON }),
        to: startOfDay(endOfWeek(day, { weekStartsOn: WEEK_STARTS_ON })),
      },
    },
    {
      label: "Mês atual",
      range: { from: startOfMonth(day), to: startOfDay(endOfMonth(day)) },
    },
    ...LAST_DAYS_OPTIONS.map((days) => ({
      label: `Últimos ${days} dias`,
      range: { from: subDays(day, days - 1), to: day },
    })),
  ];
}
