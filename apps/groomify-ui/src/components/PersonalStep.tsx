import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isValidPhone, isValidEmail } from "@shared-utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { CLASSNAMES } from "../styles/classNames";
import {
  MAX_FIRST_NAME_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_EMAIL_LENGTH
} from "../constants";
const { BOOKING_MODAL_FIELD_TWO } = CLASSNAMES;
export const PersonalStep = ({
  formData = {},
  updateFormData,
  onValidityChange,
  showErrors = false
}) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: ""
  });
  const { t } = useTranslation();
  const { firstName, lastName, phone, email } = formData;
  const validateFields = (field, value) => {
    if (field === "firstName") {
      if (!value) {
        return t("clients.errors.notEmpty", { input: "First Name" });
      } else if (value.length > MAX_FIRST_NAME_LENGTH) {
        return t("clients.errors.firstName", { max: MAX_FIRST_NAME_LENGTH });
      }
      return "";
    }

    if (field === "lastName") {
      if (!value) {
        return t("clients.errors.notEmpty", { input: "Last Name" });
      } else if (value.length > MAX_FIRST_NAME_LENGTH) {
        return t("clients.errors.lastName", { max: MAX_FIRST_NAME_LENGTH });
      }
      return "";
    }

    if (field === "phone") {
      if (!value) {
        return t("clients.errors.notEmpty", { input: "Phone" });
      } else if (!isValidPhone(value) || value.length > MAX_PHONE_LENGTH) {
        return t("clients.errors.phone", { max: MAX_PHONE_LENGTH });
      }
      return "";
    }

    if (field === "email") {
      if (value && (!isValidEmail(value) || value.length > MAX_EMAIL_LENGTH)) {
        return t("clients.errors.email", { max: MAX_EMAIL_LENGTH });
      }

      return "";
    }
    return "";
  };
  const stepIsValid =
    validateFields("firstName", formData.firstName) === "" &&
    validateFields("lastName", formData.lastName) === "" &&
    validateFields("phone", formData.phone) === "";

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

  useEffect(() => {
    onValidityChange(stepIsValid);
  }, [stepIsValid, onValidityChange]);

  useEffect(() => {
    if (!showErrors) return;
    setTouched((prev) => ({
      ...prev,
      firstName: true,
      lastName: true,
      phone: true,
      email: true
    }));
    setErrors((prev) => ({
      ...prev,
      firstName: validateFields("firstName", formData.firstName),
      lastName: validateFields("lastName", formData.lastName),
      phone: validateFields("phone", formData.phone),
      email: validateFields("email", formData.email)
    }));
  }, [
    showErrors,
    formData.firstName,
    formData.lastName,
    formData.phone,
    formData.email
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-red-600">
        <span className="text-red-600">*</span>
        <p className="text-sm text-gray-800">
          {t("bookingModal.requiredMessage")}
        </p>
      </div>
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <Label htmlFor="firstName">
          {t("bookingModal.firstName")}
          <span className="text-red-600 ml-1">*</span>
        </Label>
        {errors.firstName && touched.firstName && (
          <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
        )}
        <Input
          id="firstName"
          name="firstName"
          required
          placeholder={t("placeholder.firstName")}
          value={firstName}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <Label htmlFor="lastName">
          {t("bookingModal.lastName")}
          <span className="text-red-600 ml-1">*</span>
        </Label>
        {errors.lastName && touched.lastName && (
          <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
        )}
        <Input
          id="lastName"
          name="lastName"
          required
          placeholder={t("placeholder.lastName")}
          value={lastName}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <Label htmlFor="phone">
          {t("bookingModal.phone")}
          <span className="text-red-600 ml-1">*</span>
        </Label>
        {errors.phone && touched.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder={t("placeholder.phone")}
          value={phone}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <Label htmlFor="email">{t("bookingModal.email")}</Label>
        {errors.email && touched.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
        )}
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("placeholder.email")}
          value={email}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
