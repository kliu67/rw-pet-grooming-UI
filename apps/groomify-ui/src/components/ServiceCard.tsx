import { defaultImage } from "../constants";
import { useTranslation } from "react-i18next";
import { serviceTextMap } from "../constants";

const serviceImagePositionMap = {
  FULL_GROOMING: "50% 28%",
  BATH_BRUSH: "50% 32%",
  BASIC_GROOMING: "50% 26%",
  DEMATTING: "50% 28%",
  NAIL_TRIMMING: "50% 28%",
  EAR_CLEANING: "50% 28%",
  CAT_BATH: "50% 30%",
  CAT_BATH_LONG: "50% 30%",
  CAT_HAIR_TRIMMING: "50% 28%",
};

export const ServiceCard = ({
  image = "",
  Icon = "",
  service = {},
  isSelected = false,
  onClick: onSelectService = () => {},
}) => {
  const { t } = useTranslation();
  const { id, name, description, base_price } = service;
  const imagePosition = serviceImagePositionMap[service?.code] || "50% 30%";
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 ${
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
      <div className="h-32 overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          style={{ objectPosition: imagePosition }}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
      </div>
      <div className="p-4">
        {Icon && (
          <div className="mb-2 inline-flex p-2 bg-teal-100 rounded-lg text-teal-600">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-gray-900">
            {t(serviceTextMap[service.code]?.name)}
          </h3>
          <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap">
            {t("bookingModal.startingPrice", { price: base_price })}
          </span>
        </div>
        <p className="text-gray-600 text-xs leading-5 max-h-10 overflow-hidden">
          {t(serviceTextMap[service.code]?.desc)}
        </p>
      </div>
    </div>
  );
};
