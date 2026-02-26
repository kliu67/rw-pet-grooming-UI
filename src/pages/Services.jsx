import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  createColumnHelper,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../api/services";
import { useTranslation } from "react-i18next";
import { useModal } from "@/components/modal/ModalProvider";
import ServiceModal from "@/components/modal/types/ServiceModal";
import { Table as ServiceTable } from "@/components/Table";
import { MODAL_TYPES } from "@/components/modal/modalRegistry";
import {
  useCreateService,
  useUpdateService,
  useDeleteService
} from "@/hooks/service";
import { RowActionsMenu } from "@/components/RowActionDropdown";

const columnHelper = createColumnHelper();

export const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [service, setService] = useState({})
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  //query hooks
  const {
    data = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["services"],
    queryFn: getServices
  });

  const serviceInputs = React.useMemo(
    () => ({
      name: {
        id: "services-name",
        name: "name",
        displayName: "Name",
        placeholder: t("services.placeholderText.name"),
        errorMsg: t("services.errors.name")
      },
      base_price: {
        id: "services-base_price",
        name: "base_price",
        displayName: "Base price",
        placeholder: t("services.placeholderText.base_price"),
        errorMsg: t("services.errors.base_price")
      },
      description: {
        id: "services_description",
        name: "description",
        displayName: "Description",
        placeholder: t("services.placeholderText.description"),
        errorMsg: t("services.errors.description")
      }
    }),
    [t]
  );

    const isSubmitting =
    mode === "create"
      ? createServiceMutation.isPending
      : mode === "edit"
        ? updateServiceMutation.isPending
        : false;

  const filteredServices = data.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- CREATE AND EDIT ACTION HANDLER ---------------- */
  const handleAction = React.useCallback((action = "", service = {}) => {
    if (action === "create" || action === "edit") {
      setMode(action),
      setService(service);
      setIsOpen(true);
    }

    if (action === "delete") {
      openModal(MODAL_TYPES.DELETE, {
        onSubmit: async () => {
          try{
            console.log('deleting service');
            await deleteServiceMutation.mutateAsync(service.id);
            closeModal();
          }
          catch (err) {
            console.error(err?.message);
          }
        },
        isLoading: deleteServiceMutation.isPending,
        serverError: deleteServiceMutation.error?.message,
        entityName: service.name || "",
        entityType: 'service'
      });
    }
  }, [openModal, deleteServiceMutation]);

  const handleSubmit = async (formData) => {
    if (mode === "edit") {
      if (!service?.id) {
        throw new Error("Missing service id");
      }
      return updateServiceMutation.mutateAsync({
        id: service.id,
        data: formData
      });
    }

    return createServiceMutation.mutateAsync(formData);
  };
  
  /* ---------------- Columns ---------------- */
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("base_price", {
        header: "Base Price",
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("created_at", {
        header: "Created",
        cell: (info) => {
          const v = info.getValue();
          return v ? new Date(v).toLocaleDateString() : "-";
        }
      }),

      //ACTIONS COLUMN
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const service = row.original;

          return (
            <RowActionsMenu
              onEdit={() => handleAction("edit", service)}
              onDelete={() => handleAction("delete", service)}
            />
          );
        }
      })
    ],[handleAction]);

  if (isLoading) return <p>{t("general.loading")}</p>;
  if (error) return <p>{t("services.errors.loading")}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("services.heading")}
          </h1>
          <p className="text-gray-500 mt-1">{t("services.subheading")}</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={()=>handleAction("create")}
        >
          <Plus className="h-4 w-4" />
          {t("services.add")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <ServiceTable data={filteredServices} columns={columns} />
        </div>
        {isOpen && (
          <ServiceModal
          mode={mode || "create"}
          inputs={serviceInputs}
          onSubmit={handleSubmit}
          serviceData={service}
          onClose={()=>setIsOpen(false)}
          isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};
