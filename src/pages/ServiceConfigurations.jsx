import React, { useState } from "react";
import { Search } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useBreeds } from "@/hooks/breeds";
import { useWeightClasses } from "@/hooks/weightClasses";
import { useServiceConfigurations } from "@/hooks/serviceConfigurations";
import { useServices } from "@/hooks/services";
import { useTranslation } from "react-i18next";
import { Table as ServiceTable } from "@/components/Table";

const columnHelper = createColumnHelper();

export const ServiceConfigurations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  //query hooks
  const {
    data: serviceConfigurationsData = [],
    isLoading: serviceConfigurationsIsLoading,
    error: serviceConfigurationsError
  } = useServiceConfigurations();

  const {
    data: servicesData = [],
    isLoading: servicesIsLoading,
    error: servicesError
  } = useServices();

  const {
    data: breedsData = [],
    isLoading: breedsIsLoading,
    error: breedsError
  } = useBreeds();

  const {
    data: weightClassesData = [],
    isLoading: weightClassesIsLoading,
    error: weightClassesError
  } = useWeightClasses();

  const isLoading =
    serviceConfigurationsIsLoading ||
    servicesIsLoading ||
    breedsIsLoading ||
    weightClassesIsLoading;
  const error =
    serviceConfigurationsError ||
    servicesError ||
    breedsError ||
    weightClassesError;

  /* ---------------- Columns ---------------- */
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("id", {
        header: t("columns.id"),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("service", {
        header: t("columns.service"),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("breed", {
        header: t("columns.breed"),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("weightClass", {
        header: t("columns.weightClass"),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("price", {
        header: t("columns.price"),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("durationMinutes", {
        header: t("columns.duratoin"),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("isActive", {
        header: t("columns.isActive"),
        cell: (info) => (info.getValue() ? "Yes" : "No")
      }),
      columnHelper.accessor("createdAt", {
        header: t("columns.createdAt"),
        cell: (info) => {
          const v = info.getValue();
          return v ? new Date(v).toLocaleDateString() : "-";
        }
      }),
      columnHelper.accessor("updatedAt", {
        header: t("columns.updatedAt"),
        cell: (info) => {
          const v = info.getValue();
          return v ? new Date(v).toLocaleDateString() : "-";
        }
      })

      //ACTIONS COLUMN
    ],
    [t]
  );

  if (isLoading) return <p>{t("general.loading")}</p>;
  if (error) return <p>{t("serviceConfigurations.errors.loading")}</p>;

  const serviceConfigurations = serviceConfigurationsData.map((sc) => {
    const service = servicesData.find((service) => service.id === sc.service_id);
    const breed = breedsData.find((breed) => breed.id === sc.breed_id);
    const weightClass = weightClassesData.find(
      (wc) => wc.id === sc.weight_class_id
    );

    return {
      id: sc.id,
      service: service?.name ?? "-",
      breed: breed?.name ?? "-",
      weightClass: weightClass?.label ?? "-",
      price: sc.price,
      durationMinutes: sc.duration_minutes,
      isActive: sc.is_active,
      createdAt: sc.created_at,
      updatedAt: sc.updated_at
    };
  });

  const filteredServiceConfigurations = serviceConfigurations.filter(
    (sc) =>
      sc.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.weightClass?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("serviceConfigurations.heading")}
          </h1>
          <p className="text-gray-500 mt-1">
            {t("serviceConfigurations.subheading")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("serviceConfigurations.search")}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <ServiceTable
            data={filteredServiceConfigurations}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
};
