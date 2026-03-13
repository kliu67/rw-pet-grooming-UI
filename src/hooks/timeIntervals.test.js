import { describe, expect, it } from "vitest";
import {
  computeAMPMTimeString,
  computeDateTimeIntervals,
  getDaysInMonth
} from "./timeIntervals";

describe("timeIntervals", () => {
  it("returns every day in the requested month", () => {
    const days = getDaysInMonth(2026, 1);

    expect(days).toHaveLength(28);
    expect(days[0].toISOString()).toContain("2026-02-01");
    expect(days[27].toISOString()).toContain("2026-02-28");
  });

  it("formats morning and afternoon times with AM/PM", () => {
    const morning = new Date("2026-03-15T09:05:00");
    const afternoon = new Date("2026-03-15T15:30:00");

    expect(computeAMPMTimeString(morning)).toBe("09:05AM");
    expect(computeAMPMTimeString(afternoon)).toBe("3:30PM");
  });

  it("computes date time intervals within a range", () => {
    const date = new Date("2026-03-15T00:00:00");

    const intervals = computeDateTimeIntervals(
      { start: "09:00", end: "11:00" },
      date,
      60,
      30
    );

    expect(intervals).toHaveLength(3);
    expect(intervals[0]).toMatchObject({
      startStr24Hr: "09:00",
      endStr24Hr: "10:00",
      startStrAMPM: "09:00AM",
      endStrAMPM: "10:00AM"
    });
    expect(intervals[1]).toMatchObject({
      startStr24Hr: "09:30",
      endStr24Hr: "10:30"
    });
    expect(intervals[2]).toMatchObject({
      startStr24Hr: "10:00",
      endStr24Hr: "11:00"
    });
  });

  it("returns no intervals when the range is shorter than the duration", () => {
    const date = new Date("2026-03-15T00:00:00");

    const intervals = computeDateTimeIntervals(
      { start: "09:00", end: "09:30" },
      date,
      60,
      30
    );

    expect(intervals).toEqual([]);
  });

  it("normalizes the date to midnight before computing intervals", () => {
    const date = new Date("2026-03-15T17:45:00");

    const [interval] = computeDateTimeIntervals(
      { start: "08:00", end: "09:00" },
      date,
      60,
      30
    );

    expect(interval.start.getHours()).toBe(8);
    expect(interval.start.getMinutes()).toBe(0);
    expect(interval.end.getHours()).toBe(9);
    expect(interval.end.getMinutes()).toBe(0);
  });
});
