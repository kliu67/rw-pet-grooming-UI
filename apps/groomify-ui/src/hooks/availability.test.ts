import { describe, expect, it, vi, beforeEach } from "vitest";

const useQueryMock = vi.fn();
const getAvailabilityMock = vi.fn();
const getAvailabilityByIdMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args: any[]) => useQueryMock(...args)
}));

vi.mock("@/api/availability", () => ({
  getAvailability: (...args: any[]) => getAvailabilityMock(...args),
  getAvailabilityById: (...args: any[]) => getAvailabilityByIdMock(...args)
}));

import { useAvailability, useAvailabiltyByStylistId } from "./availability";
import { AVAILABILITY_QUERY_KEY } from "@/constants";

describe("availability hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useAvailability configures the base query", () => {
    useAvailability();

    const config = useQueryMock.mock.calls[0][0];
    expect(config.queryKey).toEqual([AVAILABILITY_QUERY_KEY]);
    config.queryFn();
    expect(getAvailabilityMock).toHaveBeenCalled();
  });

  it("useAvailabiltyById enables query when stylist id is present", () => {
    useAvailabiltyByStylistId(7);

    const config = useQueryMock.mock.calls[0][0];
    expect(config.queryKey).toEqual([AVAILABILITY_QUERY_KEY, 7]);
    expect(config.enabled).toBe(true);
    config.queryFn();
    expect(getAvailabilityByIdMock).toHaveBeenCalledWith(7);
  });

  it("useAvailabiltyById disables query for missing stylist id", () => {
    useAvailabiltyByStylistId("");

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [AVAILABILITY_QUERY_KEY, ""],
        enabled: false
      })
    );
  });
});
