import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAvailability, getAvailabilityById } from "./availability";

vi.mock("./api", () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from "./api";

describe("availability api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiFetch.mockReset();
  });

  it("gets availability list", async () => {
    const payload = [{ id: 1 }];
    apiFetch.mockResolvedValue(payload);

    await expect(getAvailability()).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/availability");
  });

  it("throws when getAvailability fails", async () => {
    apiFetch.mockRejectedValue(new Error("Failed availability"));

    await expect(getAvailability()).rejects.toThrow("Failed availability");
  });

  it("gets availability by stylist id", async () => {
    const payload = [{ day_of_week: 1 }];
    apiFetch.mockResolvedValue(payload);

    await expect(getAvailabilityById(7)).resolves.toEqual(payload);
    expect(apiFetch).toHaveBeenCalledWith("/api/availability/stylist/7");
  });

  it("throws when getAvailabilityById fails", async () => {
    apiFetch.mockRejectedValue(new Error("Missing stylist"));

    await expect(getAvailabilityById(7)).rejects.toThrow("Missing stylist");
  });
});
