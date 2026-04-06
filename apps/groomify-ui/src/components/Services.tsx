import React from "react";
import { Scissors, Droplets, Heart, Sparkles, Brush } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useServices } from "../hooks/services";
import { mapWeightClassLabel } from "@shared-utils";
import { useDistinctConfigsByServiceIds } from "@/hooks/serviceConfigurations";
import fullServiceImage from "../static/img/full_service.webp";
import bathImage from "../static/img/bath.webp";
import basicServiceImage from "../static/img/basic_service.webp";
import demattingImage from "../static/img/dematting.webp";
import nailClippingImage from "../static/img/nail_clipping.webp";
import earCleaningImage from "../static/img/ear_cleaning.webp";

type Service = {
  id: number;
  name: string;
  base_price: string;
  description: string;
  uuid: string;
};
const iconMap = {
  FULL_GROOMING: Scissors,
  BATH_BRUSH: Droplets,
  BASIC_GROOMING: Heart,
  DEMATTING: Brush,
  NAIL_TRIMMING: Scissors,
  EAR_CLEANING: Sparkles,
};

const imageMap = {
  FULL_GROOMING: fullServiceImage,
  BATH_BRUSH: bathImage,
  BASIC_GROOMING: basicServiceImage,
  DEMATTING: demattingImage,
  NAIL_TRIMMING: nailClippingImage,
  EAR_CLEANING: earCleaningImage,
};
const defaultImage = fullServiceImage;

export const Services = ({}) => {
  const { t } = useTranslation();
  const { data: serviceList = [], isLoading, error } = useServices();
  const serviceIds = serviceList.map((service) => service.id).filter(Boolean);

  const configQueries = useDistinctConfigsByServiceIds({
    serviceIds,
    enabled: !isLoading && !error && serviceIds.length > 0,
  });

  const configsData = configQueries.flatMap((q) => q.data ?? []);
  const configsIsLoading = configQueries.some((q) => q.isLoading);
  const configsError = configQueries.find((q) => q.error)?.error ?? null;

  const services = serviceList.map((service) => ({
    name: service.name,
    price: `From $${service.base_price}`,
    description: service.description,
    code: service.code,
    configs: configsData.filter((config) => config?.service_id === service?.id),
  }));

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Grooming Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We use premium, organic products suited for your pet's specific coat
            type. Prices vary based on size and coat condition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service?.code] ?? Scissors;
            const image = imageMap[service?.code] ?? defaultImage;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={image}
                    alt={service.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    {/* <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                      {service.price}
                    </span> */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service?.configs.length > 0 &&
                      service?.configs.map((config) => {
                        const label = mapWeightClassLabel(config.weight_class_label);
                        const lower = config.weight_class_range[0];
                        const upper = config.weight_class_range[1];
                        const price = config.price;
                        const str = `${label} (${lower}${t("general.pounds")} - ${upper}${t("general.pounds")}) - $${price}`;
                        return <p>{str}</p>;
                      })}
                    {/* {service.description} */}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
