import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export const DropdownSearch = ({ searchTerm, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={t('general.search')}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => onChange(e)}
        />
      </div>
    </div>
  );
};