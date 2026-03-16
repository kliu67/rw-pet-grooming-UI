import { Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";
export const EmptyState = ({}) => {
    const { t } = useTranslation();
  return (
    <div className="p-6 border-b border-gray-100">
      <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
        <Scissors className="h-6 w-6" />
        <span>Groomify</span>
      </h1>
      <p>{t('general.loginRequireMessage')}</p>
    </div>
  );
};
