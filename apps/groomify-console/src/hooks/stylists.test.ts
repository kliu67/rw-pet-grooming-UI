import { describe, expect, it, vi, beforeEach } from "vitest";

const useQueryMock = vi.fn();
const getStylistsMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args: any[]) => useQueryMock(...args)
}));

vi.mock("@/api/stylists", () => ({
  getStylists: (...args: any[]) => getStylistsMock(...args)
}));

import { useStylists } from "./stylists";
import { STYLISTS_QUERY_KEY } from "@/constants";

describe("stylists hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useStylists configures the stylists query", () => {
    useStylists();

    const config = useQueryMock.mock.calls[0][0];
    expect(config.queryKey).toEqual([STYLISTS_QUERY_KEY]);
    config.queryFn();
    expect(getStylistsMock).toHaveBeenCalled();
  });
});
