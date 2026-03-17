import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTimeOffByStylistId, getTimeOffs } from "./timeOffs";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("timeOffs api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiFetch.mockReset();
  });

  it("gets time offs", async () => {
    const payload = [{ id: 1 }];
    apiFetch.mockResolvedValue(payload);

    await expect(getTimeOffs()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/timeOffs");
  });

  it("throws fetch error for getTimeOffs", async () => {
    apiFetch.mockRejectedValue(new Error("No time offs"));

    await expect(getTimeOffs()).rejects.toThrow("No time offs");
  });

  it("gets time offs by stylist id", async () => {
    const payload = [{ id: 2 }];
    apiFetch.mockResolvedValue(payload);

    await expect(getTimeOffByStylistId(9)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/timeOffs/stylist/9");
  });

  it("throws fetch error for getTimeOffByStylistId", async () => {
    apiFetch.mockRejectedValue(new Error("Missing stylist time off"));

    await expect(getTimeOffByStylistId(9)).rejects.toThrow("Missing stylist time off");
  });
});
