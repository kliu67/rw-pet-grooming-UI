import React from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  getBlockedTimeRanges,
  getOpenTimeRanges,
  getTimeSlotsForDate,
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

  it("builds bookable/unbookable slots from availability, time offs, appointments, and now+2h", () => {
    const date = new Date("2026-03-15T00:00:00");

    const result = getTimeSlotsForDate({
      availabilityData: [{ day_of_week: 0, start_time: "09:00", end_time: "12:00" }],
      timeOffsData: [{ day_of_week: 0, start_time: "10:00", end_time: "10:30" }],
      appointments: [{ startTime: "2026-03-15T11:00:00", endTime: "2026-03-15T11:30:00" }],
      date,
      slotMinutes: 30,
      now: new Date("2026-03-15T07:00:00")
    });

    expect(
      result.map((slot) => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        startStrAMPM: slot.startStrAMPM,
        endStrAMPM: slot.endStrAMPM,
        bookable: slot.bookable
      }))
    ).toEqual([
      {
        start: new Date("2026-03-15T09:00:00").toISOString(),
        end: new Date("2026-03-15T09:30:00").toISOString(),
        startStrAMPM: "9:00AM",
        endStrAMPM: "9:30AM",
        bookable: false
      },
      {
        start: new Date("2026-03-15T09:30:00").toISOString(),
        end: new Date("2026-03-15T10:00:00").toISOString(),
        startStrAMPM: "9:30AM",
        endStrAMPM: "10:00AM",
        bookable: true
      },
      {
        start: new Date("2026-03-15T10:00:00").toISOString(),
        end: new Date("2026-03-15T10:30:00").toISOString(),
        startStrAMPM: "10:00AM",
        endStrAMPM: "10:30AM",
        bookable: false
      },
      {
        start: new Date("2026-03-15T10:30:00").toISOString(),
        end: new Date("2026-03-15T11:00:00").toISOString(),
        startStrAMPM: "10:30AM",
        endStrAMPM: "11:00AM",
        bookable: true
      },
      {
        start: new Date("2026-03-15T11:00:00").toISOString(),
        end: new Date("2026-03-15T11:30:00").toISOString(),
        startStrAMPM: "11:00AM",
        endStrAMPM: "11:30AM",
        bookable: false
      },
      {
        start: new Date("2026-03-15T11:30:00").toISOString(),
        end: new Date("2026-03-15T12:00:00").toISOString(),
        startStrAMPM: "11:30AM",
        endStrAMPM: "12:00PM",
        bookable: true
      }
    ]);
  });

  it("marks slots unbookable when full appointment duration does not fit", () => {
    const date = new Date("2026-03-15T00:00:00");

    const result = getTimeSlotsForDate({
      availabilityData: [{ day_of_week: 0, start_time: "09:00", end_time: "10:00" }],
      date,
      slotMinutes: 20,
      appointmentDurationMinutes: 45,
      now: new Date("2026-03-15T06:00:00")
    });

    expect(result.map((slot) => ({ start: slot.startStrAMPM, bookable: slot.bookable }))).toEqual([
      { start: "9:00AM", bookable: true },
      { start: "9:20AM", bookable: false },
      { start: "9:40AM", bookable: false }
    ]);
  });
});
