import { describe, expect, it, vi, beforeEach } from "vitest";

const useQueryMock = vi.fn();
const getTimeOffsMock = vi.fn();
const getTimeOffByStylistIdMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args: any[]) => useQueryMock(...args)
}));

vi.mock("@/api/timeOffs", () => ({
  getTimeOffs: (...args: any[]) => getTimeOffsMock(...args),
  getTimeOffByStylistId: (...args: any[]) => getTimeOffByStylistIdMock(...args)
}));

import { useTimeOffs, useTimeOffById } from "./timeOffs";
import { TIMEOFFS_QUERY_KEY } from "@/constants";

describe("timeOffs hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useTimeOffs configures the time off query", () => {
    useTimeOffs();

    const config = useQueryMock.mock.calls[0][0];
    expect(config.queryKey).toEqual([TIMEOFFS_QUERY_KEY]);
    config.queryFn();
    expect(getTimeOffsMock).toHaveBeenCalled();
  });

  it("useTimeOffById enables query for a valid stylist id", () => {
    useTimeOffById(2);

    const config = useQueryMock.mock.calls[0][0];
    expect(config.queryKey).toEqual([TIMEOFFS_QUERY_KEY, 2]);
    expect(config.enabled).toBe(true);
    config.queryFn();
    expect(getTimeOffByStylistIdMock).toHaveBeenCalledWith(2);
  });

  it("useTimeOffById disables query for an empty stylist id", () => {
    useTimeOffById("");

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [TIMEOFFS_QUERY_KEY, ""],
        enabled: false
      })
    );
  });
});
