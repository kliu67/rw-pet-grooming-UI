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
import { CLASSNAMES } from "../styles/classNames";
import { MAX_PET_NAME_LENGTH } from "../constants";
import { DropdownSearch } from "./DropdownSearch";
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

  const stepIsValid = validateFields("petName", formData.petName) === "";

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
      petName: validateFields("petName", formData.petName)
    }));
  }, [showErrors, formData.petName]);

  return (
    <div className="space-y-4">
      <div className={BOOKING_MODAL_FIELD_TWO}>
        <Label htmlFor="pet-name">{t("bookingModal.petName")}</Label>
        {errors.petName && touched.petName && (
          <p className="text-sm text-red-600 mt-1">{errors.petName}</p>
        )}
        <Input
          id="pet-name"
          name="petName"
          placeholder={t("placeholder.petName")}
          value={formData.petName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {breedsData.length > 1 && (
        <div className={BOOKING_MODAL_FIELD_TWO}>
          <Label htmlFor="breed">{t("bookingModal.breed")}</Label>
          <Select
            name="breed"
            value={formData.breedId}
            onValueChange={(value) => updateFormData("breedId", value)}
          >
            <SelectTrigger id="breedId">
              <SelectValue placeholder={t("placeholder.breed")} />
            </SelectTrigger>
            <SelectContent>
              <DropdownSearch
                searchTerm={searchTerm}
                onChange={handleSearchChange}
              ></DropdownSearch>
              {breedsData.map((breed) => (
                <SelectItem key={breed?.id} value={breed?.id}>
                  {breed?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {weightClassesData.length > 1 && (
        <div className={BOOKING_MODAL_FIELD_TWO}>
          <Label htmlFor="weight-class">{t("bookingModal.weight")}</Label>
          <Select
          name="weight-class"
            value={formData.weightClassId}
            onValueChange={(value) => updateFormData("weightClassId", value)}
          >
            <SelectTrigger id="weightClassId">
              <SelectValue placeholder={t("placeholder.weight")} />
            </SelectTrigger>
            <SelectContent>
              {weightClassesData.map((weight) => (
                <SelectItem key={weight?.id} value={weight?.id}>
                  <span className="font-semibold">{weight?.label}</span>{" "}
                  <span>
                    {weight?.weight_bounds[0]}-{weight?.weight_bounds[1]}
                  </span>{" "}
                  <span className="text-gray-600 text-sm">
                    {t("pets.pounds")}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
