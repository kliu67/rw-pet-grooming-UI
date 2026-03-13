import { beforeEach, describe, expect, it, vi } from "vitest";
import { getWeightClasses } from "./weightClasses";

describe("weightClasses api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("gets weight classes", async () => {
    const payload = [{ id: 1 }];
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(getWeightClasses()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/weightClasses");
  });

  it("throws fetch error for getWeightClasses", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "No weight classes" })
    });

    await expect(getWeightClasses()).rejects.toThrow("No weight classes");
  });
});
