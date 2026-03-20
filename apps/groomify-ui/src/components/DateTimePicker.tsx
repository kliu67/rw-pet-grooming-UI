import React, { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { INTERVAL_MINUTES } from "@/constants";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { CLASSNAMES } from "@/styles/classNames";
import { getTimestamp, isObjectNotEmpty } from "@shared-utils";
import {
  getTimeSlotsForDate,
  useTimeSlotsForDate,
} from "@/hooks/openTimeRanges";
import { getDaysInMonth } from "@/hooks/timeIntervals";

const {
  BOOKING_MODAL_FIELD_TWO,
  TIME_BTN_DIV_DISABLED: TIME_BTN_DISABLED,
  TIME_BTN_DIV_ACTIVE: TIME_BTN_ACTIVE,
} = CLASSNAMES;

export const DateTimePicker = ({
  configData,
  availabilityData,
  timeOffsData,
  appointmentsData,
  onSelect,
  isLoading,
  isError,
}) => {
  const [date, setDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const timePickerRef = useRef(null);
  const prevDateKeyRef = useRef(null);
  const isTimeDisabled = !isObjectNotEmpty(configData);
  const { t } = useTranslation();
  const appointmentDurationMinutes = useMemo(() => {
    const duration = Number(configData?.duration_minutes) || 0;
    const buffer = Number(configData?.buffer_minutes) || 0;
    const total = duration + buffer;
    return total > 0 ? total : INTERVAL_MINUTES;
  }, [configData?.duration_minutes, configData?.buffer_minutes]);

  const appointmentsForRanges = useMemo(() => {
    return appointmentsData.map((app) => ({
      startTime: app.start_time,
      endTime: app.effective_end_time,
    }));
  }, [appointmentsData]);

  const monthAvailability = useMemo(() => {
    if (!availabilityData?.length) return [];

    const thisMonth = calendarMonth?.getMonth();
    const thisYear = calendarMonth?.getFullYear();

    return getDaysInMonth(thisYear, thisMonth).map((day) => {
      const daySlots = getTimeSlotsForDate({
        availabilityData,
        timeOffsData,
        appointments: appointmentsForRanges,
        date: day,
        slotMinutes: INTERVAL_MINUTES,
        appointmentDurationMinutes,
      });

      return daySlots.filter((slot) => slot.bookable);
    });
  }, [
    availabilityData,
    appointmentsForRanges,
    timeOffsData,
    calendarMonth,
    appointmentDurationMinutes,
  ]);

  const monthBookableDates = useMemo(() => {
    if (!availabilityData?.length) return new Set();

    const thisMonth = calendarMonth.getMonth();
    const thisYear = calendarMonth.getFullYear();
    const monthDays = getDaysInMonth(thisYear, thisMonth);

    return new Set(
      monthDays
        .filter((_, index) => monthAvailability[index]?.length > 0)
        .map((day) => day.toDateString()),
    );
  }, [availabilityData, calendarMonth, monthAvailability]);

  const isDateDisabled = useCallback(
    (day) => {
      if (isTimeDisabled) return true;

      const todayDate = new Date();
      const normalizedToday = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate(),
      );
      const normalizedDay = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
      );

      if (normalizedDay < normalizedToday) return true;

      if (isLoading || isError) {
        return false;
      }

      if (!availabilityData?.length) return true;

      return !monthBookableDates.has(normalizedDay.toDateString());
    },
    [
      configData,
      isLoading,
      isError,
      availabilityData,
      timeOffsData,
      monthBookableDates,
    ],
  );

  const timeSlots = useTimeSlotsForDate({
    availabilityData,
    timeOffsData,
    appointments: appointmentsForRanges,
    date,
    slotMinutes: INTERVAL_MINUTES,
    appointmentDurationMinutes,
  });

  useEffect(() => {
    const dateKey = date ? date.toDateString() : null;
    if (!dateKey || prevDateKeyRef.current === dateKey) return;
    prevDateKeyRef.current = dateKey;

    requestAnimationFrame(() => {
      const firstBookable = timePickerRef.current?.querySelector(
        '[data-bookable="true"]',
      );

      firstBookable?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    });
  }, [date, timeSlots]);

  return (
    <div className={BOOKING_MODAL_FIELD_TWO}>
      <div
        id="date-time-picker-container"
        className="flex flex-col md:flex-row md:items-stretch gap-4"
      >
        <div
          className={`${BOOKING_MODAL_FIELD_TWO} md:w-1/2 lg:w-1/3 lg:flex lg:flex-col lg:max-h-[280px]`}
        >
          <Label htmlFor="date">{t("bookingModal.date")}</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            className="mx-auto rounded-md border"
            classNames={{
              months: "flex flex-col sm:flex-row gap-2 justify-center",
              month: "flex flex-col items-center gap-4 mx-auto",
              table: "mx-auto border-collapse space-x-1",
              head_row: "flex justify-center",
              row: "flex justify-center mt-2",
            }}
            disabled={isDateDisabled}
          />
        </div>
        <div
          className={`${BOOKING_MODAL_FIELD_TWO} md:w-1/2 lg:w-2/3 lg:flex lg:flex-col lg:min-h-[280px]`}
        >
          <Label htmlFor="timeInterval">{t("bookingModal.time")}</Label>
          <div
            id="time-picker"
            ref={timePickerRef}
            className="flex flex-wrap overflow-y-auto max-h-[280px] lg:flex-1 scroll-smooth"
          >
            {" "}
            {timeSlots.map((time) => (
              <div
                key={time.start.toISOString()}
                data-bookable={time.bookable ? "true" : "false"}
                className={`w-full ${time.bookable ? TIME_BTN_ACTIVE : TIME_BTN_DISABLED} ${
                  getTimestamp(selectedTimeSlot) === getTimestamp(time.start)
                    ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <button
                  className="w-full h-full p-0 m-0 text-center active:bg-emerald-600 active:text-white disabled:bg-gray-200"
                  name="startTime"
                  value={time.start.toISOString()}
                  type="button"
                  disabled={!time.bookable}
                  onClick={(e) => {
                    const current = selectedTimeSlot || "";
                    const clicked = time.start.toISOString();
                    const value = current === clicked ? "" : clicked;
                    setSelectedTimeSlot(value);
                    onSelect(e);
                  }}
                >
                  {`${time.startStrAMPM}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
