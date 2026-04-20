import React from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { useTranslation } from "react-i18next";
import { MAX_PET_NAME_LENGTH } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export const DropdownSearch = ({ searchTerm, onChange }) => {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => onChange(e)}
        />
      </div>
    </div>
  );
};

export default function PetModal({
  onClose,
  inputs,
  petData = {},
  mode,
  onSubmit,
  clientData,
  breedData,
  weightClassData,
  isLoading
}) {
  //States
  const [form, setForm] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const { t } = useTranslation();
  const [serverError, setServerError] = useState(null);

  const isEdit = mode === "edit";
  const hasValidationErrors = errors.name;

  const modalTexts = {
    heading: isEdit ? t("pets.edit") : t("pets.create"),
    primaryButtonLabel: isEdit ? t("general.update") : t("general.create")
  };

  const filteredClients = clientData.filter(
    (client) =>
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWeightClasses = weightClassData.filter((wc) =>
    wc.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchedBreed = useMemo(() => {
    const breedName = form.breed?.trim()?.toLowerCase();
    if (!breedName) return undefined;
    return breedData.find((breed) => breed.name.toLowerCase() === breedName);
  }, [breedData, form.breed]);

  const validateFields = (field, value) => {
    if (isDirty) {
      if (field === "name") {
        if (!value) {
          return t("pets.errors.notEmpty", { input: "Name" });
        } else if (value.length > MAX_PET_NAME_LENGTH) {
          return t("pets.errors.nameLengthViolation", {
            max: MAX_PET_NAME_LENGTH
          });
        }
      }
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServerError(null);
    setIsDirty(true);

    const errorMsg = validateFields(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setSearchTerm("");
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const hasChanges = (current) => {
    return (
      (petData?.name || "").trim() !== current.name.trim() ||
      (petData?.owner?.id || "") !== current.owner.id ||
      (petData?.breed?.id || "") !== matchedBreed?.id ||
      (petData?.species || "") !== (current.species || "") ||
      ((petData?.weightClass?.id || "") !== current.weightClass?.id &&
        !!current.weightClass?.id)
    );
  };

  const canSubmit =
    !isLoading &&
    !hasValidationErrors &&
    form.name &&
    form.owner &&
    form.breed &&
    form.species &&
    matchedBreed &&
    form.weightClass &&
    ((mode === "edit" && hasChanges(form)) || mode === "create");

  // ---------- Reset form when editing another row ----------
  useEffect(() => {
    setForm({
      name: petData?.name || "",
      owner: petData?.owner || "",
      breed: petData?.breed?.name || "",
      species: petData?.species || "",
      weightClass: petData?.weightClass || ""
    });
    setErrors({
      name: "",
      owner: "",
      breed: "",
      species: "",
      weightClass: ""
    });

    setServerError(null);
  }, [petData]);

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
            let delta = {};
            if (petData?.name !== form?.name?.trim()) {
              delta.name = form.name.trim();
            }
            if (petData?.owner?.id !== form?.owner?.id) {
              delta.owner = form.owner.id;
            }
            if (petData?.breed?.id !== matchedBreed?.id) {
              delta.breed = matchedBreed?.id;
            }
            if (petData?.species !== form?.species) {
              delta.species = form.species;
            }
            if (petData?.weightClass?.id !== form.weightClass?.id) {
              delta.weight_class_id = form.weightClass.id;
            }

            try {
              await onSubmit(delta);
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
          <label htmlFor="name">{inputs.name.displayName}</label>
          {errors.name && touched.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
          <input
            name="name"
            value={form.name ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={inputs.name.placeholder}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            autoFocus
            required
          />
          <fieldset className="mb-3">
            <legend className="mb-2">
              {inputs.species?.displayName || "Species"}
            </legend>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="species"
                  value="dog"
                  checked={form.species === "dog"}
                  onChange={handleChange}
                  required
                />
                Dog
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="species"
                  value="cat"
                  checked={form.species === "cat"}
                  onChange={handleChange}
                  required
                />
                Cat
              </label>
            </div>
          </fieldset>
          <div className="mt-4 mb-4">
            <DropdownMenu id="owner">
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  {form.owner
                    ? `${form.owner.last_name}, ${form.owner.first_name}`
                    : inputs.owner.placeholder}{" "}
                  <span aria-hidden="true">&#9662;</span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownSearch
                  searchTerm={searchTerm}
                  onChange={handleSearchChange}
                ></DropdownSearch>
                {filteredClients.map((client) => (
                  <Fragment key={client.id}>
                    <DropdownMenuItem
                      onSelect={() => {
                        setForm((prev) => ({
                          ...prev,
                          owner: client
                        }));
                      }}
                    >{`${client.last_name}, ${client.first_name}`}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <label htmlFor="breed">{inputs.breed.displayName}</label>
          <input
            id="breed"
            name="breed"
            value={form.breed ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={inputs.breed.placeholder}
            list="breed-options"
            className="w-full border rounded-lg px-3 py-2 mb-3"
            required
          />
          <datalist id="breed-options">
            {breedData.map((breed) => (
              <option key={breed.id} value={breed.name} />
            ))}
          </datalist>
          <div className="mt-4 mb-4">
            <DropdownMenu id="weightClass">
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  {form.weightClass
                    ? form.weightClass.label
                    : inputs.weightClass.placeholder}{" "}
                  <span aria-hidden="true">&#9662;</span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {filteredWeightClasses.map((wc) => (
                  <Fragment key={wc.id}>
                    <DropdownMenuItem
                      onSelect={() => {
                        setForm((prev) => ({
                          ...prev,
                          weightClass: wc
                        }));
                      }}
                    >
                      {wc.label}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm mb-2">
              {serverError?.error || serverError?.message || "Failed to save pet"}
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
