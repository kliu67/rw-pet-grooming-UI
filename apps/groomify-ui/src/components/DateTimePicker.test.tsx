import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { DateTimePicker } from "./DateTimePicker";

const mockUseTimeSlotsForDate = vi.fn();
const mockGetTimeSlotsForDate = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      resolvedLanguage: "en",
      changeLanguage: vi.fn(),
    },
  }),
}));

vi.mock("./ui/calendar", () => ({
  Calendar: ({ onSelect, onMonthChange }: any) => (
    <div>
      <button
        type="button"
        data-testid="calendar-select-date"
        onClick={() => onSelect(new Date("2026-03-11T00:00:00.000Z"))}
      >
        select-date
      </button>
      <button
        type="button"
        data-testid="calendar-change-month"
        onClick={() => onMonthChange(new Date("2026-04-01T00:00:00.000Z"))}
      >
        change-month
      </button>
    </div>
  ),
}));

vi.mock("@/hooks/openTimeRanges", () => ({
  getTimeSlotsForDate: (args: any) => mockGetTimeSlotsForDate(args),
  useTimeSlotsForDate: (args: any) => mockUseTimeSlotsForDate(args),
}));

describe("DateTimePicker", () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    mockGetTimeSlotsForDate.mockImplementation(() => [{ bookable: true }]);
    mockUseTimeSlotsForDate.mockImplementation(({ date }: any) => {
      const dateKey = date?.toISOString?.().slice(0, 10);
      if (dateKey === "2026-03-11") {
        return [
          {
            start: new Date("2026-03-11T10:00:00.000Z"),
            end: new Date("2026-03-11T10:20:00.000Z"),
            startStrAMPM: "10:00AM",
            startStrNormal: "10:00",
            isStartAMOrPM: "AM",
            endStrAMPM: "10:20AM",
            bookable: true,
          },
        ];
      }
      return [
        {
          start: new Date("2026-03-10T09:00:00.000Z"),
          end: new Date("2026-03-10T09:20:00.000Z"),
          startStrAMPM: "9:00AM",
          startStrNormal: "9:00",
          isStartAMOrPM: "AM",
          endStrAMPM: "9:20AM",
          bookable: true,
        },
      ];
    });
  });

  it("hydrates selected slot from selected datetime", async () => {
    render(
      <DateTimePicker
        configData={{ duration_minutes: 20, buffer_minutes: 0 }}
        availabilityData={[]}
        timeOffsData={[]}
        appointmentsData={[]}
        onSelect={vi.fn()}
        isLoading={false}
        isError={false}
        selected={new Date("2026-03-10T09:00:00.000Z")}
      />,
    );

    await waitFor(() => {
      expect(
        screen
          .getByRole("button", { name: "dateTime.timeStringAM" })
          .closest("[data-selected]"),
      ).toHaveAttribute("data-selected", "true");
    });
  });

  it("clears selected slot when user changes calendar date", async () => {
    render(
      <DateTimePicker
        configData={{ duration_minutes: 20, buffer_minutes: 0 }}
        availabilityData={[]}
        timeOffsData={[]}
        appointmentsData={[]}
        onSelect={vi.fn()}
        isLoading={false}
        isError={false}
        selected={new Date("2026-03-10T09:00:00.000Z")}
      />,
    );

    fireEvent.click(screen.getByTestId("calendar-select-date"));

    await waitFor(() => {
      expect(
        screen
          .getByRole("button", { name: "dateTime.timeStringAM" })
          .closest("[data-selected]"),
      ).toHaveAttribute("data-selected", "false");
    });
  });

  it("sends ISO startTime value on slot click", () => {
    const onSelect = vi.fn();

    render(
      <DateTimePicker
        configData={{ duration_minutes: 20, buffer_minutes: 0 }}
        availabilityData={[]}
        timeOffsData={[]}
        appointmentsData={[]}
        onSelect={onSelect}
        isLoading={false}
        isError={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "dateTime.timeStringAM" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].target.value).toBe("2026-03-10T09:00:00.000Z");
  });
});
