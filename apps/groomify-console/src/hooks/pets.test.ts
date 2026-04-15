import { describe, expect, it, vi, beforeEach } from "vitest";

const useQueryMock = vi.fn();
const useMutationMock = vi.fn();
const useQueryClientMock = vi.fn();

const getPetsMock = vi.fn();
const createPetMock = vi.fn();
const updatePetMock = vi.fn();
const deletePetMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args: any[]) => useQueryMock(...args),
  useMutation: (...args: any[]) => useMutationMock(...args),
  useQueryClient: () => useQueryClientMock()
}));

vi.mock("@/api/pets", () => ({
  getPets: (...args: any[]) => getPetsMock(...args),
  createPet: (...args: any[]) => createPetMock(...args),
  updatePet: (...args: any[]) => updatePetMock(...args),
  deletePet: (...args: any[]) => deletePetMock(...args)
}));

import {
  usePets,
  useCreatePet,
  useUpdatePet,
  useDeletePet
} from "./pets";
import { PETS_QUERY_KEY } from "@/constants";

describe("pets hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("usePets configures the pets query", () => {
    usePets();

    const config = useQueryMock.mock.calls[0][0];
    expect(config.queryKey).toEqual([PETS_QUERY_KEY]);
    config.queryFn();
    expect(getPetsMock).toHaveBeenCalled();
  });

  it("useCreatePet invalidates pets on success", () => {
    const queryClient = { invalidateQueries: vi.fn() };
    let mutationConfig: any;

    useQueryClientMock.mockReturnValue(queryClient);
    useMutationMock.mockImplementation((config) => {
      mutationConfig = config;
      return config;
    });

    useCreatePet();
    mutationConfig.mutationFn({ name: "Buddy" });
    mutationConfig.onSuccess();

    expect(createPetMock).toHaveBeenCalledWith({ name: "Buddy" });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [PETS_QUERY_KEY]
    });
  });

  it("useUpdatePet applies optimistic update and rollback", async () => {
    const previous = [{ id: 1, name: "Buddy" }, { id: 2, name: "Milo" }];
    const queryClient = {
      cancelQueries: vi.fn().mockResolvedValue(undefined),
      getQueryData: vi.fn().mockReturnValue(previous),
      setQueryData: vi.fn(),
      invalidateQueries: vi.fn()
    };
    let mutationConfig: any;

    useQueryClientMock.mockReturnValue(queryClient);
    useMutationMock.mockImplementation((config) => {
      mutationConfig = config;
      return config;
    });

    useUpdatePet();
    await mutationConfig.onMutate({ id: 2, data: { name: "Max" } });

    const updater = queryClient.setQueryData.mock.calls[0][1];
    expect(updater(previous)).toEqual([
      { id: 1, name: "Buddy" },
      { id: 2, name: "Max" }
    ]);

    mutationConfig.onError(new Error("boom"), null, { previousPets: previous });
    expect(queryClient.setQueryData).toHaveBeenCalledWith([PETS_QUERY_KEY], previous);

    mutationConfig.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [PETS_QUERY_KEY]
    });
  });

  it("useDeletePet removes item optimistically and restores on error", async () => {
    const previous = [{ id: 1 }, { id: 2 }];
    const queryClient = {
      cancelQueries: vi.fn().mockResolvedValue(undefined),
      getQueryData: vi.fn().mockReturnValue(previous),
      setQueryData: vi.fn(),
      invalidateQueries: vi.fn()
    };
    let mutationConfig: any;

    useQueryClientMock.mockReturnValue(queryClient);
    useMutationMock.mockImplementation((config) => {
      mutationConfig = config;
      return config;
    });

    useDeletePet();
    await mutationConfig.onMutate(1);

    const updater = queryClient.setQueryData.mock.calls[0][1];
    expect(updater(previous)).toEqual([{ id: 2 }]);

    mutationConfig.onError(new Error("boom"), 1, { previousPets: previous });
    expect(queryClient.setQueryData).toHaveBeenCalledWith([PETS_QUERY_KEY], previous);

    mutationConfig.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [PETS_QUERY_KEY]
    });
  });
});
