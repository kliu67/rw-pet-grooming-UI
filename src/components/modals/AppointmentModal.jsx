import { Fragment, useState, useEffect } from "react";
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
export default function AppointmentModal({
  onClose,
  inputs,
  appointment = {},
  mode,
  onSubmit,
  configs,
  clients,
  breeds,
  pets,
  stylists,
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

  const filteredClients = clients.filter(
    (client) =>
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPets = pets.filter(
    (pet) => pet.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  //   const filteredBreeds = breeds.filter((breed) =>
  //     breed.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   const filteredWeightClasses = weightClassData.filter((wc) =>
  //     wc.label?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

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
    // return (
    //   (petData?.name || "").trim() !== current.name.trim() ||
    //   (petData?.owner?.id || "") !== current.owner.id ||
    //   (petData?.breed?.id || "") !== current.breed.id ||
    //   ((petData?.weightClass?.id || "") !== current.weightClass?.id &&
    //     !!current.weightClass?.id)
    // );
  };

  const canSubmit =
    !isLoading &&
    !hasValidationErrors &&
    form.name &&
    form.owner &&
    form.breed &&
    ((mode === "edit" && hasChanges(form)) || mode === "create");

  // ---------- Reset form when editing another row ----------
  useEffect(() => {
    setForm({
      //   name: petData?.name || "",
      //   owner: petData?.owner || "",
      //   breed: petData?.breed || "",
      //   weightClass: petData?.weightClass || ""
    });
    setErrors({
      name: "",
      owner: "",
      breed: "",
      weightClass: ""
    });

    setServerError(null);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
        <form
          onSubmit={async (e) => {
            // e.preventDefault();
            // if (!canSubmit) return;
            // let delta = {};
            // if (petData?.name !== form?.name?.trim()) {
            //   delta.name = form.name.trim();
            // }
            // if (petData?.owner?.id !== form?.owner?.id) {
            //   delta.owner = form.owner.id;
            // }
            // if (petData?.breed?.id !== form?.breed?.id) {
            //   delta.breed = form.breed.id;
            // }
            // if (petData?.weightClass?.id !== form.weightClass?.id) {
            //   delta.weightClassId = form.weightClass.id;
            // }
            // try {
            //   await onSubmit(delta);
            //   setServerError(null);
            //   onClose();
            // } catch (err) {
            //   setServerError(err);
            // }
          }}
        >
          {/* Header */}

          {/* client */}
          <div className="mt-4 mb-4">
            <label className="mr-2" htmlFor="client">{inputs.client.displayName}</label>
            {/* {errors.first_name && touched.first_name && (
              <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
            )} */}
            <DropdownMenu id="client">
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  {form.client
                    ? `${form.client.last_name}, ${form.client.first_name}`
                    : t('general.select')}{" "}
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
                          client: client
                        }));
                      }}
                    >{`${client.last_name}, ${client.first_name}`}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 mb-4">
            <label className="mr-2" htmlFor="pet">{inputs.pet.displayName}</label>
            <DropdownMenu id="pet">
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  {form.pet ? form.pet.name : t('general.select')}{" "}
                  <span aria-hidden="true">&#9662;</span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownSearch
                  searchTerm={searchTerm}
                  onChange={handleSearchChange}
                ></DropdownSearch>
                {filteredPets.map((pet) => (
                  <Fragment key={pet.id}>
                    <DropdownMenuItem
                      onSelect={() => {
                        setForm((prev) => ({
                          ...prev,
                          pet: pet
                        }));
                      }}
                    >
                      {pet.name}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* <div className="mt-4 mb-4">
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
          </div> */}

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm mb-2">
              {serverError?.error ||
                serverError?.message ||
                "Failed to save pet"}
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
