import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { startOfWeek, subWeeks, addWeeks } from "date-fns";
import { WeeklySchedule } from "./weekly-schedule";

describe("WeeklySchedule", () => {
  it("handles week navigation, slot click, and appointment click", () => {
    const onWeekChange = vi.fn();
    const onTimeSlotClick = vi.fn();
    const onAppointmentClick = vi.fn();
    const currentDate = new Date("2026-03-18T10:00:00");
    const weekStart = startOfWeek(currentDate);

    const appointment = {
      id: "apt-week-1",
      title: "Full Groom",
      date: new Date(weekStart),
      startTime: "09:30",
      endTime: "11:00",
      color: "bg-orange-100 text-orange-700"
    };

    const { container } = render(
      <WeeklySchedule
        currentDate={currentDate}
        onWeekChange={onWeekChange}
        appointments={[appointment]}
        onTimeSlotClick={onTimeSlotClick}
        onAppointmentClick={onAppointmentClick}
      />
    );

    const navButtons = screen.getAllByRole("button");
    fireEvent.click(navButtons[0]);
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    fireEvent.click(navButtons[2]);

    expect(onWeekChange).toHaveBeenNthCalledWith(1, subWeeks(currentDate, 1));
    expect(onWeekChange).toHaveBeenCalledTimes(3);
    expect(onWeekChange).toHaveBeenNthCalledWith(3, addWeeks(currentDate, 1));

    const slotCells = container.querySelectorAll("div.cursor-pointer");
    expect(slotCells.length).toBeGreaterThan(0);
    fireEvent.click(slotCells[0] as HTMLElement);
    expect(onTimeSlotClick).toHaveBeenCalledWith(weekStart, "06:00");

    const aptButton = screen.getByRole("button", { name: /Full Groom/i });
    expect(aptButton).toHaveStyle({ height: "96px", top: "32px" });
    fireEvent.click(aptButton);
    expect(onAppointmentClick).toHaveBeenCalledWith(appointment);
  });
});
