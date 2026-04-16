import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface Appointment {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;
  color?: string;
}

interface CalendarProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  appointments: Appointment[];
  onDayClick: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

export function Calendar({
  currentDate,
  onMonthChange,
  appointments,
  onDayClick,
  onAppointmentClick,
}: CalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), day));
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onMonthChange(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] border rounded-lg p-2 ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              } ${isDayToday ? "ring-2 ring-blue-500" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    isCurrentMonth ? "text-gray-900" : "text-gray-400"
                  } ${isDayToday ? "text-blue-600 font-bold" : ""}`}
                >
                  {format(day, "d")}
                </span>
                <button
                  onClick={() => onDayClick(day)}
                  className="opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Plus className="h-3 w-3 text-gray-400" />
                </button>
              </div>

              <div className="space-y-1">
                {dayAppointments.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => onAppointmentClick(apt)}
                    className={`w-full text-left text-xs p-1 rounded truncate ${
                      apt.color || "bg-blue-100 text-blue-700"
                    } hover:opacity-80 transition-opacity`}
                  >
                    <div className="font-medium truncate">{apt.title}</div>
                    <div className="text-[10px] opacity-75">
                      {apt.startTime}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
