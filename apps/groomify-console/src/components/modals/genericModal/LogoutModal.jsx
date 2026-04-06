import React from "react";
import { t } from "i18next";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";


export default function LogoutModal({
  closeModal,
  title = "",
  message = "",
  primaryLabel = "",
}) {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t("toast.logoutSuccess"));
      closeModal();
    } catch (err) {
      toast.error(
        `Logout failed: ${err?.status} - ${err?.message || err?.error}`
      );
    }
  };
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <p className="text-md text-black-600 mt-1">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => closeModal()}
          className="px-4 py-2 border rounded-lg transition-colors hover:bg-gray-100 hover:border-gray-300"
        >
          {t("general.cancel")}
        </button>

        <button
          type="primary"
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg transition-colors hover:bg-red-700"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}
