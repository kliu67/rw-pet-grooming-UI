import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isValidPrice } from "@/utils";
import {
  MAX_SERVICE_NAME_LENGTH,
  MAX_SERVICE_DESC_LENGTH,
  MAX_SERVICE_BASE_PRICE_VALUE
} from "@/constants";

export default function CreateServiceModal({
  closeModal,
  onSubmit,
  inputs,
  isLoading,
  serverError
}) {
  const [form, setForm] = useState({
    name: "",
    base_price: "",
    description: ""
  });

  const { t } = useTranslation();
    const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [basePriceErrorMsg, setBasePriceErrorMsg] = useState("");
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");

  const isError = Boolean(
    nameErrorMsg || basePriceErrorMsg || descriptionErrorMsg
  );

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    // ----- NAME -----
    if (name === "name") {
      if (value === "") {
        setNameErrorMsg(t("services.errors.notEmpty", { input: "Name" }));
      } else if (value.length > MAX_SERVICE_NAME_LENGTH) {
        setNameErrorMsg(t("services.errors.name"));
      } else {
        setNameErrorMsg("");
      }
    }

    // ----- PRICE -----
    if (name === "base_price") {
      if (value === "") {
        setBasePriceErrorMsg(
          t("services.errors.notEmpty", { input: "Base price" })
        );
      } else if (
        !isValidPrice(value) ||
        Number(value) > MAX_SERVICE_BASE_PRICE_VALUE
      ) {
        setBasePriceErrorMsg(t("services.errors.base_price"));
      } else {
        setBasePriceErrorMsg("");
      }
    }

    // ----- DESCRIPTION -----
    if (name === "description") {
      if (value === "") {
        setDescriptionErrorMsg(
          t("services.errors.notEmpty", { input: "Description" })
        );
      } else if (value.length > MAX_SERVICE_DESC_LENGTH) {
        setDescriptionErrorMsg(t("services.errors.description"));
      } else {
        setDescriptionErrorMsg("");
      }
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (isLoading || isError) return;
    console.log("Creating:", form);
    onSubmit({
      name: form.name.trim(),
      base_price: Number(form.base_price),
      description: form.description.trim()
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">
        {t("service.create")}
      </h2>
      <label htmlFor={inputs.name.id}>
        {inputs.name.placeholder}
      </label>
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
      />
      <label htmlFor={inputs.base_price.id}>
        {inputs.base_price.placeholder}
      </label>
    {basePriceErrorMsg && (
          <p className="text-sm text-red-600 mt-1">{basePriceErrorMsg}</p>
        )}
      <input
        id={inputs.base_price.id}
        name={inputs.base_price.name}
        placeholder={inputs.base_price.placeholder}
        type="number"
        step="0.01"
        min="0"
        max={MAX_SERVICE_BASE_PRICE_VALUE}
        value={form.base_price}
        className="w-full border rounded-lg px-3 py-2 mb-3"
        onChange={handleChange}
        required
      />
      <label htmlFor={inputs.description.id}>
        {inputs.description.placeholder}
      </label>
      {descriptionErrorMsg && (
          <p className="text-sm text-red-600 mt-1">{descriptionErrorMsg}</p>
        )}
      <textarea
        id={inputs.description.id}
        name={inputs.description.name}
        label={inputs.description.name}
        placeholder={inputs.description.placeholder}
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2 mb-4"
      />

      <div className="flex justify-end gap-2">
        {serverError &&
          <p className="text-red-500 text-sm">
            {serverError}
          </p>}
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="
                    px-4 py-2 bg-blue-600 text-white rounded-lg
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                    disabled:opacity-60"
          disabled={
            isLoading ||
            isError ||
            !form.name ||
            form.base_price === "" ||
            !form.description
          }
        >
          Save
        </button>
      </div>
    </form>
  );
}
