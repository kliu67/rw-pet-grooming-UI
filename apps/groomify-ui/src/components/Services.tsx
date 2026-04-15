import React from "react";
import { Scissors, Droplets, Heart, Sparkles, Brush } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useServices } from "../hooks/services";
import { mapWeightClassLabel } from "@shared-utils";
import { useDistinctConfigsByServiceIds } from "@/hooks/serviceConfigurations";
import { serviceImageMap, serviceTextMap, iconMap, defaultImage, SPECIES } from "../constants";

type Service = {
  id: number;
  name: string;
  base_price: string;
  description: string;
  uuid: string;
};

const { DOG, CAT } = SPECIES;

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
    species: service.service_species,
    configs: configsData.filter((config) => config?.service_id === service?.id),
  }));

  const dogServices = services.filter((s) => s.species === DOG);
  const catServices = services.filter((s) => s.species === CAT);

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('services.title')}
          </h2>
          {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We use premium, organic products suited for your pet's specific coat
            type. Prices vary based on size and coat condition.
          </p> */}
        </div>

        {dogServices.length > 0 && (
          <div
            id="dog-services"
            className="border border-gray-300 rounded-2xl shadow-md p-6 mb-10"
          >
            <div className="text-center py-4 mb-6">
              <p className="text-2xl md:text-3xl font-semibold text-gray-600">
                {t("services.dog.title")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dogServices.length > 0 &&
                dogServices.map((service, index) => {
                  const Icon = iconMap[service?.code] ?? Scissors;
                  const image = serviceImageMap[service?.code] ?? defaultImage;
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
                            {/* {service.name} */}
                            {
                              t(serviceTextMap[service.code]?.name)
                            }
                          </h3>
                          <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {service?.configs.length > 0 &&
                            service?.configs.map((config) => {
                              const label = mapWeightClassLabel(
                                config.weight_class_label,
                              );
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
        )}
        {catServices.length > 0 && (
          <div
            id="cat-services"
            className="border border-gray-300 rounded-2xl shadow-md p-6"
          >
            <div className="text-center py-4 mb-6">
              <p className="text-2xl md:text-3xl font-semibold text-gray-600">
                {t("services.cat.title")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {catServices.map((service, index) => {
                const Icon = iconMap[service?.code] ?? Scissors;
                const image = serviceImageMap[service?.code] ?? defaultImage;
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
                            {t(serviceTextMap[service.code]?.name)}
                        </h3>
                        <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service?.configs.length > 0 &&
                          service?.configs.map((config) => {
                            const label = mapWeightClassLabel(
                              config.weight_class_label,
                            );
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
        )}
      </div>
    </section>
  );
};
