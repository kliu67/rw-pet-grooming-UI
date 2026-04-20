import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { addDays, subDays } from "date-fns";
import { DaySchedule } from "./day-schedule";

describe("DaySchedule", () => {
  it("renders summary and handles day navigation, slot click, and appointment click", () => {
    const onDayChange = vi.fn();
    const onTimeSlotClick = vi.fn();
    const onAppointmentClick = vi.fn();
    const currentDate = new Date("2026-03-15T12:00:00");

    const appointment = {
      id: "apt-day-1",
      title: "Nail Trim",
      date: new Date("2026-03-15T00:00:00"),
      startTime: "10:15",
      endTime: "11:45",
      description: "Small dog",
      color: "bg-pink-100 text-pink-700"
    };

    const { container } = render(
      <DaySchedule
        currentDate={currentDate}
        onDayChange={onDayChange}
        appointments={[appointment]}
        onTimeSlotClick={onTimeSlotClick}
        onAppointmentClick={onAppointmentClick}
      />
    );

    expect(screen.getByText("1 appointment scheduled")).toBeInTheDocument();
    expect(screen.getAllByText("10:15 - 11:45")).toHaveLength(2);
    expect(screen.getByText("Nail Trim")).toBeInTheDocument();
    expect(screen.getByText("Small dog")).toBeInTheDocument();

    const navButtons = screen.getAllByRole("button");
    fireEvent.click(navButtons[0]);
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    fireEvent.click(navButtons[2]);

    expect(onDayChange).toHaveBeenNthCalledWith(1, subDays(currentDate, 1));
    expect(onDayChange).toHaveBeenCalledTimes(3);
    expect(onDayChange).toHaveBeenNthCalledWith(3, addDays(currentDate, 1));

    const slotCells = container.querySelectorAll("div.cursor-pointer");
    expect(slotCells.length).toBeGreaterThan(0);
    fireEvent.click(slotCells[0] as HTMLElement);
    expect(onTimeSlotClick).toHaveBeenCalledWith(currentDate, "00:00");

    const aptButton = screen.getByRole("button", { name: /Nail Trim/i });
    expect(aptButton).toHaveStyle({ height: "120px", top: "20px" });
    fireEvent.click(aptButton);
    expect(onAppointmentClick).toHaveBeenCalledWith(appointment);
  });
});
