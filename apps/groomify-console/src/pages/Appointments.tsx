import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/hooks/appointments";

import { useClients } from "@/hooks/clients";
import { useBreeds } from "@/hooks/breeds";
import { useServices } from "@/hooks/services";
import { usePets } from "@/hooks/pets";
import { useStylists } from "@/hooks/stylists";
import { useServiceConfigurations } from "@/hooks/serviceConfigurations";
import { get24HrMinString } from "@/hooks/openTimeRanges";
import AppointmentModal from "@/components/modals/AppointmentModal";
import { useModal } from "@/components/modals/ModalProvider";
import { Table as AppointmentTable } from "@/components/Table";
import { MODAL_TYPES } from "@/components/modals/modalRegistry";
import { RowActionsMenu } from "@/components/RowActionDropdown";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "@/components/emptyState";
import { Calendar } from "../components/scheduler/calendar";
import { WeeklySchedule } from "../components/scheduler/weekly-schedule";
import { DaySchedule } from "../components/scheduler/day-schedule";
import { AppointmentDialog } from "../components/scheduler/appointment-dialog";
import { Button } from "../components/ui/button";
import {
  Calendar as CalendarIcon,
  Calendar as CalendarViewIcon,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Plus,
  Search,
  XCircle,
  Menu,
  Sun,
} from "lucide-react";

