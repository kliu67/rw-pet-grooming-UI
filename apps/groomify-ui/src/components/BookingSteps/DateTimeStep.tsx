import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBooking } from "@/context/BookingContext";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { CLASSNAMES } from "../../styles/classNames";
import { MAX_PET_NAME_LENGTH } from "../../constants";
import { DateTimePicker } from "../DateTimePicker";
const { BOOKING_MODAL_FIELD_TWO } =
  CLASSNAMES;

export const DateTimeStep = ({
  availabilityData = [],
  timeOffsData = [],
  appointmentsData = [],
  configData = {},
  onValidityChange,
  isLoading = false,
  isError = false,
  showErrors = false,
}) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({
    petName: "",
  });

  const { t } = useTranslation();
  const { bookingData, updateBookingData } = useBooking();

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

  const stepIsValid = validateFields("petName", bookingData.description) === "";

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
    if (bookingData.startTime === value) {
      value = "";
    }
    updateBookingData({ [name]: value });
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
      petName: validateFields("petName", bookingData.description),
    }));
  }, [showErrors, bookingData.description]);

  return (
    <div className="space-y-4">
      <div className={`${BOOKING_MODAL_FIELD_TWO}`}>
        <DateTimePicker
          configData={configData}
          availabilityData={availabilityData}
          timeOffsData={timeOffsData}
          appointmentsData={appointmentsData}
          onSelect={handleChange}
          isLoading={false}
          isError={false}
        />
      </div>
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <Label htmlFor="description">{t("bookingModal.message")}</Label>
        {errors.description && touched.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
        <Textarea
          id="description"
          placeholder={t("placeholder.message")}
          className="min-h-32"
          value={bookingData.description}
          onChange={(e) => updateBookingData({ description: e.target.value })}
        />
      </div>
    </div>
  );
};
