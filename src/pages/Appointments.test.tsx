import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Appointments } from "./Appointments";

const openModalMock = vi.fn();
const closeModalMock = vi.fn();
const createMutateAsyncMock = vi.fn();
const updateMutateAsyncMock = vi.fn();
const deleteMutateAsyncMock = vi.fn();

let appointmentsHookState: any;
let clientsHookState: any;
let breedsHookState: any;
let servicesHookState: any;
let petsHookState: any;
let stylistsHookState: any;
let configsHookState: any;
let createMutationState: any;
let updateMutationState: any;
let deleteMutationState: any;

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

vi.mock("@/hooks/appointments", () => ({
  useAppointments: () => appointmentsHookState,
  useCreateAppointment: () => createMutationState,
  useUpdateAppointment: () => updateMutationState,
  useDeleteAppointment: () => deleteMutationState
}));

vi.mock("@/hooks/clients", () => ({
  useClients: () => clientsHookState
}));

vi.mock("@/hooks/breeds", () => ({
  useBreeds: () => breedsHookState
}));

vi.mock("@/hooks/services", () => ({
  useServices: () => servicesHookState
}));

vi.mock("@/hooks/pets", () => ({
  usePets: () => petsHookState
}));

vi.mock("@/hooks/stylists", () => ({
  useStylists: () => stylistsHookState
}));

vi.mock("@/hooks/serviceConfigurations", () => ({
  useServiceConfigurations: () => configsHookState
}));

vi.mock("@/components/modals/ModalProvider", () => ({
  useModal: () => ({
    openModal: openModalMock,
    closeModal: closeModalMock
  })
}));

vi.mock("@/components/modals/AppointmentModal", () => ({
  default: ({ mode, row, onClose }: any) => (
    <div data-testid="appointment-modal">
      <span>{mode}</span>
      <span>{row?.id ?? "new"}</span>
      <button type="button" onClick={onClose}>
        close modal
      </button>
    </div>
  )
}));

vi.mock("@/components/RowActionDropdown", () => ({
  RowActionsMenu: ({ onEdit, onDelete }: any) => (
    <div>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
      <button type="button" onClick={onDelete}>
        Delete
      </button>
    </div>
  )
}));

vi.mock("@/components/Table", () => ({
  Table: ({ data, columns }: any) => (
    <div data-testid="appointments-table">
      {data.map((row: any) => (
        <div key={row.id} data-testid={`row-${row.id}`}>
          {columns[0].cell({ row: { original: row } })}
          <span>{[row.client?.first_name, row.client?.last_name].filter(Boolean).join(" ")}</span>
          <span>{row.pet?.name}</span>
          <span>{row.service?.name}</span>
          <span>{[row.stylist?.first_name, row.stylist?.last_name].filter(Boolean).join(" ")}</span>
          <span>{row.status}</span>
        </div>
      ))}
    </div>
  )
}));

const appointmentRecords = [
  {
    id: 1,
    client_id: 1,
    pet_id: 1,
    service_id: 1,
    service_configuration_id: 1,
    stylist_id: 1,
    status: "booked",
    price_snapshot: "$80.00",
    start_time: "2026-03-15T09:00:00.000Z",
    end_time: "2026-03-15T10:00:00.000Z",
    effective_end_time: "2026-03-15T10:00:00.000Z",
    description: "Morning groom",
    duration_snapshot: 60,
    uuid: "apt-1",
    created_at: "2026-03-01T00:00:00.000Z",
    updated_at: "2026-03-02T00:00:00.000Z"
  },
  {
    id: 2,
    client_id: 2,
    pet_id: 2,
    service_id: 2,
    service_configuration_id: 2,
    stylist_id: 2,
    status: "completed",
    price_snapshot: "$40.00",
    start_time: "2026-03-16T11:00:00.000Z",
    end_time: "2026-03-16T11:30:00.000Z",
    effective_end_time: "2026-03-16T11:30:00.000Z",
    description: "Nail trim",
    duration_snapshot: 30,
    uuid: "apt-2",
    created_at: "2026-03-01T00:00:00.000Z",
    updated_at: "2026-03-02T00:00:00.000Z"
  }
];

const clients = [
  { id: 1, first_name: "Jane", last_name: "Doe" },
  { id: 2, first_name: "John", last_name: "Smith" }
];

const pets = [
  { id: 1, name: "Buddy" },
  { id: 2, name: "Milo" }
];

const services = [
  { id: 1, name: "Bath" },
  { id: 2, name: "Trim" }
];

const stylists = [
  { id: 1, first_name: "Sam", last_name: "Smith" },
  { id: 2, first_name: "Taylor", last_name: "Jones" }
];

const configs = [
  { id: 1, breed_id: 1 },
  { id: 2, breed_id: 2 }
];

const breeds = [
  { id: 1, name: "Poodle" },
  { id: 2, name: "Terrier" }
];

beforeEach(() => {
  vi.clearAllMocks();

  appointmentsHookState = { data: appointmentRecords, isLoading: false, error: null };
  clientsHookState = { data: clients, isLoading: false, error: null };
  breedsHookState = { data: breeds, isLoading: false, error: null };
  servicesHookState = { data: services, isLoading: false, error: null };
  petsHookState = { data: pets, isLoading: false, error: null };
  stylistsHookState = { data: stylists, isLoading: false, error: null };
  configsHookState = { data: configs, isLoading: false, error: null };

  createMutationState = { mutateAsync: createMutateAsyncMock, isPending: false };
  updateMutationState = { mutateAsync: updateMutateAsyncMock, isPending: false };
  deleteMutationState = {
    mutateAsync: deleteMutateAsyncMock,
    isPending: false,
    error: null
  };
});

describe("Appointments", () => {
  it("renders loading state while data is loading", () => {
    appointmentsHookState = { data: [], isLoading: true, error: null };

    render(<Appointments />);

    expect(screen.getByText("general.loading")).toBeInTheDocument();
  });

  it("renders appointment rows and filters by search term", () => {
    render(<Appointments />);

    expect(screen.getByTestId("row-1")).toHaveTextContent("Jane Doe");
    expect(screen.getByTestId("row-2")).toHaveTextContent("Taylor Jones");

    fireEvent.change(
      screen.getByPlaceholderText("Search by client or pet name..."),
      { target: { value: "taylor" } }
    );

    expect(screen.queryByTestId("row-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("row-2")).toBeInTheDocument();
  });

  it("opens the create modal when add is clicked", () => {
    render(<Appointments />);

    fireEvent.click(screen.getByText("appointments.add"));

    expect(screen.getByTestId("appointment-modal")).toHaveTextContent("create");
    expect(screen.getByTestId("appointment-modal")).toHaveTextContent("new");
  });

  it("opens the edit modal for a row action", () => {
    render(<Appointments />);

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(screen.getByTestId("appointment-modal")).toHaveTextContent("edit");
    expect(screen.getByTestId("appointment-modal")).toHaveTextContent("1");
  });

  it("opens the delete confirmation modal for a row action", async () => {
    render(<Appointments />);

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(openModalMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          entityName: 1,
          entityType: "appointment",
          confirmMsg: "appointments.confirmDelete"
        })
      );
    });
  });
});
