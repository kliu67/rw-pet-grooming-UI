import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAvailability, getAvailabilityById } from "./availability";

describe("availability api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("gets availability list", async () => {
    const payload = [{ id: 1 }];
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(getAvailability()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/availability");
  });

  it("throws when getAvailability fails", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Failed availability" })
    });

    await expect(getAvailability()).rejects.toThrow("Failed availability");
  });

  it("gets availability by stylist id", async () => {
    const payload = [{ day_of_week: 1 }];
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(getAvailabilityById(7)).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/availability/stylist/7");
  });

  it("throws when getAvailabilityById fails", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Missing stylist" })
    });

    await expect(getAvailabilityById(7)).rejects.toThrow("Missing stylist");
  });
});
