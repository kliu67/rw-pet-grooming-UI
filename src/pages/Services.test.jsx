import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Services } from "./Services";

/* ---------------- MOCKS ---------------- */

// i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k) => k
  })
}));

// react-query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn()
}));

// modal provider
const openModal = vi.fn();
const closeModal = vi.fn();

vi.mock("@/components/modal/ModalProvider", () => ({
  useModal: () => ({
    openModal,
    closeModal
  })
}));

// mutations
const createMutateAsync = vi.fn();
const updateMutateAsync = vi.fn();
const deleteMutateAsync = vi.fn();

vi.mock("@/hooks/service", () => ({
  useCreateService: () => ({
    mutateAsync: createMutateAsync,
    isPending: false
  }),
  useUpdateService: () => ({
    mutateAsync: updateMutateAsync,
    isPending: false
  }),
  useDeleteService: () => ({
    mutateAsync: deleteMutateAsync,
    isPending: false
  })
}));

// table
vi.mock("@/components/Table", () => ({
  Table: ({ data, columns = [] }) => {
    const actionsCol = columns.find((c) => c.id === "actions");

    return (
      <div data-testid="table">
        {data.map((s) => (
          <div key={s.id}>
            <span>{s.name}</span>
            {actionsCol?.cell?.({
              row: { original: s }
            })}
          </div>
        ))}
      </div>
    );
  }
}));

// RowActionsMenu
vi.mock("@/components/RowActionDropdown", () => ({
  RowActionsMenu: ({ onEdit, onDelete }) => (
    <div>
      <button onClick={onEdit}>edit</button>
      <button onClick={onDelete}>delete</button>
    </div>
  )
}));

// ServiceModal
vi.mock("@/components/modal/types/ServiceModal", () => ({
  default: ({ mode, onSubmit, onClose }) => (
    <div data-testid="service-modal">
      <button onClick={() => onSubmit({ name: "Test" })}>submit-{mode}</button>
      <button onClick={() => onClose()}>cancel-{mode}</button>
    </div>
  )
}));

/* ---------------- TEST DATA ---------------- */

const mockServices = [
  { id: 1, name: "Bath", base_price: 10, description: "Wash" },
  { id: 2, name: "Haircut", base_price: 20, description: "Trim" }
];

/* ---------------- TESTS ---------------- */

import { useQuery } from "@tanstack/react-query";

describe("Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    useQuery.mockReturnValue({ data: [], isLoading: true });

    render(<Services />);
    expect(screen.getByText("general.loading")).toBeInTheDocument();
  });

  it("shows error state", () => {
    useQuery.mockReturnValue({ data: [], isLoading: false, error: true });

    render(<Services />);
    expect(screen.getByText("services.errors.loading")).toBeInTheDocument();
  });

  it("renders services in table", () => {
    useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null
    });

    render(<Services />);
    expect(screen.getByText("Bath")).toBeInTheDocument();
    expect(screen.getByText("Haircut")).toBeInTheDocument();
  });

  it("filters services by search", () => {
    useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null
    });

    render(<Services />);

    const input = screen.getByPlaceholderText("Search services...");
    fireEvent.change(input, { target: { value: "bath" } });

    expect(screen.getByText("Bath")).toBeInTheDocument();
    expect(screen.queryByText("Haircut")).not.toBeInTheDocument();
  });

  it("opens/closes service modal", () => {
    useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null
    });

    render(<Services />);

    fireEvent.click(screen.getByText("services.add"));

    expect(screen.getByTestId("service-modal")).toBeInTheDocument();

    //close modal
    fireEvent.click(screen.getByText("cancel-create"));
    expect(screen.queryByTestId("service-modal")).not.toBeInTheDocument();
  });


  it("submits create service", async () => {
    useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null
    });

    render(<Services />);

    fireEvent.click(screen.getByText("services.add"));
    fireEvent.click(screen.getByText("submit-create"));

    await waitFor(() => {
      expect(createMutateAsync).toHaveBeenCalled();
    });
  });

  it("submits edit service", async () => {
    useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null
    });

    render(<Services />);
    screen.debug();
    fireEvent.click(screen.getAllByText("edit")[0]);
    fireEvent.click(screen.getByText("submit-edit"));

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: { name: "Test" }
      });
    });
  });

  it("calls delete modal", async () => {
    useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null
    });

    render(<Services />);

    fireEvent.click(screen.getAllByText("delete")[0]);

    await waitFor(() => {
      expect(openModal).toHaveBeenCalled();
    });
  });

  it("submits delete service", async () => {
    useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null
    });

    render(<Services />);
    fireEvent.click(screen.getAllByText("delete")[0]);

    const modalArgs = openModal.mock.calls[0][1];
    await modalArgs.onSubmit();

    await waitFor(() => {
      expect(deleteMutateAsync).toHaveBeenCalledWith(1);
    });
    expect(closeModal).toHaveBeenCalled();
  });

  

});
