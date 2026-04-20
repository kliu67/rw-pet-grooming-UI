import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
  isToday,
  addHours,
  startOfDay,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

interface WeeklyScheduleProps {
  currentDate: Date;
  onWeekChange: (date: Date) => void;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, time: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

const TIME_SLOTS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export function WeeklySchedule({
  currentDate,
  onWeekChange,
  appointments,
  onTimeSlotClick,
  onAppointmentClick,
}: WeeklyScheduleProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getAppointmentsForDayAndTime = (day: Date, timeSlot: string) => {
    return appointments.filter((apt) => {
      if (!isSameDay(new Date(apt.date), day)) return false;
      
      // Check if appointment starts within this hour
      const slotHour = parseInt(timeSlot.split(":")[0]);
      const aptHour = parseInt(apt.startTime.split(":")[0]);
      
      return aptHour === slotHour;
    });
  };

  const getAppointmentHeight = (apt: Appointment) => {
    const [startHour, startMin] = apt.startTime.split(":").map(Number);
    const [endHour, endMin] = apt.endTime.split(":").map(Number);
    
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const hours = durationMinutes / 60;
    
    return Math.max(hours * 64, 32); // 64px per hour, minimum 32px
  };

  const getAppointmentTop = (apt: Appointment) => {
    const [, startMin] = apt.startTime.split(":").map(Number);
    return (startMin / 60) * 64; // Offset within the hour
  };

  return (
    <div className="w-full">
      {/* Week Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onWeekChange(subWeeks(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onWeekChange(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onWeekChange(addWeeks(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="overflow-auto border rounded-lg bg-white">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
            <div className="p-4 border-r bg-gray-50"></div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`p-4 text-center border-r last:border-r-0 ${
                  isToday(day) ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-sm font-medium text-gray-500">
                  {format(day, "EEE")}
                </div>
                <div
                  className={`text-2xl font-semibold mt-1 ${
                    isToday(day) ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {TIME_SLOTS.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 border-b last:border-b-0">
              {/* Time Label */}
              <div className="p-2 border-r text-sm text-gray-500 bg-gray-50 text-right pr-4">
                {timeSlot}
              </div>

              {/* Day Columns */}
              {weekDays.map((day) => {
                const dayAppointments = getAppointmentsForDayAndTime(day, timeSlot);

                return (
                  <div
                    key={`${day.toISOString()}-${timeSlot}`}
                    className={`relative border-r last:border-r-0 min-h-[64px] hover:bg-gray-50 cursor-pointer ${
                      isToday(day) ? "bg-blue-50/30" : ""
                    }`}
                    onClick={() => onTimeSlotClick(day, timeSlot)}
                  >
                    {dayAppointments.map((apt) => (
                      <button
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentClick(apt);
                        }}
                        className={`absolute left-1 right-1 z-20 rounded p-2 text-left text-sm ${
                          apt.color || "bg-blue-100 text-blue-700"
                        } hover:opacity-80 transition-opacity overflow-hidden`}
                        style={{
                          height: `${getAppointmentHeight(apt)}px`,
                          top: `${getAppointmentTop(apt)}px`,
                        }}
                      >
                        <div className="font-medium truncate">{apt.title}</div>
                        <div className="text-xs opacity-75">
                          {apt.startTime} - {apt.endTime}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
