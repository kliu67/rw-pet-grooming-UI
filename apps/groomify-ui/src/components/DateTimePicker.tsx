import React, { useMemo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { INTERVAL_MINUTES } from "@/constants";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { CLASSNAMES } from "@/styles/classNames";
import { getTimestamp, isObjectNotEmpty } from "@shared-utils";
import { useOpenTimeRanges, getOpenTimeRanges, getAvailableTimeRanges } from "@/hooks/openTimeRanges";
import {
  computeDateTimeIntervals,
  getDaysInMonth,
} from "@/hooks/timeIntervals";

const { BOOKING_MODAL_FIELD_TWO, TIME_BTN_DISABLED, TIME_BTN_ACTIVE } =
  CLASSNAMES;
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
  const isTimeDisabled = !isObjectNotEmpty(configData);
  const { t } = useTranslation();

  const appointmentsForRanges = useMemo(() => {
    return appointmentsData.map((app) => ({
      startTime: app.start_time,
      endTime: app.effective_end_time,
    }));
  }, [appointmentsData]);

  const bookableTimeRanges = useOpenTimeRanges({
    availabilityData,
    timeOffsData,
    appointments: appointmentsForRanges,
    date,
  });


  const monthAvailability = useMemo(() => {
    if (!availabilityData?.length) return [];

    const thisMonth = calendarMonth?.getMonth();
    const thisYear = calendarMonth?.getFullYear();
    const appointmentsByStylist = appointmentsForRanges;

    return getDaysInMonth(thisYear, thisMonth).map((day) =>
      getOpenTimeRanges({
        availabilityData,
        timeOffsData,
        appointments: appointmentsByStylist,
        date: day,
      }),
    );
  }, [availabilityData, appointmentsForRanges, timeOffsData, calendarMonth]);



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
  const timeIntervals = useMemo(() => {
    if (!bookableTimeRanges || !date || !configData) return [];

    return bookableTimeRanges.flatMap((range) =>
      computeDateTimeIntervals(
        range,
        date,
        configData.duration_minutes,
        INTERVAL_MINUTES,
      ),
    );
  }, [bookableTimeRanges, date, configData]);
  return (
    timeIntervals.length > 0 && (
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <div id="date-time-picker-container" className="flex flex-col md:flex-row md:items-stretch gap-4">
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
              className="flex flex-wrap overflow-y-auto max-h-[280px] lg:flex-1 flex flex-wrap gap-1 overflow-y-auto"
            >
              {" "}
              {timeIntervals.map((time, index) => (
                <div
                  key={time.start.toISOString()}
                  className={`w-full ${isTimeDisabled ? TIME_BTN_DISABLED : TIME_BTN_ACTIVE} ${
                    getTimestamp(selectedTimeSlot) === getTimestamp(time.start)
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-200"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <button
                    className="w-full text-center"
                    name="startTime"
                    value={time.start}
                    type="button"
                    disabled={!configData}
                    onClick={(e) => {
                      let value;
                      const current = getTimestamp(selectedTimeSlot);
                      const clicked = getTimestamp(time.start);
                      value = current === clicked ? "" : time.start;
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
    )
  );
};
