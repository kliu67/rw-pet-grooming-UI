import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import { CLASSNAMES } from "../styles/classNames";
import { MAX_PET_NAME_LENGTH } from "../constants";

const { BOOKING_MODAL_FIELD_TWO } = CLASSNAMES;

export const DateTimeStep = ({
  formData = {},
  updateFormData,
  availabilityData = [],
  timeOffsData = [],
  appointmentData = [],
  onValidityChange,
  showErrors = false
}) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({
    petName: ""
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { t } = useTranslation();

  const validateFields = (field, value) => {
    if (field === "petName") {
      if (!value) {
        return t("pets.errors.notEmpty", { input: "Name" });
      } else if (value.length > MAX_PET_NAME_LENGTH) {
        return t("pets.errors.nameLengthViolation", {
          max: MAX_PET_NAME_LENGTH
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
      [name]: errorMsg
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
    const { name, value } = e.target;
    updateFormData(name, value);
    updateFieldError(name, value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    onValidityChange(stepIsValid);
  }, [stepIsValid, onValidityChange]);

  useEffect(() => {
    if (!showErrors) return;
    setTouched((prev) => ({
      ...prev,
      petName: true
    }));
    setErrors((prev) => ({
      ...prev,
      petName: validateFields("petName", formData.description)
    }));
  }, [showErrors, formData.description]);

  return (
        <div className="space-y-4">
            <div className={BOOKING_MODAL_FIELD_TWO}>
              <Label htmlFor="date">{t("bookingModal.date")}</Label>
              <Calendar></Calendar>
            </div>
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
