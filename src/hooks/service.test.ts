import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService, deleteService, updateService } from "@/api/services";
import { useCreateService, useDeleteService, useUpdateService } from "./service";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn()
}));

vi.mock("@/api/services", () => ({
  createService: vi.fn(),
  updateService: vi.fn(),
  deleteService: vi.fn()
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

describe("hooks/service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMutation).mockImplementation((config: unknown) => config as never);
  });

  it("useCreateService invalidates services after success", () => {
    const queryClient = createQueryClientMock();
    vi.mocked(useQueryClient).mockReturnValue(queryClient as never);

    const mutation = useCreateService() as {
      mutationFn: typeof createService;
      onSuccess: () => void;
    };

    expect(mutation.mutationFn).toBe(createService);
    mutation.onSuccess();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["services"] });
  });

  it("useUpdateService calls api and applies optimistic update lifecycle", async () => {
    const previousServices = [
      { id: 1, name: "Bath", base_price: 10 },
      { id: 2, name: "Nail Trim", base_price: 5 }
    ];
    const queryClient = createQueryClientMock();
    queryClient.cancelQueries.mockResolvedValue(undefined);
    queryClient.getQueryData.mockReturnValue(previousServices);
    vi.mocked(useQueryClient).mockReturnValue(queryClient as never);

    const mutation = useUpdateService() as {
      mutationFn: (args: { id: number; data: { name: string } }) => unknown;
      onMutate: (args: { id: number; data: { name: string } }) => Promise<{ previousServices: unknown }>;
      onError: (err: unknown, variables: unknown, context: { previousServices: unknown }) => void;
      onSettled: () => void;
    };

    const payload = { id: 1, data: { name: "Luxury Bath" } };
    mutation.mutationFn(payload);
    expect(updateService).toHaveBeenCalledWith(1, { name: "Luxury Bath" });

    const context = await mutation.onMutate(payload);
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ["services"] });
    expect(context).toEqual({ previousServices });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["services"], expect.any(Function));

    const updater =
      queryClient.setQueryData.mock.calls[0][1] as (old: typeof previousServices) => typeof previousServices;
    expect(updater(previousServices)).toEqual([
      { id: 1, name: "Luxury Bath", base_price: 10 },
      { id: 2, name: "Nail Trim", base_price: 5 }
    ]);

    mutation.onError(new Error("fail"), payload, { previousServices });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["services"], previousServices);

    mutation.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["services"] });
  });

  it("useDeleteService calls api and applies optimistic delete lifecycle", async () => {
    const previousServices = [
      { id: 1, name: "Bath", base_price: 10 },
      { id: 2, name: "Nail Trim", base_price: 5 }
    ];
    const queryClient = createQueryClientMock();
    queryClient.cancelQueries.mockResolvedValue(undefined);
    queryClient.getQueryData.mockReturnValue(previousServices);
    vi.mocked(useQueryClient).mockReturnValue(queryClient as never);

    const mutation = useDeleteService() as {
      mutationFn: (id: number) => unknown;
      onMutate: (id: number) => Promise<{ previousServices: unknown }>;
      onError: (err: unknown, id: number, context: { previousServices: unknown }) => void;
      onSettled: () => void;
    };

    mutation.mutationFn(1);
    expect(deleteService).toHaveBeenCalledWith(1);

    const context = await mutation.onMutate(1);
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ["services"] });
    expect(context).toEqual({ previousServices });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["services"], expect.any(Function));

    const updater =
      queryClient.setQueryData.mock.calls[0][1] as (old: typeof previousServices) => typeof previousServices;
    expect(updater(previousServices)).toEqual([{ id: 2, name: "Nail Trim", base_price: 5 }]);

    mutation.onError(new Error("fail"), 1, { previousServices });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["services"], previousServices);

    mutation.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["services"] });
  });
});
