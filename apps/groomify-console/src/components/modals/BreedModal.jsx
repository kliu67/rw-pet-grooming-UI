import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MAX_BREED_NAME_LENGTH } from "@/constants";

export default function BreedModal({
  onClose,
  inputs,
  breedData = {},
  mode,
  onSubmit,
  isLoading
}) {
  const [form, setForm] = useState({
    name: breedData?.name || ""
  });
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [serverError, setServerError] = useState(null);

  const { t } = useTranslation();
  const isError = Boolean(nameErrorMsg);
  const isEdit = mode === "edit";
  const modalTexts = {
    heading: isEdit ? t("breeds.edit") : t("breeds.create"),
    primaryButtonLabel: isEdit ? t("general.update") : t("general.create")
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // ----- NAME -----
    if (name === "name") {
      if (value === "") {
        setNameErrorMsg(t("breeds.errors.notEmpty", { input: "Name" }));
      } else if (value.length > MAX_BREED_NAME_LENGTH) {
        setNameErrorMsg(
          t("breeds.errors.name", { max: MAX_BREED_NAME_LENGTH })
        );
      } else {
        setNameErrorMsg("");
      }
    }
    setServerError(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const hasChanges = (current) => {
    return (breedData?.name || "").trim() !== current.name.trim();
  };

  const canSubmit =
    !isLoading &&
    !isError &&
    form.name &&
    ((mode === "edit" && hasChanges(form)) || mode === "create");

  useEffect(() => {
    setForm({ name: breedData?.name || "" });
    setServerError(null);
  }, [breedData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal container */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault(); // 🚨 REQUIRED
            if (isLoading || isError) return;

            try {
              await onSubmit({
                name: form.name.trim()
              });
              setServerError(null);
              onClose();
            } catch (err) {
              setServerError(err);
            }
          }}
        >
          <div className="modal-header">
            <h2 className="text-lg font-semibold mb-4">{modalTexts.heading}</h2>
          </div>
          <div className="modal-body">
            <label htmlFor={inputs.name.id}>{inputs.name.displayName}</label>
            {nameErrorMsg && (
              <p className="text-sm text-red-600 mt-1">{nameErrorMsg}</p>
            )}
            <input
              id={inputs.name.id}
              name={inputs.name.name}
              placeholder={inputs.name.placeholder}
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mb-3"
              required
              autoFocus
            />

            {serverError && (
              <p className="text-red-500 text-sm">
                {serverError.error || "Failed to save breed"}
              </p>
            )}
          </div>
          <div className=" modal-footer flex justify-end gap-2 ">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              {t("general.cancel")}
            </button>

            <button
              type="submit"
              className="
                px-4 py-2 bg-blue-600 text-white rounded-lg
                disabled:bg-gray-400
                disabled:cursor-not-allowed
                disabled:opacity-60"
              disabled={!canSubmit}
            >
              {modalTexts.primaryButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
