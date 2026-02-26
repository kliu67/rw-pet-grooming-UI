import { t } from "i18next";
import { useState } from "react";

export default function DeleteModal({
  closeModal,
  onSubmit,
  isLoading,
  serverError,
  row
}) {
  const [name, setName] = useState("");
  const [canDelete, setCanDelete] = useState(false);

  function handleChange(e) {
    const value = e.target.value;
    setName(value);
    setCanDelete(value === row.name);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isLoading || !canDelete) return;
    onSubmit(row.id);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">
        {t("general.delete")}
      </h2>
      <p className="text-xs text-red-600 mt-1">
        {t("general.confirmDelete", { row: row.name })}
      </p>
      {serverError &&
        <p className="text-sm text-red-600 mt-2">
          {serverError}
        </p>}
      <input
        autoFocus
        name="name"
        placeholder="Row Name"
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
