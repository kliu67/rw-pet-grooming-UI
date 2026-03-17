import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, deleteClient, updateClient } from "@/api/clients";
import { useCreateClient, useDeleteClient, useUpdateClient } from "./clients";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn()
}));

vi.mock("@/api/clients", () => ({
  createClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn()
}));

function createQueryClientMock() {
  return {
    invalidateQueries: vi.fn(),
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn()
  };
}

describe("hooks/clients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMutation).mockImplementation((config: unknown) => config as never);
  });

  it("useCreateClient invalidates clients after success", () => {
    const queryClient = createQueryClientMock();
    vi.mocked(useQueryClient).mockReturnValue(queryClient as never);

    const mutation = useCreateClient() as {
      mutationFn: typeof createClient;
      onSuccess: () => void;
    };

    expect(mutation.mutationFn).toBe(createClient);
    mutation.onSuccess();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["clients"] });
  });

  it("useUpdateClient calls api and applies optimistic lifecycle", async () => {
    const previousClients = [
      { id: 1, first_name: "Jane" },
      { id: 2, first_name: "John" }
    ];
    const queryClient = createQueryClientMock();
    queryClient.cancelQueries.mockResolvedValue(undefined);
    queryClient.getQueryData.mockReturnValue(previousClients);
    vi.mocked(useQueryClient).mockReturnValue(queryClient as never);

    const mutation = useUpdateClient() as {
      mutationFn: (args: { id: number; data: { first_name: string } }) => unknown;
      onMutate: (args: { id: number; data: { first_name: string } }) => Promise<{ previousClients: unknown }>;
      onError: (err: unknown, variables: unknown, context: { previousClients: unknown }) => void;
      onSettled: () => void;
    };

    const payload = { id: 1, data: { first_name: "Janet" } };
    mutation.mutationFn(payload);
    expect(updateClient).toHaveBeenCalledWith(1, { first_name: "Janet" });

    const context = await mutation.onMutate(payload);
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ["clients"] });
    expect(context).toEqual({ previousClients });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["users"], expect.any(Function));

    const updater = queryClient.setQueryData.mock.calls[0][1] as (old: typeof previousClients) => typeof previousClients;
    expect(updater(previousClients)).toEqual([
      { id: 1, first_name: "Janet" },
      { id: 2, first_name: "John" }
    ]);

    mutation.onError(new Error("fail"), payload, { previousClients });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["users"], previousClients);

    mutation.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["clients"] });
  });

  it("useDeleteClient calls api and applies optimistic delete lifecycle", async () => {
    const previousClients = [
      { id: 1, first_name: "Jane" },
      { id: 2, first_name: "John" }
    ];
    const queryClient = createQueryClientMock();
    queryClient.cancelQueries.mockResolvedValue(undefined);
    queryClient.getQueryData.mockReturnValue(previousClients);
    vi.mocked(useQueryClient).mockReturnValue(queryClient as never);

    const mutation = useDeleteClient() as {
      mutationFn: (id: number) => unknown;
      onMutate: (id: number) => Promise<{ previousClients: unknown }>;
      onError: (err: unknown, id: number, context: { previousClients: unknown }) => void;
      onSettled: () => void;
    };

    mutation.mutationFn(1);
    expect(deleteClient).toHaveBeenCalledWith(1);

    const context = await mutation.onMutate(1);
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ["clients"] });
    expect(context).toEqual({ previousClients });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["clients"], expect.any(Function));

    const updater = queryClient.setQueryData.mock.calls[0][1] as (old: typeof previousClients) => typeof previousClients;
    expect(updater(previousClients)).toEqual([{ id: 2, first_name: "John" }]);

    mutation.onError(new Error("fail"), 1, { previousClients });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(["clients"], previousClients);

    mutation.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["clients"] });
  });
});
