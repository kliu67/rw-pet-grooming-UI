import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useModal } from "@/components/modals/ModalProvider";
import ClientModal from "@/components/modals/ClientModal";
import { Table as ClientTable } from "@/components/Table";
import { MODAL_TYPES } from "@/components/modals/modalRegistry";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient
} from "@/hooks/clients";
import { RowActionsMenu } from "@/components/RowActionDropdown";

const columnHelper = createColumnHelper();

export const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [client, setClient] = useState({});
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  //query hooks
  const {
    data = [],
    isLoading,
    error
  } = useClients();

  const clientInputs = React.useMemo(
    () => ({
      first_name: {
        id: "clients-first_name",
        name: "first_name",
        displayName: "First Name",
        placeholder: t("clients.placeholderText.first_name"),
        errorMsg: t("clients.errors.first_name")
      },
      last_name: {
        id: "clients-last_name",
        name: "last_name",
        displayName: "Last Name",
        placeholder: t("clients.placeholderText.last_name"),
        errorMsg: t("clients.errors.last_name")
      },
      phone: {
        id: "clients-phone",
        name: "phone",
        displayName: "Phone",
        placeholder: t("clients.placeholderText.phone"),
        errorMsg: t("clients.errors.phone")
      },
      email: {
        id: "clients-email",
        name: "email",
        displayName: "Email",
        placeholder: t("clients.placeholderText.email"),
        errorMsg: t("clients.errors.email")
      },
      description: {
        id: "clients-description",
        name: "description",
        displayName: "Description",
        placeholder: t("clients.placeholderText.description"),
        errorMsg: t("clients.errors.description")
      },
      uuid: {
        id: "clients-uuid",
        name: "uuid",
        displayName: "UUID"
      }
    }),
    [t]
  );

  const isSubmitting =
    mode === "create"
      ? createClientMutation.isPending
      : mode === "edit"
        ? updateClientMutation.isPending
        : false;

  const filteredClients = data.filter(
    (client) =>
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- CREATE AND EDIT ACTION HANDLER ---------------- */
  const handleAction = React.useCallback(
    (action = "", client = {}) => {
      if (action === "create" || action === "edit") {
        (setMode(action), setClient(client));
        setIsOpen(true);
      }

      if (action === "delete") {
        openModal(MODAL_TYPES.DELETE, {
          onSubmit: async () => {
            try {
              console.log("deleting client");
              await deleteClientMutation.mutateAsync(client.id);
              closeModal();
            } catch (err) {
              console.error(err?.message);
            }
          },
          isLoading: deleteClientMutation.isPending,
          serverError: deleteClientMutation.error?.message,
          entityName: `${client.first_name} ${client.last_name}` || "",
          entityType: "client"
        });
      }
    },
    [openModal, deleteClientMutation]
  );

  const handleSubmit = async (formData) => {
    if (mode === "edit") {
      if (!client?.id) {
        throw new Error("Missing client id");
      }
      return updateClientMutation.mutateAsync({
        id: client.id,
        data: formData
      });
    }

    return createClientMutation.mutateAsync(formData);
  };

  /* ---------------- Columns ---------------- */
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("first_name", {
        header: "First Name",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("last_name", {
        header: "Last Name",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("phone", {
        header: "phone",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("email", {
        header: "email",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("description", {
        header: "description",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("uuid", {
        header: "uuid",
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
          const client = row.original;

          return (
            <RowActionsMenu
              onEdit={() => handleAction("edit", client)}
              onDelete={() => handleAction("delete", client)}
            />
          );
        }
      })
    ],
    [handleAction]
  );

  if (isLoading) return <p>{t("general.loading")}</p>;
  if (error) return <p>{t("clients.errors.loading")}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("clients.heading")}
          </h1>
          <p className="text-gray-500 mt-1">{t("clients.subheading")}</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => handleAction("create")}
        >
          <Plus className="h-4 w-4" />
          {t("clients.add")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <ClientTable data={filteredClients} columns={columns} />
        </div>
        {isOpen && (
          <ClientModal
            mode={mode || "create"}
            inputs={clientInputs}
            onSubmit={handleSubmit}
            clientData={client}
            onClose={() => setIsOpen(false)}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};
