import { describe, expect, it, vi, beforeEach } from "vitest";

const useQueryMock = vi.fn();
const useMutationMock = vi.fn();
const useQueryClientMock = vi.fn();

const getAppointmentsMock = vi.fn();
const createAppointmentMock = vi.fn();
const updateAppointmentMock = vi.fn();
const deleteAppointmentMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args: any[]) => useQueryMock(...args),
  useMutation: (...args: any[]) => useMutationMock(...args),
  useQueryClient: () => useQueryClientMock()
}));

vi.mock("@/api/appointments", () => ({
  getAppointments: (...args: any[]) => getAppointmentsMock(...args),
  createAppointment: (...args: any[]) => createAppointmentMock(...args),
  updateAppointment: (...args: any[]) => updateAppointmentMock(...args),
  deleteAppointment: (...args: any[]) => deleteAppointmentMock(...args)
}));

import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment
} from "./appointments";
import { APPOINTMENTS_QUERY_KEY } from "@/constants";

describe("appointments hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useAppointments configures the appointments query", () => {
    useAppointments();

    const config = useQueryMock.mock.calls[0][0];
    expect(config.queryKey).toEqual([APPOINTMENTS_QUERY_KEY]);
    config.queryFn();
    expect(getAppointmentsMock).toHaveBeenCalled();
  });

  it("useCreateAppointment invalidates appointments on success", () => {
    const queryClient = {
      invalidateQueries: vi.fn()
    };
    let mutationConfig: any;

    useQueryClientMock.mockReturnValue(queryClient);
    useMutationMock.mockImplementation((config) => {
      mutationConfig = config;
      return config;
    });

    useCreateAppointment();

    mutationConfig.mutationFn({ id: 1 });
    expect(createAppointmentMock).toHaveBeenCalledWith({ id: 1 });
    mutationConfig.onSuccess();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [APPOINTMENTS_QUERY_KEY]
    });
  });

  it("useUpdateAppointment performs optimistic update and rollback", async () => {
    const previous = [{ id: 1, status: "booked" }, { id: 2, status: "pending" }];
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

    useUpdateAppointment();

    expect(mutationConfig.mutationFn).toBeDefined();
    await mutationConfig.onMutate({ id: 1, data: { status: "completed" } });

    expect(queryClient.cancelQueries).toHaveBeenCalledWith({
      queryKey: [APPOINTMENTS_QUERY_KEY]
    });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      [APPOINTMENTS_QUERY_KEY],
      expect.any(Function)
    );

    const updater = queryClient.setQueryData.mock.calls[0][1];
    expect(updater(previous)).toEqual([
      { id: 1, status: "completed" },
      { id: 2, status: "pending" }
    ]);

    mutationConfig.onError(new Error("boom"), null, { prevAppointments: previous });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      [APPOINTMENTS_QUERY_KEY],
      previous
    );

    mutationConfig.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [APPOINTMENTS_QUERY_KEY]
    });
  });

  it("useDeleteAppointment removes deleted item optimistically and rolls back on error", async () => {
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

    useDeleteAppointment();

    expect(mutationConfig.mutationFn).toBeDefined();
    await mutationConfig.onMutate(1);

    expect(queryClient.cancelQueries).toHaveBeenCalledWith({
      queryKey: [APPOINTMENTS_QUERY_KEY]
    });
    const updater = queryClient.setQueryData.mock.calls[0][1];
    expect(updater(previous)).toEqual([{ id: 2 }]);

    mutationConfig.onError(new Error("boom"), 1, { prevAppointments: previous });
    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      [APPOINTMENTS_QUERY_KEY],
      previous
    );

    mutationConfig.onSettled();
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [APPOINTMENTS_QUERY_KEY]
    });
  });
});
