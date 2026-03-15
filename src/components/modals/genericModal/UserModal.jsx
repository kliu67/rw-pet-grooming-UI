import { t } from "i18next";
import { useState } from "react";
import { CONFIRM_DELETE } from "@/constants";

export default function UserModal({ closeModal, user }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t("userModal.heading")}</h2>
      <p className="text-md text-black-600 mt-1">
        {t("userModal.fields.firstName")}
      </p>
        <p className="text-md text-black-600 mt-1">
        {user?.first_name}
      </p>
      <p className="text-md text-black-600 mt-1">
        {t("userModal.fields.lastName")}
      </p>
         <p className="text-md text-black-600 mt-1">
        {user?.last_name}
      </p>
      <p className="text-md text-black-600 mt-1">
        {t("userModal.fields.email")}
      </p>
         <p className="text-md text-black-600 mt-1">
        {user?.email}
      </p>
      <p className="text-md text-black-600 mt-1">
        {t("userModal.fields.phone")}
      </p>
         <p className="text-md text-black-600 mt-1">
        {user?.phone}
      </p>
      <p className="text-md text-black-600 mt-1">
        {t("userModal.fields.role")}
      </p>
         <p className="text-md text-black-600 mt-1">
        {user?.role}
      </p>

      {/* {serverError && (
        <p className="text-sm text-red-600 mt-2">{serverError}</p>
      )} */}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 border rounded-lg"
        >
          {t("general.cancel")}
        </button>
      </div>
    </div>
  );
}
