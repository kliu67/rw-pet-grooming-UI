import React from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  getBlockedTimeRanges,
  getOpenTimeRanges,
  useOpenTimeRanges
} from "./openTimeRanges";

describe("openTimeRanges", () => {
  it("returns empty ranges when no date is provided", () => {
    expect(
      getOpenTimeRanges({
        availabilityData: [{ day_of_week: 0, start_time: "09:00", end_time: "12:00" }]
      })
    ).toEqual([]);
  });

  it("subtracts time off and appointment ranges from availability", () => {
    const date = new Date("2026-03-15T00:00:00");

    const result = getOpenTimeRanges({
      availabilityData: [{ day_of_week: 0, start_time: "09:00", end_time: "17:00" }],
      timeOffsData: [{ day_of_week: 0, start_time: "12:00", end_time: "13:00" }],
      appointments: [{ startTime: "2026-03-15T10:00:00", endTime: "2026-03-15T11:00:00" }],
      date
    });

    expect(result).toEqual([
      { start: "09:00", end: "10:00" },
      { start: "11:00", end: "12:00" },
      { start: "13:00", end: "17:00" }
    ]);
  });

  it("handles overnight availability that spills into the selected day", () => {
    const date = new Date("2026-03-15T00:00:00");

    const result = getOpenTimeRanges({
      availabilityData: [{ day_of_week: 6, start_time: "22:00", end_time: "02:00" }],
      date
    });

    expect(result).toEqual([{ start: "00:00", end: "02:00" }]);
  });

  it("computes blocked time ranges without appointments", () => {
    const date = new Date("2026-03-15T00:00:00");

    const result = getBlockedTimeRanges({
      availabilityData: [{ day_of_week: 0, start_time: "09:00", end_time: "17:00" }],
      timeOffsData: [{ day_of_week: 0, start_time: "12:00", end_time: "13:00" }],
      date
    });

    expect(result).toEqual([
      { start: "09:00", end: "12:00" },
      { start: "13:00", end: "17:00" }
    ]);
  });

  it("memo hook returns the same computed ranges", () => {
    const date = new Date("2026-03-15T00:00:00");

    const { result } = renderHook(() =>
      useOpenTimeRanges({
        availabilityData: [{ day_of_week: 0, start_time: "09:00", end_time: "11:00" }],
        timeOffsData: [],
        appointments: [],
        date
      })
    );

    expect(result.current).toEqual([{ start: "09:00", end: "11:00" }]);
  });
});
