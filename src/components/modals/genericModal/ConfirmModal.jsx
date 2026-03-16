import { t } from "i18next";

export default function ConfirmModal({
  closeModal,
  title = "",
  message = "",
  primaryLabel = "",
  onSubmit = ()=>{},
}) {

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <p className="text-md text-black-600 mt-1">
        {message}
      </p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={()=>closeModal()}
          className="px-4 py-2 border rounded-lg transition-colors hover:bg-gray-100 hover:border-gray-300"
        >
          {t('general.cancel')}
        </button>

        <button
          type="primary"
           onClick={()=>onSubmit()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg transition-colors hover:bg-red-700"
          // disabled={!canDelete || isLoading || serverError}
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}
