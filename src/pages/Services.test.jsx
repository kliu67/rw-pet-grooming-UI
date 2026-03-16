import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Services } from "./Services";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k) => k
  })
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
const useServicesMock = vi.fn();

vi.mock("@/hooks/services", () => ({
  useServices: () => useServicesMock(),
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

vi.mock("@/components/Table", () => ({
  Table: ({ data = [], columns = [] }) => {
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

vi.mock("@/components/RowActionDropdown", () => ({
  RowActionsMenu: ({ onEdit, onDelete }) => (
    <div>
      <button onClick={onEdit}>edit</button>
      <button onClick={onDelete}>delete</button>
    </div>
  )
}));

vi.mock("@/components/modals/ServiceModal", () => ({
  default: ({ mode, onSubmit, onClose }) => (
    <div data-testid="service-modal">
      <button onClick={() => onSubmit({ name: "Test" })}>submit-{mode}</button>
      <button onClick={() => onClose()}>cancel-{mode}</button>
    </div>
  )
}));

const mockServices = [
  { id: 1, name: "Bath", base_price: 10, description: "Wash" },
  { id: 2, name: "Haircut", base_price: 20, description: "Trim" }
];

function mockServicesQuery({
  data = mockServices,
  isLoading = false,
  error = null
} = {}) {
  useServicesMock.mockReturnValue({
    data,
    isLoading,
    error
  });
}

describe("Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockServicesQuery({ data: [], isLoading: true });

    render(<Services />);
    expect(screen.getByText("general.loading")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockServicesQuery({ data: [], error: true });

    render(<Services />);
    expect(screen.getByText("services.errors.loading")).toBeInTheDocument();
  });

  it("renders services in table", () => {
    mockServicesQuery();

    render(<Services />);
    expect(screen.getByText("Bath")).toBeInTheDocument();
    expect(screen.getByText("Haircut")).toBeInTheDocument();
  });

  it("filters services by search", () => {
    mockServicesQuery();

    render(<Services />);

    const input = screen.getByPlaceholderText("Search services...");
    fireEvent.change(input, { target: { value: "bath" } });

    expect(screen.getByText("Bath")).toBeInTheDocument();
    expect(screen.queryByText("Haircut")).not.toBeInTheDocument();
  });

  it("opens/closes service modal", () => {
    mockServicesQuery();

    render(<Services />);

    fireEvent.click(screen.getByText("services.add"));
    expect(screen.getByTestId("service-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("cancel-create"));
    expect(screen.queryByTestId("service-modal")).not.toBeInTheDocument();
  });

  it("submits create service", async () => {
    mockServicesQuery();

    render(<Services />);

    fireEvent.click(screen.getByText("services.add"));
    fireEvent.click(screen.getByText("submit-create"));

    await waitFor(() => {
      expect(createMutateAsync).toHaveBeenCalled();
    });
  });

  it("submits edit service", async () => {
    mockServicesQuery();

    render(<Services />);
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
    mockServicesQuery();

    render(<Services />);
    fireEvent.click(screen.getAllByText("delete")[0]);

    await waitFor(() => {
      expect(openModal).toHaveBeenCalled();
    });
  });

  it("submits delete service", async () => {
    mockServicesQuery();

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
