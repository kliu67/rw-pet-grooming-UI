import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  isValidPhone,
  isValidEmail,
  areAllObjectKeysEmpty
} from "@shared-utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { CLASSNAMES } from "../styles/classNames";
import { MAX_PET_NAME_LENGTH } from "../constants";
const { BOOKING_MODAL_FIELD_TWO } = CLASSNAMES;
export const PetStep = ({
  formData = {},
  updateFormData,
  breedsData = [],
  weightClassesData = [],
  onValidityChange,
  showErrors = false
}) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({
    petName: ""
  });
  const { t } = useTranslation();
  const { petName } = formData;
  // const weightMapping={
  //   SMALL: `$${t('pets.pounds')}`
  //   MEDIUM:
  //   LARGE:
  //   XLARGE:
  // }
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
  const stepIsValid = areAllObjectKeysEmpty(errors) && formData.petName;

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
      petName: true
    }));
    setErrors((prev) => ({
      ...prev,
      petName: validateFields("petName", formData.petName)
    }));
  }, [showErrors, formData.petName]);

  return (
    <div className="space-y-4">
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <Label htmlFor="pet-name">{t("bookingModal.petName")}</Label>
        <Input
          id="pet-name"
          placeholder={t("placeholder.petName")}
          value={formData.petName}
          onChange={(e) => updateFormData("petName", e.target.value)}
        />
      </div>
      {breedsData.length > 1 && (
        <div className={BOOKING_MODAL_FIELD_TWO}>
          <Label htmlFor="breed">{t("bookingModal.breed")}</Label>
          <Select
            value={formData.breed}
            onValueChange={(value) => updateFormData("breed", value)}
          >
            <SelectTrigger id="breed">
              <SelectValue placeholder={t("placeholder.breed")} />
            </SelectTrigger>
            <SelectContent>
              {breedsData.map((breed) => (
                <SelectItem value={breed?.id}>{breed?.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {weightClassesData.length > 1 && (
        <div className={BOOKING_MODAL_FIELD_TWO}>
          <Label htmlFor="weight">{t("bookingModal.weight")}</Label>
          <Select
            value={formData.weight}
            onValueChange={(value) => updateFormData("weight", value)}
          >
            <SelectTrigger id="weight">
              <SelectValue placeholder={t("placeholder.weight")} />
            </SelectTrigger>
            <SelectContent>
              {weightClassesData.map((weight) => (
                <SelectItem value={weight.id}>
                  <span className="font-semibold">{weight.label}</span>{" "}
                  <span>
                    {weight.weight_bounds[0]}–{weight.weight_bounds[1]}
                  </span>{" "}
                  <span className="text-gray-600 text-sm">{t("pets.pounds")}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
