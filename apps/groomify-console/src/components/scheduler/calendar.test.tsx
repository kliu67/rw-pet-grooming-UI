import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { startOfWeek, startOfMonth } from "date-fns";
import { Calendar } from "./calendar";

describe("Scheduler Calendar", () => {
  it("renders appointments and handles month/day/appointment interactions", () => {
    const onMonthChange = vi.fn();
    const onDayClick = vi.fn();
    const onAppointmentClick = vi.fn();

    const currentDate = new Date("2026-03-15T12:00:00");
    const appointment = {
      id: "apt-1",
      title: "Bath Session",
      date: new Date("2026-03-10T00:00:00"),
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-green-100 text-green-700"
    };

    const { container } = render(
      <Calendar
        currentDate={currentDate}
        onMonthChange={onMonthChange}
        appointments={[appointment]}
        onDayClick={onDayClick}
        onAppointmentClick={onAppointmentClick}
      />
    );

    expect(screen.getByText("March 2026")).toBeInTheDocument();
    expect(screen.getByText("Bath Session")).toBeInTheDocument();
    expect(screen.getByText("09:00")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Bath Session"));
    expect(onAppointmentClick).toHaveBeenCalledWith(appointment);

    const dayAddButtons = container.querySelectorAll("button.opacity-0");
    expect(dayAddButtons.length).toBeGreaterThan(0);
    fireEvent.click(dayAddButtons[0]);

    const expectedFirstDay = startOfWeek(startOfMonth(currentDate));
    expect(onDayClick).toHaveBeenCalledWith(expectedFirstDay);

    const navButtons = screen.getAllByRole("button");
    fireEvent.click(navButtons[0]);
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    fireEvent.click(navButtons[2]);

    expect(onMonthChange).toHaveBeenCalledTimes(3);
  });
});
