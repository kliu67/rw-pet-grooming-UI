import React, { useEffect } from "react";
import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import { CLASSNAMES } from "../styles/classNames";
import { MAX_PET_NAME_LENGTH, INTERVAL_MINUTES } from "../constants";
import { isObjectNotEmpty, getTimestamp } from "@shared-utils";
import { useOpenTimeRanges, getOpenTimeRanges } from "@/hooks/openTimeRanges";
import {
  computeDateTimeIntervals,
  getDaysInMonth,
} from "@/hooks/timeIntervals";
const { BOOKING_MODAL_FIELD_TWO, TIME_BTN_DISABLED, TIME_BTN_ACTIVE } =
  CLASSNAMES;

export const DateTimeStep = ({
  formData = {},
  updateFormData,
  availabilityData = [],
  timeOffsData = [],
  appointmentsData = [],
  configData = {},
  onValidityChange,
  isLoading = false,
  isError = false,
  showErrors = false,
}) => {
  const [date, setDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({
    petName: "",
  });

  const { t } = useTranslation();
  const appointmentsForRanges = useMemo(() => {
    return appointmentsData.map((app) => ({
      startTime: app.start_time,
      endTime: app.effective_end_time,
    }));
  }, [appointmentsData]);

  const openTimeRanges = useOpenTimeRanges({
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

  const isTimeDisabled = !isObjectNotEmpty(configData);
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
    if (!openTimeRanges || !date || !configData) return [];

    return openTimeRanges.flatMap((range) =>
      computeDateTimeIntervals(
        range,
        date,
        configData.duration_minutes,
        INTERVAL_MINUTES,
      ),
    );
  }, [openTimeRanges, date, configData]);

  const validateFields = (field, value) => {
    if (field === "petName") {
      if (!value) {
        return t("pets.errors.notEmpty", { input: "Name" });
      } else if (value.length > MAX_PET_NAME_LENGTH) {
        return t("pets.errors.nameLengthViolation", {
          max: MAX_PET_NAME_LENGTH,
        });
      }
    }
    return "";
  };

  const stepIsValid = validateFields("petName", formData.description) === "";

  const updateFieldError = (name, value) => {
    const errorMsg = validateFields(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const validateField = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    updateFieldError(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if(formData.startTime === value){
      value = '';
    }
    updateFormData(name, value);
    updateFieldError(name, value);
  };

  useEffect(() => {
    onValidityChange(stepIsValid);
  }, [stepIsValid, onValidityChange]);

  useEffect(() => {
    if (!showErrors) return;
    setTouched((prev) => ({
      ...prev,
      petName: true,
    }));
    setErrors((prev) => ({
      ...prev,
      petName: validateFields("petName", formData.description),
    }));
  }, [showErrors, formData.description]);

  return (
    <div className="space-y-4">
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <Label htmlFor="date">{t("bookingModal.date")}</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          className="rounded-md border"
          disabled={isDateDisabled}
        />
      </div>
      {timeIntervals.length > 0 && (
        <div className={BOOKING_MODAL_FIELD_TWO}>
          <Label htmlFor="timeInterval">{t("bookingModal.time")}</Label>
          <div className="flex flex-wrap gap-2 overflow-y-auto">
            {timeIntervals.map((time, index) => (
              <div
                key={time.start.toISOString()}
                className={`${isTimeDisabled ? TIME_BTN_DISABLED : TIME_BTN_ACTIVE} ${
                  new Date(formData.startTime).getTime() === getTimestamp(time.start)
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-200"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <button
                  name="startTime"
                  value={time.start}
                  type="button"
                  disabled={!configData}
                  onClick={handleChange}
                >
                  {`${time.startStrAMPM}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <Label htmlFor="description">{t("bookingModal.message")}</Label>
        <Textarea
          id="description"
          placeholder={t("placeholder.message")}
          className="min-h-32"
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
        />
      </div>
    </div>
  );
};
