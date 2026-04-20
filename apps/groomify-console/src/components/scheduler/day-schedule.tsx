import {
  format,
  isSameDay,
  addDays,
  subDays,
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

interface DayScheduleProps {
  currentDate: Date;
  onDayChange: (date: Date) => void;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, time: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

const TIME_SLOTS = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

export function DaySchedule({
  currentDate,
  onDayChange,
  appointments,
  onTimeSlotClick,
  onAppointmentClick,
}: DayScheduleProps) {
  const dayAppointments = appointments.filter((apt) =>
    isSameDay(new Date(apt.date), currentDate)
  );

  const getAppointmentsForTime = (timeSlot: string) => {
    return dayAppointments.filter((apt) => {
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
    
    return Math.max(hours * 80, 40); // 80px per hour, minimum 40px
  };

  const getAppointmentTop = (apt: Appointment) => {
    const [, startMin] = apt.startTime.split(":").map(Number);
    return (startMin / 60) * 80; // Offset within the hour
  };

  const formatTime = (time: string) => {
    const [hours] = time.split(":").map(Number);
    if (hours === 0) return "12 AM";
    if (hours === 12) return "12 PM";
    if (hours > 12) return `${hours - 12} PM`;
    return `${hours} AM`;
  };

  return (
    <div className="w-full">
      {/* Day Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
          {isToday(currentDate) && (
            <span className="ml-3 text-sm font-normal text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Today
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDayChange(subDays(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onDayChange(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDayChange(addDays(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day Summary */}
      <div className="mb-6 bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">
              {dayAppointments.length} appointment{dayAppointments.length !== 1 ? "s" : ""} scheduled
            </h3>
            {dayAppointments.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {dayAppointments[0].startTime} - {dayAppointments[dayAppointments.length - 1].endTime}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-320px)]">
          {TIME_SLOTS.map((timeSlot) => {
            const slotAppointments = getAppointmentsForTime(timeSlot);

            return (
              <div
                key={timeSlot}
                className="flex border-b last:border-b-0 min-h-[80px]"
              >
                {/* Time Label */}
                <div className="w-28 flex-shrink-0 p-4 text-right border-r bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">
                    {formatTime(timeSlot)}
                  </div>
                </div>

                {/* Appointment Area */}
                <div
                  className="flex-1 relative hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTimeSlotClick(currentDate, timeSlot)}
                >
                  {/* Hover Add Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-gray-600 shadow-sm">
                      <Plus className="h-4 w-4" />
                      Add appointment
                    </div>
                  </div>

                  {/* Appointments */}
                  {slotAppointments.map((apt) => (
                    <button
                      key={apt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick(apt);
                      }}
                      className={`absolute left-2 right-2 z-20 rounded-lg p-3 text-left ${
                        apt.color || "bg-blue-100 text-blue-700"
                      } hover:opacity-80 transition-opacity shadow-sm border border-black/10`}
                      style={{
                        height: `${getAppointmentHeight(apt)}px`,
                        top: `${getAppointmentTop(apt)}px`,
                      }}
                    >
                      <div className="font-semibold mb-1">{apt.title}</div>
                      <div className="text-sm opacity-90 mb-1">
                        {apt.startTime} - {apt.endTime}
                      </div>
                      {apt.description && (
                        <div className="text-xs opacity-75 line-clamp-2">
                          {apt.description}
                        </div>
                      )}
                    </button>
                  ))}

                  {/* 30-minute mark */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-100 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
