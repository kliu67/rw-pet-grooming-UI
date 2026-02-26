import { t } from "i18next";
import { useState } from "react";

export default function DeleteModal({
  closeModal,
  onSubmit,
  isLoading,
  serverError,
  entityName,
}) {
  const [name, setName] = useState("");
  const [canDelete, setCanDelete] = useState(false);

  function handleChange(e) {
    const value = e.target.value;
    setName(value);
    setCanDelete(value === entityName);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isLoading || !canDelete) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">
        {t("DeleteModal.title", {entity: "Breed"})}
      </h2>
      <p className="text-md text-black-600 mt-1">
        {t("DeleteModal.confirmDelete", { entity: 'breed', entity_name: entityName })}
      </p>
        <p className="text-md text-red-600 mt-1">
        {t("DeleteModal.warning")}
      </p>
      {serverError &&
        <p className="text-sm text-red-600 mt-2">
          {serverError}
        </p>} 
      <input
        autoFocus
        name="name"
        placeholder="Entity Name"
        value={name}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2 mb-3"
        required
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 border rounded-lg"
        >
          {t("general.cancel")}
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-lg
            disabled:bg-gray-400
            disabled:cursor-not-allowed
            disabled:opacity-60"
          disabled={!canDelete || isLoading || serverError}
        >
          {t("general.delete")}
        </button>
      </div>
    </form>
  );
}
