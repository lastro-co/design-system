import { formatDuration } from "./types";

describe("formatDuration", () => {
  it("formats zero seconds correctly", () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("formats seconds under a minute correctly", () => {
    expect(formatDuration(5)).toBe("0:05");
    expect(formatDuration(30)).toBe("0:30");
    expect(formatDuration(59)).toBe("0:59");
  });

  it("formats exactly one minute correctly", () => {
    expect(formatDuration(60)).toBe("1:00");
  });

  it("formats minutes and seconds correctly", () => {
    expect(formatDuration(90)).toBe("1:30");
    expect(formatDuration(125)).toBe("2:05");
    expect(formatDuration(185)).toBe("3:05");
  });

  it("formats multiple minutes correctly", () => {
    expect(formatDuration(120)).toBe("2:00");
    expect(formatDuration(300)).toBe("5:00");
    expect(formatDuration(600)).toBe("10:00");
  });

  it("handles decimal seconds by flooring", () => {
    expect(formatDuration(30.7)).toBe("0:30");
    expect(formatDuration(90.9)).toBe("1:30");
  });

  it("formats long durations correctly", () => {
    expect(formatDuration(3600)).toBe("60:00"); // 1 hour
    expect(formatDuration(7200)).toBe("120:00"); // 2 hours
  });

  it("pads single digit seconds with zero", () => {
    expect(formatDuration(1)).toBe("0:01");
    expect(formatDuration(61)).toBe("1:01");
    expect(formatDuration(601)).toBe("10:01");
  });

  it("handles invalid values gracefully", () => {
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe("0:00");
    expect(formatDuration(Number.NaN)).toBe("0:00");
    expect(formatDuration(-5)).toBe("0:00");
  });
});
