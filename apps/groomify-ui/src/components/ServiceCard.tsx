import { defaultImage } from "../constants";
import { useTranslation } from "react-i18next";
import { serviceNameMap } from "../constants";
export const ServiceCard = ({
  image = "",
  Icon = "",
  service = {},
  isSelected = false,
  onClick: onSelectService = () => {},
}) => {
  const { t } = useTranslation();
  const { id, name, description, base_price } = service;
  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 ${
        isSelected
          ? "border-teal-700 ring-2 ring-teal-400/60 shadow-[0_0_0_3px_rgba(20,184,166,0.25)]"
          : "border-transparent hover:border-teal-300"
      }`}
      role="button"
      tabIndex={0}
      onClick={() => onSelectService("service", service)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelectService("serviceId", service);
      }}
    >
      <div className="h-36 overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          {Icon && (
            <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded">
            {t("bookingModal.startingPrice", { price: base_price })}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t(serviceNameMap[service.code])}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
