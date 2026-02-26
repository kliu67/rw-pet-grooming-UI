import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Breeds } from "./Breeds";

/* ---------------- MOCKS ---------------- */

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

vi.mock("@/components/modals/ModalProvider.jsx", () => ({
  useModal: () => ({
    openModal,
    closeModal
  })
}));

const createMutateAsync = vi.fn();
const updateMutateAsync = vi.fn();
const deleteMutateAsync = vi.fn();

vi.mock("@/hooks/breeds", () => ({
  useCreateBreed: () => ({
    mutateAsync: createMutateAsync,
    isPending: false
  }),
  useUpdateBreed: () => ({
    mutateAsync: updateMutateAsync,
    isPending: false
  }),
  useDeleteBreed: () => ({
    mutateAsync: deleteMutateAsync,
    isPending: false
  })
}));

vi.mock("@/components/Table", () => ({
  Table: ({ data, columns = [] }) => {
    const actionsCol = columns.find((c) => c.id === "actions");

    return (
      <div data-testid="table">
        {data.map((b) => (
          <div key={b.id}>
            <span>{b.name}</span>
            {actionsCol?.cell?.({
              row: { original: b }
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

vi.mock("@/components/modals/BreedModal", () => ({
  default: ({ mode, onSubmit, onClose }) => (
    <div data-testid="breed-modal">
      <button onClick={() => onSubmit({ name: "Poodle" })}>submit-{mode}</button>
      <button onClick={onClose}>close-modal</button>
    </div>
  )
}));

/* ---------------- TEST DATA ---------------- */

const mockBreeds = [
  { id: 1, name: "Poodle" },
  { id: 2, name: "Labrador" }
];

/* ---------------- TESTS ---------------- */

import { useQuery } from "@tanstack/react-query";

describe("Breeds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    useQuery.mockReturnValue({ data: [], isLoading: true, error: null });

    render(<Breeds />);
    expect(screen.getByText("general.loading")).toBeInTheDocument();
  });

  it("shows error state", () => {
    useQuery.mockReturnValue({ data: [], isLoading: false, error: true });

    render(<Breeds />);
    expect(screen.getByText("breeds.errors.loading")).toBeInTheDocument();
  });

  it("renders breeds in table", () => {
    useQuery.mockReturnValue({
      data: mockBreeds,
      isLoading: false,
      error: null
    });

    render(<Breeds />);
    expect(screen.getByText("Poodle")).toBeInTheDocument();
    expect(screen.getByText("Labrador")).toBeInTheDocument();
  });

  it("filters breeds by search", () => {
    useQuery.mockReturnValue({
      data: mockBreeds,
      isLoading: false,
      error: null
    });

    render(<Breeds />);
    fireEvent.change(screen.getByPlaceholderText("breeds.search"), {
      target: { value: "poo" }
    });

    expect(screen.getByText("Poodle")).toBeInTheDocument();
    expect(screen.queryByText("Labrador")).not.toBeInTheDocument();
  });

  it("opens and closes breed modal", () => {
    useQuery.mockReturnValue({
      data: mockBreeds,
      isLoading: false,
      error: null
    });

    render(<Breeds />);
    fireEvent.click(screen.getByText("breeds.add"));
    expect(screen.getByTestId("breed-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("close-modal"));
    expect(screen.queryByTestId("breed-modal")).not.toBeInTheDocument();
  });

  it("submits create breed", async () => {
    useQuery.mockReturnValue({
      data: mockBreeds,
      isLoading: false,
      error: null
    });

    render(<Breeds />);
    fireEvent.click(screen.getByText("breeds.add"));
    fireEvent.click(screen.getByText("submit-create"));

    await waitFor(() => {
      expect(createMutateAsync).toHaveBeenCalledWith({ name: "Poodle" });
    });
  });

  it("submits edit breed", async () => {
    useQuery.mockReturnValue({
      data: mockBreeds,
      isLoading: false,
      error: null
    });

    render(<Breeds />);
    fireEvent.click(screen.getAllByText("edit")[0]);
    fireEvent.click(screen.getByText("submit-edit"));

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: { name: "Poodle" }
      });
    });
  });

  it("opens delete confirmation modal", async () => {
    useQuery.mockReturnValue({
      data: mockBreeds,
      isLoading: false,
      error: null
    });

    render(<Breeds />);
    fireEvent.click(screen.getAllByText("delete")[0]);

    await waitFor(() => {
      expect(openModal).toHaveBeenCalled();
    });
  });

  it("confirms delete and calls delete mutation", async () => {
    useQuery.mockReturnValue({
      data: mockBreeds,
      isLoading: false,
      error: null
    });

    render(<Breeds />);
    fireEvent.click(screen.getAllByText("delete")[0]);

    const modalArgs = openModal.mock.calls[0][1];
    await modalArgs.onSubmit();

    expect(deleteMutateAsync).toHaveBeenCalledWith(1);
    expect(closeModal).toHaveBeenCalled();
  });
});
