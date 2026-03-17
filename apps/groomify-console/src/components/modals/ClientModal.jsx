import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isValidPhone, isValidEmail } from "@/utils";
import {
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_CLIENT_DESC_LENGTH
} from "@/constants";

export default function ClientModal({
  onClose,
  inputs,
  clientData = {},
  mode,
  onSubmit,
  isLoading
}) {
  //States
  const [form, setForm] = useState({
    first_name: clientData?.name || "",
    last_name: clientData?.last_name || "",
    phone: clientData?.phone || "",
    email: clientData?.email || "",
    description: clientData?.description || ""
  });
  const [touched, setTouched] = useState({});

  const [errors, setErrors] = useState({
    name: "",
    base_price: "",
    description: ""
  });

  const { t } = useTranslation();
  const [serverError, setServerError] = useState(null);

  const isEdit = mode === "edit";

  const modalTexts = {
    heading: isEdit ? t("clients.edit") : t("clients.create"),
    primaryButtonLabel: isEdit ? t("general.update") : t("general.create")
  };

  const validateFields = (field, value) => {
    if (field === "first_name") {
      if (!value) {
        return t("clients.errors.notEmpty", { input: "First Name" });
      } else if (value.length > MAX_FIRST_NAME_LENGTH) {
        return t("clients.errors.first_name");
      }
      return "";
    }

    if (field === "last_name") {
      if (!value) {
        return t("clients.errors.notEmpty", { input: "Last Name" });
      } else if (value.length > MAX_FIRST_NAME_LENGTH) {
        return t("clients.errors.last_name");
      }
      return "";
    }

    if (field === "phone") {
      if (!value) {
        return t("clients.errors.notEmpty", { input: "Phone" });
      } else if (
        !isValidPhone(value) ||
        value.length > MAX_PHONE_LENGTH
      ) {
        return t("clients.errors.phone");
      }
      return "";
    }

    if (field === "email") {
      if (
        value &&
        (!isValidEmail(value) || value.length > MAX_EMAIL_LENGTH)
      ) {
        return t("clients.errors.email");
      }

      return "";
    }

    if (field === "description") {
     if (value && value.length > MAX_CLIENT_DESC_LENGTH) {
        return t("clients.errors.description");
      } else {
        return "";
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServerError(null);
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateFields(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));
  };

  const hasChanges = (current) => {
    return (
      (clientData?.first_name || "").trim() !== current.first_name.trim() ||
      (clientData?.last_name || "").trim() !== current.last_name.trim() ||
      (clientData?.phone || "").trim() !== current.phone.trim() ||
      (clientData?.email || "").trim() !== current.email.trim() ||
      (clientData?.description || "").trim() !== current.description.trim()
    );
  };

  const hasValidationErrors =
    errors.first_name ||
    errors.last_name ||
    errors.phone ||
    errors.email ||
    errors.description;

  const canSubmit =
    !isLoading &&
    !hasValidationErrors &&
    form.first_name &&
    form.last_name &&
    form.phone &&
    ((mode === "edit" && hasChanges(form)) || mode === "create");

  // ---------- Reset form when editing another row ----------
  useEffect(() => {
    setForm({
      first_name: clientData?.name || "",
      last_name: clientData?.last_name || "",
      phone: clientData?.phone || "",
      email: clientData?.email || "",
      description: clientData?.description || ""
    });

    setErrors({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      description: ""
    });

    setServerError(null);
  }, [clientData]);

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
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                phone: form.phone.trim(),
                email: form.email.trim().toLowerCase(),
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

          {/* First Name */}
          <label>{inputs.first_name.displayName}</label>
          {errors.first_name && touched.first_name && (
            <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
          )}
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={inputs.first_name.placeholder}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            autoFocus
            required
          />

          {/* Last Name */}
          <label>{inputs.last_name.displayName}</label>
          {errors.last_name && touched.last_name && (
            <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
          )}
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={inputs.last_name.placeholder}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            required
          />

          {/* Phone */}
          <label>{inputs.phone.displayName}</label>
          {errors.phone && touched.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
          )}
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={inputs.phone.placeholder}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            required
          />

          {/* Email */}
          <label>{inputs.email.displayName}</label>
          {errors.email && touched.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={inputs.email.placeholder}
            className="w-full border rounded-lg px-3 py-2 mb-3"
          />

          {/* Description */}
          <label>{inputs.description.displayName}</label>
          {errors.description && touched.description &&(
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={inputs.description.placeholder}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            rows={3}
          />

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm mb-2">
              {serverError?.error || "Failed to save client"}
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
