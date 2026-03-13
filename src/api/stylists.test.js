import { beforeEach, describe, expect, it, vi } from "vitest";
import { getStylists } from "./stylists";

describe("stylists api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("gets stylists", async () => {
    const payload = [{ id: 1 }];
    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(getStylists()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/stylists");
  });

  it("throws fetch error for getStylists", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "No stylists" })
    });

    await expect(getStylists()).rejects.toThrow("No stylists");
  });
});
