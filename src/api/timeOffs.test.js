import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTimeOffByStylistId, getTimeOffs } from "./timeOffs";

describe("timeOffs api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("gets time offs", async () => {
    const payload = [{ id: 1 }];
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(getTimeOffs()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/timeOffs");
  });

  it("throws fetch error for getTimeOffs", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "No time offs" })
    });

    await expect(getTimeOffs()).rejects.toThrow("No time offs");
  });

  it("gets time offs by stylist id", async () => {
    const payload = [{ id: 2 }];
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(getTimeOffByStylistId(9)).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/timeOffs/stylist/9");
  });

  it("throws fetch error for getTimeOffByStylistId", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Missing stylist time off" })
    });

    await expect(getTimeOffByStylistId(9)).rejects.toThrow("Missing stylist time off");
  });
});
