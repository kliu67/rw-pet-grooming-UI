import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Clients } from "./Clients";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k) => k
  })
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn()
}));

const openModal = vi.fn();
const closeModal = vi.fn();

vi.mock("@/components/modals/ModalProvider", () => ({
  useModal: () => ({
    openModal,
    closeModal
  })
}));

const createMutateAsync = vi.fn();
const updateMutateAsync = vi.fn();
const deleteMutateAsync = vi.fn();

vi.mock("@/hooks/clients", () => ({
  useCreateClient: () => ({
    mutateAsync: createMutateAsync,
    isPending: false
  }),
  useUpdateClient: () => ({
    mutateAsync: updateMutateAsync,
    isPending: false
  }),
  useDeleteClient: () => ({
    mutateAsync: deleteMutateAsync,
    isPending: false
  })
}));

vi.mock("@/components/Table", () => ({
  Table: ({ data, columns = [] }) => {
    const actionsCol = columns.find((c) => c.id === "actions");

    return (
      <div data-testid="table">
        {data.map((c) => (
          <div key={c.id}>
            <span>{`${c.first_name} ${c.last_name}`}</span>
            {actionsCol?.cell?.({
              row: { original: c }
            })}
          </div>
        ))}
      </div>
    );
  }
}));

vi.mock("@/components/RowActionDropdown", () => ({
  RowActionsMenu: ({ onEdit, onDelete }) => (
    <div>
      <button onClick={onEdit}>edit</button>
      <button onClick={onDelete}>delete</button>
    </div>
  )
}));

vi.mock("@/components/modals/ClientModal", () => ({
  default: ({ mode, onSubmit }) => (
    <div data-testid="client-modal">
      <button
        onClick={() =>
          onSubmit({
            first_name: "Jane",
            last_name: "Doe",
            phone: "1234567890",
            email: "jane@example.com",
            description: "VIP"
          })
        }
      >
        submit-{mode}
      </button>
    </div>
  )
}));

const mockClients = [
  {
    id: 1,
    first_name: "Jane",
    last_name: "Doe",
    phone: "1234567890",
    email: "jane@example.com",
    description: "VIP"
  },
  {
    id: 2,
    first_name: "John",
    last_name: "Smith",
    phone: "2222222222",
    email: "john@example.com",
    description: "New"
  }
];

import { useQuery } from "@tanstack/react-query";

describe("Clients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    useQuery.mockReturnValue({ data: [], isLoading: true, error: null });

    render(<Clients />);
    expect(screen.getByText("general.loading")).toBeInTheDocument();
  });

  it("shows error state", () => {
    useQuery.mockReturnValue({ data: [], isLoading: false, error: true });

    render(<Clients />);
    expect(screen.getByText("clients.errors.loading")).toBeInTheDocument();
  });

  it("renders clients in table", () => {
    useQuery.mockReturnValue({
      data: mockClients,
      isLoading: false,
      error: null
    });

    render(<Clients />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("filters clients by search", () => {
    useQuery.mockReturnValue({
      data: mockClients,
      isLoading: false,
      error: null
    });

    render(<Clients />);
    fireEvent.change(screen.getByPlaceholderText("Search clients..."), {
      target: { value: "jane" }
    });

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
  });

  it("submits create client", async () => {
    useQuery.mockReturnValue({
      data: mockClients,
      isLoading: false,
      error: null
    });

    render(<Clients />);
    fireEvent.click(screen.getByText("clients.add"));
    fireEvent.click(screen.getByText("submit-create"));

    await waitFor(() => {
      expect(createMutateAsync).toHaveBeenCalledWith({
        first_name: "Jane",
        last_name: "Doe",
        phone: "1234567890",
        email: "jane@example.com",
        description: "VIP"
      });
    });
  });

  it("submits edit client", async () => {
    useQuery.mockReturnValue({
      data: mockClients,
      isLoading: false,
      error: null
    });

    render(<Clients />);
    fireEvent.click(screen.getAllByText("edit")[0]);
    fireEvent.click(screen.getByText("submit-edit"));

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: {
          first_name: "Jane",
          last_name: "Doe",
          phone: "1234567890",
          email: "jane@example.com",
          description: "VIP"
        }
      });
    });
  });

  it("opens and confirms delete modal", async () => {
    useQuery.mockReturnValue({
      data: mockClients,
      isLoading: false,
      error: null
    });

    render(<Clients />);
    fireEvent.click(screen.getAllByText("delete")[0]);
    expect(openModal).toHaveBeenCalled();

    const modalArgs = openModal.mock.calls[0][1];
    await modalArgs.onSubmit();

    expect(deleteMutateAsync).toHaveBeenCalledWith(1);
    expect(closeModal).toHaveBeenCalled();
  });
});
