import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isValidPrice } from "@shared-utils";
import {
  MAX_SERVICE_NAME_LENGTH,
  MAX_SERVICE_DESC_LENGTH,
  MAX_SERVICE_BASE_PRICE_VALUE
} from "@/constants";

export default function ServiceModal({
  onClose,
  inputs,
  serviceData = {},
  mode,
  onSubmit,
  isLoading
}) {
  //States
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [basePriceErrorMsg, setBasePriceErrorMsg] = useState("");
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: serviceData?.name || "",
    base_price: serviceData?.base_price || "",
    description: serviceData?.description || ""
  });

  const [errors, setErrors] = useState({
    name: "",
    base_price: "",
    description: ""
  });

  const { t } = useTranslation();
  const [serverError, setServerError] = useState(null);

  const isEdit = mode === "edit";

  const modalTexts = {
    heading: isEdit ? t("services.edit") : t("services.create"),
    primaryButtonLabel: isEdit ? t("general.update") : t("general.create")
  };

  const validateFields = (name, value) => {
    // ----- NAME -----
    if (name === "name") {
      if (!value) {
        return t("services.errors.notEmpty", { input: "Name" });
      } else if (value.length > MAX_SERVICE_NAME_LENGTH) {
        return t("services.errors.name");
      } 
        return '';
    }

    // ----- PRICE -----
    if (name === "base_price") {
      if (!value) {
        return t("services.errors.notEmpty", { input: "Base price" });
      } else if (
        !isValidPrice(value) ||
        Number(value) > MAX_SERVICE_BASE_PRICE_VALUE
      ) {
        return t("services.errors.base_price");
      } else {
        return '';
      }
    }

    // ----- DESCRIPTION -----
    if (name === "description") {
      if (!value) {
        return t("services.errors.notEmpty", { input: "Description" });
      } else if (value.length > MAX_SERVICE_DESC_LENGTH) {
        return t("services.errors.description");
      } else {
        return ;;;
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateFields(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));

    setServerError(null);
      setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const hasChanges = (current) => {
    return (
      (serviceData?.name || "").trim() !== current.name.trim() ||
      String(serviceData?.base_price || "") !== String(current.base_price) ||
      (serviceData?.description || "").trim() !== current.description.trim()
    );
  };

  const hasValidationErrors =
    errors.name || errors.base_price || errors.description;

  const canSubmit =
    !isLoading &&
    !hasValidationErrors &&
    form.name &&
    form.base_price &&
    ((mode === "edit" && hasChanges(form)) || mode === "create");

  // ---------- Reset form when editing another row ----------
  useEffect(() => {
    setForm({
      name: serviceData?.name || "",
      base_price: serviceData?.base_price || "",
      description: serviceData?.description || ""
    });

    setErrors({
      name: "",
      base_price: "",
      description: ""
    });

    setServerError(null);
  }, [serviceData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSubmit) return;

            try {
              await onSubmit({
                name: form.name.trim(),
                base_price: Number(form.base_price),
                description: form.description.trim()
              });

              setServerError(null);
              onClose();
            } catch (err) {
              setServerError(err);
            }
          }}
        >
          {/* Header */}
          <h2 className="text-lg font-semibold mb-4">{modalTexts.heading}</h2>

          {/* Name */}
          <label>{inputs.name.displayName}</label>
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={inputs.name.placeholder}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            autoFocus
            required
          />

          {/* Base Price */}
          <label>{inputs.base_price.displayName}</label>
          {errors.base_price && (
            <p className="text-sm text-red-600 mt-1">{errors.base_price}</p>
          )}
          <input
            name="base_price"
            type="number"
            step="0.01"
            min="0"
            value={form.base_price}
            onChange={handleChange}
            placeholder={inputs.base_price.placeholder}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            required
          />

          {/* Description */}
          <label>{inputs.description.displayName}</label>
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder={inputs.description.placeholder}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            rows={3}
          />

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm mb-2">
              {serverError?.error || "Failed to save service"}
            </p>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              {t("general.cancel")}
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg
                disabled:bg-gray-400
                disabled:cursor-not-allowed
                disabled:opacity-60"
            >
              {modalTexts.primaryButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