const columnHelper = createColumnHelper();

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    booked: "bg-green-100 text-green-700",
    Confirmed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
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
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"table | month" | "week" | "day">("month");
  const [appointments, setAppointments] = useState<Appointment[]>([
    // {
    //   id: "1",
    //   title: "Team Meeting",
    //   date: new Date(2026, 3, 16, 10, 0),
    //   startTime: "10:00",
    //   endTime: "11:00",
    //   description: "Weekly team sync",
    //   color: "bg-blue-100 text-blue-700",
    // },
    // {
    //   id: "2",
    //   title: "Doctor Appointment",
    //   date: new Date(2026, 3, 18, 14, 30),
    //   startTime: "14:30",
    //   endTime: "15:30",
    //   description: "Annual checkup",
    //   color: "bg-green-100 text-green-700",
    // },
    // {
    //   id: "3",
    //   title: "Lunch with Client",
    //   date: new Date(2026, 3, 16, 12, 0),
    //   startTime: "12:00",
    //   endTime: "13:30",
    //   color: "bg-purple-100 text-purple-700",
    // },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<
    Appointment | undefined
  >();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  //queries

  const {
    data: appData = [],
    isLoading: appIsLoading,
    error: appError,
  } = useAppointments();

  const {
    data: clientsData = [],
    isLoading: clientsIsLoading,
    error: clientsError,
  } = useClients();

  const {
    data: breedsData = [],
    isLoading: breedsIsLoading,
    error: breedsError,
  } = useBreeds();

  const {
    data: servicesData = [],
    isLoading: servicesIsLoading,
    error: servicesError,
  } = useServices();
  const {
    data: petsData = [],
    isLoading: petsIsLoading,
    error: petsError,
  } = usePets();

  const {
    data: stylistsData = [],
    isLoading: stylistsIsLoading,
    error: stylistsError,
  } = useStylists();

  const {
    data: configsData = [],
    isLoading: configsIsLoading,
    error: configsError,
  } = useServiceConfigurations();

  //inputs

  const appointmentInputs = React.useMemo(
    () => ({
      client: {
        name: "client",
        displayName: t("appointments.displayName.client"),
        placeholder: t("appointments.placeholderText.client"),
      },
      pet: {
        name: "pet",
        displayName: t("appointments.displayName.pet"),
        placeholder: t("appointments.placeholderText.pet"),
      },
      service: {
        name: "service",
        displayName: t("appointments.displayName.service"),
        placeholder: t("appointments.placeholderText.service"),
      },
      stylist: {
        name: "stylist",
        displayName: t("appointments.displayName.stylist"),
        placeholder: t("appointments.placeholderText.stylist"),
      },
    }),
    [t],
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
    (action = "", appointment = {}) => {
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
          entityType: "appointment",
          confirmMsg: t("appointments.confirmDelete"),
        });
      }
    },
    [openModal, closeModal, deleteAppMutation],
  );

  const handleSubmit = async (formData) => {
    if (mode === "edit") {
      if (!appointment?.id) {
        throw new Error("Missing appointment id");
      }
      return updateAppMutation.mutateAsync({
        id: appointment.id,
        data: formData,
      });
    }

    return await createAppMutation.mutateAsync(formData);
  };

  const formatDateTimeCell = (value: string | Date | null | undefined) => {
    if (!value) return "-";

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
  };

  const columns = React.useMemo(
    () => [
      //ACTIONS COLUMN
      columnHelper.display({
        id: "actions",
        header: <Menu />,
        size: 20,
        minSize: 20,
        maxSize: 40,
        cell: ({ row }) => {
          const rowApp = row.original;

          return (
            <RowActionsMenu
              onEdit={() => handleAction("edit", rowApp)}
              onDelete={() => handleAction("delete", rowApp)}
            />
          );
        },
      }),
      columnHelper.accessor("id", {
        header: "ID",
        size: 20,
        minSize: 20,
        maxSize: 120,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor(
        (row) =>
          [row.client?.first_name, row.client?.last_name]
            .filter(Boolean)
            .join(" ") || "-",
        {
          header: "clientName",
          size: 100,
          minSize: 60,
          maxSize: 160,
          cell: (info) => info.getValue(),
        },
      ),
      columnHelper.accessor((row) => row.service?.name ?? "-", {
        header: "serviceName",
        size: 120,
        minSize: 60,
        maxSize: 160,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.pet?.name ?? "-", {
        header: "petName",
        size: 120,
        minSize: 60,
        maxSize: 180,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("startTime", {
        header: "startTime",
        size: 210,
        minSize: 100,
        maxSize: 210,
        cell: (info) => formatDateTimeCell(info.getValue()),
      }),
      columnHelper.accessor("endTime", {
        header: "endTime",
        size: 210,
        minSize: 100,
        maxSize: 210,
        cell: (info) => formatDateTimeCell(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: "status",
        size: 100,
        minSize: 60,
        maxSize: 120,
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("priceSnapshot", {
        header: "amount",
        size: 100,
        minSize: 60,
        maxSize: 120,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor(
        (row) =>
          [row.stylist?.first_name, row.stylist?.last_name]
            .filter(Boolean)
            .join(" ") || "-",
        {
          header: "stylist",
          size: 100,
          minSize: 60,
          maxSize: 160,
          cell: (info) => info.getValue(),
        },
      ),

      columnHelper.accessor("durationSnapshot", {
        header: "Duration",
        size: 80,
        minSize: 80,
        maxSize: 120,
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("description", {
        header: "description",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("uuid", {
        header: "uuid",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (info) => {
          const v = info.getValue();
          return v ? new Date(v).toLocaleDateString() : "-";
        },
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated",
        cell: (info) => {
          const v = info.getValue();
          return v ? new Date(v).toLocaleDateString() : "-";
        },
      }),
    ],
    [],
  );

  if (isLoading) return <p>{t("general.loading")}</p>;
  if (error) return <p>{t("serviceConfigurations.errors.loading")}</p>;

  const clientsById = new Map(clientsData.map((c) => [c.id, c]));
  const configsById = new Map(configsData.map((c) => [c.id, c]));
  const servicesById = new Map(servicesData.map((s) => [s.id, s]));
  const stylistsById = new Map(stylistsData.map((s) => [s.id, s]));
  const petsById = new Map(petsData.map((p) => [p.id, p]));
  const breedsById = new Map(breedsData.map((b) => [b.id, b]));

  const apps = appData.map((app) => {
    const client = clientsById.get(app.client_id);
    const config = configsById.get(app.service_configuration_id);
    const service = servicesById.get(app.service_id);
    const stylist = stylistsById.get(app.stylist_id);
    const pet = petsById.get(app.pet_id);
    const breed = config ? breedsById.get(config.breed_id) : undefined;

    return {
      id: app.id,
      client_id: app.client_id,
      pet_id: app.pet_id,
      service_id: app.service_id,
      service_configuration_id: app.service_configuration_id,
      stylist_id: app.stylist_id,
      client: client,
      service,
      pet,
      status: app.status,
      breed,
      priceSnapshot: app.price_snapshot,
      stylist,
      startTime: app.start_time,
      endTime: app.end_time,
      effectiveEndTime: app.effective_end_time,
      description: app.description,
      durationSnapshot: app.duration_snapshot,
      uuid: app.uuid,
      createdAt: app.created_at,
      updatedAt: app.updated_at,
    };
  });

  const filteredAppointments = apps.filter(
    (app) =>
      `${app.client?.first_name ?? ""} ${app.client?.last_name ?? ""}`
        .trim()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (app.pet?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.service?.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.stylist?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.stylist?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const appointmentObjects = filteredAppointments.map((a) => {
    const startDate = new Date(a.startTime);
    const endDate = new Date(a.endTime);
    return {
      id: a?.id,
      title: a?.service?.name || "",
      date: startDate,
      startTime: get24HrMinString(startDate),
      endTime: get24HrMinString(endDate),
      description: a.service?.name,
      color: "bg-blue-100 text-blue-700",
    };
  });

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedAppointment(undefined);
    setDialogOpen(true);
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const dateWithTime = new Date(date);
    dateWithTime.setHours(hours, minutes, 0, 0);

    setSelectedDate(dateWithTime);
    setSelectedAppointment(undefined);
    setDialogOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate(undefined);
    setDialogOpen(true);
  };

  const handleNewAppointment = () => {
    setSelectedDate(new Date());
    setSelectedAppointment(undefined);
    setDialogOpen(true);
  };

  return isAuthenticated ? (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">
                  {t("appointments.heading")}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={view === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("table")}
                  className="gap-2"
                >
                  <CalendarViewIcon className="h-4 w-4" />
                  Table View
                </Button>
                <Button
                  variant={view === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("month")}
                  className="gap-2"
                >
                  <CalendarViewIcon className="h-4 w-4" />
                  Month
                </Button>
                <Button
                  variant={view === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("week")}
                  className="gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Week
                </Button>
                <Button
                  variant={view === "day" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("day")}
                  className="gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Day
                </Button>
              </div>

                <button
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => handleAction("create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "table" ? (
          <div className="space-y-6">
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("appointments.heading")}
                </h1>
                <p className="text-gray-500 mt-1">
                  {t("appointments.subheading")}
                </p>
              </div>
              <button
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => handleAction("create")}
              >
                <Plus className="h-4 w-4" />
                {t("appointments.add")}
              </button>
            </div> */}

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

              <div className="overflow-x-auto">
                <AppointmentTable
                  data={filteredAppointments}
                  columns={columns}
                />
              </div>
            </div>
          </div>
        ) : view === "month" ? (
          <Calendar
            currentDate={currentDate}
            onMonthChange={setCurrentDate}
            appointments={appointmentObjects}
            onDayClick={handleDayClick}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : view === "week" ? (
          <WeeklySchedule
            currentDate={currentDate}
            onWeekChange={setCurrentDate}
            appointments={appointmentObjects}
            onTimeSlotClick={handleTimeSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : (
          <DaySchedule
            currentDate={currentDate}
            onDayChange={setCurrentDate}
            appointments={appointmentObjects}
            onTimeSlotClick={handleTimeSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        )}
      </div>
        {isOpen && (
                <AppointmentModal
                  mode={mode || "create"}
                  inputs={appointmentInputs}
                  onSubmit={handleSubmit}
                  row={appointment}
                  onClose={() => setIsOpen(false)}
                  isLoading={isSubmitting}
                  configs={configsData}
                  clients={clientsData}
                  services={servicesData}
                  breeds={breedsData}
                  pets={petsData}
                  appointmentsData={appointments}
                  stylists={stylistsData}
                />
              )}
    </>
  ) : (
    <EmptyState />
  );
};
