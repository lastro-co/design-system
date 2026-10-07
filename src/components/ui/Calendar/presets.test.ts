import { getDefaultCalendarPresets } from "./presets";

const byLabel = (today: Date) =>
  Object.fromEntries(
    getDefaultCalendarPresets(today).map((preset) => [
      preset.label,
      preset.range,
    ])
  );

describe("getDefaultCalendarPresets", () => {
  it("returns the five Figma shortcuts in order", () => {
    expect(
      getDefaultCalendarPresets(new Date(2026, 8, 23)).map((p) => p.label)
    ).toEqual([
      "Semana atual",
      "Mês atual",
      "Últimos 7 dias",
      "Últimos 14 dias",
      "Últimos 30 dias",
    ]);
  });

  it("builds every range from a fixed today (Wed 2026-09-23 14:30)", () => {
    const presets = byLabel(new Date(2026, 8, 23, 14, 30));

    expect(presets["Semana atual"]).toEqual({
      from: new Date(2026, 8, 20),
      to: new Date(2026, 8, 26),
    });
    expect(presets["Mês atual"]).toEqual({
      from: new Date(2026, 8, 1),
      to: new Date(2026, 8, 30),
    });
    expect(presets["Últimos 7 dias"]).toEqual({
      from: new Date(2026, 8, 17),
      to: new Date(2026, 8, 23),
    });
    expect(presets["Últimos 14 dias"]).toEqual({
      from: new Date(2026, 8, 10),
      to: new Date(2026, 8, 23),
    });
    expect(presets["Últimos 30 dias"]).toEqual({
      from: new Date(2026, 7, 25),
      to: new Date(2026, 8, 23),
    });
  });

  it("spans two months when the current week crosses a month boundary", () => {
    // Thu 2026-10-01: its Sunday-first week starts on Sun 2026-09-27.
    const presets = byLabel(new Date(2026, 9, 1));
    expect(presets["Semana atual"]).toEqual({
      from: new Date(2026, 8, 27),
      to: new Date(2026, 9, 3),
    });
    expect(presets["Mês atual"]).toEqual({
      from: new Date(2026, 9, 1),
      to: new Date(2026, 9, 31),
    });
  });

  it("defaults today to the current date", () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 23, 9));
    try {
      expect(getDefaultCalendarPresets()[2].range).toEqual({
        from: new Date(2026, 8, 17),
        to: new Date(2026, 8, 23),
      });
    } finally {
      jest.useRealTimers();
    }
  });
});
