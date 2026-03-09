import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment
} from "@/hooks/appointments";
import { useClients } from "@/hooks/clients";
import { useBreeds } from "@/hooks/breeds";
import { useServices } from "@/hooks/services";
import { usePets } from "@/hooks/pets";
import { useStylists } from "@/hooks/stylists";
import { useServiceConfigurations } from "@/hooks/serviceConfigurations";
import AppointmentModal from "@/components/modals/AppointmentModal";
import { useModal } from "@/components/modals/ModalProvider";
import ServiceModal from "@/components/modals/ServiceModal";
import { Table as AppointmentTable } from "@/components/Table";
import { MODAL_TYPES } from "@/components/modals/modalRegistry";
import { RowActionsMenu } from "@/components/RowActionDropdown";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Plus,
  Search,
  XCircle
} from "lucide-react";

const columnHelper = createColumnHelper();

// Mock data
const initialAppointments = [
  {
    id: 1,
    client: "Alice Johnson",
    pet: "Bella",
    service: "Full Grooming",
    date: "2023-10-25",
    time: "10:00 AM",
    status: "Confirmed",
    amount: "$85.00"
  },
  {
    id: 2,
    client: "Bob Smith",
    pet: "Max",
    service: "Bath & Brush",
    date: "2023-10-25",
    time: "11:30 AM",
    status: "Pending",
    amount: "$45.00"
  },
  {
    id: 3,
    client: "Carol White",
    pet: "Lucy",
    service: "Nail Trim",
    date: "2023-10-26",
    time: "09:15 AM",
    status: "Completed",
    amount: "$25.00"
  },
  {
    id: 4,
    client: "David Brown",
    pet: "Charlie",
    service: "Full Grooming",
    date: "2023-10-26",
    time: "02:00 PM",
    status: "Cancelled",
    amount: "$90.00"
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Confirmed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700"
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState("");
  const [appointment, setAppointment] = useState({});
  const [mode, setMode] = useState("create");
  const { openModal, closeModal } = useModal();
  const createAppMutation = useCreateAppointment();
  const updateAppMutation = useUpdateAppointment();
  const deleteAppMutation = useDeleteAppointment();
  // const [appointments, setAppointments] = useState(initialAppointments);
  const { t } = useTranslation();

  //queries

  const {
    data: appData = [],
    isLoading: appIsLoading,
    error: appError
  } = useAppointments();

  const {
    data: clientsData = [],
    isLoading: clientsIsLoading,
    error: clientsError
  } = useClients();

  const {
    data: breedsData = [],
    isLoading: breedsIsLoading,
    error: breedsError
  } = useBreeds();
  const {
    data: servicesData = [],
    isLoading: servicesIsLoading,
    error: servicesError
  } = useServices();
  const {
    data: petsData = [],
    isLoading: petsIsLoading,
    error: petsError
  } = usePets();

  const {
    data: stylistsData = [],
    isLoading: stylistsIsLoading,
    error: stylistsError
  } = useStylists();

  const {
    data: configsData = [],
    isLoading: configsIsLoading,
    error: configsError
  } = useServiceConfigurations();

  //inputs

  const appointmentInputs = React.useMemo(
    () => ({
      client: {
        name: "client",
        displayName: t("appointments.displayName.client"),
        placeholder: t("appointments.placeholderText.client")
      },
        pet: {
        name: "pet",
        displayName: t("appointments.displayName.pet"),
        placeholder: t("appointments.placeholderText.pet")
      },
        service: {
        name: "service",
        displayName: t("appointments.displayName.service"),
        placeholder: t("appointments.placeholderText.service")
      },
        stylist: {
        name: "stylist",
        displayName: t("appointments.displayName.stylist"),
        placeholder: t("appointments.placeholderText.stylist")
      }
    }),
    [t]
  );

  const isLoading =
    appIsLoading ||
    clientsIsLoading ||
    breedsIsLoading ||
    servicesIsLoading ||
    petsIsLoading ||
    stylistsIsLoading ||
    configsIsLoading;

  const error =
    appError ||
    clientsError ||
    breedsError ||
    servicesError ||
    petsError ||
    stylistsError ||
    configsError;

  const isSubmitting =
    mode === "create"
      ? createAppMutation.isPending
      : mode === "edit"
        ? updateAppMutation.isPending
        : false;

  /* ---------------- CREATE AND EDIT ACTION HANDLER ---------------- */
  const handleAction = React.useCallback(
    (action = "", pet = {}) => {
      if (action === "create" || action === "edit") {
        (setMode(action), setAppointment(appointment));
        setIsOpen(true);
      }

      if (action === "delete") {
        openModal(MODAL_TYPES.DELETE, {
          onSubmit: async () => {
            try {
              console.log("deleting pet");
              await deleteAppMutation.mutateAsync(appointment.id);
              closeModal();
            } catch (err) {
              console.error(err?.message);
            }
          },
          isLoading: deleteAppMutation.isPending,
          serverError: deleteAppMutation.error?.message,
          entityName: appointment.id || "",
          entityType: "appointment"
        });
      }
    },
    [openModal, closeModal, deleteAppMutation]
  );

  const handleSubmit = async (formData) => {
    if (mode === "edit") {
      if (!appointment?.id) {
        throw new Error("Missing appointment id");
      }
      return updateAppMutation.mutateAsync({
        id: appointment.id,
        data: formData
      });
    }

    return createAppMutation.mutateAsync(formData);
  };

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor(
        (row) =>
          [row.client?.first_name, row.client?.last_name]
            .filter(Boolean)
            .join(" ") || "-",
        {
          header: "clientName",
          cell: (info) => info.getValue()
        }
      ),
      columnHelper.accessor((row) => row.service?.name ?? "-", {
        header: "serviceName",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor((row) => row.pet?.name ?? "-", {
        header: "petName",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusBadge status={info.getValue()} />
      }),
      columnHelper.accessor((row) => row.breed?.name ?? "-", {
        header: "breedName",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("priceSnapshot", {
        header: "priceSnapshot",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor(
        (row) =>
          [row.stylist?.first_name, row.stylist?.last_name]
            .filter(Boolean)
            .join(" ") || "-",
        {
          header: "stylistName",
          cell: (info) => info.getValue()
        }
      ),
      columnHelper.accessor("startTime", {
        header: "startTime",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("endTime", {
        header: "endTime",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("durationSnapshot", {
        header: "durationSnapshot",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("uuid", {
        header: "uuid",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (info) => {
          const v = info.getValue();
          return v ? new Date(v).toLocaleDateString() : "-";
        }
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated",
        cell: (info) => {
          const v = info.getValue();
          return v ? new Date(v).toLocaleDateString() : "-";
        }
      })

      //ACTIONS COLUMN
      // columnHelper.display({
      //   id: "actions",
      //   header: "",
      //   cell: ({ row }) => {
      //     const client = row.original;

      //     return (
      //       <RowActionsMenu
      //         onEdit={() => handleAction("edit", client)}
      //         onDelete={() => handleAction("delete", client)}
      //       />
      //     );
      //   }
      // })
    ],
    []
  );

  if (isLoading) return <p>{t("general.loading")}</p>;
  if (error) return <p>{t("serviceConfigurations.errors.loading")}</p>;

  const clientsById = new Map(clientsData.map((c) => [c.id, c]));
  const configsById = new Map(configsData.map((c) => [c.id, c]));
  const servicesById = new Map(servicesData.map((s) => [s.id, s]));
  const stylistsById = new Map(stylistsData.map((s) => [s.id, s]));
  const petsById = new Map(petsData.map((p) => [p.id, p]));
  const breedsById = new Map(breedsData.map((b) => [b.id, b]));

  const appointments = appData.map((app) => {
    const client = clientsById.get(app.client_id);
    const config = configsById.get(app.service_configuration_id);
    const service = config ? servicesById.get(config.service_id) : undefined;
    const stylist = stylistsById.get(app.stylist_id);
    const pet = petsById.get(app.pet_id);
    const breed = config ? breedsById.get(config.breed_id) : undefined;

    return {
      id: app.id,
      client: client,
      service,
      pet,
      status: app.status,
      breed,
      priceSnapshot: app.price_snapshot,
      stylist,
      startTime: app.start_time,
      endTime: app.end_time,
      durationSnapshot: app.duration_snapshot,
      uuid: app.uuid,
      createdAt: app.created_at,
      updatedAt: app.updated_at
    };
  });

  const filteredAppointments = appointments.filter(
    (app) =>
      `${app.client?.first_name ?? ""} ${app.client?.last_name ?? ""}`
        .trim()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (app.pet?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.service?.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.stylistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("appointments.heading")}
          </h1>
          <p className="text-gray-500 mt-1">{t("appointments.subheading")}</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => handleAction("create")}
        >
          <Plus className="h-4 w-4" />
          {t("appointments.add")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client or pet name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
              <CalendarIcon className="h-4 w-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
              <Clock className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Client / Pet</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {app.client}
                    </div>
                    <div className="text-xs text-gray-500">Pet: {app.pet}</div>
                  </td>
                  <td className="px-6 py-4">{app.service}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{app.date}</div>
                    <div className="text-xs text-gray-500">{app.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {app.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        <div className="overflow-x-auto">
          <AppointmentTable data={filteredAppointments} columns={columns} />
        </div>

        {isOpen && (
          <AppointmentModal
            mode={mode || "create"}
            inputs={appointmentInputs}
            onSubmit={handleSubmit}
            appointment={appointment}
            onClose={() => setIsOpen(false)}
            isLoading={isSubmitting}
            configs={configsData}
            clients={clientsData}
            services={servicesData}
            breeds={breedsData}
            pets={petsData}
            stylists={stylistsData}
          />
        )}
      </div>
    </div>
  );
};
