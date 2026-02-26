import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBreed, deleteBreed, updateBreed } from "@/api/breeds";
import { useCreateBreed, useDeleteBreed, useUpdateBreed } from "./breeds";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn()
}));

vi.mock("@/api/breeds", () => ({
  createBreed: vi.fn(),
  updateBreed: vi.fn(),
  deleteBreed: vi.fn()
}));

type QueryClientMock = {
  invalidateQueries: ReturnType<typeof vi.fn>;
  cancelQueries: ReturnType<typeof vi.fn>;
  getQueryData: ReturnType<typeof vi.fn>;
  setQueryData: ReturnType<typeof vi.fn>;
};

function createQueryClientMock(): QueryClientMock {
  return {
    invalidateQueries: vi.fn(),
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn()
  };
}

describe("hooks/breeds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMutation).mockImplementation((config: unknown) => config as never);
  });

  it("useCreateBreed invalidates species after success", () => {
    const queryClient = createQueryClientMock();
    vi.mocked(useQueryClient).mockReturnValue(queryClient as never);

    const mutation = useCreateBreed() as {
      mutationFn: typeof createBreed;
      onSuccess: () => void;
    };

    expect(mutation.mutationFn).toBe(createBreed);
    mutation.onSuccess();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["species"] });
  });

  it("useUpdateBreed calls api and applies optimistic update lifecycle", async () => {
    const previousBreeds = [{ id: 1, name: "Poodle" }, { id: 2, name: "Lab" }];
    const queryClient = createQueryClientMock();
    queryClient.cancelQueries.mockResolvedValue(undefined);
    queryClient.getQueryData.mockReturnValue(previousBreeds);
    vi.mocked(useQueryClient).mockReturnValue(queryClient as never);

    const mutation = useUpdateBreed() as {
      mutationFn: (args: { id: number; data: { name: string } }) => unknown;
      onMutate: (args: { id: number; data: { name: string } }) => Promise<{ previousBreeds: unknown }>;
      onError: (err: unknown, variables: unknown, context: { previousBreeds: unknown }) => void;
      onSettled: () => void;
    };

    const payload = { id: 1, data: { name: "Goldendoodle" } };
    mutation.mutationFn(payload);
    expect(updateBreed).toHaveBeenCalledWith(1, { name: "Goldendoodle" });

    const context = await mutation.onMutate(payload);
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ["species"] });
    expect(context).toEqual({ previousBreeds });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["species"], expect.any(Function));

    const updater = queryClient.setQueryData.mock.calls[0][1] as (old: typeof previousBreeds) => typeof previousBreeds;
    const optimistic = updater(previousBreeds);
    expect(optimistic).toEqual([
      { id: 1, name: "Goldendoodle" },
      { id: 2, name: "Lab" }
    ]);

    mutation.onError(new Error("fail"), payload, { previousBreeds });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["species"], previousBreeds);

    mutation.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["species"] });
  });

  it("useDeleteBreed calls api and applies optimistic delete lifecycle", async () => {
    const previousBreeds = [{ id: 1, name: "Poodle" }, { id: 2, name: "Lab" }];
    const queryClient = createQueryClientMock();
    queryClient.cancelQueries.mockResolvedValue(undefined);
    queryClient.getQueryData.mockReturnValue(previousBreeds);
    vi.mocked(useQueryClient).mockReturnValue(queryClient as never);

    const mutation = useDeleteBreed() as {
      mutationFn: (id: number) => unknown;
      onMutate: (id: number) => Promise<{ previousBreeds: unknown }>;
      onError: (err: unknown, id: number, context: { previousBreeds: unknown }) => void;
      onSettled: () => void;
    };

    mutation.mutationFn(1);
    expect(deleteBreed).toHaveBeenCalledWith(1);

    const context = await mutation.onMutate(1);
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ["species"] });
    expect(context).toEqual({ previousBreeds });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["species"], expect.any(Function));

    const updater = queryClient.setQueryData.mock.calls[0][1] as (old: typeof previousBreeds) => typeof previousBreeds;
    expect(updater(previousBreeds)).toEqual([{ id: 2, name: "Lab" }]);

    mutation.onError(new Error("fail"), 1, { previousBreeds });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["species"], previousBreeds);

    mutation.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["species"] });
  });
});
