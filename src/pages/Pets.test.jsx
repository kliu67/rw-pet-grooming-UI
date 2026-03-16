import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Pets } from "./Pets";

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
const usePetsMock = vi.fn();
const useClientsMock = vi.fn();
const useBreedsMock = vi.fn();
const useWeightClassesMock = vi.fn();

vi.mock("@/hooks/pets", () => ({
  usePets: () => usePetsMock(),
  useCreatePet: () => ({
    mutateAsync: createMutateAsync,
    isPending: false
  }),
  useUpdatePet: () => ({
    mutateAsync: updateMutateAsync,
    isPending: false
  }),
  useDeletePet: () => ({
    mutateAsync: deleteMutateAsync,
    isPending: false
  })
}));

vi.mock("@/hooks/clients", () => ({
  useClients: () => useClientsMock()
}));

vi.mock("@/hooks/breeds", () => ({
  useBreeds: () => useBreedsMock()
}));

vi.mock("@/hooks/weightClasses", () => ({
  useWeightClasses: () => useWeightClassesMock()
}));

vi.mock("@/components/Table", () => ({
  Table: ({ data = [], columns = [] }) => {
    const actionsCol = columns.find((c) => c.id === "actions");

    return (
      <div data-testid="table">
        {data.map((p) => (
          <div key={p.id}>
            <span>{p.name}</span>
            {actionsCol?.cell?.({
              row: { original: p }
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

vi.mock("@/components/modals/PetModal", () => ({
  default: ({ mode, onSubmit, onClose }) => (
    <div data-testid="pet-modal">
      <button
        onClick={() =>
          onSubmit({
            name: "Buddy",
            owner: 1,
            breed: 10,
            weightClassId: 100
          })
        }
      >
        submit-{mode}
      </button>
      <button onClick={onClose}>close-modal</button>
    </div>
  )
}));

const mockPets = [
  {
    id: 1,
    name: "Buddy",
    owner: 1,
    breed: 10,
    weight_class_id: 100,
    uuid: "pet-1",
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-02T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Max",
    owner: 2,
    breed: 20,
    weight_class_id: 200,
    uuid: "pet-2",
    created_at: "2025-01-03T00:00:00.000Z",
    updated_at: "2025-01-04T00:00:00.000Z"
  }
];

const mockClients = [
  { id: 1, first_name: "Jane", last_name: "Doe" },
  { id: 2, first_name: "John", last_name: "Smith" }
];

const mockBreeds = [
  { id: 10, name: "Poodle" },
  { id: 20, name: "Labrador" }
];

const mockWeightClasses = [
  { id: 100, label: "Small" },
  { id: 200, label: "Large" }
];

function mockAllQueries({
  petsData = mockPets,
  clientsData = mockClients,
  breedsData = mockBreeds,
  weightClassesData = mockWeightClasses,
  petsIsLoading = false,
  clientsIsLoading = false,
  breedsIsLoading = false,
  weightClassesIsLoading = false,
  petsError = null,
  clientsError = null,
  breedsError = null,
  weightClassesError = null
} = {}) {
  usePetsMock.mockReturnValue({
    data: petsData,
    isLoading: petsIsLoading,
    error: petsError
  });
  useClientsMock.mockReturnValue({
    data: clientsData,
    isLoading: clientsIsLoading,
    error: clientsError
  });
  useBreedsMock.mockReturnValue({
    data: breedsData,
    isLoading: breedsIsLoading,
    error: breedsError
  });
  useWeightClassesMock.mockReturnValue({
    data: weightClassesData,
    isLoading: weightClassesIsLoading,
    error: weightClassesError
  });
}

describe("Pets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockAllQueries({ petsIsLoading: true });

    render(<Pets />);
    expect(screen.getByText("general.loading")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockAllQueries({ clientsError: true });

    render(<Pets />);
    expect(screen.getByText("pets.errors.loading")).toBeInTheDocument();
  });

  it("renders pets in table", () => {
    mockAllQueries();

    render(<Pets />);
    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
  });

  it("filters pets by search", () => {
    mockAllQueries();

    render(<Pets />);
    fireEvent.change(screen.getByPlaceholderText("pets.search"), {
      target: { value: "bud" }
    });

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.queryByText("Max")).not.toBeInTheDocument();
  });

  it("opens and closes pet modal", () => {
    mockAllQueries();

    render(<Pets />);
    fireEvent.click(screen.getByText("pets.add"));
    expect(screen.getByTestId("pet-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("close-modal"));
    expect(screen.queryByTestId("pet-modal")).not.toBeInTheDocument();
  });

  it("submits create pet", async () => {
    mockAllQueries();

    render(<Pets />);
    fireEvent.click(screen.getByText("pets.add"));
    fireEvent.click(screen.getByText("submit-create"));

    await waitFor(() => {
      expect(createMutateAsync).toHaveBeenCalledWith({
        name: "Buddy",
        owner: 1,
        breed: 10,
        weightClassId: 100
      });
    });
  });

  it("submits edit pet", async () => {
    mockAllQueries();

    render(<Pets />);
    fireEvent.click(screen.getAllByText("edit")[0]);
    fireEvent.click(screen.getByText("submit-edit"));

    await waitFor(() => {
      expect(updateMutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: {
          name: "Buddy",
          owner: 1,
          breed: 10,
          weightClassId: 100
        }
      });
    });
  });

  it("opens delete confirmation modal", async () => {
    mockAllQueries();

    render(<Pets />);
    fireEvent.click(screen.getAllByText("delete")[0]);

    await waitFor(() => {
      expect(openModal).toHaveBeenCalled();
    });
  });

  it("confirms delete and calls delete mutation", async () => {
    mockAllQueries();

    render(<Pets />);
    fireEvent.click(screen.getAllByText("delete")[0]);

    const modalArgs = openModal.mock.calls[0][1];
    await modalArgs.onSubmit();

    expect(deleteMutateAsync).toHaveBeenCalledWith(1);
    expect(closeModal).toHaveBeenCalled();
  });
});
